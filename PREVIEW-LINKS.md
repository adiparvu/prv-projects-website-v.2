# Linkuri preview PRV

## Recomandat: Cloudflare (fără parolă IP)

Deschide direct în browser — **nu** folosi Localtunnel dacă apare pagină albă sau blocaj IP.

| Pagină | URL |
|--------|-----|
| Site | `https://electoral-drums-glory-underwear.trycloudflare.com/` |
| Shop | `https://electoral-drums-glory-underwear.trycloudflare.com/shop/index.html` |

> Linkul Cloudflare expiră când se oprește serverul/tunnel-ul. Cere un link nou în chat.

## Localtunnel (nesigur)

- Cere „parola” = **IP-ul tău public** (vezi https://ifconfig.me)
- După IP, unele browsere arată pagină albă din cauza proxy-ului — folosește Cloudflare.

## Permanent

https://adiparvu.github.io/prv-projects-website-v.2/shop/index.html  
(activează GitHub Pages: branch `gh-pages`)

## Stripe live (local)

1. `cd server && npm install && STRIPE_SECRET_KEY=sk_test_... npm start`
2. Setează în `js/site-config.js`: `shop.apiBase` + `shop.stripePublishableKey`
3. Reîncarcă checkout — Payment Element activ pentru card
