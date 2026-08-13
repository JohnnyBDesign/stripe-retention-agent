import Link from 'next/link';
import { Card } from '@/components/ui/card';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black">
      <nav className="border-b border-border px-6 md:px-8 py-4">
        <div className="mx-auto max-w-content">
          <Link href="/" className="font-mono text-label uppercase tracking-[0.08em] text-text-display">
            Signal
          </Link>
        </div>
      </nav>

      <main className="px-6 md:px-8 py-20">
        <div className="mx-auto max-w-3xl">
          <Card className="p-12 bg-surface border-border-visible">
            <h1 className="font-display text-display-lg text-text-display mb-8 font-medium">
              About Signal
            </h1>

            <div className="space-y-6 font-body text-body text-text-secondary">
              <p>
                Signal is a retention agent for SaaS companies that bill on Stripe. We help you understand 
                why customers cancel or go silent, and draft personalized retention emails that you 
                approve before Signal sends.
              </p>

              <p>
                Signal monitors your Stripe billing data for churn signals, classifies cancellation reasons, 
                identifies silent renewers at risk, and automatically drafts retention emails tailored to each 
                situation. Every draft goes through your approval queue — nothing sends without your 
                explicit approval.
              </p>

              <p>
                Once you approve a draft, Signal sends the email. Sending is included in your subscription. 
                Replies go to you. No ESP key needed from you.
              </p>

              <div className="pt-6 mt-6 border-t border-border">
                <p className="font-mono text-caption uppercase tracking-[0.06em] text-text-disabled mb-4">
                  Independent Product
                </p>
                <p>
                  Signal is an independent product and is not made by, endorsed by, or affiliated with Stripe, Inc. 
                  We integrate with the Stripe API to provide retention intelligence for SaaS founders.
                </p>
              </div>
            </div>
          </Card>

          <div className="mt-8">
            <Link href="/" className="font-body text-body-sm text-text-secondary hover:text-text-primary transition">
              ← Back to home
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
