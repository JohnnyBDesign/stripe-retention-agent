'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

export default function CaseStudies() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const cases = [
    {
      title: 'Scan Report',
      year: '2025',
      description: 'See everyone leaving in the last 30 days. Categorized by reason. Export ready.',
      stats: [
        { label: 'Pipeline Influence', value: '$80K+' },
        { label: 'Qualified Leads', value: '77%' },
      ],
      color: 'bg-mint-light',
    },
    {
      title: 'Approval Queue',
      year: '2025',
      description: 'Review drafted saves. Edit the copy. Skip or approve. Replies go to you.',
      stats: [
        { label: 'User Interaction', value: '10x' },
        { label: 'Increase in Signals', value: '42%' },
      ],
      color: 'bg-lilac',
    },
    {
      title: 'Save Email Sent',
      year: '2025',
      description: 'After approval, Signal sends. Sending included. No ESP key needed.',
      stats: [
        { label: 'Revenue Opportunity', value: '$1M+' },
        { label: 'New Signups', value: '78+' },
      ],
      color: 'bg-sky',
    },
  ];

  return (
    <section className="relative py-32 px-6 md:px-8 bg-panel" id="how">
      <div className="mx-auto max-w-content">
        <div className="mb-16">
          <p className="font-nav text-[11px] uppercase tracking-[0.1em] text-muted-foreground mb-6">
            {'{HOW IT WORKS}'}
          </p>
          <h2 className="font-body text-[48px] leading-[1.1] font-normal tracking-tight text-white max-w-2xl">
            Four steps from churn to save
          </h2>
        </div>

        <div className="space-y-6">
          {cases.map((item, index) => (
            <motion.div
              key={index}
              className={`${item.color} rounded-sm overflow-hidden cursor-pointer relative`}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.3, ease: [0.33, 1, 0.68, 1] }}
            >
              <motion.div
                className="absolute inset-0 bg-canvas/5"
                initial={{ opacity: 0 }}
                animate={{ opacity: hoveredIndex === index ? 1 : 0 }}
                transition={{ duration: 0.3, ease: [0.33, 1, 0.68, 1] }}
              />
              
              <div className="p-8 md:p-12 relative z-10">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <p className="font-nav text-[11px] uppercase tracking-[0.1em] text-canvas/60 mb-2">
                      {item.year}
                    </p>
                    <h3 className="font-body text-[32px] font-normal tracking-tight text-canvas mb-4">
                      {item.title}
                    </h3>
                    <p className="font-body text-[16px] leading-relaxed text-canvas/70 max-w-xl">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8 mt-8">
                  {item.stats.map((stat, i) => (
                    <div key={i}>
                      <p className="font-nav text-[11px] uppercase tracking-[0.1em] text-canvas/60 mb-2">
                        {stat.label}
                      </p>
                      <p className="font-body text-[36px] font-normal text-canvas">
                        {stat.value}
                      </p>
                    </div>
                  ))}
                </div>

                <motion.div
                  className="mt-8 font-nav text-[11px] uppercase tracking-[0.1em] text-canvas flex items-center gap-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: hoveredIndex === index ? 1 : 0, y: hoveredIndex === index ? 0 : 10 }}
                  transition={{ duration: 0.3, ease: [0.33, 1, 0.68, 1] }}
                >
                  LEARN MORE
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-canvas">
                    <path d="M4 12L12 4M12 4H6M12 4V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
