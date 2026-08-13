'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export default function FinalCta() {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    mrrBand: '',
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');

    try {
      const response = await fetch('/api/founding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus('sent');
        setFormData({ name: '', email: '', company: '', mrrBand: '' });
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    <section className="relative py-20 px-6 md:px-8" id="founding">
      <div className="mx-auto max-w-content">
        {!showForm ? (
          <Card className="p-12 md:p-16 bg-surface border-border-visible text-center">
            <h2 className="font-display text-display-md text-text-display mb-6 font-medium">
              See why they cancel, approve the save
            </h2>
            <p className="font-body text-subheading text-text-secondary mb-10 max-w-2xl mx-auto">
              Built for founders who bill on Stripe. You approve every save before anything sends — your Resend, your call. No auto-sends.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/scan">
                <Button variant="primary" size="lg">
                  See who&apos;s leaving — and why
                </Button>
              </Link>
              <Button 
                variant="secondary" 
                size="lg"
                onClick={() => setShowForm(true)}
              >
                Apply for founding — keep 50% off for 90 days after first successful enroll
              </Button>
            </div>
          </Card>
        ) : (
          <Card className="p-12 md:p-16 bg-surface border-border-visible">
            <div className="max-w-2xl mx-auto">
              <h2 className="font-display text-display-md text-text-display mb-6 font-medium text-center">
                Apply for Founding
              </h2>
              <p className="font-body text-subheading text-text-secondary mb-10 text-center">
                Keep 50% off for 90 days after your first successful enroll.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="founding-name" className="block font-mono text-caption uppercase tracking-[0.06em] text-text-primary mb-2">
                    Name
                  </label>
                  <Input
                    id="founding-name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full"
                  />
                </div>

                <div>
                  <label htmlFor="founding-email" className="block font-mono text-caption uppercase tracking-[0.06em] text-text-primary mb-2">
                    Email
                  </label>
                  <Input
                    id="founding-email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full"
                  />
                </div>

                <div>
                  <label htmlFor="founding-company" className="block font-mono text-caption uppercase tracking-[0.06em] text-text-primary mb-2">
                    Company
                  </label>
                  <Input
                    id="founding-company"
                    type="text"
                    required
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full"
                  />
                </div>

                <div>
                  <label htmlFor="founding-mrr" className="block font-mono text-caption uppercase tracking-[0.06em] text-text-primary mb-2">
                    Stripe MRR Band
                  </label>
                  <select
                    id="founding-mrr"
                    required
                    value={formData.mrrBand}
                    onChange={(e) => setFormData({ ...formData, mrrBand: e.target.value })}
                    className="w-full bg-black border border-border rounded-card px-4 py-3 font-body text-body text-text-primary focus:outline-none focus:ring-2 focus:ring-interactive focus:border-transparent"
                  >
                    <option value="">Select MRR band</option>
                    <option value="<$1k">&lt;$1k</option>
                    <option value="$1k-$5k">$1k-$5k</option>
                    <option value="$5k-$10k">$5k-$10k</option>
                    <option value="$10k-$25k">$10k-$25k</option>
                    <option value="$25k-$50k">$25k-$50k</option>
                    <option value="$50k-$100k">$50k-$100k</option>
                    <option value="$100k+">$100k+</option>
                  </select>
                </div>

                <div className="flex items-center gap-4 pt-4">
                  <Button 
                    type="submit" 
                    variant="primary"
                    disabled={status === 'sending'}
                  >
                    {status === 'sending' ? 'Submitting...' : 'Submit application'}
                  </Button>
                  
                  <Button 
                    type="button" 
                    variant="ghost"
                    onClick={() => {
                      setShowForm(false);
                      setStatus('idle');
                    }}
                  >
                    Cancel
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
            </div>
          </Card>
        )}
      </div>
    </section>
  );
}
