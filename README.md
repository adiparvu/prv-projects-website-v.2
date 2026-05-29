# PRV Projects — Website v2

Site **liquid glass** / glassmorphism cu teme **Dark · Light · System**, efecte immersive și **12 limbi**.

## Ecosistem produs (web + mobil)

PRV este construit ca **ecosistem unificat web + mobil**, cu intenția de livrare în **App Store** și **Google Play** — nu doar ca dashboard desktop.

| Strat | Locație |
|-------|---------|
| Arhitectură | [`docs/PRODUCT_ECOSYSTEM.md`](docs/PRODUCT_ECOSYSTEM.md) |
| Platformă (web / PWA / iOS / Android) | `js/prv-platform.js` |
| API unificat | `js/api/client.js` |
| Shop | [`shop/`](shop/) · API [`server/`](server/) |
| **Unificare cu dashboard** | [`docs/MERGE-DASHBOARD.md`](docs/MERGE-DASHBOARD.md) |
| Export / alt repo | [`docs/REPO-SNAPSHOT.md`](docs/REPO-SNAPSHOT.md) |
| App-uri native (viitor) | [`apps/README.md`](apps/README.md) |

### Limbi suportate

| Cod | Limbă |
|-----|--------|
| RO | Română |
| EN | Engleză |
| NL | Neerlandeză |
| FR | Franceză |
| DE | Germană |
| PL | Poloneză |
| ES | Spaniolă |
| IT | Italiană |
| TR | Turcă |
| AR | Arabă (RTL) |
| RU | Rusă |
| UK | Ucraineană |

Selector în meniu → listă completă cu nume native.

## Vizionare internațională

### Link permanent (GitHub Pages)

După o singură activare în contul tău:

1. **https://github.com/adiparvu/prv-projects-website-v.2/settings/pages**
2. Source: **Deploy from a branch** → Branch: **`gh-pages`** → folder **`/ (root)`**
3. Save

Site live:

### **https://adiparvu.github.io/prv-projects-website-v.2/**

Workflow-ul `Deploy to GitHub Pages` publică automat pe branch-ul `gh-pages` la fiecare push pe `main`.

### Alternativă rapidă (Netlify)

1. **https://app.netlify.com/drop**
2. Trage folderul proiectului (`index.html`, `css/`, `js/`, `favicon.svg`)
3. Primești link `*.netlify.app` permanent

## Local

```bash
npx serve .
# http://localhost:3000
```

## Structură

| Fișier | Rol |
|--------|-----|
| `index.html` | Pagină principală |
| `css/styles.css` | Design system glass |
| `js/main.js` | Teme, canvas, animații |
| `js/i18n.js` | Traduceri RO / EN |
| `favicon.svg` | Icon site |

## Funcții

- Liquid glass UI, parallax, tilt 3D, text reveal
- Teme light / dark / system (localStorage)
- Canvas lichid + cursor glow
- Secțiuni: Servicii, Proiecte, Despre, Contact
