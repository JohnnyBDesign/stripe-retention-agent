export default function WhyUs() {
  const points = [
    'Cancel flows save the click. We save the customer after we know why they left—or went quiet.',
    'Stripe-native reason brain → Resend segments (ret_price, ret_bug, …). Your ESP. Your brand. Human approval.',
    'Not another cancel modal. Classifies price, bugs, competitors, never-activated, and silent renewers—then enrolls the playbook.',
    'Bring your own Resend (then Customer.io / Loops). We don\'t hijack deliverability to rent you six engines.',
    'HITL by design: the agent drafts the retention move; you ship it. Autopilot is how brands get weird.',
  ];

  return (
    <section className="border-y border-afterwhy-line bg-afterwhy-elevated">
      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <h2 className="text-3xl font-bold text-afterwhy-paper mb-16 text-center">
          Why us
        </h2>
        <div className="space-y-8 max-w-3xl mx-auto">
          {points.map((point, i) => (
            <div key={i} className="flex gap-6 items-start">
              <div className="flex-shrink-0 font-mono text-sm font-bold text-afterwhy-amber">
                {String(i + 1).padStart(2, '0')}
              </div>
              <p className="text-afterwhy-muted text-base leading-[1.55] pt-0.5">
                {point}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
