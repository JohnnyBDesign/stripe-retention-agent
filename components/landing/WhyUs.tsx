import { Card } from '@/components/ui/card';

export default function WhyUs() {
  return (
    <section className="relative py-20 px-6 md:px-8">
      <div className="mx-auto max-w-content">
        <Card className="p-12 md:p-16 bg-surface border-border">
          <div className="max-w-3xl">
            <h2 className="font-body text-display-md text-text-display mb-6 font-light">
              Approve every enroll like a teammate.
            </h2>
            <p className="font-body text-subheading text-text-secondary leading-relaxed">
              Signal classifies the reason, drafts the save email, and waits for your approval 
              before enrolling the customer in your Resend playbook. No auto-sends.
            </p>
          </div>
        </Card>
      </div>
    </section>
  );
}
