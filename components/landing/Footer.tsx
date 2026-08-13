import Link from 'next/link';
import { Separator } from '@/components/ui/separator';

export default function Footer() {
  return (
    <footer className="relative py-16 px-6 md:px-8 border-t border-border">
      <div className="mx-auto max-w-content">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex items-center mb-4">
              <span className="font-mono text-label uppercase tracking-[0.08em] text-text-display">Signal</span>
            </div>
            <p className="font-body text-body-sm text-text-secondary">
              Retention agent for SaaS on Stripe
            </p>
          </div>

          <div>
            <h4 className="font-mono text-caption uppercase tracking-[0.08em] text-text-primary mb-3">
              Product
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="#product" className="font-body text-body-sm text-text-secondary hover:text-text-primary transition">
                  Features
                </Link>
              </li>
              <li>
                <Link href="#how" className="font-body text-body-sm text-text-secondary hover:text-text-primary transition">
                  How it works
                </Link>
              </li>
              <li>
                <Link href="#pricing" className="font-body text-body-sm text-text-secondary hover:text-text-primary transition">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/queue" className="font-body text-body-sm text-text-secondary hover:text-text-primary transition">
                  HITL Queue
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-mono text-caption uppercase tracking-[0.08em] text-text-primary mb-3">
              Company
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="font-body text-body-sm text-text-secondary hover:text-text-primary transition">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="font-body text-body-sm text-text-secondary hover:text-text-primary transition">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/blog" className="font-body text-body-sm text-text-secondary hover:text-text-primary transition">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-mono text-caption uppercase tracking-[0.08em] text-text-primary mb-3">
              Legal
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="font-body text-body-sm text-text-secondary hover:text-text-primary transition">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="font-body text-body-sm text-text-secondary hover:text-text-primary transition">
                  Terms
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="mb-8" />

        <p className="font-mono text-caption uppercase tracking-[0.06em] text-text-disabled text-center">
          © {new Date().getFullYear()} Signal. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
