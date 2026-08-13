import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

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
    <section className="relative py-20 px-6 md:px-8" id="pricing">
      <div className="mx-auto max-w-content relative z-10">
        <div className="mb-16">
          <h2 className="font-display text-display-lg text-text-display mb-6 font-medium">
            Pricing
          </h2>
          <p className="font-body text-subheading text-text-secondary mb-4 max-w-2xl">
            Simple, transparent pricing for every stage
          </p>
          <p className="font-mono text-caption uppercase tracking-[0.06em] text-text-disabled">
            Founding customers: 50% off for 90 days after first successful enroll<br/>
            Annual: 2 months free
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl">
          {plans.map((plan) => (
            <Card 
              key={plan.name}
              className={`p-8 ${
                plan.highlighted 
                  ? 'border-border-visible bg-surface' 
                  : 'border-border bg-black'
              }`}
            >
              <div className="mb-6">
                <p className="font-mono text-caption uppercase tracking-[0.08em] text-text-disabled mb-2">
                  {plan.name}
                </p>
                <p className="font-body text-body-sm text-text-secondary mb-6">
                  {plan.description}
                </p>
              </div>
              
              <div className="mb-8">
                <span className="font-display text-display-lg text-text-display">
                  ${plan.price}
                </span>
                <span className="font-mono text-caption text-text-disabled ml-2">
                  /MONTH
                </span>
              </div>

              <Separator className="mb-6" />

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <span className="font-mono text-success mt-1">✓</span>
                    <span className="font-body text-body-sm text-text-secondary">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button 
                variant={plan.highlighted ? 'primary' : 'secondary'} 
                className="w-full"
              >
                Get started
              </Button>
            </Card>
          ))}
        </div>

        <p className="text-center font-mono text-caption uppercase tracking-[0.06em] text-text-disabled mt-8">
          Need custom volume or features? <a href="/contact" className="text-text-primary underline">Contact us</a>
        </p>
      </div>
    </section>
  );
}
