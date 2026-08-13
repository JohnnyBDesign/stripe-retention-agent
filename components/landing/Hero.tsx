'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import AnimatedSphere from './AnimatedSphere';

export default function Hero() {
  return (
    <section className="relative pt-32 pb-20 px-6 md:px-8 overflow-hidden min-h-[90vh] flex items-center noise-overlay">
      {/* Grid lines background */}
      <div className="absolute inset-0 grid-lines pointer-events-none opacity-30" />
      
      <div className="mx-auto max-w-content relative z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="max-w-2xl">
            {/* Chip */}
            <Badge variant="outline" className="mb-6">
              For SaaS founders on Stripe Billing
            </Badge>

            {/* H1 - Huge serif headline */}
            <h1 className="font-display text-display-xl lg:text-[96px] lg:leading-[0.95] font-normal mb-6">
              Know why they cancel — before they disappear.
            </h1>

            {/* Subhead */}
            <p className="font-body text-subheading text-muted-foreground leading-relaxed mb-10 max-w-xl">
              Signal classifies Stripe churn, drafts personalized saves, and sends after your approval. We send from our Resend. Reply-to goes to you. Independent product, not made by Stripe.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-start gap-4 mb-8">
              <Link href="/scan">
                <Button variant="default" size="lg" className="rounded-full">
                  See who&apos;s leaving — and why
                </Button>
              </Link>
            </div>

            {/* Trust line */}
            <p className="font-mono text-label uppercase tracking-[0.05em] text-muted-foreground">
              You approve every save. We send it. Reply-to goes to you.
            </p>
          </div>

          {/* ASCII Sphere */}
          <div className="hidden lg:flex items-center justify-center">
            <div className="relative w-full max-w-md aspect-square">
              <AnimatedSphere />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
