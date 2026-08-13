import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="relative py-16 px-6 md:px-8 border-t border-line overflow-hidden">
      <div className="mx-auto max-w-content relative z-10">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex items-center mb-4">
              <span className="text-lg font-semibold text-ink">Signal</span>
            </div>
            <p className="text-sm text-ink-subdued">
              Retention agent for SaaS on Stripe
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-ink mb-3">Product</h4>
            <ul className="space-y-2">
              <li><Link href="#product" className="text-sm text-ink-dim hover:text-ink transition">Features</Link></li>
              <li><Link href="#how" className="text-sm text-ink-dim hover:text-ink transition">How it works</Link></li>
              <li><Link href="#pricing" className="text-sm text-ink-dim hover:text-ink transition">Pricing</Link></li>
              <li><Link href="/queue" className="text-sm text-ink-dim hover:text-ink transition">HITL Queue</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-ink mb-3">Company</h4>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-sm text-ink-dim hover:text-ink transition">About</Link></li>
              <li><Link href="/contact" className="text-sm text-ink-dim hover:text-ink transition">Contact</Link></li>
              <li><Link href="/blog" className="text-sm text-ink-dim hover:text-ink transition">Blog</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-ink mb-3">Legal</h4>
            <ul className="space-y-2">
              <li><Link href="/privacy" className="text-sm text-ink-dim hover:text-ink transition">Privacy</Link></li>
              <li><Link href="/terms" className="text-sm text-ink-dim hover:text-ink transition">Terms</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-line">
          <p className="text-sm text-ink-subdued text-center">
            © {new Date().getFullYear()} Signal. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
