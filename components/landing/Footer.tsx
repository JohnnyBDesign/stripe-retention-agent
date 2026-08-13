import Link from 'next/link';
import { Separator } from '@/components/ui/separator';

export default function Footer() {
  return (
    <footer className="relative py-16 px-6 md:px-8 border-t border-border">
      <div className="mx-auto max-w-content">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex items-center mb-4">
              <span className="font-mono text-sm uppercase tracking-wider font-semibold">Signal</span>
            </div>
            <p className="font-body text-sm text-muted-foreground">
              Retention agent for SaaS on Stripe
            </p>
          </div>

          <div>
            <h4 className="font-mono text-xs uppercase tracking-wider mb-3 font-medium">
              Product
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="#product" className="font-body text-sm text-muted-foreground hover:text-foreground transition">
                  Features
                </Link>
              </li>
              <li>
                <Link href="#how" className="font-body text-sm text-muted-foreground hover:text-foreground transition">
                  How it works
                </Link>
              </li>
              <li>
                <Link href="#pricing" className="font-body text-sm text-muted-foreground hover:text-foreground transition">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-mono text-xs uppercase tracking-wider mb-3 font-medium">
              Company
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="font-body text-sm text-muted-foreground hover:text-foreground transition">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="font-body text-sm text-muted-foreground hover:text-foreground transition">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/blog" className="font-body text-sm text-muted-foreground hover:text-foreground transition">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-mono text-xs uppercase tracking-wider mb-3 font-medium">
              Legal
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="font-body text-sm text-muted-foreground hover:text-foreground transition">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="font-body text-sm text-muted-foreground hover:text-foreground transition">
                  Terms
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="mb-8" />

        <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground text-center">
          © {new Date().getFullYear()} Signal. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
