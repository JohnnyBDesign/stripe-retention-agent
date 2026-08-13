import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Nav() {
  return (
    <nav className="absolute top-0 left-0 right-0 z-50 border-b border-border/50 bg-canvas/95 backdrop-blur-sm">
      <div className="mx-auto max-w-content px-6 md:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Wordmark left */}
          <Link href="/" className="flex items-center">
            <span className="font-body text-[18px] font-medium tracking-tight text-white">Signal</span>
          </Link>
          
          {/* Centered uppercase links with dots */}
          <div className="hidden md:flex items-center gap-1 absolute left-1/2 transform -translate-x-1/2">
            <Link href="/scan" className="nav-link font-nav text-[11px] uppercase tracking-[0.1em] text-white/70 hover:text-white transition px-3">
              SCAN
            </Link>
            <span className="text-white/30">·</span>
            <Link href="#pricing" className="nav-link font-nav text-[11px] uppercase tracking-[0.1em] text-white/70 hover:text-white transition px-3">
              PRICING
            </Link>
            <span className="text-white/30">·</span>
            <Link href="/contact" className="nav-link font-nav text-[11px] uppercase tracking-[0.1em] text-white/70 hover:text-white transition px-3">
              CONTACT
            </Link>
          </div>

          {/* Outlined button right */}
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="outline" size="sm" className="rounded-sm">
                LOGIN
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
