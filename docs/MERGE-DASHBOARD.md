# Unificare Shop + Dashboard — ghid de mutare repo

Repo sursă (actual): **`adiparvu/prv-projects-website-v.2`**  
Branch: **`main`** · ultimul shop live API: commit `c35c6d0`+

## 1. Clone / copiere în repo-ul dashboard

### Variantă A — tot monorepo-ul (recomandat)

```bash
git clone https://github.com/adiparvu/prv-projects-website-v.2.git prv-temp
cd your-dashboard-repo

# Copiază modulele shop + API + date
rsync -av ../prv-temp/shop/ ./shop/
rsync -av ../prv-temp/js/shop/ ./js/shop/
rsync -av ../prv-temp/js/api/ ./js/api/
rsync -av ../prv-temp/js/translations/shop/ ./js/translations/shop/
rsync -av ../prv-temp/data/shop/ ./data/shop/
rsync -av ../prv-temp/server/ ./server/
rsync -av ../prv-temp/scripts/shop-*.mjs ../prv-temp/scripts/generate-*.mjs ./scripts/
rsync -av ../prv-temp/css/shop.css ./css/shop.css
rsync -av ../prv-temp/dashboard/shop/ ./dashboard/shop/
```

### Variantă B — doar submodule git

```bash
cd your-dashboard-repo
git submodule add https://github.com/adiparvu/prv-projects-website-v.2.git packages/website-shop
# Sau: git subtree add --prefix=shop ...
```

### Variantă C — fork + PR

1. Fork `prv-projects-website-v.2` în contul tău  
2. În repo dashboard: `git remote add shop-upstream <fork-url>`  
3. `git fetch shop-upstream main`  
4. `git merge shop-upstream/main --allow-unrelated-histories` (rezolvă conflicte pe `js/site-config.js`, paths)

---

## 2. Ce include pachetul Shop (inventar fișiere)

| Cale | Rol |
|------|-----|
| `shop/` | Pagini HTML publice (index, category, product, cart, checkout, account) |
| `js/shop/` | Logică frontend (catalog, cart, checkout, stripe, auth, i18n) |
| `js/api/client.js` | Client HTTP unificat (web + dashboard) |
| `js/translations/shop/*.json` | 12 limbi UI |
| `data/shop/catalog.json` | Catalog seed |
| `data/shop/i18n/*.json` | Overlay catalog i18n |
| `server/` | API Node (Stripe, webhooks, auth, reminders) |
| `css/shop.css` | Stiluri shop |
| `dashboard/shop/` | Stub-uri admin (de înlocuit cu UI dashboard real) |
| `scripts/generate-shop-i18n.mjs` | Regenerare traduceri |
| `scripts/generate-catalog-i18n.mjs` | Regenerare catalog i18n |
| `docs/PRODUCT_ECOSYSTEM.md` | Viziune web + mobile |
| `shop/README.md` | Config shop |
| `server/README.md` | Deploy API |

**Dependențe site existente** (păstrează în repo unificat):

- `js/site-config.js` → `PRV_CONFIG.shop`
- `js/i18n.js` + `js/i18n-config.js` (merge `shop.*` keys)
- `css/prv-brand.css`, `css/styles.css`, `css/effects.css`
- `js/prv-platform.js`, `js/site-paths.js`, `js/footer.js`

---

## 3. Integrare cu dashboard-ul intern

### Arhitectură țintă

```
┌─────────────────────────────────────────────────────────┐
│  Repo unificat PRV                                       │
├─────────────────┬───────────────────┬───────────────────┤
│  Site public    │  /shop/*          │  js/shop/*        │
│  Dashboard      │  /dashboard/*     │  dashboard/*      │
│  API            │  server/          │  :8787 / Railway  │
└─────────────────┴───────────────────┴───────────────────┘
         │                    │                    │
         └────────────────────┴────────────────────┘
                    PRV_CONFIG.shop.apiBase
                    PRV_CONFIG.product.api.baseUrl
```

### Pași integrare dashboard

1. **Navigare** — link „Shop admin” → `/dashboard/shop/`  
2. **Autentificare admin** — același `JWT` sau sesiune dashboard + `X-Admin-Key` pentru API  
3. **Înlocuiește** `dashboard/shop/index.html` (stub) cu modulele tale (React/Vanilla)  
4. **Consumă API** existent:

| Admin UI | Endpoint (de extins) | Există acum |
|----------|----------------------|-------------|
| Comenzi | `GET /v1/admin/shop/orders` | 🔲 de adăugat |
| Stoc | `PATCH /v1/admin/stock` | ✅ |
| Catalog reload | `POST /v1/admin/catalog/reload` | ✅ |
| Produse CRUD | `GET/POST/PATCH /v1/admin/shop/products` | 🔲 de adăugat |

5. **Config unic** în dashboard:

```js
window.PRV_CONFIG = {
  product: { api: { baseUrl: "https://api.prvprojects.be" } },
  shop: {
    apiBase: "", // gol = folosește product.api.baseUrl
    stripePublishableKey: "pk_live_...",
  },
};
```

6. **Deploy** — un workflow sau două:
   - Site static (Pages) + API (Railway)  
   - Sau totul pe același host cu reverse proxy `/v1` → API

---

## 4. API backend — ce e live vs de făcut pentru dashboard

### Live (`server/index.mjs`)

- `GET /v1/shop/catalog`
- `POST /v1/shop/checkout/prepare|session|payment-intent`
- `POST /v1/shop/webhooks/stripe`
- `POST /v1/auth/magic-link`, `GET /v1/auth/verify`
- `GET /v1/account/orders`, invoices HTML
- `POST /v1/shop/reminders`
- `PATCH /v1/admin/stock`, `POST /v1/admin/catalog/reload`

### De implementat pentru dashboard complet

```
GET    /v1/admin/shop/orders
GET    /v1/admin/shop/orders/:id
PATCH  /v1/admin/shop/orders/:id/status
GET    /v1/admin/shop/products
POST   /v1/admin/shop/products
PATCH  /v1/admin/shop/products/:id
GET    /v1/admin/shop/categories
PATCH  /v1/admin/shop/categories/:id
GET    /v1/admin/shop/discounts
POST   /v1/admin/shop/discounts
GET    /v1/admin/shop/reviews
DELETE /v1/admin/shop/reviews/:id
```

Toate protejate cu `X-Admin-Key` sau JWT rol `admin`.

---

## 5. Variabile env (repo unificat)

Copiază `server/.env.example` → secrets Railway + documentează în dashboard README:

```
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
JWT_SECRET=
RESEND_API_KEY=
EMAIL_FROM=
SHOP_PUBLIC_URL=https://...
API_PUBLIC_URL=https://...
CORS_ORIGIN=https://...
ADMIN_API_KEY=
```

---

## 6. Checklist după mutare

- [ ] `js/site-config.js` — `apiBase` + Stripe pk  
- [ ] `js/i18n.js` — paths `/shop/` OK  
- [ ] GitHub Pages / deploy include `shop/`, `data/`, `js/translations/shop/`  
- [ ] API deployat, webhook Stripe configurat  
- [ ] Dashboard nav → shop admin  
- [ ] Test: catalog, checkout test mode, magic link, reminder  
- [ ] Șterge duplicate dacă ai avut shop vechi în dashboard  

---

## 7. Comenzi utile

```bash
# Regenerare i18n
node scripts/generate-shop-i18n.mjs
node scripts/generate-catalog-i18n.mjs

# API local
cd server && npm install && npm start

# Site static local
python3 -m http.server 8765
```

---

## 8. Contact între echipe / agenți AI

Când lucrezi în **alt repo**, menționează:

- „Continuă din `prv-projects-website-v.2` commit `main`”
- Citește `docs/MERGE-DASHBOARD.md` + `shop/README.md` + `server/README.md`
- Admin: `dashboard/shop/README.md`

**Nu duplica** logica de prețuri — folosește mereu `server/lib/pricing.js` pe backend.
