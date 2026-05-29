# Snapshot repo — prv-projects-website-v.2

**GitHub:** https://github.com/adiparvu/prv-projects-website-v.2  
**Branch activ:** `main`

## Ultima versiune shop (referință)

| Commit | Descriere |
|--------|-----------|
| `c35c6d0` | API live: Stripe webhooks, auth, catalog, reminders |
| `c94bde6` | Favorite icon on images |
| `1b5eb2b` | Share icon on images |
| `136bb3d` | i18n 12 langs + catalog i18n + Stripe stub |
| `4d21f45` | Toolnation UX, filters, i18n |

## Clone pentru alt repo

```bash
git clone https://github.com/adiparvu/prv-projects-website-v.2.git
cd prv-projects-website-v.2
git checkout main
git pull origin main
```

Arhivă fără istoric (doar fișiere):

```bash
git clone --depth 1 https://github.com/adiparvu/prv-projects-website-v.2.git prv-shop-export
```

## Link-uri utile

| Doc | Path |
|-----|------|
| Unificare dashboard | `docs/MERGE-DASHBOARD.md` |
| Ecosistem | `docs/PRODUCT_ECOSYSTEM.md` |
| Shop config | `shop/README.md` |
| API deploy | `server/README.md` |
| Preview local | `PREVIEW-LINKS.md` |

## GitHub Pages (site public)

URL (dacă e activ): https://adiparvu.github.io/prv-projects-website-v.2/shop/index.html  
Workflow: `.github/workflows/pages.yml` → branch `gh-pages`
