import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-afterwhy-elevated/30 to-transparent" />
      <div className="relative max-w-content mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div className="max-w-hero mx-auto text-center">
          <h1 className="font-display text-hero font-bold text-afterwhy-paper mb-6">
            Stripe churn, classified and saved.
          </h1>
          <p className="text-lg leading-[1.55] text-afterwhy-muted mb-10 max-w-xl mx-auto">
            Not another cancel modal. A churn agent that classifies price, bugs,
            competitors, never-activated, and silent renewers—then enrolls the
            playbook in YOUR Resend. Human approves every draft.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="#pricing"
              className="w-full sm:w-auto px-8 py-3 bg-afterwhy-amber hover:bg-afterwhy-amber-hover text-afterwhy-ink text-base font-semibold rounded-pill transition-colors"
            >
              Start with Stripe keys → get your first HITL card
            </Link>
            <Link
              href="#pricing"
              className="w-full sm:w-auto px-8 py-3 border border-afterwhy-line hover:border-afterwhy-paper text-afterwhy-paper text-base font-medium rounded-pill transition-colors"
            >
              Apply for founding — 50% off 90 days after first successful enroll
            </Link>
          </div>
          <p className="text-sm text-afterwhy-mono leading-relaxed max-w-2xl mx-auto mt-8">
            Human in the loop. 4h cancel-path SLA · 1d silent. Resend segments
            first; Customer.io & Loops next. No cancel-button widget. No emails
            from our domain.
          </p>
        </div>
      </div>
    </section>
  );
}
