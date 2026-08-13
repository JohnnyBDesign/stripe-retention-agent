export default function Stats() {
  const stats = [
    { label: 'Avg. Response Time', value: '<24h', color: 'bg-mint' },
    { label: 'Approval Queue', value: '100%', color: 'bg-sky' },
    { label: 'Classification', value: 'LLM', color: 'bg-lilac' },
    { label: 'Sending', value: 'Included', color: 'bg-butter' },
  ];

  return (
    <section className="relative py-32 px-6 md:px-8 bg-canvas">
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
            <div
              key={index}
              className={`${stat.color} rounded-sm p-8 text-canvas relative`}
              style={{
                marginTop: index % 2 === 0 ? '0' : '2rem',
              }}
            >
              <p className="font-body text-[48px] md:text-[56px] font-normal leading-none mb-4">
                {stat.value}
              </p>
              <p className="font-nav text-[11px] uppercase tracking-[0.1em] text-canvas/60">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
