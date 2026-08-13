import Link from 'next/link';
import { Card } from '@/components/ui/card';

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-black">
      <nav className="border-b border-border px-6 md:px-8 py-4">
        <div className="mx-auto max-w-content">
          <Link href="/" className="font-mono text-label uppercase tracking-[0.08em] text-text-display">
            Signal
          </Link>
        </div>
      </nav>

      <main className="px-6 md:px-8 py-20">
        <div className="mx-auto max-w-3xl">
          <h1 className="font-display text-display-lg text-text-display mb-12 font-medium">
            Blog
          </h1>

          <Card className="p-12 bg-surface border-border-visible text-center">
            <p className="font-mono text-heading uppercase tracking-[0.06em] text-text-disabled">
              [NO POSTS]
            </p>
          </Card>

          <div className="mt-8">
            <Link href="/" className="font-body text-body-sm text-text-secondary hover:text-text-primary transition">
              ← Back to home
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
