import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative pt-32 pb-20 px-6 md:px-8 overflow-hidden">
      {/* Oil painting backdrop with dark overlay */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'url(/backdrops/hero.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div className="absolute inset-0 bg-black/70 pointer-events-none" />
      
      <div className="mx-auto max-w-content relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Chip */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-pill bg-surface border border-line text-ink-dim text-xs font-medium mb-8">
            For SaaS founders on Stripe Billing
          </div>

          {/* H1 - text only */}
          <h1 className="text-5xl md:text-hero-lg font-bold text-ink mb-6">
            Know why they cancel — before they disappear.
          </h1>

          {/* Subhead - clarify Signal is independent/third-party */}
          <p className="text-xl md:text-2xl text-ink-dim leading-relaxed mb-10 max-w-2xl mx-auto">
            Independent retention agent for SaaS founders who bill on Stripe — classify, you approve, enroll your Resend.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <Link 
              href="#pricing"
              className="px-8 py-4 bg-white text-black text-base font-medium rounded-pill hover:bg-white/90 transition"
            >
              Start with Stripe keys → get your first HITL card
            </Link>
            <Link 
              href="#founding"
              className="px-8 py-4 bg-surface text-ink text-base font-medium rounded-pill hover:bg-panel transition border border-line"
            >
              Apply for founding — 50% off 90 days after first successful enroll
            </Link>
          </div>

          {/* Trust line */}
          <p className="text-sm text-ink-subdued">
            Human-in-the-loop · Resend segments · No auto-sends
          </p>
        </div>
      </div>
    </section>
  );
}
