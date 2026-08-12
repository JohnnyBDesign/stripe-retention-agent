import Link from 'next/link';

export default function FinalCta() {
  return (
    <section className="border-y border-line bg-panel">
      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-chalk mb-6">
            Ready to save churned customers?
          </h2>
          <p className="text-lg text-mute mb-8">
            Get 50% off for 90 days after your first successful enroll.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/queue"
              className="w-full sm:w-auto px-8 py-3.5 bg-lime hover:bg-lime/90 text-void text-base font-semibold rounded-chrome transition-colors"
            >
              Connect Stripe → get your first HITL card
            </Link>
            <Link
              href="#pricing"
              className="w-full sm:w-auto px-8 py-3.5 border-2 border-line hover:border-chalk text-chalk text-base font-semibold rounded-chrome transition-colors"
            >
              Apply for founding — 50% off 90 days after first successful enroll
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
