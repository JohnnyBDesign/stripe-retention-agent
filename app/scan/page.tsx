'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

type ScanResult = {
  totalLeakage: number;
  breakdown: {
    involuntary: number;
    voluntary: number;
    downgrades: number;
    leavingSoon: number;
  };
  reasonBreakdown: Record<string, number>;
  scannedAt: string;
};

const REASON_LABELS: Record<string, string> = {
  price: 'Price / Too Expensive',
  bug: 'Bugs / Technical Issues',
  competitor: 'Switched to Competitor',
  missing_feature: 'Missing Features',
  never_activated: 'Never Activated',
  other: 'Other / No Reason on File',
};

export default function ScanPage() {
  const [stripeKey, setStripeKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ScanResult | null>(null);

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stripeKey }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to scan. Please try again.');
        setResult(null);
      } else {
        setResult(data);
        setError(null);
      }
    } catch (err) {
      setError('Network error. Please check your connection and try again.');
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Nav - Optimus Light */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto max-w-content px-6 md:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center">
              <span className="font-mono text-label uppercase tracking-[0.08em] text-foreground">Signal</span>
            </Link>
            <Link href="/" className="font-mono text-caption uppercase tracking-[0.06em] text-muted-foreground hover:text-foreground transition">
              Back to home
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-32 pb-20 px-6 md:px-8">
        <div className="mx-auto max-w-2xl">
          {!result ? (
            <>
              {/* Header */}
              <div className="mb-12">
                <h1 className="font-display text-display-lg md:text-display-xl font-normal mb-4 tracking-tight">
                  See who&apos;s leaving — and why.
                </h1>
                <p className="font-body text-subheading text-muted-foreground leading-relaxed">
                  60 seconds. Restricted read key. Never stored. $99 includes sending.
                </p>
              </div>

              {/* Required Permissions */}
              <Card className="bg-card border-border p-6 mb-8">
                <h2 className="font-mono text-label uppercase tracking-[0.08em] text-foreground mb-4">Restricted Read Only</h2>
                <ul className="space-y-2 font-body text-body-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <span className="text-success">✓</span>
                    Customers
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-success">✓</span>
                    Subscriptions
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-success">✓</span>
                    Invoices
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-success">✓</span>
                    Events
                  </li>
                </ul>
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="font-mono text-caption text-muted-foreground">
                    Never persisted. Never logged. Create at{' '}
                    <a 
                      href="https://dashboard.stripe.com/apikeys/create?type=restricted" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-foreground underline transition"
                    >
                      dashboard.stripe.com/apikeys/create
                    </a>
                  </p>
                </div>
              </Card>

              {/* Scan Form */}
              <form onSubmit={handleScan} className="space-y-6">
                <div>
                  <label htmlFor="stripeKey" className="block font-mono text-label uppercase tracking-[0.08em] text-foreground mb-3">
                    Paste your restricted key
                  </label>
                  <Input
                    id="stripeKey"
                    type="password"
                    value={stripeKey}
                    onChange={(e) => setStripeKey(e.target.value)}
                    placeholder="rk_live_..."
                    disabled={loading}
                    required
                  />
                  <p className="mt-2 font-mono text-caption text-muted-foreground">
                    Starts with <code className="text-muted-foreground">rk_live_</code> or <code className="text-muted-foreground">rk_test_</code>
                  </p>
                </div>

                {error && (
                  <Card className="bg-card border-accent p-4">
                    <p className="font-body text-body-sm text-error">{error}</p>
                  </Card>
                )}

                <Button
                  type="submit"
                  disabled={loading || !stripeKey}
                  variant="default"
                  size="lg"
                  className="w-full"
                >
                  {loading ? 'Scanning...' : 'Scan my Stripe'}
                </Button>
              </form>

              {/* Trust indicators */}
              <div className="mt-8 text-center">
                <p className="font-mono text-caption text-muted-foreground">
                  Independent product, not made by Stripe
                </p>
              </div>
            </>
          ) : (
            <>
              {/* Results Header */}
              <div className="mb-12">
                <div className="inline-block px-4 py-2 border border-border rounded-pill font-mono text-caption uppercase tracking-[0.06em] text-muted-foreground mb-6">
                  Scanned {new Date(result.scannedAt).toLocaleDateString()}
                </div>
                
                <h1 className="font-display text-[72px] md:text-[96px] leading-[0.95] font-medium text-foreground mb-2 tracking-tight">
                  ${result.totalLeakage.toLocaleString()}
                </h1>
                <p className="font-body text-subheading text-muted-foreground">
                  leaking / 90d
                </p>
              </div>

              {/* Four Scan Buckets: Failed / Cancel / Downgrade / Leaving-Soon */}
              <div className="grid grid-cols-2 gap-3 mb-12">
                <Card className="bg-card border-border p-5">
                  <div className="font-display text-display-sm font-medium text-foreground mb-1">
                    ${result.breakdown.voluntary.toLocaleString()}
                  </div>
                  <div className="font-mono text-caption uppercase tracking-[0.06em] text-muted-foreground">Cancel</div>
                </Card>
                <Card className="bg-card border-border p-5">
                  <div className="font-display text-display-sm font-medium text-foreground mb-1">
                    ${result.breakdown.leavingSoon.toLocaleString()}
                  </div>
                  <div className="font-mono text-caption uppercase tracking-[0.06em] text-muted-foreground">Leaving Soon</div>
                </Card>
                <Card className="bg-card border-border p-5">
                  <div className="font-display text-display-sm font-medium text-foreground mb-1">
                    ${result.breakdown.downgrades.toLocaleString()}
                  </div>
                  <div className="font-mono text-caption uppercase tracking-[0.06em] text-muted-foreground">Downgrade</div>
                </Card>
                <Card className="bg-card border-border p-5">
                  <div className="font-display text-display-sm font-medium text-foreground mb-1">
                    ${result.breakdown.involuntary.toLocaleString()}
                  </div>
                  <div className="font-mono text-caption uppercase tracking-[0.06em] text-muted-foreground">Failed</div>
                </Card>
              </div>

              {/* Why They Left - Classified Voluntary Cancels Only */}
              <Card className="bg-card border-border p-8 mb-8">
                <h2 className="font-display text-display-sm font-medium text-foreground mb-6">Why they left</h2>
                
                {Object.entries(result.reasonBreakdown).length > 0 ? (
                  <div className="space-y-4">
                    {Object.entries(result.reasonBreakdown)
                      .sort(([, a], [, b]) => b - a)
                      .map(([reason, amount]) => {
                        const voluntaryTotal = result.breakdown.voluntary + result.breakdown.leavingSoon;
                        const percentage = voluntaryTotal > 0 ? (amount / voluntaryTotal) * 100 : 0;
                        return (
                          <div key={reason} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="font-body text-body text-muted-foreground">{REASON_LABELS[reason] || reason}</span>
                              <span className="font-mono text-body font-medium text-foreground">${amount.toLocaleString()}</span>
                            </div>
                            <div className="h-1 bg-border rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-foreground rounded-full transition-all"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                  </div>
                ) : (
                  <p className="font-body text-body text-muted-foreground text-center py-8">
                    No cancellation reasons detected in the scanned period.
                  </p>
                )}
              </Card>

              {/* Failed Payments Note - Display Only */}
              <Card className="bg-card border-border p-5 mb-8">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-body text-body-sm text-muted-foreground">Failed payments — display only</span>
                  <span className="font-mono text-heading font-medium text-foreground">
                    ${result.breakdown.involuntary.toLocaleString()}
                  </span>
                </div>
                <p className="font-mono text-caption text-muted-foreground">
                  Failed payments — Stripe retries; not Signal v0.
                </p>
              </Card>

              {/* Optional Activity Signal Note */}
              <Card className="bg-card border-border p-4 mb-8">
                <p className="font-mono text-caption text-muted-foreground text-center">
                  Silent renewers need a usage signal — connect activity after you start.
                </p>
              </Card>

              {/* Post-Scan CTA */}
              <Card className="bg-card border-border p-8 text-center mb-8">
                <h3 className="font-display text-display-md font-normal mb-3">
                  Get these in a queue you approve
                </h3>
                <p className="font-body text-body text-muted-foreground mb-6 max-w-lg mx-auto">
                  Sign up to connect your Stripe and start approving retention cases. You approve. Signal sends. Replies go to you.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link href="/login">
                    <Button variant="default" size="lg">
                      Sign up / Login
                    </Button>
                  </Link>
                  <Link href="/#pricing">
                    <Button variant="outline" size="lg">
                      See pricing
                    </Button>
                  </Link>
                </div>
              </Card>

              {/* Scan Again */}
              <div className="text-center">
                <button
                  onClick={() => {
                    setResult(null);
                    setStripeKey('');
                    setError(null);
                  }}
                  className="font-mono text-caption uppercase tracking-[0.06em] text-muted-foreground hover:text-foreground transition underline"
                >
                  Scan another account
                </button>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
