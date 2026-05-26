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

## Structure

```
index.html      # Page markup
css/styles.css  # Design system & glass styles
js/main.js      # Theme, canvas, interactions
```
