import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="relative py-16 px-6 md:px-8 border-t border-line overflow-hidden">
      <div className="mx-auto max-w-content relative z-10">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Image src="/face.svg" alt="Signal" width={32} height={32} />
              <span className="text-lg font-semibold text-white">Signal</span>
            </div>
            <p className="text-sm text-gray-dim">
              Stripe churn, classified and saved
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-3">Product</h4>
            <ul className="space-y-2">
              <li><Link href="#product" className="text-sm text-gray-dim hover:text-white transition">Features</Link></li>
              <li><Link href="#how" className="text-sm text-gray-dim hover:text-white transition">How it works</Link></li>
              <li><Link href="#pricing" className="text-sm text-gray-dim hover:text-white transition">Pricing</Link></li>
              <li><Link href="/queue" className="text-sm text-gray-dim hover:text-white transition">HITL Queue</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-3">Company</h4>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-sm text-gray-dim hover:text-white transition">About</Link></li>
              <li><Link href="/contact" className="text-sm text-gray-dim hover:text-white transition">Contact</Link></li>
              <li><Link href="/blog" className="text-sm text-gray-dim hover:text-white transition">Blog</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-3">Legal</h4>
            <ul className="space-y-2">
              <li><Link href="/privacy" className="text-sm text-gray-dim hover:text-white transition">Privacy</Link></li>
              <li><Link href="/terms" className="text-sm text-gray-dim hover:text-white transition">Terms</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-line">
          <p className="text-sm text-gray-dim text-center">
            © {new Date().getFullYear()} Signal. All rights reserved.
          </p>
        </div>
      </div>

      {/* Large faint face */}
      <div className="absolute right-0 bottom-0 opacity-5 pointer-events-none">
        <Image src="/face.svg" alt="" width={400} height={400} />
      </div>
    </footer>
  );
}
