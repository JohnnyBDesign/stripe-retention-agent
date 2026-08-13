# Signal Product Requirements

## Product Wedge
Signal is a churn agent for B2B SaaS with Stripe subscriptions. It classifies cancel reasons, drafts retention emails, and waits for human approval before enrolling customers in Resend playbooks.

**Not a cancel widget. Not auto-send. HITL-first.**

## Core Value Props
1. **Classification**: LLM + context → `ret_price`, `ret_bugs`, `ret_competitor`, `ret_never_activated`, `silent_rescue`
2. **HITL Approval**: Every enroll requires human review (like a teammate)
3. **Resend Segments**: Enrolls into segments (not tags)
4. **No Auto-Sends**: Draft first, approve second, send third

## CTAs (Locked)
Primary: **"Start with Stripe keys → get your first HITL card"**

Secondary: **"Apply for founding — 50% off 90 days after first successful enroll"**

## Pricing (Locked)
- **Starter**: $99/mo
  - ≤100 approved enrolls/mo
  - 1 HITL seat
  - Resend segments
  - Email support

- **Growth**: $249/mo (highlighted)
  - ≤500 approved enrolls/mo
  - 3 HITL seats
  - **Priority support**
  - Resend segments

**Founding discount**: 50% off for 90 days after first successful enroll
**Annual**: 2 months free

## Copy Guidelines

### Voice & Tone
- **Technical, not cute**: Speak to engineers and technical founders
- **Soft claims only**: "Signal understands why they're leaving" not "Signal saves 40% of churn"
- **No fake metrics**: Real data or no data
- **Direct, not salesy**: No "revolutionary" or "game-changing"

### Terms to Use
- HITL (Human-in-the-loop)
- Segments (not tags)
- Churn agent (not "churn prevention tool")
- Approve/enroll (not "activate" or "trigger")
- Classification (not "detection" or "analysis")

### Terms to Avoid
- Cancel widget
- Auto-send / Automatic
- AI-powered (implied, not stated)
- Revolutionary / Game-changing
- Tags (use "segments")
- Save rate / Retention rate (unless real data)

## Anti-References (Banned Elements)

### Visual
- ❌ Mascot (face.svg, face.png, rainbow arcs)
- ❌ Cute illustrations for B2B SaaS
- ❌ Purple gradients
- ❌ Glassmorphism
- ❌ 3D elements or depth effects

### Copy
- ❌ "Meet [mascot name]"
- ❌ Fake testimonials
- ❌ Made-up metrics
- ❌ "Join 10,000+ companies" (unless true)

### UX
- ❌ Pulsing notification dots
- ❌ Pop-up modals on landing
- ❌ Auto-play videos
- ❌ Chatbot widgets on first visit

## Logo Requirements
**Text-only wordmark: "Signal"**

No icon. No mascot. No face. No decorative elements.

Clean, readable, in primary font (Geist Sans or Inter), semibold weight.

## Marketing Page Structure
1. **Nav**: Logo (text), Product/How/Pricing links, CTA button
2. **Hero**: H1 "Signal" (text only), subhead, 2 CTAs, trust line
3. **Product Window**: macOS-style HITL card preview
4. **Why Us**: HITL approval explanation
5. **How It Works**: 4 steps (Stripe fires → classify → approve → enroll)
6. **Reasons**: Classified reason tags (no mascot icons)
7. **Pricing**: 2 plans, transparent, founding discount note
8. **Final CTA**: "Get your first HITL card this week"
9. **Footer**: Text logo, product/company/legal links

## /queue Page
Keep functional. Apply same design tokens (canvas, surface, line, ink). No mascot references.
