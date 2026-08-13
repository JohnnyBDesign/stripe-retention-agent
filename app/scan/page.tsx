'use client';

import { useState } from 'react';
import Link from 'next/link';

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
    <div className="min-h-screen bg-canvas">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-line bg-canvas/80 backdrop-blur-sm">
        <div className="mx-auto max-w-content px-6 md:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center">
              <span className="text-lg font-semibold text-ink">Signal</span>
            </Link>
            <Link 
              href="/"
              className="text-sm text-ink-dim hover:text-ink transition"
            >
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
              <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold text-ink mb-4">
                  See who&apos;s leaving — and why
                </h1>
                <p className="text-lg text-ink-dim leading-relaxed">
                  60 seconds. Restricted read key. Never stored.
                </p>
              </div>

              {/* Required Permissions */}
              <div className="bg-surface border border-line rounded-3xl p-6 mb-8">
                <h2 className="text-sm font-semibold text-ink mb-3">Restricted Read Only</h2>
                <ul className="space-y-2 text-sm text-ink-dim">
                  <li className="flex items-center gap-2">
                    <span className="text-status-green">✓</span>
                    Customers
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-status-green">✓</span>
                    Subscriptions
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-status-green">✓</span>
                    Invoices
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-status-green">✓</span>
                    Events
                  </li>
                </ul>
                <div className="mt-4 pt-4 border-t border-line">
                  <p className="text-xs text-ink-subdued">
                    Never persisted. Never logged. Create at{' '}
                    <a 
                      href="https://dashboard.stripe.com/apikeys/create?type=restricted" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-ink-dim hover:text-ink underline"
                    >
                      dashboard.stripe.com/apikeys/create
                    </a>
                  </p>
                </div>
              </div>

              {/* Scan Form */}
              <form onSubmit={handleScan} className="space-y-6">
                <div>
                  <label htmlFor="stripeKey" className="block text-sm font-medium text-ink mb-2">
                    Paste your restricted key
                  </label>
                  <input
                    id="stripeKey"
                    type="password"
                    value={stripeKey}
                    onChange={(e) => setStripeKey(e.target.value)}
                    placeholder="rk_live_..."
                    className="w-full px-4 py-3 bg-surface border border-line rounded-xl text-ink placeholder:text-ink-subdued focus:outline-none focus:ring-2 focus:ring-white/20 font-mono text-sm"
                    disabled={loading}
                    required
                  />
                  <p className="mt-2 text-xs text-ink-subdued">
                    Starts with <code className="text-ink-dim">rk_live_</code> or <code className="text-ink-dim">rk_test_</code>
                  </p>
                </div>

                {error && (
                  <div className="bg-status-red/10 border border-status-red/20 rounded-xl p-4">
                    <p className="text-sm text-status-red">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || !stripeKey}
                  className="w-full px-8 py-4 bg-white text-black text-base font-medium rounded-pill hover:bg-white/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Scanning 90 days...' : 'Scan 90 days'}
                </button>
              </form>

              {/* Trust indicators */}
              <div className="mt-8 text-center">
                <p className="text-xs text-ink-subdued">
                  Independent product, not made by Stripe
                </p>
              </div>
            </>
          ) : (
            <>
              {/* Results Header - Hero $ = Sum of All Four Buckets */}
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-pill bg-surface border border-line text-ink-dim text-xs font-medium mb-6">
                  Scanned {new Date(result.scannedAt).toLocaleDateString()}
                </div>
                
                <h1 className="text-6xl md:text-7xl font-bold text-ink mb-2">
                  ${result.totalLeakage.toLocaleString()}
                </h1>
                <p className="text-xl text-ink-dim">
                  leaking / 90d
                </p>
              </div>

              {/* Four Scan Buckets: Failed / Cancel / Downgrade / Leaving-Soon */}
              <div className="grid grid-cols-2 gap-3 mb-12">
                <div className="bg-surface border border-line rounded-2xl p-5">
                  <div className="text-2xl font-bold text-ink mb-1">
                    ${result.breakdown.voluntary.toLocaleString()}
                  </div>
                  <div className="text-xs text-ink-dim">Cancel</div>
                </div>
                <div className="bg-surface border border-line rounded-2xl p-5">
                  <div className="text-2xl font-bold text-ink mb-1">
                    ${result.breakdown.leavingSoon.toLocaleString()}
                  </div>
                  <div className="text-xs text-ink-dim">Leaving Soon</div>
                </div>
                <div className="bg-surface border border-line rounded-2xl p-5">
                  <div className="text-2xl font-bold text-ink mb-1">
                    ${result.breakdown.downgrades.toLocaleString()}
                  </div>
                  <div className="text-xs text-ink-dim">Downgrade</div>
                </div>
                <div className="bg-surface border border-line rounded-2xl p-5">
                  <div className="text-2xl font-bold text-ink mb-1">
                    ${result.breakdown.involuntary.toLocaleString()}
                  </div>
                  <div className="text-xs text-ink-dim">Failed</div>
                </div>
              </div>

              {/* Why They Left - Classified Voluntary Cancels Only */}
              <div className="bg-surface border border-line rounded-3xl p-8 mb-8">
                <h2 className="text-xl font-semibold text-ink mb-6">Why they left</h2>
                
                {Object.entries(result.reasonBreakdown).length > 0 ? (
                  <div className="space-y-3">
                    {Object.entries(result.reasonBreakdown)
                      .sort(([, a], [, b]) => b - a)
                      .map(([reason, amount]) => {
                        const voluntaryTotal = result.breakdown.voluntary + result.breakdown.leavingSoon;
                        const percentage = voluntaryTotal > 0 ? (amount / voluntaryTotal) * 100 : 0;
                        return (
                          <div key={reason} className="space-y-1.5">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-ink-dim">{REASON_LABELS[reason] || reason}</span>
                              <span className="font-semibold text-ink">${amount.toLocaleString()}</span>
                            </div>
                            <div className="h-1.5 bg-panel rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-ink rounded-full transition-all"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                  </div>
                ) : (
                  <p className="text-ink-dim text-center py-8">
                    No cancellation reasons detected in the scanned period.
                  </p>
                )}
              </div>

              {/* Failed Payments Note - Display Only */}
              <div className="bg-panel border border-line rounded-2xl p-5 mb-8">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-ink-dim">Failed payments — display only</span>
                  <span className="text-lg font-semibold text-ink">
                    ${result.breakdown.involuntary.toLocaleString()}
                  </span>
                </div>
                <p className="text-xs text-ink-subdued">
                  Failed payments — Stripe retries; not Signal v0.
                </p>
              </div>

              {/* Optional Activity Signal Note */}
              <div className="bg-surface border border-line rounded-2xl p-4 mb-8">
                <p className="text-xs text-ink-subdued text-center">
                  Silent renewers need a usage signal — connect activity after you start.
                </p>
              </div>

              {/* Post-Scan CTA */}
              <div className="bg-gradient-to-br from-surface to-panel border border-line rounded-3xl p-8 text-center">
                <h3 className="text-2xl font-bold text-ink mb-3">
                  Get these in a queue you approve
                </h3>
                <p className="text-ink-dim mb-6 max-w-lg mx-auto">
                  Signal classifies every cancel, drafts the save, and sends through your Resend — after you approve. No auto-sends.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link 
                    href="/#pricing"
                    className="px-8 py-4 bg-white text-black text-base font-medium rounded-pill hover:bg-white/90 transition"
                  >
                    See pricing
                  </Link>
                  <Link 
                    href="/queue"
                    className="px-8 py-4 bg-surface text-ink text-base font-medium rounded-pill hover:bg-panel transition border border-line"
                  >
                    View demo queue
                  </Link>
                </div>
              </div>

              {/* Scan Again */}
              <div className="mt-8 text-center">
                <button
                  onClick={() => {
                    setResult(null);
                    setStripeKey('');
                    setError(null);
                  }}
                  className="text-sm text-ink-dim hover:text-ink transition underline"
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
