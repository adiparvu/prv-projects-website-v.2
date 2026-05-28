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
   */
  whatsappNumber: "",

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

  /** WebGL glass în hero (Three.js) — dezactivează pe device foarte slabe dacă e nevoie */
  heroWebgl: true,

  /**
   * Video hero — înlocuiește cu fișier propriu: assets/video/hero-renovation.mp4
   * (șantier / finisaj, recomandat 10–20s, H.264, fără sunet)
   */
  heroVideo: {
    mp4: "https://videos.pexels.com/video-files/7578565/7578565-hd_1920_1080_25fps.mp4",
    webm: "",
    poster:
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1200&q=80&auto=format&fit=crop",
  },
};
