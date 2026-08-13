'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

interface User {
  id: string;
  email: string;
  name: string | null;
  company: string | null;
  replyToEmail: string | null;
  createdAt: string;
}

interface StripeConnection {
  id: string;
  keyLast4: string;
  stripeAccountId: string | null;
  isActive: boolean;
  createdAt: string;
}

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
  createdAt: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [stripeConnection, setStripeConnection] = useState<StripeConnection | null>(null);
  const [cases, setCases] = useState<RetentionCase[]>([]);
  const [selectedCase, setSelectedCase] = useState<RetentionCase | null>(null);
  const [view, setView] = useState<'queue' | 'settings'>('queue');
  
  // Settings form
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [replyToEmail, setReplyToEmail] = useState('');
  const [settingsError, setSettingsError] = useState('');
  const [settingsSaving, setSettingsSaving] = useState(false);
  
  // Stripe connection form
  const [stripeKey, setStripeKey] = useState('');
  const [stripeError, setStripeError] = useState('');
  const [stripeConnecting, setStripeConnecting] = useState(false);
  
  // Case editing
  const [editedSubject, setEditedSubject] = useState('');
  const [editedBody, setEditedBody] = useState('');
  const [editedReason, setEditedReason] = useState('');

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/verify');
      const data = await response.json();

      if (!data.authenticated) {
        router.push('/login');
        return;
      }

      setUser(data.user);
      setName(data.user.name || '');
      setCompany(data.user.company || '');
      setReplyToEmail(data.user.replyToEmail || data.user.email);
      
      await fetchStripeConnection();
      await fetchCases();
      
      setLoading(false);
    } catch (error) {
      console.error('Auth check failed:', error);
      router.push('/login');
    }
  };

  const fetchStripeConnection = async () => {
    try {
      const response = await fetch('/api/user/stripe');
      const data = await response.json();
      setStripeConnection(data.connection);
    } catch (error) {
      console.error('Failed to fetch Stripe connection:', error);
    }
  };

  const fetchCases = async () => {
    try {
      const response = await fetch('/api/user/cases?state=pending');
      const data = await response.json();
      setCases(data.cases || []);
    } catch (error) {
      console.error('Failed to fetch cases:', error);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsError('');
    setSettingsSaving(true);

    try {
      const response = await fetch('/api/user/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, company, replyToEmail }),
      });

      const data = await response.json();

      if (!response.ok) {
        setSettingsError(data.error || 'Failed to save settings');
        setSettingsSaving(false);
        return;
      }

      setUser(data.user);
      setSettingsSaving(false);
    } catch (err) {
      setSettingsError('An error occurred. Please try again.');
      setSettingsSaving(false);
    }
  };

  const handleConnectStripe = async (e: React.FormEvent) => {
    e.preventDefault();
    setStripeError('');
    setStripeConnecting(true);

    try {
      const response = await fetch('/api/user/stripe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stripeKey }),
      });

      const data = await response.json();

      if (!response.ok) {
        setStripeError(data.error || 'Failed to connect Stripe');
        setStripeConnecting(false);
        return;
      }

      setStripeConnection(data.connection);
      setStripeKey('');
      setStripeConnecting(false);
    } catch (err) {
      setStripeError('An error occurred. Please try again.');
      setStripeConnecting(false);
    }
  };

  const handleDisconnectStripe = async () => {
    if (!confirm('Are you sure you want to disconnect your Stripe account?')) {
      return;
    }

    try {
      await fetch('/api/user/stripe', { method: 'DELETE' });
      setStripeConnection(null);
    } catch (error) {
      console.error('Failed to disconnect Stripe:', error);
    }
  };

  const selectCase = (c: RetentionCase) => {
    setSelectedCase(c);
    setEditedSubject(c.subjectDraft);
    setEditedBody(c.bodyDraft);
    setEditedReason(c.reason);
  };

  const handleApprove = async () => {
    if (!selectedCase) return;

    const isEdited = editedSubject !== selectedCase.subjectDraft || editedBody !== selectedCase.bodyDraft;
    const reasonOverridden = editedReason !== selectedCase.reason;

    try {
      await fetch(`/api/user/cases/${selectedCase.id}`, {
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
      await fetch(`/api/user/cases/${selectedCase.id}`, {
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
      await fetch(`/api/user/cases/${selectedCase.id}`, {
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
    return <div className="min-h-screen bg-background p-8">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-muted/30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-xl font-semibold">Signal</Link>
            <nav className="flex gap-4">
              <button
                onClick={() => setView('queue')}
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  view === 'queue' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Queue
              </button>
              <button
                onClick={() => setView('settings')}
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  view === 'settings' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Settings
              </button>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{user?.email}</span>
            <Button onClick={handleLogout} variant="ghost" size="sm">
              Logout
            </Button>
          </div>
        </div>
      </div>

      {view === 'settings' ? (
        <div className="max-w-4xl mx-auto px-6 py-12">
          <h1 className="text-3xl font-semibold mb-8">Settings</h1>

          <div className="space-y-8">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Profile</h2>
              <form onSubmit={handleSaveSettings} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <Input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="bg-muted"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Email cannot be changed</p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Name</label>
                  <Input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Company</label>
                  <Input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Your company"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Reply-To Email</label>
                  <Input
                    type="email"
                    value={replyToEmail}
                    onChange={(e) => setReplyToEmail(e.target.value)}
                    placeholder="replies@yourcompany.com"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    This email will be used as Reply-To when sending retention emails
                  </p>
                </div>

                {settingsError && (
                  <div className="bg-destructive/10 border border-destructive/20 rounded-md p-3">
                    <p className="text-sm text-destructive">{settingsError}</p>
                  </div>
                )}

                <Button type="submit" disabled={settingsSaving}>
                  {settingsSaving ? 'Saving...' : 'Save Changes'}
                </Button>
              </form>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Stripe Connection</h2>

              {stripeConnection ? (
                <div className="space-y-4">
                  <div className="bg-muted/50 p-4 rounded-md border border-border">
                    <p className="text-sm mb-2">
                      <strong>Status:</strong> <span className="text-green-600">Connected</span>
                    </p>
                    <p className="text-sm mb-2">
                      <strong>Key:</strong> <code className="font-mono">sk_***{stripeConnection.keyLast4}</code>
                    </p>
                    {stripeConnection.stripeAccountId && (
                      <p className="text-sm">
                        <strong>Account ID:</strong> <code className="font-mono text-xs">{stripeConnection.stripeAccountId}</code>
                      </p>
                    )}
                  </div>
                  <Button onClick={handleDisconnectStripe} variant="destructive">
                    Disconnect Stripe
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleConnectStripe} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Stripe Restricted API Key</label>
                    <Input
                      type="password"
                      value={stripeKey}
                      onChange={(e) => setStripeKey(e.target.value)}
                      placeholder="sk_live_..."
                      required
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Paste your Stripe restricted API key. Your key is encrypted at rest.
                    </p>
                  </div>

                  {stripeError && (
                    <div className="bg-destructive/10 border border-destructive/20 rounded-md p-3">
                      <p className="text-sm text-destructive">{stripeError}</p>
                    </div>
                  )}

                  <Button type="submit" disabled={stripeConnecting}>
                    {stripeConnecting ? 'Connecting...' : 'Connect Stripe'}
                  </Button>
                </form>
              )}
            </Card>
          </div>
        </div>
      ) : !stripeConnection ? (
        <div className="max-w-4xl mx-auto px-6 py-20 text-center">
          <div className="mb-8">
            <h1 className="text-3xl font-semibold mb-4">Welcome to Signal</h1>
            <p className="text-lg text-muted-foreground mb-8">
              Connect your Stripe account to start receiving retention cases
            </p>
          </div>

          <Card className="p-8 max-w-md mx-auto">
            <h2 className="text-xl font-semibold mb-4">Connect Stripe</h2>
            <form onSubmit={handleConnectStripe} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-left">Stripe Restricted API Key</label>
                <Input
                  type="password"
                  value={stripeKey}
                  onChange={(e) => setStripeKey(e.target.value)}
                  placeholder="sk_live_..."
                  required
                />
                <p className="text-xs text-muted-foreground mt-1 text-left">
                  Your key is encrypted at rest. Only last 4 characters are shown.
                </p>
              </div>

              {stripeError && (
                <div className="bg-destructive/10 border border-destructive/20 rounded-md p-3">
                  <p className="text-sm text-destructive">{stripeError}</p>
                </div>
              )}

              <Button type="submit" className="w-full" disabled={stripeConnecting}>
                {stripeConnecting ? 'Connecting...' : 'Connect Stripe'}
              </Button>
            </form>
          </Card>
        </div>
      ) : (
        <div className="flex h-[calc(100vh-73px)]">
          <div className="w-1/3 border-r border-border overflow-y-auto">
            <div className="p-4 border-b border-border bg-muted/50">
              <h2 className="text-lg font-semibold mb-1">Your Queue</h2>
              <p className="text-sm text-muted-foreground">{cases.length} pending cases</p>
            </div>
            
            <div className="divide-y divide-border">
              {cases.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  <p>No pending cases</p>
                  <p className="text-sm mt-2">Cases will appear here when customers cancel</p>
                </div>
              ) : (
                cases.map((c) => (
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
                ))
              )}
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
                      <label className="block text-sm font-medium mb-1 text-muted-foreground">Body (plain text)</label>
                      <textarea
                        value={editedBody}
                        onChange={(e) => setEditedBody(e.target.value)}
                        rows={10}
                        className="w-full border border-border rounded-md px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring font-mono text-sm"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Plain text only. Reply-To: {user?.replyToEmail || user?.email}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={handleApprove}
                    className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 font-medium transition-colors"
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
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                Select a case to review
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
