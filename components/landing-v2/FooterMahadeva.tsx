import Link from 'next/link';

export default function FooterMahadeva() {
  return (
    <footer className="relative bg-canvas border-t border-border/50">
      {/* Pastel bar strip at top */}
      <div className="flex h-2">
        <div className="flex-1 bg-mint" />
        <div className="flex-1 bg-lilac" />
        <div className="flex-1 bg-sky" />
        <div className="flex-1 bg-butter" />
        <div className="flex-1 bg-mint-light" />
      </div>

      <div className="relative py-20 px-6 md:px-8">
        <div className="mx-auto max-w-content">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            {/* Email */}
            <div>
              <p className="font-nav text-[11px] uppercase tracking-[0.1em] text-muted-foreground mb-3">
                {'{EMAIL}'}
              </p>
              <a
                href="mailto:hello@signal.example"
                className="font-body text-[18px] text-white hover:text-mint transition"
              >
                hello@signal.example
              </a>
            </div>

            {/* Navigation */}
            <div>
              <p className="font-nav text-[11px] uppercase tracking-[0.1em] text-muted-foreground mb-3">
                {'{NAVIGATION}'}
              </p>
              <ul className="space-y-2">
                <li>
                  <Link href="/scan" className="font-body text-[14px] text-white/70 hover:text-white transition">
                    Scan
                  </Link>
                </li>
                <li>
                  <Link href="#pricing" className="font-body text-[14px] text-white/70 hover:text-white transition">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="font-body text-[14px] text-white/70 hover:text-white transition">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="font-body text-[14px] text-white/70 hover:text-white transition">
                    Login
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <p className="font-nav text-[11px] uppercase tracking-[0.1em] text-muted-foreground mb-3">
                {'{COMPANY}'}
              </p>
              <ul className="space-y-2">
                <li>
                  <Link href="/about" className="font-body text-[14px] text-white/70 hover:text-white transition">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="font-body text-[14px] text-white/70 hover:text-white transition">
                    Blog
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <p className="font-nav text-[11px] uppercase tracking-[0.1em] text-muted-foreground mb-3">
                {'{LEGAL}'}
              </p>
              <ul className="space-y-2">
                <li>
                  <Link href="/privacy" className="font-body text-[14px] text-white/70 hover:text-white transition">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="font-body text-[14px] text-white/70 hover:text-white transition">
                    Terms
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Giant ghosted SIGNAL wordmark with marquee */}
          <div className="relative overflow-hidden py-12">
            <div className="flex whitespace-nowrap">
              <p className="font-body text-[120px] md:text-[180px] lg:text-[240px] font-bold leading-none text-white/5 select-none marquee-slow inline-block pr-24">
                SIGNAL SIGNAL SIGNAL SIGNAL
              </p>
              <p className="font-body text-[120px] md:text-[180px] lg:text-[240px] font-bold leading-none text-white/5 select-none marquee-slow inline-block pr-24">
                SIGNAL SIGNAL SIGNAL SIGNAL
              </p>
            </div>
          </div>

          {/* Copyright */}
          <div className="text-center pt-8 border-t border-border/50">
            <p className="font-nav text-[11px] uppercase tracking-[0.1em] text-muted-foreground">
              ©2026 Signal. All Rights Reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
