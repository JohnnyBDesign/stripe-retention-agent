'use client';

import { useState } from 'react';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: 'Do I need to connect an ESP like Resend or SendGrid?',
      answer: 'No. Sending is included. Signal handles email delivery. Replies go directly to you.',
    },
    {
      question: 'How does Signal classify churn reasons?',
      answer: 'Signal uses an LLM to analyze Stripe metadata, cancellation feedback, and subscription history to classify cancellations into categories like ret_price, ret_bugs, ret_competitor, ret_never_activated, or silent_rescue.',
    },
    {
      question: 'What happens if I don\'t approve a save?',
      answer: 'Nothing. Every email requires your explicit approval. If you skip or ignore a draft, Signal never sends it.',
    },
    {
      question: 'Is Signal made by Stripe?',
      answer: 'No. Signal is an independent product built for SaaS founders who bill on Stripe. Not affiliated with Stripe.',
    },
    {
      question: 'Can I edit the save emails before they go out?',
      answer: 'Yes. Every draft appears in your approval queue where you can edit, skip, or approve before Signal sends.',
    },
    {
      question: 'What if I need custom volume or features?',
      answer: 'Contact us for custom plans with higher send limits, dedicated support, or custom terms.',
    },
  ];

  return (
    <section className="relative py-32 px-6 md:px-8 bg-panel">
      <div className="mx-auto max-w-3xl">
        <div className="mb-16 text-center">
          <p className="font-nav text-[11px] uppercase tracking-[0.1em] text-muted-foreground mb-6">
            {'{FAQ}'}
          </p>
          <h2 className="font-body text-[48px] leading-[1.1] font-normal tracking-tight text-white">
            Frequently asked questions
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-canvas rounded-sm border border-border/50 overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full text-left p-6 flex items-center justify-between hover:bg-white/5 transition"
              >
                <span className="font-body text-[18px] text-white pr-8">
                  {faq.question}
                </span>
                <span className="text-white text-[24px] flex-shrink-0">
                  {openIndex === index ? '−' : '+'}
                </span>
              </button>
              {openIndex === index && (
                <div className="px-6 pb-6">
                  <p className="font-body text-[16px] leading-relaxed text-muted-foreground">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
