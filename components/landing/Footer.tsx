import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-afterwhy-line">
      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
        {/* Trust Strip */}
        <div className="py-12 text-center border-b border-afterwhy-line">
          <p className="text-sm text-afterwhy-mono mb-4">Built for</p>
          <div className="flex flex-wrap justify-center items-center gap-6 text-afterwhy-paper font-medium">
            <span>Stripe</span>
            <span className="text-afterwhy-mono">+</span>
            <span>Resend</span>
            <span className="text-afterwhy-mono">+</span>
            <span className="text-afterwhy-muted">Customer.io (soon)</span>
            <span className="text-afterwhy-mono">+</span>
            <span className="text-afterwhy-muted">Loops (soon)</span>
          </div>
        </div>

        {/* Footer Links */}
        <div className="py-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-afterwhy-mono text-sm">
            © 2026 AfterWhy. Human-in-the-loop retention for Stripe.
          </div>
          <Link
            href="/queue"
            className="text-sm text-afterwhy-muted hover:text-afterwhy-paper transition-colors"
          >
            HITL Queue →
          </Link>
        </div>
      </div>
    </footer>
  );
}
