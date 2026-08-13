export default function WhyUs() {
  return (
    <section className="relative py-20 px-6 md:px-8 overflow-hidden">
      {/* Oil painting backdrop with dark overlay */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'url(/backdrops/product.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div className="absolute inset-0 bg-black/70 pointer-events-none" />
      
      <div className="mx-auto max-w-content relative z-10">
        <div className="bg-surface rounded-4xl p-12 md:p-16 border border-line relative overflow-hidden">
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-bold text-ink mb-6">
              Approve every enroll like a teammate.
            </h2>
            <p className="text-xl text-ink-dim leading-relaxed">
              Signal classifies the reason, drafts the save email, and waits for your approval 
              before enrolling the customer in your Resend playbook. No auto-sends.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
