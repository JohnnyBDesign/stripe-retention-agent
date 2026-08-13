export default function Reasons() {
  const reasons = [
    { code: 'ret_price', label: 'Price concerns' },
    { code: 'ret_bugs', label: 'Technical issues' },
    { code: 'ret_competitor', label: 'Switching to competitor' },
    { code: 'ret_never_activated', label: 'Never activated' },
    { code: 'silent_rescue', label: 'Silent downgrade' },
  ];

  return (
    <section className="relative py-20 px-6 md:px-8">
      <div className="mx-auto max-w-content">
        <div className="mb-12">
          <h2 className="font-display text-display-md mb-4 font-normal">
            Classified reasons, matched to templates
          </h2>
          <p className="font-body text-subheading text-muted-foreground">
            Signal understands why they&apos;re leaving
          </p>
        </div>

        <div className="flex flex-wrap gap-4">
          {reasons.map((reason) => (
            <div 
              key={reason.code}
              className="inline-flex items-center gap-3 px-6 py-3 border border-border rounded-full bg-muted"
            >
              <span className="font-mono text-sm">
                {reason.code}
              </span>
              <span className="font-body text-sm text-muted-foreground">
                · {reason.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
