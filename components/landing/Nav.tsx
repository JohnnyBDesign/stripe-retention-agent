import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Nav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-black">
      <div className="mx-auto max-w-content px-6 md:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center">
            <span className="font-mono text-label uppercase tracking-[0.08em] text-text-display">Signal</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8">
            <Link href="#product" className="font-mono text-caption uppercase tracking-[0.06em] text-text-secondary hover:text-text-display transition">
              Product
            </Link>
            <Link href="#how" className="font-mono text-caption uppercase tracking-[0.06em] text-text-secondary hover:text-text-display transition">
              How
            </Link>
            <Link href="#pricing" className="font-mono text-caption uppercase tracking-[0.06em] text-text-secondary hover:text-text-display transition">
              Pricing
            </Link>
            <Link href="/contact" className="font-mono text-caption uppercase tracking-[0.06em] text-text-secondary hover:text-text-display transition">
              Contact
            </Link>
            <Link href="/scan">
              <Button variant="primary" size="default">
                See who&apos;s leaving — and why
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
