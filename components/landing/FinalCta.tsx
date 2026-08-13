import Link from 'next/link';

export default function FinalCta() {
  return (
    <section className="relative py-20 px-6 md:px-8 overflow-hidden" id="founding">
      {/* Oil painting backdrop with dark overlay */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'url(/backdrops/cta.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div className="absolute inset-0 bg-black/70 pointer-events-none" />
      
      <div className="mx-auto max-w-content relative z-10">
        <div className="bg-surface rounded-4xl p-12 md:p-16 border border-line text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-ink mb-6">
            See why they cancel, approve the save
          </h2>
          <p className="text-xl text-ink-dim mb-8 max-w-2xl mx-auto">
            Built for founders who bill on Stripe. You approve every save before anything sends — your Resend, your call. No auto-sends.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="#pricing"
              className="px-8 py-4 bg-white text-black text-base font-medium rounded-pill hover:bg-white/90 transition"
            >
              See who&apos;s leaving — and why
            </Link>
            <Link 
              href="#founding"
              className="px-8 py-4 bg-surface text-ink text-base font-medium rounded-pill hover:bg-panel transition border border-line"
            >
              Apply for founding — keep 50% off for 90 days after your first save
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
