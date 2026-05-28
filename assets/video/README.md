# Video hero

Pune aici clipul tău propriu (recomandat):

- `hero-renovation.mp4` — șantier / finisaj, **10–20 secunde**, H.264, **fără sunet**
- opțional: `hero-renovation.webm` (VP9) pentru browsere moderne

Apoi în `js/site-config.js`:

```js
heroVideo: {
  mp4: "/assets/video/hero-renovation.mp4",
  webm: "/assets/video/hero-renovation.webm",
  poster: "/assets/video/hero-poster.jpg",
},
```

Până atunci site-ul folosește un clip stock (Pexels) din config.
