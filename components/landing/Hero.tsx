import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function Hero() {
  return (
    <section className="relative pt-32 pb-20 px-6 md:px-8 overflow-hidden min-h-screen flex items-center">
      {/* Subtle dot grid background */}
      <div className="absolute inset-0 dot-grid-subtle pointer-events-none opacity-50" />
      
      <div className="mx-auto max-w-content relative z-10 w-full">
        <div className="max-w-4xl">
          {/* Chip */}
          <Badge variant="default" className="mb-8">
            For SaaS founders on Stripe Billing
          </Badge>

          {/* H1 - Large, asymmetric, left-aligned */}
          <h1 className="font-body text-display-xl md:text-[96px] md:leading-[0.95] font-light text-text-display mb-8 tracking-tight">
            Know why they cancel — before they disappear.
          </h1>

          {/* Subhead - Keep money version */}
          <p className="font-body text-subheading md:text-heading text-text-secondary leading-relaxed mb-12 max-w-2xl">
            See why subscribers cancel or go quiet, then approve the save before anything sends. Built for founders who bill on Stripe — your Resend, your call. Independent product, not made by Stripe.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-start gap-4 mb-10">
            <Link href="/scan">
              <Button variant="primary" size="lg">
                See who&apos;s leaving — and why
              </Button>
            </Link>
            <Link href="#founding">
              <Button variant="secondary" size="lg">
                Apply for founding — keep 50% off for 90 days after your first save
              </Button>
            </Link>
          </div>

          {/* Trust line */}
          <p className="font-mono text-caption uppercase tracking-[0.06em] text-text-disabled">
            You approve every save · Your Resend segments · No auto-sends
          </p>
        </div>
      </div>
    </section>
  );
}
