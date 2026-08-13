'use client';

export default function Marquee() {
  const tools = [
    'Stripe',
    'SaaS Metrics',
    'Retention Tools',
    'Email Automation',
    'Customer Success',
    'Churn Analytics',
  ];

  const duplicatedTools = [...tools, ...tools];

  return (
    <section className="relative py-16 bg-panel border-y border-border/50 overflow-hidden">
      <div className="mx-auto max-w-content px-6 md:px-8">
        <p className="font-nav text-[11px] uppercase tracking-[0.1em] text-muted-foreground text-center mb-8">
          {'{BUILT FOR}'}
        </p>
      </div>
      
      <div className="relative overflow-hidden">
        <div className="flex marquee-rtl">
          {duplicatedTools.map((tool, index) => (
            <div
              key={index}
              className="font-body text-[16px] text-white/40 tracking-tight whitespace-nowrap px-8 flex-shrink-0"
            >
              {tool}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
