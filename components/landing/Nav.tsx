import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Nav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="mx-auto max-w-content px-6 md:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center">
            <span className="font-mono text-label uppercase tracking-[0.05em] font-semibold">Signal</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8">
            <Link href="#product" className="font-body text-sm text-muted-foreground hover:text-foreground transition">
              Product
            </Link>
            <Link href="#how" className="font-body text-sm text-muted-foreground hover:text-foreground transition">
              How it works
            </Link>
            <Link href="#pricing" className="font-body text-sm text-muted-foreground hover:text-foreground transition">
              Pricing
            </Link>
            <Link href="/contact" className="font-body text-sm text-muted-foreground hover:text-foreground transition">
              Contact
            </Link>
            <Link href="/scan">
              <Button variant="default" size="default" className="rounded-full">
                See who&apos;s leaving — and why
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
