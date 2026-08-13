# Signal — Product Requirements

**Locked overnight 2026-08-12 (Johnny / Revenue Lead).** Name: **Signal**.

## Wedge

Stripe-native churn agent: classify **why** they cancel → human **approves** the draft → **Signal sends** the email from **Signal's Resend**.

- **Stripe required.** Onboarding = Stripe only (restricted key + webhooks).
- **Customers never provide a Resend (or any ESP) API key.** $99 / $249 **includes sending**.
- **From:** Signal's Resend. **Reply-To:** founder email. We do **not** run a recovery inbox.
- **HITL is the gate.** No auto-send. Approve / Edit & approve / Reject / Snooze.
- **Scan** (`/scan`) is **free**. Paste read-only restricted key; never stored.
- **Not a cancel widget.** Not SaveMRR. Not $19. No fake recovery %.

## What we sell

1. **Reason brain** — taxonomy: `price` · `bug` · `missing_feature` · `competitor` · `never_activated` · `silent_rescue` · `other` (`ret_*` = internal codes only).
2. **Approve-then-send** — HITL card, then Signal sends the approved subject/body.
3. **Leak scan** — 60s `/scan`: $ leaking / 90d + why they **canceled** (when Stripe has a reason).

## CTAs (locked)

| Surface | Copy | Dest |
| Primary (hero / nav) | **See who's leaving — and why** | `/scan` |
| After scan | **Get these in a queue you approve** | Stripe onboard / `/queue` |
| Secondary | **Apply for founding — 50% off 90 days after first successful send** | `#pricing` |

Queue is **gated**. Do not put "HITL card" or "Stripe keys" in the hero CTA. Do not ask for a Resend key anywhere.

## Pricing (locked)

Scan is free.

- **Starter — $99/mo** — ≤100 **approved sends**/mo · 1 HITL seat · Email support
- **Growth — $249/mo** — ≤500 **approved sends**/mo · 3 HITL seats · **Priority support** (same 4h/1d product SLA)
- **Founding:** 50% off for 90 days after **first successful send**
- **Annual:** 2 months free
- Flat fee. No rev-share. No $19 race.

## `/scan` (free)

- Restricted **read** key (`rk_…`): Customers, Subscriptions, Invoices, Events. In-memory for the request only.
- Report: hero **$X leaking / 90d**; split **failed / cancel / downgrade / leaving-soon**; **why they left $** on classified **voluntary cancels** only.
- **Failed-payment $:** shown, caption "Stripe retries; not Signal v0." Never CTA recover failed payments.
- **Silent / never-activated:** **omitted** (need usage signal post-connect). Do not fake from Stripe-only.
- Write keys rejected. Rate-limited. No HITL rows, no send, no key persistence.

## HITL + send (paid)

Webhook path: `customer.subscription.deleted/updated` (cancel / `cancel_at_period_end`), refunds → classify → queue. SLA 4h cancel/refund, 1 business day silent.

On **Approve / Edit & approve:** send the draft via **Signal Resend**, `Reply-To` = founder. Idempotent per case. Reject/Snooze = no send. SLA breach = escalate, **no auto-send**.

`invoice.payment_failed` = no retention card (dunning stays Stripe).

## Hard out of scope

- Cancel-button UI / JS intercept / Cancel Shield clone
- Customer-provided Resend / Customer.io / Loops keys (BYO ESP **dead**)
- Recovery inbox / we own the reply thread (replies go to founder)
- Fake stats, spots-left, "55% recovery", $19
- Auto-send without HITL
- Treating failed payments as the save product

## Later (not this sale)

Why dashboard (logged-in) · apply coupon/pause in Stripe **after** approve · silent rescue via activity · win-back (still HITL send).

## Copy

**Use:** Signal, approve, send, replies to you, scan, why they canceled, leaking MRR.  
**Kill:** your Resend, BYO ESP, enroll `ret_*` / segments as the product, "no emails from our domain," cancel widget, auto-send, fake metrics.

Voice: technical, founder-to-founder. Soft claims. Real numbers from **this** Stripe key only.

Done when PRODUCT.md on the PR matches this and CI is green.
