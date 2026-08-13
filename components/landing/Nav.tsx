import Link from 'next/link';

export default function Nav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-line bg-canvas/80 backdrop-blur-sm">
      <div className="mx-auto max-w-content px-6 md:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center">
            <span className="text-lg font-semibold text-ink">Signal</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8">
            <Link href="#product" className="text-sm text-ink-dim hover:text-ink transition">
              Product
            </Link>
            <Link href="#how" className="text-sm text-ink-dim hover:text-ink transition">
              How
            </Link>
            <Link href="#pricing" className="text-sm text-ink-dim hover:text-ink transition">
              Pricing
            </Link>
            <Link href="/contact" className="text-sm text-ink-dim hover:text-ink transition">
              Contact
            </Link>
            <Link 
              href="#pricing"
              className="px-5 py-2.5 bg-white text-black text-sm font-medium rounded-pill hover:bg-white/90 transition"
            >
              Start with Stripe keys
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
