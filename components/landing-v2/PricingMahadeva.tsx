import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function PricingMahadeva() {
  const plans = [
    {
      name: 'Starter',
      price: 99,
      period: '/month',
      description: 'For early-stage SaaS testing retention plays',
      features: [
        '$99 includes sending',
        '≤100 approved sends',
        '1 seat',
        'Email support',
      ],
      cta: 'Get started',
      color: 'bg-panel',
    },
    {
      name: 'Growth',
      price: 249,
      period: '/month',
      description: 'For scaling SaaS with high churn volume',
      features: [
        '$249 includes sending',
        '≤500 approved sends',
        '3 seats',
        'Priority support',
      ],
      cta: 'Get started',
      highlighted: true,
      color: 'bg-mint',
    },
    {
      name: 'Custom',
      price: null,
      period: '',
      description: 'For high-volume SaaS with custom needs',
      features: [
        'Custom send limits',
        'Unlimited seats',
        'Dedicated support',
        'Custom terms',
      ],
      cta: 'Contact us',
      color: 'bg-panel',
    },
  ];

  return (
    <section className="relative py-32 px-6 md:px-8 bg-canvas" id="pricing">
      <div className="mx-auto max-w-content">
        <div className="mb-16 text-center">
          <p className="font-nav text-[11px] uppercase tracking-[0.1em] text-muted-foreground mb-6">
            {'{PRICING}'}
          </p>
          <h2 className="font-body text-[48px] leading-[1.1] font-normal tracking-tight text-white mb-6">
            Simple, transparent pricing
          </h2>
          <p className="font-body text-[16px] text-muted-foreground max-w-2xl mx-auto">
            Sending included. Connect Stripe, not an ESP.
          </p>
          <p className="font-nav text-[11px] uppercase tracking-[0.1em] text-muted-foreground mt-6">
            Founding: 50% off 90d after first successful send · Annual: 2 months free
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`${plan.highlighted ? plan.color : plan.color} rounded-sm p-8 ${
                plan.highlighted ? 'ring-2 ring-mint' : 'border border-border/50'
              }`}
            >
              <p className="font-nav text-[11px] uppercase tracking-[0.1em] mb-2 ${plan.highlighted ? 'text-canvas/60' : 'text-muted-foreground'}">
                {plan.name}
              </p>
              <div className="mb-6">
                {plan.price ? (
                  <>
                    <span className={`font-body text-[56px] font-normal leading-none ${plan.highlighted ? 'text-canvas' : 'text-white'}`}>
                      ${plan.price}
                    </span>
                    <span className={`font-nav text-[11px] uppercase tracking-[0.1em] ${plan.highlighted ? 'text-canvas/60' : 'text-muted-foreground'}`}>
                      {plan.period}
                    </span>
                  </>
                ) : (
                  <span className="font-body text-[56px] font-normal leading-none text-white">
                    Custom
                  </span>
                )}
              </div>
              <p className={`font-body text-[14px] mb-8 ${plan.highlighted ? 'text-canvas/70' : 'text-muted-foreground'}`}>
                {plan.description}
              </p>
              
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className={`flex items-start gap-3 font-body text-[14px] ${plan.highlighted ? 'text-canvas' : 'text-white/80'}`}>
                    <span>✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link href={plan.name === 'Custom' ? '/contact' : '/scan'} className="block">
                <Button
                  variant={plan.highlighted ? 'default' : 'outline'}
                  className={`w-full ${plan.highlighted ? 'bg-canvas text-white hover:bg-canvas/90' : ''}`}
                >
                  {plan.cta}
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
