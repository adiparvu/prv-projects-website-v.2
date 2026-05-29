/**
 * PRV Projects — Site configuration (configurat)
 * @see docs/PRODUCT_ECOSYSTEM.md — unified web + mobile (App Store / Play)
 */
window.PRV_CONFIG = {
  /** Google Analytics 4 — adaugă ID-ul tău G-... din analytics.google.com */
  gaMeasurementId: "",

  /** Email unde primești abonările newsletter + mesajele */
  contactEmail: "hello@prvprojects.be",

  /** FormSubmit — cereri ofertă (același email ca newsletter) */
  formsubmitEmail: "hello@prvprojects.be",

  /**
   * WhatsApp (fără + sau spații) — ex: "32470123456"
   * Lasă gol pentru a ascunde butonul floating.
   * Notă: butonul floating (colț) este dezactivat — folosește CTA din header.
   */
  whatsappNumber: "",

  /** Buton floating jos-dreapta (WhatsApp + ofertă) — false = dezactivat */
  floatingCtaEnabled: false,

  newsletter: {
    /**
     * formsubmit = trimite direct pe email (fără cont, activare la primul mesaj)
     * formspree | mailchimp | netlify | local
     */
    provider: "formsubmit",
    formsubmitEmail: "hello@prvprojects.be",

    formspreeId: "",
    mailchimpAction: "",
    mailchimpHiddenName: "",
  },

  siteUrl: "https://adiparvu.github.io/prv-projects-website-v.2",

  /** Micro-interacțiuni (sweep, stagger, scroll, particule CTA, etc.) */
  effectsEnabled: true,

  /**
   * Product ecosystem — one PRV across web, PWA, iOS, Android
   * Native shells set window.PRVNative; see apps/README.md
   */
  product: {
    vision: "unified-web-mobile",
    targets: ["web", "pwa", "ios", "android"],
    api: {
      baseUrl: "", // unified backend, e.g. https://api.prvprojects.be
      version: "v1",
    },
    native: {
      ios: { bundleId: "be.prvprojects.app", appStoreUrl: "" },
      android: { packageName: "be.prvprojects.app", playStoreUrl: "" },
    },
    pwa: {
      enabled: true,
      installPrompt: true,
    },
  },

  /**
   * PRV Shop — ecommerce (demo: localStorage; live: apiBase + Stripe)
   * apiBase overrides product.api.baseUrl when set
   * @see shop/README.md
   */
  shop: {
    apiBase: "", // e.g. https://prv-shop-api.up.railway.app
    stripePublishableKey: "", // pk_live_... or pk_test_...
    currency: "EUR",
    locale: "ro-BE",
  },
};
