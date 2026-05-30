# PRV — Unified Web + Mobile Product Ecosystem

## North star

**PRV is one product ecosystem** — website, shop, customer account, and (later) internal operations — designed to ship on **web**, **iOS (App Store)**, and **Android (Google Play)**, not only as a desktop web dashboard.

The marketing site and shop in this repo are the **web surface**. Native apps will wrap or share the same APIs, design tokens, and domain models.

## Surfaces

| Surface | Role | Repo / path |
|---------|------|-------------|
| **Web** | Discovery, SEO, shop, account | This repo (`/`, `/shop/`) |
| **PWA** | Installable web app, offline-ready path | `manifest.webmanifest` + service worker (future) |
| **iOS** | App Store shell + native chrome | `apps/` (Capacitor / SwiftUI WebView — TBD) |
| **Android** | Play Store shell + native chrome | `apps/` (Capacitor / TWA — TBD) |
| **Dashboard** | Admin, chantier, inventory (internal) | Separate dashboard repo; shares `apiBase` |

## Shared layers (do not fork per platform)

1. **Design system** — `css/prv-brand.css`, `css/styles.css`, `css/shop.css` (liquid glass, themes, motion).
2. **Configuration** — `js/site-config.js` → `product`, `shop`, API base.
3. **API client** — `js/api/client.js` (auth headers, versioning, errors) — used by web shop and future native.
4. **Domain data** — `data/shop/catalog.json`, `js/shop/schema.json`; backend replaces JSON when live.
5. **i18n** — `js/translations/*` (12 languages); native can load same JSON bundles.

## Platform detection

`js/prv-platform.js` exposes:

- `getPlatform()` → `web` | `pwa` | `ios` | `android`
- `isNativeShell()` — true inside Capacitor / WebView with `PRVNative`
- `getApiBase()` — unified API URL for all surfaces

Native shells should inject before page load:

```js
window.PRVNative = { platform: "ios", appVersion: "1.0.0", safeArea: true };
```

## Mobile UX requirements

- **Safe areas** — `env(safe-area-inset-*)` on headers, checkout, tab bars (`css/ecosystem.css`).
- **Touch targets** — min 44×44px on primary actions (shop + nav).
- **Motion** — respect `prefers-reduced-motion`.
- **Checkout** — trust-first layout; Apple Pay / PayPal / Bancontact via Stripe on all platforms.
- **No desktop-only assumptions** — shop layout is mobile-first; dashboard admin can stay desktop-primary until unified.

## API contract (v1)

All clients talk to one backend:

```
{apiBase}/v1/...
  shop/catalog
  shop/cart
  shop/checkout/session   (Stripe)
  account/orders
  account/invoices
  admin/shop/*            (dashboard only)
```

Until backend is live: web shop uses **demo mode** (`localStorage` + `data/shop/catalog.json`).

## App Store / Play Store path

Recommended sequence:

1. **PWA** — installable web (`manifest`, icons, standalone).
2. **Capacitor** (or similar) — wrap `shop/` + account + key marketing routes; push notifications later.
3. **Store assets** — screenshots, privacy policy URL (`confidentialitate.html`), support email from `PRV_CONFIG`.
4. **Deep links** — `prvprojects://shop/product/:slug` → same routes as web query params.

See `apps/README.md` for native project placeholders.

## What we avoid

- Separate ecommerce templates disconnected from PRV design.
- Shop-only APIs that dashboard cannot reuse.
- Mobile layouts that are only shrink-to-fit desktop admin UI.
- Hard-coded absolute URLs that break on GitHub Pages subpaths (use `PRV_CONFIG.siteUrl` + relative assets).

## Related docs

- `shop/README.md` — shop routes and Stripe
- `dashboard/shop/README.md` — admin stubs
- `js/shop/schema.json` — commerce entities
