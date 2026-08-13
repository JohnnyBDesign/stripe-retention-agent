'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function HeroMahadeva() {
  return (
    <section className="relative pt-40 pb-32 px-6 md:px-8 overflow-hidden min-h-[100vh] flex items-center bg-canvas">
      {/* Floating pastel bars - left side */}
      <div className="absolute left-0 top-20 w-20 h-32 bg-mint float-bar opacity-80" style={{ transform: 'translateX(-40%)' }} />
      <div className="absolute left-8 top-40 w-16 h-24 bg-lilac float-bar delay-1 opacity-70" />
      <div className="absolute left-0 bottom-32 w-24 h-40 bg-sky float-bar-reverse delay-2 opacity-75" style={{ transform: 'translateX(-30%)' }} />
      <div className="absolute left-12 bottom-60 w-14 h-28 bg-butter float-bar delay-3 opacity-80" />
      
      {/* Floating pastel bars - right side */}
      <div className="absolute right-0 top-32 w-18 h-36 bg-mint-light float-bar-reverse opacity-70" style={{ transform: 'translateX(40%)' }} />
      <div className="absolute right-10 top-64 w-20 h-30 bg-lilac float-bar delay-1 opacity-80" />
      <div className="absolute right-0 bottom-40 w-22 h-38 bg-sky float-bar delay-2 opacity-75" style={{ transform: 'translateX(35%)' }} />
      <div className="absolute right-8 bottom-20 w-16 h-32 bg-butter float-bar-reverse delay-3 opacity-70" />
      
      <div className="mx-auto max-w-content relative z-10 w-full">
        <div className="max-w-3xl mx-auto text-center">
          {/* H1 - Large regular-weight headline */}
          <h1 className="font-body text-[56px] md:text-[64px] leading-[1.1] font-normal mb-6 tracking-tight">
            Know why they cancel — before they disappear
          </h1>

          {/* Subhead - muted 16px */}
          <p className="font-body text-[16px] text-muted-foreground leading-relaxed mb-12 max-w-2xl mx-auto">
            See the revenue already walking out of Stripe. Approve the save. We send it. $99 includes email. You approve every send. Replies go to you.
          </p>

          {/* CTAs - Split buttons with arrow tiles */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
            <Link href="/scan" className="inline-flex">
              <div className="flex items-center gap-0 rounded-sm overflow-hidden">
                <Button variant="default" size="lg" className="rounded-none rounded-l-sm h-12 px-8">
                  SEE WHO&apos;S LEAVING — AND WHY
                </Button>
                <div className="h-12 w-12 bg-white flex items-center justify-center rounded-r-sm flex-shrink-0">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-canvas">
                    <path d="M4 12L12 4M12 4H6M12 4V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </Link>
            
            <Link href="#founding" className="inline-flex">
              <div className="flex items-center gap-0 rounded-sm overflow-hidden">
                <Button variant="secondary" size="lg" className="rounded-none rounded-l-sm h-12 px-8">
                  APPLY FOR FOUNDING
                </Button>
                <div className="h-12 w-12 border border-white/20 border-l-0 flex items-center justify-center rounded-r-sm flex-shrink-0 bg-transparent">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-white">
                    <path d="M4 12L12 4M12 4H6M12 4V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </Link>
          </div>

          {/* Trust line - uppercase micro-label */}
          <p className="font-nav text-[11px] uppercase tracking-[0.1em] text-muted-foreground">
            You approve every send · We send it · Replies go to you
          </p>
        </div>
      </div>
    </section>
  );
}
