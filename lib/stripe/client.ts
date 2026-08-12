import { Stripe } from 'stripe';
import { prisma } from '@/lib/db';

let stripeClient: Stripe | null = null;

function getStripeClient(): Stripe {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not set');
  }
  
  if (!stripeClient) {
    stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-06-20',
      typescript: true,
    });
  }
  
  return stripeClient;
}

export const stripe = new Proxy({} as Stripe, {
  get: (_target, prop) => {
    const client = getStripeClient();
    return (client as any)[prop];
  },
});

async function resolveCustomerEmail(customer: string | Stripe.Customer | Stripe.DeletedCustomer): Promise<string> {
  if (typeof customer === 'string') {
    const retrieved = await getStripeClient().customers.retrieve(customer);
    if (!retrieved.deleted && retrieved.email) {
      return retrieved.email;
    }
    return '';
  }
  if ('deleted' in customer && customer.deleted) {
    return '';
  }
  return (customer as Stripe.Customer).email || '';
}

export async function getSubscriptionInfo(subscriptionId: string) {
  const client = getStripeClient();
  const subscription = await client.subscriptions.retrieve(subscriptionId, {
    expand: ['customer', 'default_payment_method'],
  });

  const customer = subscription.customer;
  const customerId = typeof customer === 'string' ? customer : customer.id;
  const customerEmail = await resolveCustomerEmail(customer);
  const plan = subscription.items.data[0]?.price;

  return {
    customerId,
    customerEmail,
    subscriptionId: subscription.id,
    plan: plan?.nickname || plan?.id || 'unknown',
    mrr: plan?.recurring?.interval === 'month' 
      ? (plan.unit_amount || 0) / 100
      : plan?.recurring?.interval === 'year'
      ? (plan.unit_amount || 0) / 100 / 12
      : 0,
    status: subscription.status,
    currentPeriodEnd: new Date(subscription.current_period_end * 1000),
    createdAt: new Date(subscription.created * 1000),
    canceledAt: subscription.canceled_at ? new Date(subscription.canceled_at * 1000) : null,
    cancelDetails: subscription.cancellation_details,
  };
}

export async function getCustomerActivity(customerId: string): Promise<{
  lastActiveAt: Date | null;
  activationAt: Date | null;
}> {
  const activity = await prisma.customerActivity.findUnique({
    where: { customerId },
  });

  if (activity) {
    return {
      lastActiveAt: activity.lastActiveAt,
      activationAt: activity.activationCompletedAt,
    };
  }

  const customer = await getStripeClient().customers.retrieve(customerId);
  
  if (customer.deleted) {
    return {
      lastActiveAt: null,
      activationAt: null,
    };
  }

  let activationAt: Date | null = null;
  if (customer.metadata?.activation_completed_at) {
    try {
      activationAt = new Date(customer.metadata.activation_completed_at);
    } catch (e) {
      console.error('Invalid activation_completed_at in Stripe metadata:', e);
    }
  }

  return {
    lastActiveAt: null,
    activationAt,
  };
}
