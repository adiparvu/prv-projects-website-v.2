# Dashboard · Shop

Admin shop — **de integrat** în dashboard-ul intern PRV.

> **Mutare repo:** vezi `docs/MERGE-DASHBOARD.md` pentru copiere din `prv-projects-website-v.2` și structura unificată.

## Stare actuală

| Fișier | Stare |
|--------|--------|
| `dashboard/shop/index.html` | Stub HTML (listă rute planificate) |
| `js/shop/api.js` → `AdminShopApi` | URL-uri stub |
| `server/index.mjs` | Admin parțial: `PATCH /v1/admin/stock`, `POST /v1/admin/catalog/reload` |

## Rute planificate (UI dashboard)

| Route | Purpose | API de legat |
|-------|---------|--------------|
| `/dashboard/shop` | Overview KPIs | `GET /v1/admin/shop/stats` (TBD) |
| `/dashboard/shop/products` | Product list | `GET /v1/admin/shop/products` |
| `/dashboard/shop/products/new` | Create | `POST /v1/admin/shop/products` |
| `/dashboard/shop/products/:id` | Edit | `PATCH /v1/admin/shop/products/:id` |
| `/dashboard/shop/categories` | Categories | `GET/PATCH categories` |
| `/dashboard/shop/orders` | Orders | `GET /v1/admin/shop/orders` |
| `/dashboard/shop/orders/:id` | Detail | `GET + PATCH status` |
| `/dashboard/shop/invoices` | Invoices | orders `status=paid` |
| `/dashboard/shop/discounts` | Promo codes | catalog.discounts CRUD |
| `/dashboard/shop/reviews` | Moderation | reviews CRUD |
| `/dashboard/shop/stock` | Stock | `PATCH /v1/admin/stock` ✅ |
| `/dashboard/shop/analytics` | Sales | Stripe + orders aggregate |

## Autentificare admin

```http
X-Admin-Key: <ADMIN_API_KEY>
```

Sau extinde JWT cu `role: "admin"` (de implementat în `server/lib/auth.mjs`).

## Date sursă

- Catalog: `data/shop/catalog.json` (+ `data/shop/i18n/`)
- Comenzi runtime: `server/data/orders.json` (pe API host)
- Stoc override: `server/data/stock.json`

## Frontend public (nu modifica direct)

Logica clienților: `js/shop/*`, pagini `shop/*`.  
Dashboard doar **admin** — consumă același `js/api/client.js`.

## Pași următori (unificare)

1. Copiază modulele shop în repo dashboard (`docs/MERGE-DASHBOARD.md`)
2. Adaugă nav item „Shop” în shell-ul dashboard
3. Înlocuiește `index.html` stub cu pagini admin reale
4. Extinde `server/index.mjs` cu rute `GET /v1/admin/shop/*`
5. Un singur `PRV_CONFIG.product.api.baseUrl` pentru site + dashboard
