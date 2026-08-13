export default function BeforeAfter() {
  return (
    <section className="relative py-32 px-6 md:px-8 bg-panel">
      <div className="mx-auto max-w-content">
        <div className="mb-16 text-center">
          <p className="font-nav text-[11px] uppercase tracking-[0.1em] text-muted-foreground mb-6">
            {'{TRANSFORMATION}'}
          </p>
          <h2 className="font-body text-[48px] leading-[1.1] font-normal tracking-tight text-white max-w-2xl mx-auto">
            Before Signal vs After Signal
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Before */}
          <div className="bg-canvas rounded-sm p-8 border border-border/50">
            <p className="font-nav text-[11px] uppercase tracking-[0.1em] text-muted-foreground mb-6">
              {'{BEFORE}'}
            </p>
            <ul className="space-y-4">
              <li className="font-body text-[16px] text-white/60 flex items-start gap-3">
                <span className="text-white/30">×</span>
                <span>Subscriptions cancel silently</span>
              </li>
              <li className="font-body text-[16px] text-white/60 flex items-start gap-3">
                <span className="text-white/30">×</span>
                <span>No idea why they left</span>
              </li>
              <li className="font-body text-[16px] text-white/60 flex items-start gap-3">
                <span className="text-white/30">×</span>
                <span>Manual outreach, days later</span>
              </li>
              <li className="font-body text-[16px] text-white/60 flex items-start gap-3">
                <span className="text-white/30">×</span>
                <span>Need ESP integration + templates</span>
              </li>
            </ul>
          </div>

          {/* After */}
          <div className="bg-mint rounded-sm p-8">
            <p className="font-nav text-[11px] uppercase tracking-[0.1em] text-canvas/60 mb-6">
              {'{AFTER}'}
            </p>
            <ul className="space-y-4">
              <li className="font-body text-[16px] text-canvas flex items-start gap-3">
                <span className="text-canvas">✓</span>
                <span>Real-time webhook monitoring</span>
              </li>
              <li className="font-body text-[16px] text-canvas flex items-start gap-3">
                <span className="text-canvas">✓</span>
                <span>LLM classifies the reason</span>
              </li>
              <li className="font-body text-[16px] text-canvas flex items-start gap-3">
                <span className="text-canvas">✓</span>
                <span>Approve & send within minutes</span>
              </li>
              <li className="font-body text-[16px] text-canvas flex items-start gap-3">
                <span className="text-canvas">✓</span>
                <span>Sending included, no ESP needed</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
