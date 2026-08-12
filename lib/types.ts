import { z } from 'zod';

export const ChurnReason = z.enum([
  'price',
  'bug',
  'missing_feature',
  'competitor',
  'never_activated',
  'silent_rescue',
  'payment_failed',
  'other',
]);

export type ChurnReason = z.infer<typeof ChurnReason>;

export const CaseState = z.enum([
  'pending',
  'approved',
  'edited_approved',
  'rejected',
  'snoozed',
]);

export type CaseState = z.infer<typeof CaseState>;

export const RetentionCaseSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  customerEmail: z.string().email(),
  subscriptionId: z.string().nullable(),
  plan: z.string(),
  mrr: z.number(),
  tenureDays: z.number(),
  reason: ChurnReason,
  confidence: z.number().min(0).max(1),
  evidence: z.array(z.string()),
  recommendedSequence: z.string().nullable(),
  subjectDraft: z.string(),
  bodyDraft: z.string(),
  state: CaseState,
  overrideReason: z.string().nullable(),
  triggerType: z.string(),
  stripeEventIds: z.array(z.string()),
  slaDueAt: z.date().nullable(),
  snoozeUntil: z.date().nullable(),
  reviewedAt: z.date().nullable(),
  reviewedBy: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type RetentionCase = z.infer<typeof RetentionCaseSchema>;

export const ClassificationResult = z.object({
  reason: ChurnReason,
  confidence: z.number().min(0).max(1),
  evidence: z.array(z.string()),
  recommendedSequence: z.string().nullable(),
  subjectDraft: z.string(),
  bodyDraft: z.string(),
});

export type ClassificationResult = z.infer<typeof ClassificationResult>;

export const SubscriptionInfo = z.object({
  customerId: z.string(),
  customerEmail: z.string(),
  subscriptionId: z.string(),
  plan: z.string(),
  mrr: z.number(),
  status: z.string(),
  currentPeriodEnd: z.date(),
  createdAt: z.date(),
  canceledAt: z.date().nullable(),
  cancelDetails: z.any().nullable(),
});

export type SubscriptionInfo = z.infer<typeof SubscriptionInfo>;
