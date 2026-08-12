export default function HowItWorks() {
  const steps = [
    {
      number: 'STEP 1',
      title: 'Stripe fires',
      description:
        'Cancel with reason text, refund, or silent/never-activated signal.',
    },
    {
      number: 'STEP 2',
      title: 'We classify',
      description:
        'price · bug · missing_feature · competitor · never_activated · silent_rescue · other.',
    },
    {
      number: 'STEP 3',
      title: 'You approve',
      description:
        'Draft + recommended Resend segment. SLA: 4h cancel-path / 1 business day silent.',
    },
    {
      number: 'STEP 4',
      title: 'Resend enrolls',
      description:
        'Contact joins matching ret_* segment; your sequence runs.',
    },
  ];

  return (
    <section id="how" className="scroll-mt-16">
      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-afterwhy-paper mb-12 text-center">
          How it works
        </h2>
        <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {steps.map((step, i) => (
            <div
              key={i}
              className="border-2 border-afterwhy-line rounded-card p-6 hover:border-afterwhy-amber transition-colors bg-afterwhy-elevated"
            >
              <div className="text-xs font-bold text-afterwhy-mono tracking-wider mb-2">
                {step.number}
              </div>
              <h3 className="font-display text-xl font-bold text-afterwhy-paper mb-3">
                {step.title}
              </h3>
              <p className="text-afterwhy-muted leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
