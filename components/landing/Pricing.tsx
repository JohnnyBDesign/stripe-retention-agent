export default function Pricing() {
  const plans = [
    {
      name: 'Starter',
      price: 99,
      description: 'For early-stage SaaS testing retention plays',
      features: [
        'Up to 500 HITL cards/month',
        'All reason classifiers',
        'Resend segment enrollment',
        'Email support',
      ],
    },
    {
      name: 'Growth',
      price: 249,
      description: 'For scaling SaaS with high churn volume',
      features: [
        'Unlimited HITL cards',
        'All reason classifiers',
        'Resend segment enrollment',
        'Priority support',
        'Custom playbook mapping',
      ],
      highlighted: true,
    },
  ];

  return (
    <section className="relative py-20 px-6 md:px-8" id="pricing">
      <div className="mx-auto max-w-content">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Pricing
          </h2>
          <p className="text-xl text-gray mb-6">Simple, transparent pricing for every stage</p>
          <p className="text-lg text-gray-dim">
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
                  ? 'bg-charcoal border-white/20' 
                  : 'bg-charcoal border-line'
              }`}
            >
              <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
              <p className="text-gray mb-6">{plan.description}</p>
              
              <div className="mb-6">
                <span className="text-5xl font-bold text-white">${plan.price}</span>
                <span className="text-gray ml-2">/month</span>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-gray">
                    <span className="text-accent-teal mt-1">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button className={`w-full py-3 font-medium rounded-pill transition ${
                plan.highlighted
                  ? 'bg-white text-black hover:bg-white/90'
                  : 'bg-charcoal text-white border border-line hover:bg-panel'
              }`}>
                Get started
              </button>
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-gray-dim mt-8">
          Need custom volume or features? <a href="/contact" className="text-white underline">Contact us</a>
        </p>
      </div>
    </section>
  );
}
