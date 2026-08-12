import Link from 'next/link';

export default function Pricing() {
  return (
    <section id="pricing" className="scroll-mt-16">
      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <h2 className="text-3xl font-bold text-afterwhy-paper mb-4 text-center">
          Pricing
        </h2>
        <p className="text-center text-afterwhy-muted mb-12">
          Annual: 2 months free
        </p>
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-12">
          {/* Starter */}
          <div className="border border-afterwhy-line rounded-card p-8 hover:border-afterwhy-amber transition-colors bg-afterwhy-elevated">
            <div className="mb-6">
              <h3 className="text-2xl font-semibold text-afterwhy-paper mb-2">
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
                <span className="text-afterwhy-muted text-base leading-[1.55]">
                  ≤100 approved enrolls/mo
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-afterwhy-signal font-bold text-lg">
                  ✓
                </span>
                <span className="text-afterwhy-muted text-base leading-[1.55]">1 HITL seat</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-afterwhy-signal font-bold text-lg">
                  ✓
                </span>
                <span className="text-afterwhy-muted text-base leading-[1.55]">1 Stripe account</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-afterwhy-signal font-bold text-lg">
                  ✓
                </span>
                <span className="text-afterwhy-muted text-base leading-[1.55]">Resend segments</span>
              </li>
            </ul>
            <Link
              href="#pricing"
              className="block text-center px-6 py-3 bg-afterwhy-amber hover:bg-afterwhy-amber-hover text-afterwhy-ink rounded-pill font-semibold transition-colors"
            >
              Start with Stripe keys → get your first HITL card
            </Link>
          </div>

          {/* Growth */}
          <div className="border-2 border-afterwhy-amber rounded-card p-8 relative bg-afterwhy-elevated">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-afterwhy-amber text-afterwhy-ink text-xs font-bold px-4 py-1 rounded-pill">
              POPULAR
            </div>
            <div className="mb-6">
              <h3 className="text-2xl font-semibold text-afterwhy-paper mb-2">
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
                <span className="text-afterwhy-muted text-base leading-[1.55]">
                  ≤500 approved enrolls/mo
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-afterwhy-signal font-bold text-lg">
                  ✓
                </span>
                <span className="text-afterwhy-muted text-base leading-[1.55]">3 HITL seats</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-afterwhy-signal font-bold text-lg">
                  ✓
                </span>
                <span className="text-afterwhy-muted text-base leading-[1.55]">Priority support</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-afterwhy-signal font-bold text-lg">
                  ✓
                </span>
                <span className="text-afterwhy-muted text-base leading-[1.55]">
                  Everything in Starter
                </span>
              </li>
            </ul>
            <Link
              href="#pricing"
              className="block text-center px-6 py-3 bg-afterwhy-amber hover:bg-afterwhy-amber-hover text-afterwhy-ink rounded-pill font-semibold transition-colors"
            >
              Start with Stripe keys → get your first HITL card
            </Link>
          </div>
        </div>

        {/* Design Partner Offer */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-afterwhy-elevated border border-afterwhy-amber rounded-card p-6">
            <div className="flex items-start gap-4">
              <div className="text-3xl">🎯</div>
              <div>
                <h3 className="font-semibold text-afterwhy-paper text-lg mb-2">
                  Design Partner: 50% off for 90 days
                </h3>
                <p className="text-afterwhy-muted text-base leading-[1.55]">
                  Discount starts <strong className="text-afterwhy-paper">after your first successful enroll</strong> (Stripe → classify → HITL → Resend segment).
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
