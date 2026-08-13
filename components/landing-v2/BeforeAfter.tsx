'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

export default function BeforeAfter() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const beforeItems = [
    'Subscriptions cancel silently',
    'No idea why they left',
    'Manual outreach, days later',
    'Need ESP integration + templates'
  ];

  const afterItems = [
    'Real-time webhook monitoring',
    'LLM classifies the reason',
    'Approve & send within minutes',
    'Sending included, no ESP needed'
  ];

  return (
    <section className="relative py-32 px-6 md:px-8 bg-panel" ref={ref}>
      <div className="mx-auto max-w-content">
        <div className="mb-16 text-center">
          <p className="font-nav text-[11px] uppercase tracking-[0.1em] text-muted-foreground mb-6">
            {'{TRANSFORMATION}'}
          </p>
          <h2 className="font-body text-[48px] leading-[1.1] font-normal tracking-tight text-white max-w-2xl mx-auto">
            Before Signal vs After Signal
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Before */}
          <motion.div
            className="bg-canvas rounded-sm p-8 border border-border/50"
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -40 }}
            transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
          >
            <p className="font-nav text-[11px] uppercase tracking-[0.1em] text-muted-foreground mb-6">
              {'{BEFORE}'}
            </p>
            <ul className="space-y-4">
              {beforeItems.map((item, i) => (
                <motion.li
                  key={i}
                  className="font-body text-[16px] text-white/60 flex items-start gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                  transition={{ duration: 0.4, delay: 0.2 + i * 0.1, ease: [0.33, 1, 0.68, 1] }}
                >
                  <span className="text-white/30">×</span>
                  <span>{item}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* After */}
          <motion.div
            className="bg-mint rounded-sm p-8"
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 40 }}
            transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
          >
            <p className="font-nav text-[11px] uppercase tracking-[0.1em] text-canvas/60 mb-6">
              {'{AFTER}'}
            </p>
            <ul className="space-y-4">
              {afterItems.map((item, i) => (
                <motion.li
                  key={i}
                  className="font-body text-[16px] text-canvas flex items-start gap-3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
                  transition={{ duration: 0.4, delay: 0.2 + i * 0.1, ease: [0.33, 1, 0.68, 1] }}
                >
                  <span className="text-canvas">✓</span>
                  <span>{item}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
