export default function ProductWindow() {
  return (
    <section className="relative py-20 px-6 md:px-8 overflow-hidden" id="product">
      {/* Atmospheric backdrop - can be replaced with oil painting background-image */}
      <div className="absolute inset-0 bg-gradient-to-br from-surface/20 via-canvas to-canvas pointer-events-none opacity-60" />
      
      <div className="mx-auto max-w-content relative z-10">
        {/* macOS chrome */}
        <div className="rounded-3xl overflow-hidden bg-surface shadow-2xl border border-line">
          {/* Window chrome */}
          <div className="h-10 bg-panel border-b border-line flex items-center px-4">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-status-red/40"></div>
              <div className="w-3 h-3 rounded-full bg-status-orange/40"></div>
              <div className="w-3 h-3 rounded-full bg-status-green/40"></div>
            </div>
          </div>

          {/* HITL Card */}
          <div className="p-8 md:p-12">
            <div className="bg-panel rounded-3xl p-8 border border-line">
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-pill bg-status-orange/10 text-status-orange text-xs font-medium mb-3 border border-status-orange/20">
                    silent_rescue
                  </div>
                  <h3 className="text-2xl font-bold text-ink mb-2">Needs approval</h3>
                  <p className="text-ink-dim">Customer downgrading from $249 → $99 due to price concerns</p>
                </div>
                <span className="text-4xl">🔔</span>
              </div>

              {/* Draft preview */}
              <div className="bg-canvas rounded-2xl p-6 mb-6 border border-line">
                <p className="text-xs text-ink-subdued mb-2 font-medium tracking-wide uppercase">Draft Subject</p>
                <p className="text-ink mb-4">Quick question before you go</p>
                <p className="text-xs text-ink-subdued mb-2 font-medium tracking-wide uppercase">Playbook</p>
                <p className="text-ink-dim">ret_price → Resend segment offer_extension_50</p>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button className="flex-1 px-6 py-3 bg-white text-black font-medium rounded-pill hover:bg-white/90 transition">
                  Approve & enroll
                </button>
                <button className="px-6 py-3 bg-surface text-ink font-medium rounded-pill hover:bg-panel transition border border-line">
                  Edit draft
                </button>
                <button className="px-6 py-3 bg-surface text-ink-dim font-medium rounded-pill hover:bg-panel transition border border-line">
                  Skip
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
