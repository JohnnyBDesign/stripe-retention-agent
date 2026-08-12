import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  await prisma.retentionCase.create({
    data: {
      customerId: 'cus_demo_001',
      customerEmail: 'alice@example.com',
      subscriptionId: 'sub_demo_001',
      plan: 'Pro Plan',
      mrr: 49.99,
      tenureDays: 90,
      reason: 'price',
      confidence: 0.90,
      evidence: ['Price-related cancellation feedback', 'Customer comment: "Too expensive"'],
      recommendedSequence: 'discount_offer',
      subjectDraft: 'Special offer just for you',
      bodyDraft: 'Hi Alice,\n\nWe understand pricing is important. Before you go, we\'d like to discuss options that might work better for your budget.\n\nWould you be open to a brief conversation?\n\nBest regards,\nThe Team',
      state: 'pending',
    },
  });

  await prisma.retentionCase.create({
    data: {
      customerId: 'cus_demo_002',
      customerEmail: 'bob@example.com',
      subscriptionId: 'sub_demo_002',
      plan: 'Basic Plan',
      mrr: 19.99,
      tenureDays: 30,
      reason: 'never_activated',
      confidence: 0.85,
      evidence: ['No activation event recorded', 'Subscription tenure: 30 days', 'Still renewing (status: active)'],
      recommendedSequence: 'onboarding_assistance',
      subjectDraft: 'Need help getting started?',
      bodyDraft: 'Hi Bob,\n\nWe noticed you signed up for Basic Plan 30 days ago, but you haven\'t had a chance to get started yet.\n\nWe\'d love to help you get the most out of your subscription. Would you like to schedule a quick onboarding call?\n\nBest regards,\nThe Team',
      state: 'pending',
    },
  });

  await prisma.retentionCase.create({
    data: {
      customerId: 'cus_demo_003',
      customerEmail: 'carol@example.com',
      subscriptionId: 'sub_demo_003',
      plan: 'Enterprise Plan',
      mrr: 199.99,
      tenureDays: 180,
      reason: 'bug',
      confidence: 0.88,
      evidence: ['Technical issues mentioned', 'Customer comment: "Too many bugs lately"'],
      recommendedSequence: 'support_escalation',
      subjectDraft: 'Let us help fix that',
      bodyDraft: 'Hi Carol,\n\nWe\'re sorry you experienced technical issues. That\'s not the experience we want you to have.\n\nOur engineering team would like to investigate and make this right. Can we schedule a time to discuss?\n\nBest regards,\nThe Team',
      state: 'pending',
    },
  });

  console.log('Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
