import Link from 'next/link';
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
        '$99 includes sending',
        '≤100 approved sends',
        '1 seat',
        'Email support',
      ],
    },
    {
      name: 'Growth',
      price: 249,
      description: 'For scaling SaaS with high churn volume',
      features: [
        '$249 includes sending',
        '≤500 approved sends',
        '3 seats',
        'Priority support',
      ],
      highlighted: true,
    },
  ];

  return (
    <section className="relative py-20 px-6 md:px-8" id="pricing">
      <div className="mx-auto max-w-content relative z-10">
        <div className="mb-16">
          <h2 className="font-display text-display-lg mb-6 font-normal">
            Pricing
          </h2>
          <p className="font-body text-subheading text-muted-foreground mb-4 max-w-2xl">
            Simple, transparent pricing. Sending included.
          </p>
          <p className="font-mono text-label uppercase tracking-[0.05em] text-muted-foreground">
            Founding: 50% off 90d after first successful send<br/>
            Annual: 2 months free · Stripe required
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl">
          {plans.map((plan) => (
            <Card 
              key={plan.name}
              className={`p-8 ${plan.highlighted ? 'border-foreground/20' : ''}`}
            >
              <div className="mb-6">
                <p className="font-mono text-sm uppercase tracking-wider text-muted-foreground mb-2">
                  {plan.name}
                </p>
                <p className="font-body text-sm text-muted-foreground mb-6">
                  {plan.description}
                </p>
              </div>
              
              <div className="mb-8">
                <span className="font-display text-display-lg">
                  ${plan.price}
                </span>
                <span className="font-mono text-sm text-muted-foreground ml-2">
                  /MONTH
                </span>
              </div>

              <Separator className="mb-6" />

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <span className="font-mono mt-1">✓</span>
                    <span className="font-body text-sm text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link href="/scan">
                <Button 
                  variant={plan.highlighted ? 'default' : 'outline'} 
                  className="w-full"
                >
                  Get started
                </Button>
              </Link>
            </Card>
          ))}
        </div>

        <p className="text-center font-mono text-sm uppercase tracking-wider text-muted-foreground mt-8">
          Need custom volume or features? <a href="/contact" className="underline">Contact us</a>
        </p>
      </div>
    </section>
  );
}
