import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function FinalCta() {
  return (
    <section className="relative py-20 px-6 md:px-8" id="founding">
      <div className="mx-auto max-w-content">
        <Card className="p-12 md:p-16 bg-surface border-border-visible text-center">
          <h2 className="font-display text-display-md text-text-display mb-6 font-medium">
            See why they cancel, approve the save
          </h2>
          <p className="font-body text-subheading text-text-secondary mb-10 max-w-2xl mx-auto">
            Built for founders who bill on Stripe. You approve every save before anything sends — your Resend, your call. No auto-sends.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/scan">
              <Button variant="primary" size="lg">
                See who&apos;s leaving — and why
              </Button>
            </Link>
            <Link href="#founding">
              <Button variant="secondary" size="lg">
                Apply for founding — keep 50% off for 90 days after your first save
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </section>
  );
}
