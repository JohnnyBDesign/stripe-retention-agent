export default function HowItWorks() {
  const steps = [
    {
      number: '1',
      title: 'Stripe fires',
      description: 'Customer.subscription.updated or customer.subscription.deleted webhook hits Signal',
    },
    {
      number: '2',
      title: 'We classify',
      description: 'LLM + context classifies as ret_price, ret_bugs, ret_competitor, ret_never_activated, or silent_rescue',
    },
    {
      number: '3',
      title: 'You approve',
      description: 'Draft appears in your HITL queue with reason, playbook, and suggested Resend segment',
    },
    {
      number: '4',
      title: 'Resend enrolls',
      description: 'After approval, customer is enrolled in the playbook via Resend API (segments, not tags)',
    },
  ];

  return (
    <section className="relative py-20 px-6 md:px-8" id="how">
      <div className="mx-auto max-w-content">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            How it works
          </h2>
          <p className="text-xl text-gray">Four steps from churn to playbook enrollment</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {steps.map((step) => (
            <div 
              key={step.number}
              className="bg-charcoal rounded-3xl p-8 border border-line hover:border-gray-dim transition"
            >
              <div className="w-12 h-12 rounded-pill bg-white text-black font-bold text-xl flex items-center justify-center mb-4">
                {step.number}
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">{step.title}</h3>
              <p className="text-gray leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
