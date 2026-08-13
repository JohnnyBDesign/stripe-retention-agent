export default function Features() {
  const features = [
    {
      icon: '🔍',
      title: 'Stripe webhook monitoring',
      description: 'Signal listens for subscription changes. No polling. Real-time.',
      color: 'bg-mint',
    },
    {
      icon: '🧠',
      title: 'LLM classification',
      description: 'ret_price, ret_bugs, ret_competitor, ret_never_activated, silent_rescue',
      color: 'bg-sky',
    },
    {
      icon: '✉️',
      title: 'Sending included',
      description: 'No Resend key. No SendGrid account. We handle email delivery.',
      color: 'bg-lilac',
    },
    {
      icon: '✅',
      title: 'Approval queue',
      description: 'Review every draft before it goes. Edit. Skip. Approve.',
      color: 'bg-butter',
    },
  ];

  return (
    <section className="relative py-32 px-6 md:px-8 bg-canvas" id="product">
      <div className="mx-auto max-w-content">
        <div className="mb-16">
          <p className="font-nav text-[11px] uppercase tracking-[0.1em] text-muted-foreground mb-6">
            {'{EVERYTHING YOU NEED}'}
          </p>
          <h2 className="font-body text-[48px] leading-[1.1] font-normal tracking-tight text-white max-w-2xl">
            Built for founders who bill on Stripe
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`${feature.color} rounded-sm p-8 text-canvas`}
            >
              <div className="text-[48px] mb-4">{feature.icon}</div>
              <h3 className="font-body text-[20px] font-medium mb-3 tracking-tight">
                {feature.title}
              </h3>
              <p className="font-body text-[14px] leading-relaxed text-canvas/70">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
