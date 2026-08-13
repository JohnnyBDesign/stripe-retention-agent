'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus('sent');
        setFormData({ name: '', email: '', company: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
    }
  };

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
        <div className="mx-auto max-w-2xl">
          <div className="mb-12">
            <h1 className="font-display text-display-lg text-text-display mb-4 font-medium">
              Contact
            </h1>
            <p className="font-body text-subheading text-text-secondary">
              Need custom volume or features? Have questions about Signal? We&apos;ll get back to you.
            </p>
          </div>

          <Card className="p-8 bg-surface border-border-visible">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block font-mono text-caption uppercase tracking-[0.06em] text-text-primary mb-2">
                  Name
                </label>
                <Input
                  id="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full"
                />
              </div>

              <div>
                <label htmlFor="email" className="block font-mono text-caption uppercase tracking-[0.06em] text-text-primary mb-2">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full"
                />
              </div>

              <div>
                <label htmlFor="company" className="block font-mono text-caption uppercase tracking-[0.06em] text-text-primary mb-2">
                  Company
                </label>
                <Input
                  id="company"
                  type="text"
                  required
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full"
                />
              </div>

              <div>
                <label htmlFor="message" className="block font-mono text-caption uppercase tracking-[0.06em] text-text-primary mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  required
                  rows={6}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-black border border-border rounded-card px-4 py-3 font-body text-body text-text-primary placeholder:text-text-disabled focus:outline-none focus:ring-2 focus:ring-interactive focus:border-transparent"
                />
              </div>

              <div className="flex items-center gap-4">
                <Button 
                  type="submit" 
                  variant="primary"
                  disabled={status === 'sending'}
                >
                  {status === 'sending' ? 'Sending...' : 'Send message'}
                </Button>
                
                {status === 'sent' && (
                  <span className="font-mono text-caption uppercase tracking-[0.06em] text-success">
                    [SENT]
                  </span>
                )}
                
                {status === 'error' && (
                  <span className="font-mono text-caption uppercase tracking-[0.06em] text-error">
                    [ERROR]
                  </span>
                )}
              </div>
            </form>
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
