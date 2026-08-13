export default function CaseStudies() {
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
            <div
              key={index}
              className={`${item.color} rounded-sm overflow-hidden`}
            >
              <div className="p-8 md:p-12">
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
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
