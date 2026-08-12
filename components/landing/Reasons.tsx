import Image from 'next/image';

export default function Reasons() {
  const reasons = [
    { code: 'ret_price', label: 'Price concerns', color: 'bg-accent-orange/10 text-accent-orange border-accent-orange/30' },
    { code: 'ret_bugs', label: 'Technical issues', color: 'bg-danger/10 text-danger border-danger/30' },
    { code: 'ret_competitor', label: 'Switching to competitor', color: 'bg-accent-violet/10 text-accent-violet border-accent-violet/30' },
    { code: 'ret_never_activated', label: 'Never activated', color: 'bg-accent-teal/10 text-accent-teal border-accent-teal/30' },
    { code: 'silent_rescue', label: 'Silent downgrade', color: 'bg-accent-orange/10 text-accent-orange border-accent-orange/30' },
  ];

  return (
    <section className="relative py-20 px-6 md:px-8">
      <div className="mx-auto max-w-content">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Classified reasons, mapped to playbooks
          </h2>
          <p className="text-xl text-gray">Signal understands why they&apos;re leaving</p>
        </div>

        <div className="flex flex-wrap gap-4 justify-center">
          {reasons.map((reason) => (
            <div 
              key={reason.code}
              className={`inline-flex items-center gap-3 px-6 py-3 rounded-pill border ${reason.color}`}
            >
              <Image src="/face.svg" alt="" width={24} height={24} className="opacity-60" />
              <span className="font-medium">{reason.code}</span>
              <span className="text-sm opacity-75">· {reason.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
