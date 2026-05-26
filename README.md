# PRV Projects Website v2

Apple-inspired **liquid glass** landing page with glassmorphism, immersive motion, and adaptive theming.

## Features

- **Liquid glass UI** — multi-layer blur, specular edges, frosted panels
- **Themes** — Light · Dark · System (persists to `localStorage`)
- **Immersive effects** — WebGL-style liquid canvas, cursor glow, parallax, 3D tilt
- **Text effects** — character split reveals, shimmer gradients, scroll animations
- **Motion** — floating cards, marquee, magnetic buttons, stat counters

## Run locally

Open `index.html` in a browser, or serve with any static server:

```bash
npx serve .
# or
python3 -m http.server 8080
```

Then visit `http://localhost:8080`.

## Live site (international)

Repository is **private**, so GitHub Pages must be enabled once in your account:

1. Open **https://github.com/adiparvu/prv-projects-website-v.2/settings/pages**
2. Under **Build and deployment** → Source: **GitHub Actions**
3. Re-run the workflow **Deploy to GitHub Pages** (Actions tab)

Permanent URL (after the steps above):

**https://adiparvu.github.io/prv-projects-website-v.2/**

Alternative: set the repo to **Public** (Settings → General → Change visibility), then Pages works the same way.

### Instant preview (no GitHub setup)

Deploy folder to [Netlify Drop](https://app.netlify.com/drop) — drag `index.html`, `css/`, and `js/` for a permanent `*.netlify.app` link.

## Structure

```
index.html      # Page markup
css/styles.css  # Design system & glass styles
js/main.js      # Theme, canvas, interactions
```
