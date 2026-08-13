'use client';

import { motion, useInView, useMotionValue, useSpring } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';

function AnimatedStat({ value, isInView }: { value: string; isInView: boolean }) {
  const numericMatch = value.match(/\d+/);
  const targetNumber = numericMatch ? parseInt(numericMatch[0]) : 0;
  const prefix = numericMatch ? value.substring(0, numericMatch.index) : '';
  const suffix = numericMatch ? value.substring((numericMatch.index || 0) + numericMatch[0].length) : '';
  
  const count = useMotionValue(0);
  const rounded = useSpring(count, { duration: 2000, bounce: 0 });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (isInView && numericMatch) {
      count.set(targetNumber);
    }
    
    const unsubscribe = rounded.on('change', (latest) => {
      setDisplayValue(Math.round(latest));
    });
    
    return () => unsubscribe();
  }, [isInView, count, targetNumber, rounded, numericMatch]);

  if (!numericMatch) {
    return <span>{value}</span>;
  }

  return (
    <>
      {prefix}
      {displayValue}
      {suffix}
    </>
  );
}

export default function Stats() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const stats = [
    { label: 'Avg. Response Time', value: '<24h', color: 'bg-mint', hasNumber: false },
    { label: 'Approval Queue', value: '100%', color: 'bg-sky', hasNumber: true },
    { label: 'Classification', value: 'LLM', color: 'bg-lilac', hasNumber: false },
    { label: 'Sending', value: 'Included', color: 'bg-butter', hasNumber: false },
  ];

  return (
    <section className="relative py-32 px-6 md:px-8 bg-canvas" ref={ref}>
      <div className="mx-auto max-w-content">
        <div className="mb-16 text-center">
          <p className="font-nav text-[11px] uppercase tracking-[0.1em] text-muted-foreground mb-6">
            {'{WHY SIGNAL}'}
          </p>
          <h2 className="font-body text-[48px] leading-[1.1] font-normal tracking-tight text-white max-w-2xl mx-auto">
            Built for founders who care about every customer
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className={`${stat.color} rounded-sm p-8 text-canvas relative`}
              style={{
                marginTop: index % 2 === 0 ? '0' : '2rem',
              }}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
                ease: [0.33, 1, 0.68, 1]
              }}
            >
              <p className="font-body text-[48px] md:text-[56px] font-normal leading-none mb-4">
                {stat.hasNumber ? (
                  <AnimatedStat value={stat.value} isInView={isInView} />
                ) : (
                  stat.value
                )}
              </p>
              <p className="font-nav text-[11px] uppercase tracking-[0.1em] text-canvas/60">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
