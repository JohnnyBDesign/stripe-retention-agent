import { prisma } from '@/lib/db';
import { stripe, getSubscriptionInfo, getCustomerActivity, getStripeClientByAccount } from '@/lib/stripe/client';
import { classifyChurn } from '@/lib/classifier';
import Stripe from 'stripe';

/**
 * Determines the userId for a Stripe event based on the account ID.
 * Returns null for legacy/admin events.
 */
async function getUserIdFromEvent(event: Stripe.Event): Promise<string | null> {
  // For events from connected accounts, event.account will be set
  // For events from the platform account, event.account will be null
  
  // Try to get account ID from the event
  let stripeAccountId: string | null = null;
  
  if (event.account) {
    stripeAccountId = event.account as string;
  }
  
  // If no account in event, try to get it from the data object
  if (!stripeAccountId && event.data.object) {
    const obj = event.data.object as any;
    
    // For subscriptions and invoices, we can check the customer
    if (obj.customer) {
      const customerId = typeof obj.customer === 'string' ? obj.customer : obj.customer.id;
      
      // Look up which user owns this customer
      const activity = await prisma.customerActivity.findFirst({
        where: { stripeCustomerId: customerId },
        select: { userId: true },
      });
      
      if (activity?.userId) {
        return activity.userId;
      }
    }
  }
  
  if (!stripeAccountId) {
    // No account ID found - this is a legacy/admin event
    return null;
  }
  
  // Look up the user by Stripe account ID
  const connection = await prisma.stripeConnection.findFirst({
    where: {
      stripeAccountId,
      isActive: true,
    },
    select: { userId: true },
  });
  
  return connection?.userId || null;
}

export async function processStripeEvent(event: Stripe.Event): Promise<void> {
  const existingEvent = await prisma.stripeEvent.findUnique({
    where: { stripeEventId: event.id },
  });

  if (existingEvent) {
    console.log(`Event ${event.id} already processed`);
    return;
  }

  // Determine userId for this event
  const userId = await getUserIdFromEvent(event);

  await prisma.stripeEvent.create({
    data: {
      stripeEventId: event.id,
      type: event.type,
      payload: event as any,
      processed: false,
      userId,
    },
  });

  try {
    await handleEvent(event, userId);

    await prisma.stripeEvent.update({
      where: { stripeEventId: event.id },
      data: { processed: true },
    });
  } catch (error) {
    console.error(`Error processing event ${event.id}:`, error);
    throw error;
  }
}

async function handleEvent(event: Stripe.Event, userId: string | null): Promise<void> {
  switch (event.type) {
    case 'customer.subscription.updated':
    case 'customer.subscription.deleted':
      await handleSubscriptionChange(event.data.object as Stripe.Subscription, event.id, userId);
      break;

    case 'invoice.payment_failed':
      await handlePaymentFailed(event.data.object as Stripe.Invoice, userId);
      break;

    case 'invoice.upcoming':
      await handleUpcomingInvoice(event.data.object as Stripe.Invoice, event.id, userId);
      break;

    case 'charge.refunded':
      await handleChargeRefunded(event.data.object as Stripe.Charge, event.id, userId);
      break;

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }
}

async function handleSubscriptionChange(subscription: Stripe.Subscription, eventId: string, userId: string | null): Promise<void> {
  const isCanceled = subscription.status === 'canceled' || subscription.cancel_at_period_end;
  
  if (!isCanceled) {
    return;
  }

  // Get the appropriate Stripe client
  const stripeClient = userId ? await getUserStripeClient(userId) : stripe;
  if (!stripeClient) {
    console.error(`No Stripe client found for userId ${userId}`);
    return;
  }

  const subscriptionInfo = await getSubscriptionInfo(subscription.id, stripeClient);
  const activity = await getCustomerActivity(subscriptionInfo.customerId, userId);
  
  const tenureDays = Math.ceil(
    (Date.now() - subscriptionInfo.createdAt.getTime()) / (1000 * 60 * 60 * 24)
  );

  const classification = await classifyChurn({
    subscription: subscriptionInfo,
    tenureDays,
    lastActiveAt: activity.lastActiveAt,
    activationAt: activity.activationAt,
  });

  const existingCase = await prisma.retentionCase.findFirst({
    where: {
      customerId: subscriptionInfo.customerId,
      subscriptionId: subscription.id,
      state: 'pending',
      ...(userId ? { userId } : {}),
    },
  });

  if (existingCase) {
    console.log(`Case already exists for customer ${subscriptionInfo.customerId}`);
    return;
  }

  await prisma.retentionCase.create({
    data: {
      userId,
      customerId: subscriptionInfo.customerId,
      customerEmail: subscriptionInfo.customerEmail,
      subscriptionId: subscription.id,
      plan: subscriptionInfo.plan,
      mrr: subscriptionInfo.mrr,
      tenureDays,
      reason: classification.reason,
      confidence: classification.confidence,
      evidence: classification.evidence,
      recommendedSequence: classification.recommendedSequence,
      subjectDraft: classification.subjectDraft,
      bodyDraft: classification.bodyDraft,
      state: 'pending',
      triggerType: 'cancel',
      stripeEventIds: [eventId],
      slaDueAt: new Date(Date.now() + 4 * 60 * 60 * 1000),
    },
  });

  console.log(`Created retention case for customer ${subscriptionInfo.customerId}, userId: ${userId || 'legacy'}`);
}

async function handlePaymentFailed(invoice: Stripe.Invoice, userId: string | null): Promise<void> {
  console.log(`Payment failed for invoice ${invoice.id} - dunning stub only`);
}

async function handleUpcomingInvoice(invoice: Stripe.Invoice, eventId: string, userId: string | null): Promise<void> {
  if (!invoice.subscription) {
    return;
  }

  const stripeClient = userId ? await getUserStripeClient(userId) : stripe;
  if (!stripeClient) {
    console.error(`No Stripe client found for userId ${userId}`);
    return;
  }

  const subscription = await stripeClient.subscriptions.retrieve(invoice.subscription as string);
  const subscriptionInfo = await getSubscriptionInfo(subscription.id, stripeClient);
  const activity = await getCustomerActivity(subscriptionInfo.customerId, userId);

  const tenureDays = Math.ceil(
    (Date.now() - subscriptionInfo.createdAt.getTime()) / (1000 * 60 * 60 * 24)
  );

  const now = new Date();
  const daysUntilRenewal = Math.ceil(
    (subscriptionInfo.currentPeriodEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (activity.lastActiveAt) {
    const daysSinceActive = Math.ceil(
      (now.getTime() - activity.lastActiveAt.getTime()) / (1000 * 60 * 60 * 24)
    );

    const isMonthly = subscriptionInfo.mrr > 0;
    const shouldTriggerMonthly = isMonthly && daysSinceActive >= 14 && daysUntilRenewal <= 7;
    const shouldTriggerAnnual = !isMonthly && daysSinceActive >= 45 && daysUntilRenewal <= 30;

    if (shouldTriggerMonthly || shouldTriggerAnnual) {
      const classification = await classifyChurn({
        subscription: subscriptionInfo,
        tenureDays,
        lastActiveAt: activity.lastActiveAt,
        activationAt: activity.activationAt,
      });

      const existingCase = await prisma.retentionCase.findFirst({
        where: {
          customerId: subscriptionInfo.customerId,
          subscriptionId: subscription.id,
          state: 'pending',
          ...(userId ? { userId } : {}),
        },
      });

      if (!existingCase) {
        await prisma.retentionCase.create({
          data: {
            userId,
            customerId: subscriptionInfo.customerId,
            customerEmail: subscriptionInfo.customerEmail,
            subscriptionId: subscription.id,
            plan: subscriptionInfo.plan,
            mrr: subscriptionInfo.mrr,
            tenureDays,
            reason: classification.reason,
            confidence: classification.confidence,
            evidence: classification.evidence,
            recommendedSequence: classification.recommendedSequence,
            subjectDraft: classification.subjectDraft,
            bodyDraft: classification.bodyDraft,
            state: 'pending',
            triggerType: classification.reason === 'never_activated' ? 'never_activated' : 'silent',
            stripeEventIds: [eventId],
            slaDueAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
          },
        });

        console.log(`Created silent rescue case for customer ${subscriptionInfo.customerId}, userId: ${userId || 'legacy'}`);
      }
    }
  }
}

async function handleChargeRefunded(charge: Stripe.Charge, eventId: string, userId: string | null): Promise<void> {
  if (!charge.customer) {
    console.log(`Charge ${charge.id} has no customer, skipping`);
    return;
  }

  const stripeClient = userId ? await getUserStripeClient(userId) : stripe;
  if (!stripeClient) {
    console.error(`No Stripe client found for userId ${userId}`);
    return;
  }

  const customerId = typeof charge.customer === 'string' ? charge.customer : charge.customer.id;
  const customer = await stripeClient.customers.retrieve(customerId);
  
  if (customer.deleted) {
    return;
  }

  const subscriptions = await stripeClient.subscriptions.list({
    customer: customerId,
    limit: 1,
  });

  const subscription = subscriptions.data[0];
  if (!subscription) {
    return;
  }

  const subscriptionInfo = await getSubscriptionInfo(subscription.id, stripeClient);
  const activity = await getCustomerActivity(customerId, userId);
  
  const tenureDays = Math.ceil(
    (Date.now() - subscriptionInfo.createdAt.getTime()) / (1000 * 60 * 60 * 24)
  );

  const evidence = [
    `Charge refunded: ${charge.id}`,
    `Amount: $${(charge.amount_refunded / 100).toFixed(2)}`,
    `Refund reason: ${charge.refunds?.data[0]?.reason || 'not specified'}`,
  ];

  await prisma.retentionCase.create({
    data: {
      userId,
      customerId,
      customerEmail: customer.email || '',
      subscriptionId: subscription.id,
      plan: subscriptionInfo.plan,
      mrr: subscriptionInfo.mrr,
      tenureDays,
      reason: 'other',
      confidence: 0.60,
      evidence,
      recommendedSequence: null,
      subjectDraft: '',
      bodyDraft: '',
      state: 'pending',
      triggerType: 'refund',
      stripeEventIds: [eventId],
      slaDueAt: new Date(Date.now() + 4 * 60 * 60 * 1000),
    },
  });

  console.log(`Created refund retention case for customer ${customerId}, userId: ${userId || 'legacy'} with 4h SLA`);
}

// Helper function to get user-specific Stripe client (imported from client.ts)
async function getUserStripeClient(userId: string): Promise<Stripe | null> {
  const { getUserStripeClient: getClient } = await import('@/lib/stripe/client');
  return getClient(userId);
}
