/**
 * PRV Projects — Site configuration (configurat)
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
   * PRV Shop — ecommerce (demo: localStorage; live: apiBase + Stripe)
   * @see shop/README.md
   */
  shop: {
    apiBase: "",
    stripePublishableKey: "",
    currency: "EUR",
    locale: "ro-BE",
  },
};
