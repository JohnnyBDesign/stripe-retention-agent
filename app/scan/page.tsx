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
    <div className="min-h-screen bg-black">
      {/* Nav - Nothing Design */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-black">
        <div className="mx-auto max-w-content px-6 md:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center">
              <span className="font-mono text-label uppercase tracking-[0.08em] text-text-display">Signal</span>
            </Link>
            <Link href="/" className="font-mono text-caption uppercase tracking-[0.06em] text-text-secondary hover:text-text-display transition">
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
              <Card className="bg-surface border-border-visible p-6 mb-8">
                <h2 className="font-mono text-label uppercase tracking-[0.08em] text-text-primary mb-4">Restricted Read Only</h2>
                <ul className="space-y-2 font-body text-body-sm text-text-secondary">
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
                  <p className="font-mono text-caption text-text-disabled">
                    Never persisted. Never logged. Create at{' '}
                    <a 
                      href="https://dashboard.stripe.com/apikeys/create?type=restricted" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-text-secondary hover:text-text-primary underline transition"
                    >
                      dashboard.stripe.com/apikeys/create
                    </a>
                  </p>
                </div>
              </Card>

              {/* Scan Form */}
              <form onSubmit={handleScan} className="space-y-6">
                <div>
                  <label htmlFor="stripeKey" className="block font-mono text-label uppercase tracking-[0.08em] text-text-primary mb-3">
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
                  <p className="mt-2 font-mono text-caption text-text-disabled">
                    Starts with <code className="text-text-secondary">rk_live_</code> or <code className="text-text-secondary">rk_test_</code>
                  </p>
                </div>

                {error && (
                  <Card className="bg-surface border-accent p-4">
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
                <p className="font-mono text-caption text-text-disabled">
                  Independent product, not made by Stripe
                </p>
              </div>
            </>
          ) : (
            <>
              {/* Results Header */}
              <div className="mb-12">
                <div className="inline-block px-4 py-2 border border-border-visible rounded-pill font-mono text-caption uppercase tracking-[0.06em] text-text-secondary mb-6">
                  Scanned {new Date(result.scannedAt).toLocaleDateString()}
                </div>
                
                <h1 className="font-display text-[72px] md:text-[96px] leading-[0.95] font-medium text-text-display mb-2 tracking-tight">
                  ${result.totalLeakage.toLocaleString()}
                </h1>
                <p className="font-body text-subheading text-text-secondary">
                  leaking / 90d
                </p>
              </div>

              {/* Four Scan Buckets: Failed / Cancel / Downgrade / Leaving-Soon */}
              <div className="grid grid-cols-2 gap-3 mb-12">
                <Card className="bg-surface border-border-visible p-5">
                  <div className="font-display text-display-sm font-medium text-text-display mb-1">
                    ${result.breakdown.voluntary.toLocaleString()}
                  </div>
                  <div className="font-mono text-caption uppercase tracking-[0.06em] text-text-secondary">Cancel</div>
                </Card>
                <Card className="bg-surface border-border-visible p-5">
                  <div className="font-display text-display-sm font-medium text-text-display mb-1">
                    ${result.breakdown.leavingSoon.toLocaleString()}
                  </div>
                  <div className="font-mono text-caption uppercase tracking-[0.06em] text-text-secondary">Leaving Soon</div>
                </Card>
                <Card className="bg-surface border-border-visible p-5">
                  <div className="font-display text-display-sm font-medium text-text-display mb-1">
                    ${result.breakdown.downgrades.toLocaleString()}
                  </div>
                  <div className="font-mono text-caption uppercase tracking-[0.06em] text-text-secondary">Downgrade</div>
                </Card>
                <Card className="bg-surface border-border-visible p-5">
                  <div className="font-display text-display-sm font-medium text-text-display mb-1">
                    ${result.breakdown.involuntary.toLocaleString()}
                  </div>
                  <div className="font-mono text-caption uppercase tracking-[0.06em] text-text-secondary">Failed</div>
                </Card>
              </div>

              {/* Why They Left - Classified Voluntary Cancels Only */}
              <Card className="bg-surface border-border-visible p-8 mb-8">
                <h2 className="font-display text-display-sm font-medium text-text-display mb-6">Why they left</h2>
                
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
                              <span className="font-body text-body text-text-secondary">{REASON_LABELS[reason] || reason}</span>
                              <span className="font-mono text-body font-medium text-text-display">${amount.toLocaleString()}</span>
                            </div>
                            <div className="h-1 bg-border rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-text-display rounded-full transition-all"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                  </div>
                ) : (
                  <p className="font-body text-body text-text-secondary text-center py-8">
                    No cancellation reasons detected in the scanned period.
                  </p>
                )}
              </Card>

              {/* Failed Payments Note - Display Only */}
              <Card className="bg-surface-raised border-border p-5 mb-8">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-body text-body-sm text-text-secondary">Failed payments — display only</span>
                  <span className="font-mono text-heading font-medium text-text-primary">
                    ${result.breakdown.involuntary.toLocaleString()}
                  </span>
                </div>
                <p className="font-mono text-caption text-text-disabled">
                  Failed payments — Stripe retries; not Signal v0.
                </p>
              </Card>

              {/* Optional Activity Signal Note */}
              <Card className="bg-surface border-border p-4 mb-8">
                <p className="font-mono text-caption text-text-disabled text-center">
                  Silent renewers need a usage signal — connect activity after you start.
                </p>
              </Card>

              {/* Post-Scan CTA */}
              <Card className="bg-card border-border p-8 text-center mb-8">
                <h3 className="font-display text-display-md font-normal mb-3">
                  Get these in a queue you approve
                </h3>
                <p className="font-body text-body text-muted-foreground mb-6 max-w-lg mx-auto">
                  You approve. Signal sends. Replies go to you.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link href="/#pricing">
                    <Button variant="default" size="lg">
                      See pricing
                    </Button>
                  </Link>
                  <Link href="/queue">
                    <Button variant="outline" size="lg">
                      View demo queue
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
                  className="font-mono text-caption uppercase tracking-[0.06em] text-text-secondary hover:text-text-primary transition underline"
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
