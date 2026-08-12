import Link from 'next/link';

export default function Pricing() {
  return (
    <section id="pricing" className="scroll-mt-16">
      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-afterwhy-paper mb-4 text-center">
          Pricing
        </h2>
        <p className="text-center text-afterwhy-muted mb-12">
          Annual: 2 months free
        </p>
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-12">
          {/* Starter */}
          <div className="border-2 border-afterwhy-line rounded-card p-8 hover:border-afterwhy-amber transition-colors bg-afterwhy-elevated">
            <div className="mb-6">
              <h3 className="font-display text-2xl font-bold text-afterwhy-paper mb-2">
                Starter
              </h3>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-afterwhy-paper">
                  $99
                </span>
                <span className="text-afterwhy-muted">/month</span>
              </div>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-3">
                <span className="text-afterwhy-signal font-bold text-lg">
                  ✓
                </span>
                <span className="text-afterwhy-muted">
                  ≤100 approved enrolls/mo
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-afterwhy-signal font-bold text-lg">
                  ✓
                </span>
                <span className="text-afterwhy-muted">1 HITL seat</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-afterwhy-signal font-bold text-lg">
                  ✓
                </span>
                <span className="text-afterwhy-muted">1 Stripe account</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-afterwhy-signal font-bold text-lg">
                  ✓
                </span>
                <span className="text-afterwhy-muted">Resend segments</span>
              </li>
            </ul>
            <div className="space-y-3">
              <Link
                href="/queue"
                className="block text-center px-6 py-3 bg-afterwhy-amber hover:bg-afterwhy-amber-hover text-afterwhy-ink rounded-card font-semibold transition-colors"
              >
                Connect Stripe → get your first HITL card
              </Link>
              <Link
                href="#pricing"
                className="block text-center px-6 py-3 border-2 border-afterwhy-line hover:border-afterwhy-paper text-afterwhy-paper rounded-card font-medium transition-colors text-sm"
              >
                Apply for founding — 50% off 90 days after first successful enroll
              </Link>
            </div>
          </div>

          {/* Growth */}
          <div className="border-2 border-afterwhy-amber rounded-card p-8 relative bg-afterwhy-elevated">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-afterwhy-amber text-afterwhy-ink text-xs font-bold px-4 py-1 rounded-pill">
              POPULAR
            </div>
            <div className="mb-6">
              <h3 className="font-display text-2xl font-bold text-afterwhy-paper mb-2">
                Growth
              </h3>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-afterwhy-paper">
                  $249
                </span>
                <span className="text-afterwhy-muted">/month</span>
              </div>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-3">
                <span className="text-afterwhy-signal font-bold text-lg">
                  ✓
                </span>
                <span className="text-afterwhy-muted">
                  ≤500 approved enrolls/mo
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-afterwhy-signal font-bold text-lg">
                  ✓
                </span>
                <span className="text-afterwhy-muted">3 HITL seats</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-afterwhy-signal font-bold text-lg">
                  ✓
                </span>
                <span className="text-afterwhy-muted">Priority SLA</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-afterwhy-signal font-bold text-lg">
                  ✓
                </span>
                <span className="text-afterwhy-muted">
                  Everything in Starter
                </span>
              </li>
            </ul>
            <div className="space-y-3">
              <Link
                href="/queue"
                className="block text-center px-6 py-3 bg-afterwhy-amber hover:bg-afterwhy-amber-hover text-afterwhy-ink rounded-card font-semibold transition-colors"
              >
                Connect Stripe → get your first HITL card
              </Link>
              <Link
                href="#pricing"
                className="block text-center px-6 py-3 border-2 border-afterwhy-line hover:border-afterwhy-paper text-afterwhy-paper rounded-card font-medium transition-colors text-sm"
              >
                Apply for founding — 50% off 90 days after first successful enroll
              </Link>
            </div>
          </div>
        </div>

        {/* Design Partner Offer */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-afterwhy-elevated border-2 border-afterwhy-amber rounded-card p-6">
            <div className="flex items-start gap-4">
              <div className="text-3xl">🎯</div>
              <div>
                <h3 className="font-bold text-afterwhy-paper text-lg mb-2">
                  Design Partner: 50% off for 90 days
                </h3>
                <p className="text-afterwhy-muted leading-relaxed">
                  Discount starts <strong className="text-afterwhy-paper">after your first successful enroll</strong> (Stripe → classify → HITL → Resend segment). Book a walkthrough to qualify.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
