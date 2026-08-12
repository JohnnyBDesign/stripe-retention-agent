export default function WhyUs() {
  const points = [
    'Cancel flows save the click. We save the customer after we know why they left—or went quiet.',
    'Stripe-native reason brain → Resend segments (ret_price, ret_bug, …). Your ESP. Your brand. Human approval.',
    'Not another cancel modal. Classifies price, bugs, competitors, never-activated, and silent renewers—then enrolls the playbook.',
    'Bring your own Resend (then Customer.io / Loops). We don\'t hijack deliverability to rent you six engines.',
    'HITL by design: the agent drafts the retention move; you ship it. Autopilot is how brands get weird.',
  ];

  return (
    <section className="border-y border-line bg-panel">
      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <h2 className="text-3xl sm:text-4xl font-bold text-chalk mb-12 text-center">
          Why us
        </h2>
        <div className="space-y-6 max-w-3xl mx-auto">
          {points.map((point, i) => (
            <div key={i} className="flex gap-4 items-start">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-lime/10 border border-lime/30 flex items-center justify-center font-mono font-bold text-lime">
                {String(i + 1).padStart(2, '0')}
              </div>
              <p className="text-mute pt-2 text-lg leading-relaxed">
                {point}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
