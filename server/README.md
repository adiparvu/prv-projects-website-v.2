# PRV Shop API

Node.js backend for live ecommerce: **Stripe**, **webhooks**, **magic-link auth**, **catalog API**, **stock reminders (Resend)**.

## Quick start (local)

```bash
cd server
npm install
cp .env.example .env
# Edit .env — at minimum STRIPE_SECRET_KEY (test), JWT_SECRET, SHOP_PUBLIC_URL
npm start
```

Frontend (`js/site-config.js`):

```js
shop: {
  apiBase: "http://localhost:8787",
  stripePublishableKey: "pk_test_...",
},
```

## Deploy (Railway)

1. New project → deploy from repo, root directory **`server`**
2. Set variables from `.env.example`
3. **Build**: Nixpacks runs `npm install`
4. **Start**: `npm start`
5. Health check: `GET /v1/health`
6. Copy public URL → `PRV_CONFIG.shop.apiBase` (no trailing slash)

### Stripe webhook (required for live orders)

1. Stripe Dashboard → Developers → Webhooks → Add endpoint  
   `https://YOUR-API.up.railway.app/v1/shop/webhooks/stripe`
2. Events: `checkout.session.completed`, `payment_intent.succeeded`
3. Copy signing secret → `STRIPE_WEBHOOK_SECRET`

### Resend (stock reminders + magic link)

1. [resend.com](https://resend.com) → API key → `RESEND_API_KEY`
2. Verify domain → set `EMAIL_FROM=PRV Shop <shop@prvprojects.be>`

## Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `STRIPE_SECRET_KEY` | Live payments | `sk_test_` or `sk_live_` |
| `STRIPE_WEBHOOK_SECRET` | Live orders | `whsec_...` |
| `JWT_SECRET` | Auth | Random 32+ chars |
| `RESEND_API_KEY` | Email | Magic link + stock alerts |
| `EMAIL_FROM` | Email | Verified sender |
| `SHOP_PUBLIC_URL` | Yes | `https://yoursite.com` (no /shop) |
| `API_PUBLIC_URL` | Optional | Public API URL for invoice links |
| `CORS_ORIGIN` | Prod | `https://yoursite.com` |
| `ADMIN_API_KEY` | Admin | Stock PATCH / catalog reload |
| `PORT` | Auto | Railway sets this |

## API endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/v1/health` | Health check |
| GET | `/v1/shop/catalog?lang=ro` | Full catalog (live stock) |
| POST | `/v1/shop/checkout/prepare` | Validate prices, create pending order |
| POST | `/v1/shop/checkout/session` | Stripe Checkout redirect |
| POST | `/v1/shop/checkout/payment-intent` | Payment Element |
| GET | `/v1/shop/checkout/complete?session_id=` | Confirm after redirect |
| POST | `/v1/shop/webhooks/stripe` | Stripe webhooks (raw body) |
| GET | `/v1/shop/orders/:id` | Order (Bearer or `?email=`) |
| POST | `/v1/auth/magic-link` | Send sign-in email |
| GET | `/v1/auth/verify?token=` | Exchange magic token → JWT |
| GET | `/v1/account/orders` | Orders (Bearer) |
| GET | `/v1/account/invoices/:id?format=html` | Invoice HTML |
| POST | `/v1/shop/reminders` | Back-in-stock reminder |
| PATCH | `/v1/admin/stock` | Update stock (`X-Admin-Key`) |

## Anti-tampering

All checkout flows call `validateCartItems()` server-side — prices and stock come from `catalog.json`, not the client.

## Data persistence

Runtime data in `DATA_DIR` (default `server/data/`):

- `orders.json` — orders
- `reminders.json` — stock alerts
- `stock.json` — stock overrides (admin)
- `users.json`, `magic_tokens.json`

Catalog source: `data/shop/catalog.json` (repo root).

## Docker

From repo root:

```bash
docker build -f server/Dockerfile -t prv-shop-api .
docker run -p 8787:8787 --env-file server/.env prv-shop-api
```

## Fly.io

```bash
cd server && fly launch
fly secrets set STRIPE_SECRET_KEY=... STRIPE_WEBHOOK_SECRET=... JWT_SECRET=... RESEND_API_KEY=...
```
