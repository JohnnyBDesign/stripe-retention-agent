import { prisma } from '@/lib/db';
import { stripe, getSubscriptionInfo, getCustomerActivity } from '@/lib/stripe/client';
import { classifyChurn } from '@/lib/classifier';
import Stripe from 'stripe';

export async function processStripeEvent(event: Stripe.Event): Promise<void> {
  const existingEvent = await prisma.stripeEvent.findUnique({
    where: { stripeEventId: event.id },
  });

  if (existingEvent) {
    console.log(`Event ${event.id} already processed`);
    return;
  }

  await prisma.stripeEvent.create({
    data: {
      stripeEventId: event.id,
      type: event.type,
      payload: event as any,
      processed: false,
    },
  });

  try {
    await handleEvent(event);

    await prisma.stripeEvent.update({
      where: { stripeEventId: event.id },
      data: { processed: true },
    });
  } catch (error) {
    console.error(`Error processing event ${event.id}:`, error);
    throw error;
  }
}

async function handleEvent(event: Stripe.Event): Promise<void> {
  switch (event.type) {
    case 'customer.subscription.updated':
    case 'customer.subscription.deleted':
      await handleSubscriptionChange(event.data.object as Stripe.Subscription);
      break;

    case 'invoice.payment_failed':
      await handlePaymentFailed(event.data.object as Stripe.Invoice);
      break;

    case 'invoice.upcoming':
      await handleUpcomingInvoice(event.data.object as Stripe.Invoice);
      break;

    case 'charge.refunded':
      await handleChargeRefunded(event.data.object as Stripe.Charge);
      break;

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }
}

async function handleSubscriptionChange(subscription: Stripe.Subscription): Promise<void> {
  const isCanceled = subscription.status === 'canceled' || subscription.cancel_at_period_end;
  
  if (!isCanceled) {
    return;
  }

  const subscriptionInfo = await getSubscriptionInfo(subscription.id);
  const activity = await getCustomerActivity(subscriptionInfo.customerId);
  
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
    },
  });

  if (existingCase) {
    console.log(`Case already exists for customer ${subscriptionInfo.customerId}`);
    return;
  }

  await prisma.retentionCase.create({
    data: {
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
    },
  });

  console.log(`Created retention case for customer ${subscriptionInfo.customerId}`);
}

async function handlePaymentFailed(invoice: Stripe.Invoice): Promise<void> {
  console.log(`Payment failed for invoice ${invoice.id} - dunning stub only`);
}

async function handleUpcomingInvoice(invoice: Stripe.Invoice): Promise<void> {
  if (!invoice.subscription) {
    return;
  }

  const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string);
  const subscriptionInfo = await getSubscriptionInfo(subscription.id);
  const activity = await getCustomerActivity(subscriptionInfo.customerId);

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
        },
      });

      if (!existingCase) {
        await prisma.retentionCase.create({
          data: {
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
          },
        });

        console.log(`Created silent rescue case for customer ${subscriptionInfo.customerId}`);
      }
    }
  }
}

async function handleChargeRefunded(charge: Stripe.Charge): Promise<void> {
  console.log(`Charge refunded: ${charge.id}`);
}
