export default function Pricing() {
  const plans = [
    {
      name: 'Starter',
      price: 99,
      description: 'For early-stage SaaS testing retention plays',
      features: [
        '≤100 approved enrolls/mo',
        '1 HITL seat',
        'Resend segments',
        'Email support',
      ],
    },
    {
      name: 'Growth',
      price: 249,
      description: 'For scaling SaaS with high churn volume',
      features: [
        '≤500 approved enrolls/mo',
        '3 HITL seats',
        'Priority support',
        'Resend segments',
      ],
      highlighted: true,
    },
  ];

  return (
    <section className="relative py-20 px-6 md:px-8 overflow-hidden" id="pricing">
      {/* Oil painting backdrop with dark overlay */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'url(/backdrops/pricing.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div className="absolute inset-0 bg-black/70 pointer-events-none" />
      
      <div className="mx-auto max-w-content relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-ink mb-4">
            Pricing
          </h2>
          <p className="text-xl text-ink-dim mb-6">Simple, transparent pricing for every stage</p>
          <p className="text-lg text-ink-subdued">
            Founding customers: 50% off for 90 days after first successful enroll<br/>
            Annual: 2 months free
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {plans.map((plan) => (
            <div 
              key={plan.name}
              className={`rounded-3xl p-8 border ${
                plan.highlighted 
                  ? 'bg-surface border-line-hover' 
                  : 'bg-surface border-line'
              }`}
            >
              <h3 className="text-2xl font-bold text-ink mb-2">{plan.name}</h3>
              <p className="text-ink-dim mb-6">{plan.description}</p>
              
              <div className="mb-6">
                <span className="text-5xl font-bold text-ink">${plan.price}</span>
                <span className="text-ink-dim ml-2">/month</span>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-ink-dim">
                    <span className="text-status-green mt-1">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button className={`w-full py-3 font-medium rounded-pill transition ${
                plan.highlighted
                  ? 'bg-white text-black hover:bg-white/90'
                  : 'bg-surface text-ink border border-line hover:bg-panel'
              }`}>
                Get started
              </button>
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-ink-subdued mt-8">
          Need custom volume or features? <a href="/contact" className="text-ink underline">Contact us</a>
        </p>
      </div>
    </section>
  );
}
