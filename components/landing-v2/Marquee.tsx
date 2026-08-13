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

  return (
    <section className="relative py-16 px-6 md:px-8 bg-panel border-y border-border/50">
      <div className="mx-auto max-w-content">
        <p className="font-nav text-[11px] uppercase tracking-[0.1em] text-muted-foreground text-center mb-8">
          {'{BUILT FOR}'}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8">
          {tools.map((tool, index) => (
            <div
              key={index}
              className="font-body text-[16px] text-white/40 tracking-tight"
            >
              {tool}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
