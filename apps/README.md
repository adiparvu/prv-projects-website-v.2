# PRV Native Apps (iOS · Android)

Placeholder for **App Store** and **Google Play** shells. The product logic, shop, and APIs live in the main website repo; native projects wrap the same experience.

## Intended approach

1. **Capacitor** (recommended) or **TWA** (Android) + **WKWebView** (iOS).
2. Load `https://…/shop/` (or bundled static export) as the primary shell route.
3. Inject `window.PRVNative` before content loads:

```html
<script>
  window.PRVNative = { platform: "ios", appVersion: "1.0.0", safeArea: true };
</script>
```

4. Use `js/prv-platform.js` + `js/api/client.js` on all surfaces.
5. Push notifications, biometrics, and offline catalog via native plugins later.

## Store checklist

- [ ] Bundle ID / package name (`be.prvprojects.app` — configure in `js/site-config.js`)
- [ ] Privacy policy URL → `confidentialitate.html`
- [ ] Support contact → `PRV_CONFIG.contactEmail`
- [ ] Screenshots: shop home, product, checkout, account orders
- [ ] Stripe live keys only in backend; publishable key in app config

## Repos (future)

```
apps/ios/       — Xcode + Capacitor
apps/android/   — Android Studio + Capacitor
```

Do not duplicate shop UI in Swift/Kotlin until a screen truly needs native performance (camera for chantier, AR, etc.).

See **`docs/PRODUCT_ECOSYSTEM.md`** for the full architecture.
