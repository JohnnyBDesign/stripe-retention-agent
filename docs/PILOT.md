# Pilot Setup in 15 Minutes

Railway-only deployment guide for JohnnyBDesign/stripe-retention-agent.

## Steps

1. **Create Railway project**
   - Sign in to [Railway](https://railway.app)
   - Click "New Project" → "Deploy from GitHub repo"

2. **Connect repository**
   - Authorize Railway for GitHub (if needed)
   - Select `JohnnyBDesign/stripe-retention-agent`
   - Select `main` branch
   - Railway auto-detects Next.js and starts build

3. **Add Postgres database**
   - In project view, click "New"
   - Select "Database" → "Add PostgreSQL"
   - Railway auto-injects `DATABASE_URL` environment variable

4. **Configure environment variables**
   - Go to your service → "Variables" tab
   - Add the following:
     ```
     STRIPE_SECRET_KEY=sk_test_...
     STRIPE_WEBHOOK_SECRET=whsec_...
     RESEND_API_KEY=re_...
     ```
   - Use Stripe **test mode** keys
   - Leave `STRIPE_WEBHOOK_SECRET` blank initially (step 7)
   - Resend: no audience ID needed; segments `ret_*` auto-created

5. **Deploy**
   - Railway triggers deployment automatically
   - Wait for build to complete (~2-3 min)
   - Click "Generate Domain" to get your public URL
   - Copy the domain (e.g., `yourapp.railway.app`)

6. **Configure Stripe webhook**
   - Go to [Stripe Dashboard](https://dashboard.stripe.com/test/webhooks)
   - Click "Add endpoint"
   - Set endpoint URL: `https://<your-domain>/api/webhooks/stripe`
   - Select events to listen to:
     - `customer.subscription.deleted`
     - `customer.subscription.updated`
     - `charge.refunded`
     - `invoice.payment_failed`
     - `invoice.upcoming`
   - Click "Add endpoint"
   - Copy the **Signing secret** (starts with `whsec_`)

7. **Add webhook secret and redeploy**
   - Back in Railway → Variables tab
   - Update `STRIPE_WEBHOOK_SECRET` with the `whsec_...` value
   - Click "Deploy" or push to `main` to trigger redeploy
   - Wait for deployment to complete

8. **Test the HITL queue**
   - Open `https://<your-domain>/` in browser
   - You should see the landing page
   - Navigate to `/queue` for human-in-the-loop approval interface

9. **Create test cancellation**
   - Use Stripe CLI or Dashboard to cancel a test subscription with feedback
   - Check `/queue` - case should appear as `pending`

10. **Approve retention case**
    - Review customer info, MRR, tenure, and classification
    - Edit email draft if needed
    - Click "Approve"
    - Contact auto-enrolled in Resend segment (e.g., `ret_price`)

## Out of Scope (Pilot)

- **No cancellation UI**: Customers must cancel via Stripe Dashboard or API
- **No recovery inbox**: Replies go to sender's email, not tracked in system
- **No A/B testing**: Single email draft per case
- **No snooze reminders**: Snooze state saved but no follow-up automation

## Troubleshooting

**Build fails with Prisma error:**
- Check that `DATABASE_URL` is set (Postgres plugin must be added)
- Verify `postinstall` script runs `prisma generate`

**Webhook signature verification fails:**
- Confirm `STRIPE_WEBHOOK_SECRET` matches Stripe Dashboard signing secret
- Ensure no extra spaces/newlines when pasting `whsec_...`

**No retention cases appearing:**
- Check Railway logs for webhook errors
- Verify Stripe webhook endpoint is active and has correct URL
- Use Stripe CLI to test: `stripe trigger customer.subscription.deleted`

**Resend enrollment fails:**
- Verify `RESEND_API_KEY` is correct
- Check Railway logs for Resend API errors
- Segments are auto-created; no manual setup needed

## Success Criteria

✅ Stripe webhook receives events
✅ Classifier creates retention cases
✅ HITL queue shows pending cases
✅ Approval enrolls contact in Resend segment
