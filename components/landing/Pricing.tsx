import Link from 'next/link';

export default function Pricing() {
  return (
    <section id="pricing" className="scroll-mt-16">
      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <h2 className="text-3xl sm:text-4xl font-bold text-chalk mb-4 text-center">
          Pricing
        </h2>
        <p className="text-center text-mute mb-12">
          Annual: 2 months free
        </p>
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-12">
          {/* Starter */}
          <div className="border-2 border-line rounded-2xl p-8 hover:border-lime transition-colors bg-panel">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-chalk mb-2">
                Starter
              </h3>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-chalk">
                  $99
                </span>
                <span className="text-mute">/month</span>
              </div>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-3">
                <span className="text-cyan font-bold text-lg">
                  ✓
                </span>
                <span className="text-mute">
                  ≤100 approved enrolls/mo
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-cyan font-bold text-lg">
                  ✓
                </span>
                <span className="text-mute">1 HITL seat</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-cyan font-bold text-lg">
                  ✓
                </span>
                <span className="text-mute">1 Stripe account</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-cyan font-bold text-lg">
                  ✓
                </span>
                <span className="text-mute">Resend segments</span>
              </li>
            </ul>
            <div className="space-y-3">
              <Link
                href="/queue"
                className="block text-center px-6 py-3 bg-lime hover:bg-lime/90 text-void rounded-2xl font-semibold transition-colors"
              >
                Connect Stripe → get your first HITL card
              </Link>
              <Link
                href="#pricing"
                className="block text-center px-6 py-3 border-2 border-line hover:border-chalk text-chalk rounded-2xl font-medium transition-colors text-sm"
              >
                Apply for founding — 50% off 90 days after first successful enroll
              </Link>
            </div>
          </div>

          {/* Growth */}
          <div className="border-2 border-lime rounded-2xl p-8 relative bg-panel">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-lime text-void text-xs font-bold px-4 py-1 rounded-pill">
              POPULAR
            </div>
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-chalk mb-2">
                Growth
              </h3>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-chalk">
                  $249
                </span>
                <span className="text-mute">/month</span>
              </div>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-3">
                <span className="text-cyan font-bold text-lg">
                  ✓
                </span>
                <span className="text-mute">
                  ≤500 approved enrolls/mo
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-cyan font-bold text-lg">
                  ✓
                </span>
                <span className="text-mute">3 HITL seats</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-cyan font-bold text-lg">
                  ✓
                </span>
                <span className="text-mute">Priority SLA</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-cyan font-bold text-lg">
                  ✓
                </span>
                <span className="text-mute">
                  Everything in Starter
                </span>
              </li>
            </ul>
            <div className="space-y-3">
              <Link
                href="/queue"
                className="block text-center px-6 py-3 bg-lime hover:bg-lime/90 text-void rounded-2xl font-semibold transition-colors"
              >
                Connect Stripe → get your first HITL card
              </Link>
              <Link
                href="#pricing"
                className="block text-center px-6 py-3 border-2 border-line hover:border-chalk text-chalk rounded-2xl font-medium transition-colors text-sm"
              >
                Apply for founding — 50% off 90 days after first successful enroll
              </Link>
            </div>
          </div>
        </div>

        {/* Design Partner Offer */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-panel border-2 border-lime rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="text-3xl">🎯</div>
              <div>
                <h3 className="font-bold text-chalk text-lg mb-2">
                  Design Partner: 50% off for 90 days
                </h3>
                <p className="text-mute leading-relaxed">
                  Discount starts <strong className="text-chalk">after your first successful enroll</strong> (Stripe → classify → HITL → Resend segment). Book a walkthrough to qualify.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
