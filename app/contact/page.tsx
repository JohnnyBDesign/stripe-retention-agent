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
    <div className="min-h-screen bg-canvas">
      <nav className="border-b border-border/50 px-6 md:px-8 py-4 bg-panel/30">
        <div className="mx-auto max-w-content">
          <Link href="/" className="font-body text-[18px] font-medium tracking-tight text-white">
            Signal
          </Link>
        </div>
      </nav>

      <main className="px-6 md:px-8 py-20">
        <div className="mx-auto max-w-2xl">
          <div className="mb-12">
            <p className="font-nav text-[11px] uppercase tracking-[0.1em] text-muted-foreground mb-6">
              {'{CONTACT}'}
            </p>
            <h1 className="font-body text-[48px] leading-[1.1] font-normal tracking-tight text-white mb-4">
              Get in touch
            </h1>
            <p className="font-body text-[16px] text-muted-foreground">
              Need custom volume or features? Have questions about Signal? We&apos;ll get back to you.
            </p>
          </div>

          <Card className="p-8 bg-panel">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block font-nav text-[11px] uppercase tracking-[0.1em] text-white mb-2">
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
                <label htmlFor="email" className="block font-nav text-[11px] uppercase tracking-[0.1em] text-white mb-2">
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
                <label htmlFor="company" className="block font-nav text-[11px] uppercase tracking-[0.1em] text-white mb-2">
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
                <label htmlFor="message" className="block font-nav text-[11px] uppercase tracking-[0.1em] text-white mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  required
                  rows={6}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-input border border-border/50 rounded-sm px-4 py-3 font-body text-[14px] text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                />
              </div>

              <div className="flex items-center gap-4">
                <Button 
                  type="submit" 
                  variant="default"
                  disabled={status === 'sending'}
                >
                  {status === 'sending' ? 'Sending...' : 'Send message'}
                </Button>
                
                {status === 'sent' && (
                  <span className="font-nav text-[11px] uppercase tracking-[0.1em] text-mint">
                    Sent
                  </span>
                )}
                
                {status === 'error' && (
                  <span className="font-nav text-[11px] uppercase tracking-[0.1em] text-destructive">
                    Error
                  </span>
                )}
              </div>
            </form>
          </Card>

          <div className="mt-8">
            <Link href="/" className="font-body text-[14px] text-muted-foreground hover:text-white transition">
              ← Back to home
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
