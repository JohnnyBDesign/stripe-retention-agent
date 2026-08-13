'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

export default function Manifesto() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="relative py-32 px-6 md:px-8 bg-mint-light" ref={ref}>
      <div className="mx-auto max-w-content">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
          >
            <p className="font-nav text-[11px] uppercase tracking-[0.1em] text-canvas/60 mb-6">
              {'{RETENTION AGENT}'}
            </p>
            <h2 className="font-body text-[48px] md:text-[56px] leading-[1.1] font-normal tracking-tight text-canvas">
              Signal helps SaaS founders save churning revenue before it disappears
            </h2>
          </motion.div>
          <div className="space-y-6">
            {[
              'Built for modern SaaS teams billing on Stripe. Signal watches your subscriptions, classifies why they\'re canceling, drafts the right save email, and waits for your approval.',
              'Sending included. No ESP integration. Replies go straight to you. You stay in control of every message.',
              'Independent product. Not made by Stripe. Not affiliated with Stripe.'
            ].map((text, i) => (
              <motion.p
                key={i}
                className="font-body text-[16px] leading-relaxed text-canvas/80"
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                transition={{ duration: 0.6, delay: 0.2 + i * 0.1, ease: [0.33, 1, 0.68, 1] }}
              >
                {text}
              </motion.p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
