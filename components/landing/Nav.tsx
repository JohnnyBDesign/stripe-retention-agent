'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';

export default function Nav() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`sticky top-0 z-50 transition-all ${
        isScrolled
          ? 'bg-afterwhy-elevated/95 backdrop-blur-sm border-b border-afterwhy-line'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3 group">
            <Image
              src="/mark.svg"
              alt="AfterWhy"
              width={24}
              height={24}
              className="transition-transform group-hover:scale-105"
            />
            <span className="font-display text-lg text-afterwhy-paper">
              AfterWhy
            </span>
          </Link>

          <div className="flex items-center gap-8">
            <Link
              href="#how"
              className="hidden sm:block text-sm text-afterwhy-muted hover:text-afterwhy-paper transition-colors"
            >
              How it works
            </Link>
            <Link
              href="#compare"
              className="hidden sm:block text-sm text-afterwhy-muted hover:text-afterwhy-paper transition-colors"
            >
              vs SaveMRR
            </Link>
            <Link
              href="#pricing"
              className="hidden sm:block text-sm text-afterwhy-muted hover:text-afterwhy-paper transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="/queue"
              className="px-4 py-2 bg-afterwhy-amber hover:bg-afterwhy-amber-hover text-afterwhy-ink text-sm font-semibold rounded-pill transition-colors"
            >
              Start with Stripe keys
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
