# Stripe Retention Agent - API Examples

## Testing the API with curl

### 1. List Pending Cases

```bash
curl http://localhost:3000/api/queue?state=pending&limit=10
```

### 2. Get a Specific Case

```bash
curl http://localhost:3000/api/queue/CASE_ID
```

### 3. Approve a Case

```bash
curl -X PATCH http://localhost:3000/api/queue/CASE_ID \
  -H "Content-Type: application/json" \
  -d '{
    "state": "approved"
  }'
```

### 4. Approve with Edited Email

```bash
curl -X PATCH http://localhost:3000/api/queue/CASE_ID \
  -H "Content-Type: application/json" \
  -d '{
    "state": "edited_approved",
    "subjectDraft": "Custom subject line",
    "bodyDraft": "Custom email body..."
  }'
```

### 5. Reject a Case

```bash
curl -X PATCH http://localhost:3000/api/queue/CASE_ID \
  -H "Content-Type: application/json" \
  -d '{
    "state": "rejected",
    "overrideReason": "Not a good fit for retention"
  }'
```

### 6. Snooze a Case

```bash
curl -X PATCH http://localhost:3000/api/queue/CASE_ID \
  -H "Content-Type: application/json" \
  -d '{
    "state": "snoozed"
  }'
```

## Stripe CLI Test Commands

### Trigger Subscription Cancellation

```bash
# Basic cancellation
stripe trigger customer.subscription.deleted

# Cancellation with price feedback
stripe subscriptions update sub_XXX \
  --cancel_at_period_end=true \
  --cancellation_details[feedback]=too_expensive \
  --cancellation_details[comment]="Too expensive for my budget"

# Cancellation with bug feedback
stripe subscriptions update sub_XXX \
  --cancel_at_period_end=true \
  --cancellation_details[comment]="Too many bugs in the app"
```

### Trigger Invoice Events

```bash
# Upcoming invoice
stripe trigger invoice.upcoming

# Payment failed
stripe trigger invoice.payment_failed
```

### Listen to Webhook Events

```bash
# Forward to local dev server
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Filter specific events
stripe listen \
  --events customer.subscription.updated,customer.subscription.deleted,invoice.upcoming \
  --forward-to localhost:3000/api/webhooks/stripe
```

### View Webhook Logs

```bash
# Real-time event tail
stripe events tail

# List recent events
stripe events list --limit 10
```

## Database Seed

To populate the database with demo cases for testing:

```bash
npx tsx prisma/seed.ts
```

This creates 3 demo retention cases:
1. **Price** - $49.99 MRR, 90 days tenure
2. **Never Activated** - $19.99 MRR, 30 days tenure
3. **Bug** - $199.99 MRR, 180 days tenure

## Example Responses

### Queue List Response

```json
{
  "cases": [
    {
      "id": "clx...",
      "customerId": "cus_...",
      "customerEmail": "user@example.com",
      "plan": "Pro Plan",
      "mrr": 49.99,
      "tenureDays": 90,
      "reason": "price",
      "confidence": 0.90,
      "evidence": ["Price-related cancellation feedback"],
      "recommendedSequence": "discount_offer",
      "subjectDraft": "Special offer just for you",
      "bodyDraft": "Hi there...",
      "state": "pending",
      "createdAt": "2024-08-12T10:00:00.000Z",
      "updatedAt": "2024-08-12T10:00:00.000Z"
    }
  ],
  "total": 1,
  "limit": 50,
  "offset": 0
}
```

### Update Case Response

```json
{
  "id": "clx...",
  "customerId": "cus_...",
  "customerEmail": "user@example.com",
  "state": "approved",
  "reviewedAt": "2024-08-12T10:05:00.000Z",
  ...
}
```
