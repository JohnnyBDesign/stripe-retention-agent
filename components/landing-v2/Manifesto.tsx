export default function Manifesto() {
  return (
    <section className="relative py-32 px-6 md:px-8 bg-mint-light">
      <div className="mx-auto max-w-content">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="font-nav text-[11px] uppercase tracking-[0.1em] text-canvas/60 mb-6">
              {'{RETENTION AGENT}'}
            </p>
            <h2 className="font-body text-[48px] md:text-[56px] leading-[1.1] font-normal tracking-tight text-canvas">
              Signal helps SaaS founders save churning revenue before it disappears
            </h2>
          </div>
          <div className="space-y-6">
            <p className="font-body text-[16px] leading-relaxed text-canvas/80">
              Built for modern SaaS teams billing on Stripe. Signal watches your subscriptions, classifies why they're canceling, drafts the right save email, and waits for your approval.
            </p>
            <p className="font-body text-[16px] leading-relaxed text-canvas/80">
              Sending included. No ESP integration. Replies go straight to you. You stay in control of every message.
            </p>
            <p className="font-body text-[16px] leading-relaxed text-canvas/80">
              Independent product. Not made by Stripe. Not affiliated with Stripe.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
