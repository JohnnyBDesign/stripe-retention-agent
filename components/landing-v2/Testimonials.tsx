'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      quote: "This system saved our team hours every week and made our workflows faster, clearer, and much easier to manage.",
      author: "Ryan Mitchell",
      role: "CEO",
      company: "Growth SaaS",
    },
    {
      quote: "Signal catches cancellations we would have missed. The approval queue means we stay in control of every message.",
      author: "Sarah Chen",
      role: "Head of Customer Success",
      company: "Analytics Co",
    },
    {
      quote: "Finally, a retention tool that doesn't require us to connect yet another ESP. Sending included is a game-changer.",
      author: "Michael Torres",
      role: "Founder",
      company: "DevTools Inc",
    },
  ];

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="relative py-32 px-6 md:px-8 bg-canvas">
      <div className="mx-auto max-w-content">
        <div className="mb-16 text-center">
          <p className="font-nav text-[11px] uppercase tracking-[0.1em] text-muted-foreground mb-6">
            {'{TESTIMONIALS}'}
          </p>
          <h2 className="font-body text-[48px] leading-[1.1] font-normal tracking-tight text-white max-w-2xl mx-auto">
            Trusted by SaaS founders
          </h2>
          <p className="font-body text-[14px] text-muted-foreground mt-4">
            * Example testimonials for visual reference
          </p>
        </div>

        <div className="relative">
          <div className="overflow-hidden">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5, ease: [0.33, 1, 0.68, 1] }}
                className="bg-panel rounded-sm p-8 md:p-12 border border-border/50 max-w-3xl mx-auto"
              >
                <p className="font-body text-[20px] leading-relaxed text-white mb-8">
                  &quot;{testimonials[currentIndex].quote}&quot;
                </p>
                <div>
                  <p className="font-body text-[18px] font-medium text-white mb-1">
                    {testimonials[currentIndex].author}
                  </p>
                  <p className="font-nav text-[11px] uppercase tracking-[0.1em] text-muted-foreground">
                    {testimonials[currentIndex].role} @ {testimonials[currentIndex].company}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={prev}
              className="w-12 h-12 rounded-sm bg-panel border border-border/50 flex items-center justify-center text-white hover:bg-mint hover:text-canvas transition-colors"
              aria-label="Previous testimonial"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M12 4L6 10L12 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentIndex ? 'bg-mint w-8' : 'bg-white/20'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
            <button
              onClick={next}
              className="w-12 h-12 rounded-sm bg-panel border border-border/50 flex items-center justify-center text-white hover:bg-mint hover:text-canvas transition-colors"
              aria-label="Next testimonial"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M8 4L14 10L8 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
