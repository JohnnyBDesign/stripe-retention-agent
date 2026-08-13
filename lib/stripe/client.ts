import { Stripe } from 'stripe';
import { prisma } from '@/lib/db';
import { decryptStripeKey } from '@/lib/crypto';

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

/**
 * Gets a user-specific Stripe client by userId.
 * Returns null if no active connection found.
 */
export async function getUserStripeClient(userId: string): Promise<Stripe | null> {
  const connection = await prisma.stripeConnection.findFirst({
    where: {
      userId,
      isActive: true,
    },
  });

  if (!connection) {
    return null;
  }

  const decryptedKey = decryptStripeKey(connection.encryptedKey);

  return new Stripe(decryptedKey, {
    apiVersion: '2024-06-20',
    typescript: true,
  });
}

/**
 * Gets a Stripe client by Stripe account ID.
 * Returns the user-specific client and userId if found, otherwise returns the global client.
 */
export async function getStripeClientByAccount(stripeAccountId: string): Promise<{ client: Stripe; userId: string | null }> {
  const connection = await prisma.stripeConnection.findFirst({
    where: {
      stripeAccountId,
      isActive: true,
    },
  });

  if (connection) {
    const decryptedKey = decryptStripeKey(connection.encryptedKey);
    const client = new Stripe(decryptedKey, {
      apiVersion: '2024-06-20',
      typescript: true,
    });
    return { client, userId: connection.userId };
  }

  // Fallback to global client for backward compatibility
  return { client: stripe, userId: null };
}

async function resolveCustomerEmail(customer: string | Stripe.Customer | Stripe.DeletedCustomer, stripeClient?: Stripe): Promise<string> {
  const client = stripeClient || getStripeClient();
  
  if (typeof customer === 'string') {
    const retrieved = await client.customers.retrieve(customer);
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

export async function getSubscriptionInfo(subscriptionId: string, stripeClient?: Stripe) {
  const client = stripeClient || getStripeClient();
  const subscription = await client.subscriptions.retrieve(subscriptionId, {
    expand: ['customer', 'default_payment_method'],
  });

  const customer = subscription.customer;
  const customerId = typeof customer === 'string' ? customer : customer.id;
  const customerEmail = await resolveCustomerEmail(customer, client);
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

export async function getCustomerActivity(customerId: string, userId?: string | null): Promise<{
  lastActiveAt: Date | null;
  activationAt: Date | null;
}> {
  const whereClause: any = { customerId };
  if (userId !== undefined) {
    whereClause.userId = userId;
  }
  
  const activity = await prisma.customerActivity.findFirst({
    where: whereClause,
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
