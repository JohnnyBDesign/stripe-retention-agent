# Stripe Retention Agent

An agent-native Stripe retention product that intelligently classifies churn reasons, creates human-in-the-loop approval queues, and enrolls customers in recovery sequences via Resend.

## Features

- **Stripe Webhook Ingestion**: Signed webhooks with idempotent event storage
- **Churn Classification**: Heuristic v0 classifier with 7 reason types + payment_failed stub
- **HITL Queue**: Human-in-the-loop approval queue with minimal UI
- **Resend Integration**: Automatic enrollment via reason-specific segments
- **Silent Rescue**: Detects inactive users before renewal
- **Never-Activated Detection**: Identifies users who never engaged but keep paying

## Churn Taxonomy

### Primary Reasons
- `price` - Too expensive, budget constraints
- `bug` - Technical issues, product problems
- `missing_feature` - Required functionality not available
- `competitor` - Switched to alternative service
- `never_activated` - Signed up but never used (≥7d tenure, no activation)
- `silent_rescue` - No activity for 14d (monthly) or 45d (annual), renewal imminent
- `other` - Unclassified or no feedback

### Secondary
- `payment_failed` - Dunning stub only (not a retention flow)

## Architecture

```
┌─────────────┐      ┌──────────────┐      ┌────────────┐
│   Stripe    │─────▶│   Webhooks   │─────▶│ Classifier │
│  Webhooks   │      │  + Idempotent│      │ (Heuristic)│
└─────────────┘      └──────────────┘      └────────────┘
                                                   │
                                                   ▼
┌─────────────┐      ┌──────────────┐      ┌────────────┐
│   Resend    │◀─────│     HITL     │◀─────│  Database  │
│  (Segments) │      │  Approval UI │      │ (Postgres) │
└─────────────┘      └──────────────┘      └────────────┘
```

## Setup

### Prerequisites
- Node.js 20+
- PostgreSQL 15+
- Stripe account with test mode
- Resend account

### Installation

1. **Clone and install**
   ```bash
   git clone <repo>
   cd stripe-retention-agent
   npm install
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your credentials:
   ```env
   # Stripe (test mode)
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_WEBHOOK_SECRET=whsec_...

   # Resend
   RESEND_API_KEY=re_...

   # Database
   DATABASE_URL=postgresql://user:password@localhost:5432/retention_agent
   ```

3. **Setup database**
   ```bash
   npm run db:push
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```
   App runs at http://localhost:3000

5. **Forward Stripe webhooks**
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```
   Copy the webhook signing secret to your `.env`:
   ```env
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```

## Stripe Configuration

### Required API Key Scopes
Create a restricted key with these permissions:
- `Customers`: Read
- `Subscriptions`: Read
- `Invoices`: Read
- `Charges`: Read
- `Events`: Read

### Webhook Events to Subscribe
Configure these events in your Stripe Dashboard or CLI:
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.payment_failed`
- `invoice.upcoming`
- `charge.refunded`

## Usage

### Happy Path Flow

1. **Subscription Cancellation** - Customer cancels subscription with feedback
2. **Webhook Received** - `/api/webhooks/stripe` receives signed event
3. **Idempotent Storage** - Event stored in DB (duplicate detection)
4. **Classification** - Heuristic classifier analyzes:
   - Cancel details & feedback
   - Tenure duration
   - Activation status
   - Activity patterns
5. **Queue Creation** - Retention case created in `pending` state
6. **HITL Review** - Human reviews in `/queue`:
   - View customer info, MRR, tenure
   - Read classification evidence
   - Edit email draft (subject & body)
   - Approve or reject
7. **Resend Enrollment** - On approval:
   - Contact created/updated in Resend
   - Added to segment by reason (e.g., `ret_price`)
   - Ready for ESP campaign automation

### API Endpoints

#### Webhook Ingestion
```bash
POST /api/webhooks/stripe
Content-Type: application/json
Stripe-Signature: t=...,v1=...

# Webhook payload from Stripe
```

#### List Queue
```bash
GET /api/queue?state=pending&limit=50&offset=0

Response:
{
  "cases": [...],
  "total": 42,
  "limit": 50,
  "offset": 0
}
```

#### Get Case
```bash
GET /api/queue/:id

Response:
{
  "id": "...",
  "customerId": "cus_...",
  "customerEmail": "user@example.com",
  "plan": "Pro Plan",
  "mrr": 29.99,
  "tenureDays": 45,
  "reason": "price",
  "confidence": 0.90,
  "evidence": ["Price-related cancellation feedback"],
  "subjectDraft": "Special offer just for you",
  "bodyDraft": "...",
  "state": "pending",
  ...
}
```

#### Update Case (Approve/Reject)
```bash
PATCH /api/queue/:id
Content-Type: application/json

{
  "state": "approved",
  "subjectDraft": "Updated subject",
  "bodyDraft": "Updated body"
}

# State options: approved | edited_approved | rejected | snoozed
```

### Testing with Stripe CLI

1. **Trigger a subscription cancellation**
   ```bash
   stripe trigger customer.subscription.deleted
   ```

2. **View events in real-time**
   ```bash
   stripe events tail
   ```

3. **Test specific scenarios**
   ```bash
   # Create subscription with cancellation
   stripe subscriptions create \
     --customer cus_test \
     --items[0][price]=price_test \
     --cancel_at_period_end=true \
     --cancellation_details[feedback]=too_expensive \
     --cancellation_details[comment]="Too expensive for my budget"
   ```

## Customer Activity API (Stub)

The classifier needs activation and activity data. Current implementation returns nulls:

```typescript
// lib/stripe/client.ts
export async function getCustomerActivity(customerId: string) {
  // TODO: Integrate with your product analytics
  return {
    lastActiveAt: null,  // Last usage timestamp
    activationAt: null,  // First meaningful action
  };
}
```

**Integration examples:**
- Product DB: Query user events table
- Analytics: Segment, Mixpanel, Amplitude API
- Custom: Webhook receiver for activity events

## Classification Logic

### Never Activated
```typescript
tenure >= 7 days
status in [active, past_due]
activationAt == null
still renewing
```

### Silent Rescue
```typescript
status in [active, past_due]
not canceled/paused
lastActiveAt exists

// Monthly
daysSinceActive >= 14
daysUntilRenewal <= 7

// Annual
daysSinceActive >= 45
daysUntilRenewal <= 30
```

### Feedback-Based
Analyzes `cancellation_details.feedback` and `.comment`:
- `too_expensive` → `price`
- `missing_features` → `missing_feature`
- `switched_service` → `competitor`
- Keywords: "bug", "issue", "problem" → `bug`

## Development

### Run tests
```bash
npm test           # Watch mode
npm run test:ci    # CI mode (single run)
```

### Database management
```bash
npm run db:push       # Push schema changes
npm run db:generate   # Generate Prisma client
npm run db:studio     # Open Prisma Studio
npm run db:migrate    # Create migration
```

### Linting
```bash
npm run lint
```

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── queue/           # HITL API routes
│   │   └── webhooks/        # Stripe webhook handler
│   ├── queue/               # HITL UI page
│   └── page.tsx             # Landing page
├── lib/
│   ├── classifier/          # Churn classification logic
│   ├── resend/             # Resend integration
│   ├── stripe/             # Stripe client & webhooks
│   ├── db.ts               # Prisma client
│   └── types.ts            # Shared types
├── prisma/
│   └── schema.prisma       # Database schema
└── tests/                  # Vitest tests
```

## Resend Segment Convention

Contacts are enrolled in Resend segments on approval. The system automatically creates and manages these segments:
- `ret_price`
- `ret_bug`
- `ret_missing_feature`
- `ret_competitor`
- `ret_never_activated`
- `ret_silent_rescue`
- `ret_payment_failed`
- `ret_other`

**How it works**: When a retention case is approved, the system:
1. Creates the contact in Resend (if not already exists)
2. Ensures the segment exists (creates if missing, cached in memory)
3. Adds the contact to the appropriate segment

Configure email sequences in Resend Dashboard to trigger when contacts are added to these segments.

## Roadmap (v1+)

- [ ] LLM-based classification (interface ready in `classifyChurnWithLLM`)
- [ ] A/B testing for email drafts
- [ ] More ESP integrations (Customer.io, Sendgrid)
- [ ] Snooze logic with reminders
- [ ] Admin bulk actions
- [ ] Analytics dashboard (conversion rates by reason)
- [ ] Webhook retry mechanism
- [ ] Rate limiting

## Security

- Webhook signature verification (Stripe signatures)
- Idempotent event processing (prevents duplicate enrollments)
- Environment variables for secrets (never committed)
- Restricted Stripe API keys (read-only where possible)

## License

MIT

## Contributing

PRs welcome! Please ensure:
1. Tests pass (`npm test`)
2. Linting clean (`npm run lint`)
3. CI green before merge
