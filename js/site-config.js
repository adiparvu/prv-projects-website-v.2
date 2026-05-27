/**
 * PRV Projects — Site configuration (configurat)
 */
window.PRV_CONFIG = {
  /** Google Analytics 4 — adaugă ID-ul tău G-... din analytics.google.com */
  gaMeasurementId: "",

  /** Email unde primești abonările newsletter + mesajele */
  contactEmail: "hello@prvprojects.com",

  newsletter: {
    /**
     * formsubmit = trimite direct pe email (fără cont, activare la primul mesaj)
     * formspree | mailchimp | netlify | local
     */
    provider: "formsubmit",
    formsubmitEmail: "hello@prvprojects.com",

    formspreeId: "",
    mailchimpAction: "",
    mailchimpHiddenName: "",
  },

  siteUrl: "https://adiparvu.github.io/prv-projects-website-v.2",
};
