import { Card } from '@/components/ui/card';

export default function WhyUs() {
  return (
    <section className="relative py-20 px-6 md:px-8">
      <div className="mx-auto max-w-content">
        <Card className="p-12 md:p-16">
          <div className="max-w-3xl">
            <h2 className="font-display text-display-md mb-6 font-normal">
              You approve every save. We send it.
            </h2>
            <p className="font-body text-subheading text-muted-foreground leading-relaxed">
              Signal classifies the reason, drafts the save email, and waits for your approval. 
              We send from our Resend — reply-to goes to you. No ESP key needed. Independent, not a Stripe product.
            </p>
          </div>
        </Card>
      </div>
    </section>
  );
}
