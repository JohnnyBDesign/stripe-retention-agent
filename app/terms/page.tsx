import Link from 'next/link';

export default function TermsPage() {
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
          <h1 className="font-display text-display-lg text-text-display mb-12 font-medium">
            Terms of Service
          </h1>

          <div className="space-y-8 font-body text-body text-text-secondary">
            <section>
              <h2 className="font-body text-heading text-text-primary mb-4 font-medium">
                Independent Product
              </h2>
              <p className="mb-4">
                Signal is an independent product and is not made by, endorsed by, or affiliated with Stripe, Inc. 
                Signal integrates with the Stripe API to analyze billing data and is not a Stripe product or service.
              </p>
            </section>

            <section>
              <h2 className="font-body text-heading text-text-primary mb-4 font-medium">
                Service Plans
              </h2>
              <p className="mb-4">
                Signal offers two subscription tiers:
              </p>
              <ul className="space-y-2 mb-4 ml-6">
                <li className="flex gap-2">
                  <span className="text-text-disabled">•</span>
                  <span><strong className="text-text-primary">Starter</strong>: $99/month for ≤100 approved enrolls per month, 1 HITL seat</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-text-disabled">•</span>
                  <span><strong className="text-text-primary">Growth</strong>: $249/month for ≤500 approved enrolls per month, 3 HITL seats</span>
                </li>
              </ul>
              <p className="mb-4">
                Annual plans receive 2 months free (billed annually).
              </p>
            </section>

            <section>
              <h2 className="font-body text-heading text-text-primary mb-4 font-medium">
                Founding Customer Offer
              </h2>
              <p className="mb-4">
                Founding customers who sign up during the founding period receive 50% off their selected plan 
                for 90 days, starting from the date of their first successful enroll (first approved retention 
                playbook that sends to a customer). After 90 days, the subscription automatically renews at 
                standard pricing.
              </p>
            </section>

            <section>
              <h2 className="font-body text-heading text-text-primary mb-4 font-medium">
                Service Description
              </h2>
              <p className="mb-4">
                Signal monitors your Stripe account for churn signals, classifies cancellation reasons and 
                identifies silent renewers, drafts retention playbooks, and submits them to your approval queue. 
                You review and approve each playbook before it enrolls the customer in the appropriate Resend 
                segment. Signal does not send emails automatically — all sends require your explicit approval.
              </p>
            </section>

            <section>
              <h2 className="font-body text-heading text-text-primary mb-4 font-medium">
                Your Responsibilities
              </h2>
              <p className="mb-4">
                You are responsible for:
              </p>
              <ul className="space-y-2 mb-4 ml-6">
                <li className="flex gap-2">
                  <span className="text-text-disabled">•</span>
                  <span>Providing a valid Stripe restricted API key with read access to billing data</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-text-disabled">•</span>
                  <span>Maintaining an active Resend account and API key for email segment enrollment</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-text-disabled">•</span>
                  <span>Reviewing and approving retention playbooks in a timely manner</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-text-disabled">•</span>
                  <span>Ensuring compliance with applicable laws regarding customer communications</span>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="font-body text-heading text-text-primary mb-4 font-medium">
                Billing and Payment
              </h2>
              <p className="mb-4">
                Subscriptions are billed monthly in advance. If you exceed your plan&apos;s approved enroll limit, 
                you will be automatically upgraded to the next tier or contacted for custom pricing. You may cancel 
                your subscription at any time, and cancellation takes effect at the end of the current billing period.
              </p>
            </section>

            <section>
              <h2 className="font-body text-heading text-text-primary mb-4 font-medium">
                Limitation of Liability
              </h2>
              <p className="mb-4">
                Signal is provided &quot;as is&quot; without warranties of any kind. We are not liable for any 
                indirect, incidental, or consequential damages arising from your use of Signal. Our total liability 
                shall not exceed the amount you paid for the service in the 12 months preceding the claim.
              </p>
            </section>

            <section>
              <h2 className="font-body text-heading text-text-primary mb-4 font-medium">
                Changes to Terms
              </h2>
              <p className="mb-4">
                We may update these terms from time to time. Material changes will be communicated via email 
                at least 30 days before taking effect. Continued use of Signal after changes take effect 
                constitutes acceptance of the updated terms.
              </p>
            </section>

            <section>
              <h2 className="font-body text-heading text-text-primary mb-4 font-medium">
                Contact
              </h2>
              <p>
                For questions about these terms, contact us at <a href="mailto:hello@signal.dev" className="text-text-primary underline">hello@signal.dev</a>.
              </p>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t border-border">
            <p className="font-mono text-caption uppercase tracking-[0.06em] text-text-disabled mb-4">
              Last updated: August 13, 2026
            </p>
            <Link href="/" className="font-body text-body-sm text-text-secondary hover:text-text-primary transition">
              ← Back to home
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
