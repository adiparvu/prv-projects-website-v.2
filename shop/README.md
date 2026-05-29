# PRV Shop

Premium ecommerce layer for PRV Projects — same liquid-glass design system as the marketing site, with an airier, product-first layout and trust-focused checkout.

Part of the **unified web + mobile ecosystem** (App Store / Google Play intent). See `docs/PRODUCT_ECOSYSTEM.md` and `js/api/client.js`.

## Public routes (static)

| Route | File |
|-------|------|
| `/shop/` | `shop/index.html` |
| `/shop/category/:slug` | `shop/category.html?slug=` |
| `/shop/product/:slug` | `shop/product.html?slug=` |
| `/shop/search?q=` | `shop/search.html?q=` |
| `/shop/cart` | `shop/cart.html` |
| `/shop/checkout` | `shop/checkout.html` |
| `/shop/confirmation/:orderId` | `shop/confirmation.html?orderId=` |
| `/account` | `shop/account/index.html` |
| `/account/orders` | `shop/account/orders.html` |
| `/account/orders/:id` | `shop/account/order.html?id=` |
| `/account/invoices` | `shop/account/invoices.html` |
| `/account/favorites` | `shop/account/favorites.html` |

Legacy `shop.html` redirects to `shop/index.html`.

## Configuration

Shop strings live in `js/translations/shop/{lang}.json` (12 languages). Regenerate with `node scripts/generate-shop-i18n.mjs`.


```js
product: {
  api: { baseUrl: "https://api.prvprojects.be" }, // all surfaces (web + native)
},
shop: {
  apiBase: "", // optional override
  stripePublishableKey: "", // pk_live_...
  currency: "EUR",
  locale: "ro-BE",
}
```

- **Demo mode** (no `apiBase` / Stripe key): cart, checkout, orders, and invoices persist in `localStorage`.
- **Live mode**: set `apiBase` + `stripePublishableKey`, deploy `server/shop-stripe-api.mjs`, then:
  - **Card**: Stripe Payment Element (embedded) via `POST /v1/shop/checkout/payment-intent`
  - **Apple Pay / PayPal / Bancontact**: Stripe Checkout redirect via `POST /v1/shop/checkout/session`

See `server/README.md` for env vars (`STRIPE_SECRET_KEY`, `PORT`).

## Catalog i18n

- Base catalog: `data/shop/catalog.json` (Romanian)
- Locale overlays: `data/shop/i18n/{lang}.json` — regenerate with `node scripts/generate-catalog-i18n.mjs`
- Applied automatically in `js/shop/catalog.js` on load and language change

Payment methods in checkout UI: Card, Apple Pay, PayPal, Bancontact — enabled on the Stripe account and session when backend is connected.

## Data

- Seed catalog: `data/shop/catalog.json`
- Schema reference: `js/shop/schema.json`
- Modules: `js/shop/*` (store, catalog, layout, checkout, pages)

## Admin (dashboard)

Admin shop UI lives under `dashboard/shop/` as stubs until the internal dashboard is merged. See `dashboard/shop/README.md`.

## Future

Inventory, supplier logic, chantier-linked ordering, and pricing intelligence hook into the same entities (`products`, `stock`, `orders`, `payment_records`) via `apiBase` + dashboard.
