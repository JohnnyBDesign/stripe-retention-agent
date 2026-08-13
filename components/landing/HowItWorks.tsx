import { Card } from '@/components/ui/card';

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
    <section className="relative py-20 px-6 md:px-8" id="how">
      <div className="mx-auto max-w-content">
        <div className="mb-16">
          <h2 className="font-body text-display-md text-text-display mb-4 font-light">
            How it works
          </h2>
          <p className="font-body text-subheading text-text-secondary">
            Four steps from churn to playbook enrollment
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {steps.map((step) => (
            <Card 
              key={step.number}
              className="p-8 bg-black border-border hover:border-border-visible transition"
            >
              <div className="w-12 h-12 rounded-technical bg-text-display text-black font-display font-bold text-xl flex items-center justify-center mb-6">
                {step.number}
              </div>
              <h3 className="font-body text-heading text-text-display mb-3 font-medium">
                {step.title}
              </h3>
              <p className="font-body text-body-sm text-text-secondary leading-relaxed">
                {step.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
