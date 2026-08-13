import Image from 'next/image';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative pt-32 pb-20 px-6 md:px-8">
      <div className="mx-auto max-w-content">
        <div className="max-w-3xl mx-auto text-center">
          {/* Chip */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-pill bg-charcoal text-gray-dim text-xs font-medium mb-8">
            EARLY ACCESS · Stripe → HITL → Resend
          </div>

          {/* H1 with inline face */}
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 flex items-center justify-center gap-4 flex-wrap">
            Meet 
            <Image src="/face.svg" alt="" width={80} height={80} className="inline-block" />
            Signal
          </h1>

          {/* Subhead */}
          <p className="text-xl md:text-2xl text-gray leading-relaxed mb-10 max-w-2xl mx-auto">
            A churn agent that classifies cancel reasons and silent renewers, drafts the save, 
            and enrolls the playbook in your Resend — after you approve.
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
              className="px-8 py-4 bg-charcoal text-white text-base font-medium rounded-pill hover:bg-panel transition"
            >
              Apply for founding — 50% off 90 days after first successful enroll
            </Link>
          </div>

          {/* Trust line */}
          <p className="text-sm text-gray-dim">
            Human-in-the-loop · Resend segments · No cancel widget
          </p>
        </div>
      </div>
    </section>
  );
}
