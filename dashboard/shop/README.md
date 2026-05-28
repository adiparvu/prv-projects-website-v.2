# Dashboard · Shop (stubs)

Admin shop management will mount inside the PRV internal dashboard when website + shop are unified.

## Planned routes

| Route | Purpose |
|-------|---------|
| `/dashboard/shop` | Overview KPIs |
| `/dashboard/shop/products` | Product list |
| `/dashboard/shop/products/new` | Create product |
| `/dashboard/shop/products/:id` | Edit product |
| `/dashboard/shop/categories` | Categories |
| `/dashboard/shop/orders` | Orders |
| `/dashboard/shop/orders/:id` | Order detail |
| `/dashboard/shop/invoices` | Invoices |
| `/dashboard/shop/discounts` | Discount codes |
| `/dashboard/shop/reviews` | Reviews moderation |
| `/dashboard/shop/stock` | Stock visibility |
| `/dashboard/shop/analytics` | Sales analytics |

## API boundary

Customer-facing code: `js/shop/` (public).  
Admin API stubs: `js/shop/api.js` → `AdminShopApi`.

Connect `PRV_CONFIG.shop.apiBase` to your backend when ready.
