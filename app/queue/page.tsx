'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

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

export default function QueuePage() {
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
    return <div className="p-8 bg-void text-chalk min-h-screen">Loading...</div>;
  }

  return (
    <div className="flex h-screen bg-void">
      <div className="w-1/3 border-r border-line bg-panel overflow-y-auto">
        <div className="p-4 border-b border-line bg-void">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-xl font-bold text-chalk">Retention Queue</h1>
            <Link href="/" className="text-sm text-mute hover:text-chalk transition-colors">
              ← Home
            </Link>
          </div>
          <p className="text-sm text-mute">{cases.length} pending cases</p>
        </div>
        
        <div className="divide-y divide-line">
          {cases.map((c) => (
            <div
              key={c.id}
              onClick={() => selectCase(c)}
              className={`p-4 cursor-pointer hover:bg-void transition-colors ${
                selectedCase?.id === c.id ? 'bg-void border-l-2 border-lime' : ''
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-chalk">{c.customerEmail}</p>
                  <p className="text-sm text-mute">{c.plan}</p>
                </div>
                <span className="px-2 py-1 text-xs rounded bg-lime/20 text-lime border border-lime/30">
                  {c.reason}
                </span>
              </div>
              <div className="mt-2 flex gap-4 text-sm text-mute">
                <span>${c.mrr.toFixed(2)} MRR</span>
                <span>{c.tenureDays}d tenure</span>
                <span>{Math.round(c.confidence * 100)}% conf</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-void">
        {selectedCase ? (
          <div className="p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2 text-chalk">{selectedCase.customerEmail}</h2>
              <div className="flex gap-4 text-sm text-mute">
                <span>Customer ID: {selectedCase.customerId}</span>
                <span>Plan: {selectedCase.plan}</span>
                <span>${selectedCase.mrr.toFixed(2)} MRR</span>
                <span>{selectedCase.tenureDays} days tenure</span>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold mb-2 text-chalk">Classification</h3>
              <div className="bg-panel p-4 rounded-2xl border border-line space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-1 text-mute">Churn Reason</label>
                  <select
                    value={editedReason}
                    onChange={(e) => setEditedReason(e.target.value)}
                    className="w-full border border-line rounded-2xl px-3 py-2 bg-void text-chalk focus:outline-none focus:border-lime"
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
                    <p className="text-xs text-lime mt-1">Reason override will be applied</p>
                  )}
                </div>
                <p className="text-mute"><strong className="text-chalk">Confidence:</strong> {Math.round(selectedCase.confidence * 100)}%</p>
                <p className="text-mute"><strong className="text-chalk">Trigger:</strong> {selectedCase.triggerType}</p>
                <div className="mt-2">
                  <strong className="text-chalk">Evidence:</strong>
                  <ul className="list-disc list-inside mt-1">
                    {selectedCase.evidence.map((e, i) => (
                      <li key={i} className="text-sm text-mute">{e}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold mb-2 text-chalk">Email Draft</h3>
              <div className="bg-panel p-4 rounded-2xl border border-line space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-mute">Subject</label>
                  <input
                    type="text"
                    value={editedSubject}
                    onChange={(e) => setEditedSubject(e.target.value)}
                    className="w-full border border-line rounded-2xl px-3 py-2 bg-void text-chalk focus:outline-none focus:border-lime"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-mute">Body</label>
                  <textarea
                    value={editedBody}
                    onChange={(e) => setEditedBody(e.target.value)}
                    rows={10}
                    className="w-full border border-line rounded-2xl px-3 py-2 bg-void text-chalk focus:outline-none focus:border-lime"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleApprove}
                className="px-6 py-2 bg-cyan text-void rounded-2xl hover:bg-cyan/90 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={editedReason === 'payment_failed' || editedReason === 'other'}
              >
                Approve & Enroll in Resend
              </button>
              <button
                onClick={handleReject}
                className="px-6 py-2 bg-danger text-white rounded-2xl hover:bg-danger/90 font-medium transition-colors"
              >
                Reject
              </button>
              <button
                onClick={() => handleSnooze(4)}
                className="px-6 py-2 bg-panel border border-line text-chalk rounded-2xl hover:border-lime font-medium transition-colors"
              >
                Snooze 4h
              </button>
              <button
                onClick={() => handleSnooze(24)}
                className="px-6 py-2 bg-panel border border-line text-chalk rounded-2xl hover:border-lime font-medium transition-colors"
              >
                Snooze 24h
              </button>
              {(editedReason === 'payment_failed' || editedReason === 'other') && (
                <p className="text-sm text-lime self-center">
                  Cannot auto-enroll {editedReason} cases. Override reason or reject.
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-mute">
            Select a case to review
          </div>
        )}
      </div>
    </div>
  );
}
