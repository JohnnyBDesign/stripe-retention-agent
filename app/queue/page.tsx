'use client';

import { useEffect, useState } from 'react';

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
  createdAt: string;
}

export default function QueuePage() {
  const [cases, setCases] = useState<RetentionCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCase, setSelectedCase] = useState<RetentionCase | null>(null);
  const [editedSubject, setEditedSubject] = useState('');
  const [editedBody, setEditedBody] = useState('');

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
  };

  const handleApprove = async () => {
    if (!selectedCase) return;

    const isEdited = editedSubject !== selectedCase.subjectDraft || editedBody !== selectedCase.bodyDraft;

    try {
      await fetch(`/api/queue/${selectedCase.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          state: isEdited ? 'edited_approved' : 'approved',
          subjectDraft: editedSubject,
          bodyDraft: editedBody,
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

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="w-1/3 border-r bg-white overflow-y-auto">
        <div className="p-4 border-b bg-gray-100">
          <h1 className="text-xl font-bold">Retention Queue</h1>
          <p className="text-sm text-gray-600">{cases.length} pending cases</p>
        </div>
        
        <div className="divide-y">
          {cases.map((c) => (
            <div
              key={c.id}
              onClick={() => selectCase(c)}
              className={`p-4 cursor-pointer hover:bg-gray-50 ${
                selectedCase?.id === c.id ? 'bg-blue-50' : ''
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">{c.customerEmail}</p>
                  <p className="text-sm text-gray-600">{c.plan}</p>
                </div>
                <span className="px-2 py-1 text-xs rounded bg-yellow-100 text-yellow-800">
                  {c.reason}
                </span>
              </div>
              <div className="mt-2 flex gap-4 text-sm text-gray-600">
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
              <h2 className="text-2xl font-bold mb-2">{selectedCase.customerEmail}</h2>
              <div className="flex gap-4 text-sm text-gray-600">
                <span>Customer ID: {selectedCase.customerId}</span>
                <span>Plan: {selectedCase.plan}</span>
                <span>${selectedCase.mrr.toFixed(2)} MRR</span>
                <span>{selectedCase.tenureDays} days tenure</span>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold mb-2">Classification</h3>
              <div className="bg-white p-4 rounded border">
                <p><strong>Reason:</strong> {selectedCase.reason}</p>
                <p><strong>Confidence:</strong> {Math.round(selectedCase.confidence * 100)}%</p>
                <div className="mt-2">
                  <strong>Evidence:</strong>
                  <ul className="list-disc list-inside mt-1">
                    {selectedCase.evidence.map((e, i) => (
                      <li key={i} className="text-sm">{e}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold mb-2">Email Draft</h3>
              <div className="bg-white p-4 rounded border space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Subject</label>
                  <input
                    type="text"
                    value={editedSubject}
                    onChange={(e) => setEditedSubject(e.target.value)}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Body</label>
                  <textarea
                    value={editedBody}
                    onChange={(e) => setEditedBody(e.target.value)}
                    rows={10}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleApprove}
                className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Approve & Enroll in Resend
              </button>
              <button
                onClick={handleReject}
                className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Reject
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            Select a case to review
          </div>
        )}
      </div>
    </div>
  );
}
