import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { classifyCancelReason } from '@/lib/classifier';

// Simple in-memory rate limiter for scan endpoint
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const RATE_LIMIT_MAX_REQUESTS = 5; // 5 scans per hour per IP

function checkRateLimit(ip: string): { allowed: boolean; resetAt?: number } {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  // Clean up old entries periodically
  if (Math.random() < 0.01) {
    for (const [key, value] of rateLimitMap.entries()) {
      if (value.resetAt < now) {
        rateLimitMap.delete(key);
      }
    }
  }

  if (!record || record.resetAt < now) {
    // New window
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true };
  }

  if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
    return { allowed: false, resetAt: record.resetAt };
  }

  // Increment count
  record.count += 1;
  return { allowed: true };
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
    // Rate limiting
    const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
    const rateLimitCheck = checkRateLimit(ip);
    
    if (!rateLimitCheck.allowed) {
      const resetAt = rateLimitCheck.resetAt || Date.now();
      const resetInMinutes = Math.ceil((resetAt - Date.now()) / (60 * 1000));
      return NextResponse.json(
        { error: `Rate limit exceeded. Please try again in ${resetInMinutes} minutes.` },
        { 
          status: 429,
          headers: {
            'Retry-After': String(Math.ceil((resetAt - Date.now()) / 1000)),
          }
        }
      );
    }

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

    // Track revenue leakage by category (scan buckets)
    // Hero $ = involuntary + voluntary + downgrade + leaving-soon
    const leakage = {
      involuntary: 0,        // Failed/uncollectible invoices (display only)
      voluntary: 0,          // Already canceled subscriptions
      downgrades: 0,         // Subscription tier reductions
      leavingSoon: 0,        // cancel_at_period_end (scheduled)
    };

    // Track voluntary cancel reasons with dollar amounts (for why-pie)
    // Why-pie = classified voluntary cancels ONLY (canceled + leaving-soon with cancellation_details)
    // Downgrades stay in split tile only, NOT in why-pie
    const reasonBreakdown: Record<string, number> = {
      price: 0,
      bug: 0,
      competitor: 0,
      missing_feature: 0,
      other: 0,
    };

    // 1. Scan failed/uncollectible/past_due invoices (involuntary - display only)
    const failedInvoices = await stripe.invoices.list({
      created: { gte: ninetyDaysAgo },
      status: 'open',
      limit: 100,
    });

    for (const invoice of failedInvoices.data) {
      // Check if invoice is past due or uncollectible
      if (invoice.status === 'open' && invoice.due_date && invoice.due_date < Date.now() / 1000) {
        const amount = (invoice.amount_due || 0) / 100;
        leakage.involuntary += amount;
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
      leakage.involuntary += amount;
    }

    // 2. Scan canceled subscriptions (voluntary cancel)
    // Filter by canceled in the last 90 days (canceled_at), not created
    const canceledSubs = await stripe.subscriptions.list({
      status: 'canceled',
      limit: 100,
      expand: ['data.items.data.price'],
    });

    for (const sub of canceledSubs.data) {
      // Skip if not canceled in the last 90 days
      if (!sub.canceled_at || sub.canceled_at < ninetyDaysAgo) {
        continue;
      }

      // Calculate MRR from the subscription items
      let subMRR = 0;
      for (const item of sub.items.data) {
        subMRR += calculateMRR(item.price);
      }

      leakage.voluntary += subMRR;

      // Classify the cancellation reason (for why-pie)
      const comment = sub.cancellation_details?.comment;
      const reason = classifyCancelReason(sub.cancellation_details, comment);
      
      if (!reasonBreakdown[reason]) {
        reasonBreakdown[reason] = 0;
      }
      reasonBreakdown[reason] += subMRR;
    }

    // 3. Scan active subscriptions with cancel_at_period_end (leaving-soon)
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

        leakage.leavingSoon += subMRR;

        // Classify the cancellation reason (for why-pie) - only if cancellation_details present
        if (sub.cancellation_details) {
          const comment = sub.cancellation_details?.comment;
          const reason = classifyCancelReason(sub.cancellation_details, comment);
          
          if (!reasonBreakdown[reason]) {
            reasonBreakdown[reason] = 0;
          }
          reasonBreakdown[reason] += subMRR;
        }
      }
    }

    // 4. Scan for downgrades by checking subscription.updated events
    // Look for events where a subscription item's price decreased
    // Downgrades do NOT go into why-pie (reasonBreakdown) - they stay in split tile only
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

        // If MRR decreased, it's a downgrade - add to split tile, NOT to why-pie
        if (newMRR < oldMRR) {
          const downgradeAmount = oldMRR - newMRR;
          leakage.downgrades += downgradeAmount;
        }
      }
    }

    // Calculate hero total (sum of all four buckets)
    const heroTotal = leakage.involuntary + leakage.voluntary + leakage.downgrades + leakage.leavingSoon;

    // Return scan results
    return NextResponse.json({
      totalLeakage: Math.round(heroTotal * 100) / 100,
      breakdown: {
        involuntary: Math.round(leakage.involuntary * 100) / 100,
        voluntary: Math.round(leakage.voluntary * 100) / 100,
        downgrades: Math.round(leakage.downgrades * 100) / 100,
        leavingSoon: Math.round(leakage.leavingSoon * 100) / 100,
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
