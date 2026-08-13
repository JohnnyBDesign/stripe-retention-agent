export default function HowItWorks() {
  const steps = [
    {
      number: '1',
      title: 'Stripe webhook fires',
      description: 'customer.subscription.updated or customer.subscription.deleted hits Signal\'s endpoint',
    },
    {
      number: '2',
      title: 'Signal classifies',
      description: 'LLM + context → ret_price, ret_bugs, ret_competitor, ret_never_activated, or silent_rescue',
    },
    {
      number: '3',
      title: 'You approve',
      description: 'Draft appears in your HITL queue with classified reason, suggested playbook, and Resend segment',
    },
    {
      number: '4',
      title: 'Resend enrolls',
      description: 'After approval, Signal enrolls the customer via Resend API (segments, not tags)',
    },
  ];

  return (
    <section className="relative py-20 px-6 md:px-8 overflow-hidden" id="how">
      {/* Atmospheric backdrop */}
      <div className="absolute inset-0 bg-gradient-to-bl from-surface/20 via-canvas to-canvas pointer-events-none opacity-40" />
      
      <div className="mx-auto max-w-content relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-ink mb-4">
            How it works
          </h2>
          <p className="text-xl text-ink-dim">Four steps from churn to playbook enrollment</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {steps.map((step) => (
            <div 
              key={step.number}
              className="bg-surface rounded-3xl p-8 border border-line hover:border-line-hover transition"
            >
              <div className="w-12 h-12 rounded-pill bg-white text-black font-bold text-xl flex items-center justify-center mb-4">
                {step.number}
              </div>
              <h3 className="text-2xl font-bold text-ink mb-3">{step.title}</h3>
              <p className="text-ink-dim leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
