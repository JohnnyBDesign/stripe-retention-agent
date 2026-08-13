import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { ChurnReason } from '@/lib/types';

// Helper to classify cancellation reason from Stripe's cancellation_details
function classifyCancelReason(
  cancelDetails: Stripe.Subscription.CancellationDetails | null | undefined,
  comment: string | null | undefined
): ChurnReason {
  // If there's a comment, try to classify it first
  if (comment) {
    const lowerComment = comment.toLowerCase();
    if (lowerComment.includes('price') || lowerComment.includes('expensive') || lowerComment.includes('cost')) {
      return 'price';
    }
    if (lowerComment.includes('bug') || lowerComment.includes('issue') || lowerComment.includes('problem') || lowerComment.includes('error')) {
      return 'bug';
    }
    if (lowerComment.includes('competitor') || lowerComment.includes('alternative') || lowerComment.includes('switched')) {
      return 'competitor';
    }
    if (lowerComment.includes('feature') || lowerComment.includes('functionality') || lowerComment.includes('missing')) {
      return 'missing_feature';
    }
  }

  // Fall back to Stripe's reason
  const feedback = cancelDetails?.feedback;
  if (feedback === 'too_expensive') return 'price';
  if (feedback === 'missing_features') return 'missing_feature';
  if (feedback === 'switched_service') return 'competitor';
  if (feedback === 'customer_service') return 'bug';
  if (feedback === 'low_quality') return 'bug';
  if (feedback === 'unused') return 'never_activated';

  return 'other';
}

// Calculate MRR from a price object
// For monthly plans: full amount
// For annual plans: amount / 12
// For other intervals: estimate based on interval_count
function calculateMRR(price: Stripe.Price | null | undefined): number {
  if (!price || !price.unit_amount) return 0;
  
  const amount = price.unit_amount / 100; // Convert cents to dollars
  
  if (price.recurring) {
    const interval = price.recurring.interval;
    const intervalCount = price.recurring.interval_count || 1;
    
    if (interval === 'month') {
      return amount / intervalCount;
    } else if (interval === 'year') {
      return amount / (12 * intervalCount);
    } else if (interval === 'week') {
      return (amount * 52) / (12 * intervalCount);
    } else if (interval === 'day') {
      return (amount * 365) / (12 * intervalCount);
    }
  }
  
  return 0;
}

// Main scan handler
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { stripeKey } = body;

    // Validate API key format
    if (!stripeKey || typeof stripeKey !== 'string') {
      return NextResponse.json(
        { error: 'Invalid API key format' },
        { status: 400 }
      );
    }

    // Reject secret keys that aren't restricted (sk_ format without rk_ prefix)
    if (stripeKey.startsWith('sk_') && !stripeKey.startsWith('sk_test_') && !stripeKey.startsWith('sk_live_')) {
      // This is a malformed key, reject it
      return NextResponse.json(
        { error: 'Invalid API key format. Please use a restricted key (rk_live_... or rk_test_...)' },
        { status: 400 }
      );
    }

    // Prefer restricted keys
    if (!stripeKey.startsWith('rk_')) {
      return NextResponse.json(
        { 
          error: 'Please use a restricted API key (rk_live_... or rk_test_...) with read-only permissions: Customers, Subscriptions, Invoices, and Events.' 
        },
        { status: 400 }
      );
    }

    // Create ephemeral Stripe client with user's key (never stored)
    const stripe = new Stripe(stripeKey, {
      apiVersion: '2024-06-20',
      typescript: true,
    });

    // Calculate 90 days ago
    const ninetyDaysAgo = Math.floor(Date.now() / 1000) - (90 * 24 * 60 * 60);

    // Track revenue leakage by category
    const leakage = {
      failedPayments: 0,
      cancellations: 0,
      downgrades: 0,
      silent: 0,
    };

    // Track reasons with dollar amounts
    const reasonBreakdown: Record<ChurnReason, number> = {
      price: 0,
      bug: 0,
      competitor: 0,
      never_activated: 0,
      missing_feature: 0,
      silent_rescue: 0,
      payment_failed: 0,
      other: 0,
    };

    // 1. Scan failed/uncollectible/past_due invoices
    const failedInvoices = await stripe.invoices.list({
      created: { gte: ninetyDaysAgo },
      status: 'open',
      limit: 100,
    });

    for (const invoice of failedInvoices.data) {
      // Check if invoice is past due or uncollectible
      if (invoice.status === 'open' && invoice.due_date && invoice.due_date < Date.now() / 1000) {
        const amount = (invoice.amount_due || 0) / 100;
        leakage.failedPayments += amount;
        reasonBreakdown.payment_failed += amount;
      }
    }

    // Also check for uncollectible invoices
    const uncollectibleInvoices = await stripe.invoices.list({
      created: { gte: ninetyDaysAgo },
      status: 'uncollectible',
      limit: 100,
    });

    for (const invoice of uncollectibleInvoices.data) {
      const amount = (invoice.amount_due || 0) / 100;
      leakage.failedPayments += amount;
      reasonBreakdown.payment_failed += amount;
    }

    // 2. Scan canceled subscriptions
    const canceledSubs = await stripe.subscriptions.list({
      status: 'canceled',
      created: { gte: ninetyDaysAgo },
      limit: 100,
      expand: ['data.items.data.price'],
    });

    for (const sub of canceledSubs.data) {
      // Calculate MRR from the subscription items
      let subMRR = 0;
      for (const item of sub.items.data) {
        subMRR += calculateMRR(item.price);
      }

      leakage.cancellations += subMRR;

      // Classify the cancellation reason
      const comment = sub.cancellation_details?.comment;
      const reason = classifyCancelReason(sub.cancellation_details, comment);
      
      // Track silent separately
      if (reason === 'silent_rescue') {
        leakage.silent += subMRR;
      }
      
      reasonBreakdown[reason] += subMRR;
    }

    // 3. Scan active subscriptions with cancel_at_period_end
    const scheduledCancelSubs = await stripe.subscriptions.list({
      status: 'active',
      limit: 100,
      expand: ['data.items.data.price'],
    });

    for (const sub of scheduledCancelSubs.data) {
      if (sub.cancel_at_period_end) {
        // Calculate MRR from the subscription items
        let subMRR = 0;
        for (const item of sub.items.data) {
          subMRR += calculateMRR(item.price);
        }

        leakage.cancellations += subMRR;

        // Classify the cancellation reason
        const comment = sub.cancellation_details?.comment;
        const reason = classifyCancelReason(sub.cancellation_details, comment);
        
        // Track silent separately
        if (reason === 'silent_rescue') {
          leakage.silent += subMRR;
        }
        
        reasonBreakdown[reason] += subMRR;
      }
    }

    // 4. Scan for downgrades by checking subscription.updated events
    // Look for events where a subscription item's price decreased
    const subUpdatedEvents = await stripe.events.list({
      type: 'customer.subscription.updated',
      created: { gte: ninetyDaysAgo },
      limit: 100,
    });

    for (const event of subUpdatedEvents.data) {
      const previousAttributes = event.data.previous_attributes as any;
      const currentSub = event.data.object as Stripe.Subscription;

      if (previousAttributes?.items?.data) {
        // Calculate old MRR
        let oldMRR = 0;
        for (const item of previousAttributes.items.data) {
          if (item.price) {
            oldMRR += calculateMRR(item.price);
          }
        }

        // Calculate new MRR
        let newMRR = 0;
        for (const item of currentSub.items.data) {
          newMRR += calculateMRR(item.price as Stripe.Price);
        }

        // If MRR decreased, it's a downgrade
        if (newMRR < oldMRR) {
          const downgradeAmount = oldMRR - newMRR;
          leakage.downgrades += downgradeAmount;
          // Classify downgrades as price-related
          reasonBreakdown.price += downgradeAmount;
        }
      }
    }

    // Calculate total leakage
    const totalLeakage = leakage.failedPayments + leakage.cancellations + leakage.downgrades + leakage.silent;

    // Return scan results
    return NextResponse.json({
      totalLeakage: Math.round(totalLeakage * 100) / 100,
      breakdown: {
        failedPayments: Math.round(leakage.failedPayments * 100) / 100,
        cancellations: Math.round(leakage.cancellations * 100) / 100,
        downgrades: Math.round(leakage.downgrades * 100) / 100,
        silent: Math.round(leakage.silent * 100) / 100,
      },
      reasonBreakdown: Object.fromEntries(
        Object.entries(reasonBreakdown)
          .map(([reason, amount]): [string, number] => [reason, Math.round(amount * 100) / 100])
          .filter(([, amount]) => (amount as number) > 0)
      ),
      scannedAt: new Date().toISOString(),
    });

  } catch (error: any) {
    console.error('Scan error:', error.message);
    
    // Handle Stripe API errors gracefully
    if (error.type === 'StripeAuthenticationError') {
      return NextResponse.json(
        { error: 'Invalid Stripe API key. Please check your key and try again.' },
        { status: 401 }
      );
    }

    if (error.type === 'StripePermissionError') {
      return NextResponse.json(
        { error: 'API key missing required permissions. Please ensure your restricted key has read access to: Customers, Subscriptions, Invoices, and Events.' },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to scan Stripe account. Please try again.' },
      { status: 500 }
    );
  }
}
