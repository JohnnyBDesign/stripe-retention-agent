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
      description: 'Draft appears in your approval queue with classified reason and suggested template',
    },
    {
      number: '4',
      title: 'Signal sends',
      description: 'After approval, Signal sends the save. Sending included. Replies go to you. No ESP key needed.',
    },
  ];

  return (
    <section className="relative py-20 px-6 md:px-8" id="how">
      <div className="mx-auto max-w-content">
        <div className="mb-16">
          <h2 className="font-display text-display-md mb-4 font-normal">
            How it works
          </h2>
          <p className="font-body text-subheading text-muted-foreground">
            Four steps from churn to save
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {steps.map((step) => (
            <Card 
              key={step.number}
              className="p-8 hover:border-foreground/20 transition"
            >
              <div className="w-12 h-12 rounded-md bg-primary text-primary-foreground font-display font-normal text-xl flex items-center justify-center mb-6">
                {step.number}
              </div>
              <h3 className="font-body text-heading mb-3 font-semibold">
                {step.title}
              </h3>
              <p className="font-body text-body text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
