export default function Reasons() {
  const reasons = [
    { code: 'ret_price', label: 'Price concerns', color: 'bg-status-orange/10 text-status-orange border-status-orange/20' },
    { code: 'ret_bugs', label: 'Technical issues', color: 'bg-status-red/10 text-status-red border-status-red/20' },
    { code: 'ret_competitor', label: 'Switching to competitor', color: 'bg-status-blue/10 text-status-blue border-status-blue/20' },
    { code: 'ret_never_activated', label: 'Never activated', color: 'bg-status-green/10 text-status-green border-status-green/20' },
    { code: 'silent_rescue', label: 'Silent downgrade', color: 'bg-status-orange/10 text-status-orange border-status-orange/20' },
  ];

  return (
    <section className="relative py-20 px-6 md:px-8">
      <div className="mx-auto max-w-content">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-ink mb-4">
            Classified reasons, mapped to playbooks
          </h2>
          <p className="text-xl text-ink-dim">Signal understands why they&apos;re leaving</p>
        </div>

        <div className="flex flex-wrap gap-4 justify-center">
          {reasons.map((reason) => (
            <div 
              key={reason.code}
              className={`inline-flex items-center gap-3 px-6 py-3 rounded-pill border ${reason.color}`}
            >
              <span className="font-mono font-medium text-sm">{reason.code}</span>
              <span className="text-sm opacity-75">· {reason.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
