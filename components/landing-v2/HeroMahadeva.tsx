'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function HeroMahadeva() {
  const [primaryHovered, setPrimaryHovered] = useState(false);
  const [secondaryHovered, setSecondaryHovered] = useState(false);

  const headlineText = "Know why they cancel — before they disappear";
  const words = headlineText.split(' ');

  return (
    <section className="relative pt-40 pb-32 px-6 md:px-8 overflow-hidden min-h-[100vh] flex items-center bg-canvas">
      {/* Floating pastel bars - left side with continuous linear loop */}
      <div className="absolute left-0 top-0 w-20 h-32 bg-mint opacity-80 float-bar-loop" style={{ animationDuration: '15s', transform: 'translateX(-40%)' }} />
      <div className="absolute left-8 top-0 w-16 h-24 bg-lilac opacity-70 float-bar-loop-reverse" style={{ animationDuration: '18s', animationDelay: '2s' }} />
      <div className="absolute left-0 top-0 w-24 h-40 bg-sky opacity-75 float-bar-loop" style={{ animationDuration: '20s', animationDelay: '4s', transform: 'translateX(-30%)' }} />
      <div className="absolute left-12 top-0 w-14 h-28 bg-butter opacity-80 float-bar-loop-reverse" style={{ animationDuration: '22s', animationDelay: '1s' }} />
      
      {/* Floating pastel bars - right side with continuous linear loop */}
      <div className="absolute right-0 top-0 w-18 h-36 bg-mint-light opacity-70 float-bar-loop-reverse" style={{ animationDuration: '16s', transform: 'translateX(40%)' }} />
      <div className="absolute right-10 top-0 w-20 h-30 bg-lilac opacity-80 float-bar-loop" style={{ animationDuration: '19s', animationDelay: '3s' }} />
      <div className="absolute right-0 top-0 w-22 h-38 bg-sky opacity-75 float-bar-loop-reverse" style={{ animationDuration: '21s', animationDelay: '1.5s', transform: 'translateX(35%)' }} />
      <div className="absolute right-8 top-0 w-16 h-32 bg-butter opacity-70 float-bar-loop" style={{ animationDuration: '17s', animationDelay: '2.5s' }} />
      
      <div className="mx-auto max-w-content relative z-10 w-full">
        <div className="max-w-3xl mx-auto text-center">
          {/* H1 - Large regular-weight headline with block-reveal animation */}
          <h1 className="font-body text-[56px] md:text-[64px] leading-[1.1] font-normal mb-6 tracking-tight">
            {words.map((word, i) => (
              <span key={i} className="inline-block relative mr-[0.3em] last:mr-0">
                <span className="relative z-10">{word}</span>
                <motion.span
                  className="absolute inset-0 bg-mint"
                  initial={{ scaleX: 1 }}
                  animate={{ scaleX: 0 }}
                  transition={{
                    duration: 0.6,
                    delay: i * 0.05 + 0.3,
                    ease: [0.33, 1, 0.68, 1]
                  }}
                  style={{ transformOrigin: 'left' }}
                />
              </span>
            ))}
          </h1>

          {/* Subhead - muted 16px with fade+slide-up */}
          <motion.p
            className="font-body text-[16px] text-muted-foreground leading-relaxed mb-12 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2, ease: [0.33, 1, 0.68, 1] }}
          >
            See the revenue already walking out of Stripe. Approve the save. We send it. $99 includes email. You approve every send. Replies go to you.
          </motion.p>

          {/* CTAs - Split buttons with arrow tiles and fade+slide-up */}
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.4, ease: [0.33, 1, 0.68, 1] }}
          >
            <Link href="/scan" className="inline-flex">
              <div
                className="flex items-center gap-0 rounded-sm overflow-hidden group"
                onMouseEnter={() => setPrimaryHovered(true)}
                onMouseLeave={() => setPrimaryHovered(false)}
              >
                <Button variant="default" size="lg" className="rounded-none rounded-l-sm h-12 px-8">
                  SEE WHO&apos;S LEAVING — AND WHY
                </Button>
                <motion.div
                  className="h-12 w-12 flex items-center justify-center rounded-r-sm flex-shrink-0"
                  animate={{ backgroundColor: primaryHovered ? '#8CFFA7' : '#FFFFFF' }}
                  transition={{ duration: 0.3, ease: [0.33, 1, 0.68, 1] }}
                >
                  <motion.svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    className="text-canvas"
                    animate={{ x: primaryHovered ? 2 : 0, y: primaryHovered ? -2 : 0 }}
                    transition={{ duration: 0.3, ease: [0.33, 1, 0.68, 1] }}
                  >
                    <path d="M4 12L12 4M12 4H6M12 4V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </motion.svg>
                </motion.div>
              </div>
            </Link>
            
            <Link href="#founding" className="inline-flex">
              <div
                className="flex items-center gap-0 rounded-sm overflow-hidden relative"
                onMouseEnter={() => setSecondaryHovered(true)}
                onMouseLeave={() => setSecondaryHovered(false)}
              >
                <Button variant="secondary" size="lg" className="rounded-none rounded-l-sm h-12 px-8 relative z-10">
                  APPLY FOR FOUNDING
                </Button>
                <motion.div
                  className="absolute inset-0 bg-mint rounded-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: secondaryHovered ? 1 : 0 }}
                  transition={{ duration: 0.3, ease: [0.33, 1, 0.68, 1] }}
                />
                <div className="h-12 w-12 border border-white/20 border-l-0 flex items-center justify-center rounded-r-sm flex-shrink-0 bg-transparent relative z-10">
                  <motion.svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    className="text-white"
                    animate={{ x: secondaryHovered ? 2 : 0, y: secondaryHovered ? -2 : 0 }}
                    transition={{ duration: 0.3, ease: [0.33, 1, 0.68, 1] }}
                  >
                    <path d="M4 12L12 4M12 4H6M12 4V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </motion.svg>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Trust line - uppercase micro-label with fade+slide-up */}
          <motion.p
            className="font-nav text-[11px] uppercase tracking-[0.1em] text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.6, ease: [0.33, 1, 0.68, 1] }}
          >
            You approve every send · We send it · Replies go to you
          </motion.p>
        </div>
      </div>
    </section>
  );
}
