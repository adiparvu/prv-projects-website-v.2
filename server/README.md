# PRV Shop — Stripe (live payments)

## Quick start (local)

```bash
cd server
npm install
export STRIPE_SECRET_KEY=sk_test_...   # from dashboard.stripe.com
npm start                              # http://localhost:8787
```

In `js/site-config.js`:

```js
shop: {
  apiBase: "http://localhost:8787",
  stripePublishableKey: "pk_test_...",  // or pk_live_... for production
  currency: "EUR",
  locale: "ro-BE",
},
```

## Endpoints

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/v1/health` | Health + Stripe configured |
| POST | `/v1/shop/checkout/session` | Stripe Checkout redirect |
| POST | `/v1/shop/checkout/payment-intent` | Payment Element (embedded) |

## Deploy

Deploy `server/shop-stripe-api.mjs` to any Node host (Railway, Fly.io, VPS). Set env:

- `STRIPE_SECRET_KEY` — **required** (`sk_live_...` for production)
- `PORT` — optional (default 8787)

Point `PRV_CONFIG.shop.apiBase` to your deployed URL (no trailing slash).

## Payment methods

Enable in Stripe Dashboard: Cards, Bancontact, PayPal, Apple Pay. Checkout Session uses `payment_method_types` from the frontend payload.

## Security

- Never commit secret keys. Use env vars only.
- Restrict CORS to your domain in production.
- Validate order totals server-side before creating sessions (extend `shop-stripe-api.mjs`).
