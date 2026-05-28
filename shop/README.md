# PRV Shop

Premium ecommerce layer for PRV Projects — same liquid-glass design system as the marketing site, with an airier, product-first layout and trust-focused checkout.

Part of the **unified web + mobile ecosystem** (App Store / Google Play intent). See `docs/PRODUCT_ECOSYSTEM.md` and `js/api/client.js`.

## Public routes (static)

| Route | File |
|-------|------|
| `/shop/` | `shop/index.html` |
| `/shop/category/:slug` | `shop/category.html?slug=` |
| `/shop/product/:slug` | `shop/product.html?slug=` |
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

In `js/site-config.js`:

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
- **Live mode**: implement `POST {apiBase}/checkout/session` (Stripe Checkout Session) and redirect to `session.url`.

Payment methods in checkout UI: Card, Apple Pay, PayPal, Bancontact — enabled on the Stripe account and session when backend is connected.

## Data

- Seed catalog: `data/shop/catalog.json`
- Schema reference: `js/shop/schema.json`
- Modules: `js/shop/*` (store, catalog, layout, checkout, pages)

## Admin (dashboard)

Admin shop UI lives under `dashboard/shop/` as stubs until the internal dashboard is merged. See `dashboard/shop/README.md`.

## Future

Inventory, supplier logic, chantier-linked ordering, and pricing intelligence hook into the same entities (`products`, `stock`, `orders`, `payment_records`) via `apiBase` + dashboard.
