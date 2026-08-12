import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-panel/50 to-transparent" />
      <div className="relative max-w-content mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-32">
        <div className="max-w-hero mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-chalk mb-6 leading-tight">
            Stripe churn, classified and saved.
          </h1>
          <p className="text-lg sm:text-xl text-mute mb-10 leading-relaxed">
            Not another cancel modal. A churn agent that classifies price, bugs,
            competitors, never-activated, and silent renewers—then enrolls the
            playbook in YOUR Resend. Human approves every draft.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Link
              href="#pricing"
              className="w-full sm:w-auto px-8 py-3.5 bg-lime hover:bg-lime/90 text-void text-base font-semibold rounded-chrome transition-colors"
            >
              Start with Stripe keys → get your first HITL card
            </Link>
            <Link
              href="#pricing"
              className="w-full sm:w-auto px-8 py-3.5 border-2 border-line hover:border-chalk text-chalk text-base font-semibold rounded-chrome transition-colors"
            >
              Apply for founding — 50% off 90 days after first successful enroll
            </Link>
          </div>
          <p className="text-sm text-mute mt-4">
            <Link href="/queue" className="underline hover:text-chalk transition-colors">
              Open HITL queue →
            </Link>
          </p>
          <p className="text-sm text-mute leading-relaxed max-w-2xl mx-auto">
            Human in the loop. 4h cancel-path SLA · 1d silent. Resend segments
            first; Customer.io & Loops next. No cancel-button widget. No emails
            from our domain.
          </p>
        </div>
      </div>
    </section>
  );
}
