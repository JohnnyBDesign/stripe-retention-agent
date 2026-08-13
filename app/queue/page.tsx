'use client';

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

interface RetentionCase {
  id: string;
  customerId: string;
  customerEmail: string;
  plan: string;
  mrr: number;
  tenureDays: number;
  reason: string;
  confidence: number;
  evidence: string[];
  subjectDraft: string;
  bodyDraft: string;
  state: string;
  triggerType: string;
  slaDueAt: string | null;
  overrideReason: string | null;
  createdAt: string;
}

function QueueContent() {
  const [cases, setCases] = useState<RetentionCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCase, setSelectedCase] = useState<RetentionCase | null>(null);
  const [editedSubject, setEditedSubject] = useState('');
  const [editedBody, setEditedBody] = useState('');
  const [editedReason, setEditedReason] = useState('');

  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
    try {
      const response = await fetch('/api/queue?state=pending');
      const data = await response.json();
      setCases(data.cases);
    } catch (error) {
      console.error('Failed to fetch cases:', error);
    } finally {
      setLoading(false);
    }
  };

  const selectCase = (c: RetentionCase) => {
    setSelectedCase(c);
    setEditedSubject(c.subjectDraft);
    setEditedBody(c.bodyDraft);
    setEditedReason(c.overrideReason || c.reason);
  };

  const handleApprove = async () => {
    if (!selectedCase) return;

    const isEdited = editedSubject !== selectedCase.subjectDraft || editedBody !== selectedCase.bodyDraft;
    const reasonOverridden = editedReason !== selectedCase.reason;

    try {
      await fetch(`/api/queue/${selectedCase.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          state: isEdited ? 'edited_approved' : 'approved',
          subjectDraft: editedSubject,
          bodyDraft: editedBody,
          overrideReason: reasonOverridden ? editedReason : null,
        }),
      });

      setCases(cases.filter(c => c.id !== selectedCase.id));
      setSelectedCase(null);
    } catch (error) {
      console.error('Failed to approve case:', error);
      alert('Failed to approve case');
    }
  };

  const handleReject = async () => {
    if (!selectedCase) return;

    try {
      await fetch(`/api/queue/${selectedCase.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ state: 'rejected' }),
      });

      setCases(cases.filter(c => c.id !== selectedCase.id));
      setSelectedCase(null);
    } catch (error) {
      console.error('Failed to reject case:', error);
      alert('Failed to reject case');
    }
  };

  const handleSnooze = async (hours: number) => {
    if (!selectedCase) return;

    try {
      const snoozeUntil = new Date(Date.now() + hours * 60 * 60 * 1000).toISOString();
      await fetch(`/api/queue/${selectedCase.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          state: 'snoozed',
          snoozeUntil,
        }),
      });

      setCases(cases.filter(c => c.id !== selectedCase.id));
      setSelectedCase(null);
    } catch (error) {
      console.error('Failed to snooze case:', error);
      alert('Failed to snooze case');
    }
  };

  if (loading) {
    return <div className="p-8 bg-background min-h-screen">Loading...</div>;
  }

  return (
    <div className="flex h-screen bg-background">
      <div className="w-1/3 border-r border-border overflow-y-auto">
        <div className="p-4 border-b border-border bg-muted/50">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-xl font-semibold">Approval Queue</h1>
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              ← Home
            </Link>
          </div>
          <p className="text-sm text-muted-foreground">{cases.length} pending cases</p>
        </div>
        
        <div className="divide-y divide-border">
          {cases.map((c) => (
            <div
              key={c.id}
              onClick={() => selectCase(c)}
              className={`p-4 cursor-pointer hover:bg-muted/50 transition-colors ${
                selectedCase?.id === c.id ? 'bg-muted/50 border-l-2 border-foreground' : ''
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">{c.customerEmail}</p>
                  <p className="text-sm text-muted-foreground">{c.plan}</p>
                </div>
                <span className="px-2 py-1 text-xs rounded-md border border-border font-mono">
                  {c.reason}
                </span>
              </div>
              <div className="mt-2 flex gap-4 text-sm text-muted-foreground">
                <span>${c.mrr.toFixed(2)} MRR</span>
                <span>{c.tenureDays}d tenure</span>
                <span>{Math.round(c.confidence * 100)}% conf</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {selectedCase ? (
          <div className="p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-2">{selectedCase.customerEmail}</h2>
              <div className="flex gap-4 text-sm text-muted-foreground">
                <span>Customer ID: {selectedCase.customerId}</span>
                <span>Plan: {selectedCase.plan}</span>
                <span>${selectedCase.mrr.toFixed(2)} MRR</span>
                <span>{selectedCase.tenureDays} days tenure</span>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold mb-2">Classification</h3>
              <div className="bg-muted/50 p-4 rounded-md border border-border space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-1 text-muted-foreground">Churn Reason</label>
                  <select
                    value={editedReason}
                    onChange={(e) => setEditedReason(e.target.value)}
                    className="w-full border border-border rounded-md px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="price">Price</option>
                    <option value="bug">Bug</option>
                    <option value="missing_feature">Missing Feature</option>
                    <option value="competitor">Competitor</option>
                    <option value="never_activated">Never Activated</option>
                    <option value="silent_rescue">Silent Rescue</option>
                    <option value="other">Other</option>
                  </select>
                  {editedReason !== selectedCase.reason && (
                    <p className="text-xs text-green-600 mt-1">Reason override will be applied</p>
                  )}
                </div>
                <p className="text-muted-foreground"><strong>Confidence:</strong> {Math.round(selectedCase.confidence * 100)}%</p>
                <p className="text-muted-foreground"><strong>Trigger:</strong> {selectedCase.triggerType}</p>
                <div className="mt-2">
                  <strong>Evidence:</strong>
                  <ul className="list-disc list-inside mt-1">
                    {selectedCase.evidence.map((e, i) => (
                      <li key={i} className="text-sm text-muted-foreground">{e}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold mb-2">Email Draft</h3>
              <div className="bg-muted/50 p-4 rounded-md border border-border space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-muted-foreground">Subject</label>
                  <input
                    type="text"
                    value={editedSubject}
                    onChange={(e) => setEditedSubject(e.target.value)}
                    className="w-full border border-border rounded-md px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-muted-foreground">Body</label>
                  <textarea
                    value={editedBody}
                    onChange={(e) => setEditedBody(e.target.value)}
                    rows={10}
                    className="w-full border border-border rounded-md px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleApprove}
                className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={editedReason === 'payment_failed'}
              >
                Approve & Send
              </button>
              <button
                onClick={handleReject}
                className="px-6 py-2 bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90 font-medium transition-colors"
              >
                Reject
              </button>
              <button
                onClick={() => handleSnooze(4)}
                className="px-6 py-2 bg-background border border-border rounded-md hover:bg-accent font-medium transition-colors"
              >
                Snooze 4h
              </button>
              <button
                onClick={() => handleSnooze(24)}
                className="px-6 py-2 bg-background border border-border rounded-md hover:bg-accent font-medium transition-colors"
              >
                Snooze 24h
              </button>
              {editedReason === 'payment_failed' && (
                <p className="text-sm text-muted-foreground self-center">
                  Cannot send payment_failed cases. Override reason or reject.
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            Select a case to review
          </div>
        )}
      </div>
    </div>
  );
}

function PasswordGate({ onUnlock }: { onUnlock: () => void }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const response = await fetch('/api/queue/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });

    if (response.ok) {
      onUnlock();
    } else {
      setError(true);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <Card className="p-8 max-w-md w-full">
        <h1 className="font-display text-display-md mb-6 font-normal text-center">
          Queue Access
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="password" className="block font-mono text-sm uppercase tracking-wider mb-2">
              Password
            </label>
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(false);
              }}
              className="w-full"
            />
            {error && (
              <p className="mt-2 text-sm text-destructive">
                Invalid password
              </p>
            )}
          </div>
          <Button type="submit" variant="default" className="w-full">
            Access queue
          </Button>
        </form>
      </Card>
    </div>
  );
}

function QueuePageContent() {
  const searchParams = useSearchParams();
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [requiresAuth, setRequiresAuth] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const keyParam = searchParams.get('key');
      
      const response = await fetch('/api/queue/auth', {
        method: 'GET',
        headers: keyParam ? { 'x-queue-key': keyParam } : {},
      });

      if (response.ok) {
        const data = await response.json();
        if (data.requiresAuth) {
          setRequiresAuth(true);
          if (data.authenticated) {
            setIsUnlocked(true);
          }
        } else {
          setRequiresAuth(false);
          setIsUnlocked(true);
        }
      } else {
        setRequiresAuth(true);
      }
    };

    checkAuth();
  }, [searchParams]);

  if (requiresAuth === null) {
    return <div className="min-h-screen bg-background" />;
  }

  if (requiresAuth && !isUnlocked) {
    return <PasswordGate onUnlock={() => setIsUnlocked(true)} />;
  }

  return <QueueContent />;
}

export default function QueuePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <QueuePageContent />
    </Suspense>
  );
}
