import Image from 'next/image';

export default function WhyUs() {
  return (
    <section className="relative py-20 px-6 md:px-8">
      <div className="mx-auto max-w-content">
        <div className="bg-charcoal rounded-4xl p-12 md:p-16 border border-line relative overflow-hidden">
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Approve every enroll like a teammate.
            </h2>
            <p className="text-xl text-gray leading-relaxed">
              Signal classifies the reason, drafts the save email, and waits for your approval 
              before enrolling the customer in your Resend playbook. No auto-sends.
            </p>
          </div>
          
          {/* Peeking face */}
          <div className="absolute -right-12 -bottom-12 opacity-20">
            <Image src="/face.svg" alt="" width={300} height={300} />
          </div>
        </div>
      </div>
    </section>
  );
}
