import Link from 'next/link';

export default function PrivacyPage() {
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
            Privacy Policy
          </h1>

          <div className="space-y-8 font-body text-body text-text-secondary">
            <section>
              <h2 className="font-body text-heading text-text-primary mb-4 font-medium">
                Data Collection
              </h2>
              <p className="mb-4">
                Signal processes Stripe billing data to identify churn patterns and generate retention reports. 
                Your Stripe restricted API key is never stored on our servers — it is used only to fetch data 
                during the scan process and is discarded immediately after.
              </p>
            </section>

            <section>
              <h2 className="font-body text-heading text-text-primary mb-4 font-medium">
                Data Processing
              </h2>
              <p className="mb-4">
                We process subscription cancellation data, customer activity logs, and billing events to classify 
                churn reasons and draft retention playbooks. This processing happens in real-time and data is only 
                retained for the purpose of generating your report and managing your approval queue.
              </p>
            </section>

            <section>
              <h2 className="font-body text-heading text-text-primary mb-4 font-medium">
                Data Sharing
              </h2>
              <p className="mb-4">
                We do not sell, rent, or share your data with third parties. Your Stripe data and customer 
                information remain private and are used solely to provide Signal&apos;s retention services to you.
              </p>
            </section>

            <section>
              <h2 className="font-body text-heading text-text-primary mb-4 font-medium">
                Data Security
              </h2>
              <p className="mb-4">
                We use industry-standard encryption for data in transit and at rest. API keys are never logged 
                or persisted. All communication with Stripe APIs happens over secure HTTPS connections.
              </p>
            </section>

            <section>
              <h2 className="font-body text-heading text-text-primary mb-4 font-medium">
                Your Rights
              </h2>
              <p className="mb-4">
                You have the right to access, correct, or delete your data at any time. You can also revoke 
                Signal&apos;s access to your Stripe account by deleting your restricted API key. For data 
                deletion requests, contact us at hello@signal.dev.
              </p>
            </section>

            <section>
              <h2 className="font-body text-heading text-text-primary mb-4 font-medium">
                Contact
              </h2>
              <p>
                For privacy-related questions, contact us at <a href="mailto:hello@signal.dev" className="text-text-primary underline">hello@signal.dev</a>.
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
