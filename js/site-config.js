/**
 * PRV Projects — Site configuration
 * Înlocuiește valorile goale cu ID-urile tale reale.
 */
window.PRV_CONFIG = {
  /** Google Analytics 4 — ex: "G-XXXXXXXXXX" */
  gaMeasurementId: "",

  newsletter: {
    /**
     * Provider: "formspree" | "mailchimp" | "netlify" | "local"
     * - formspree: gratuit, https://formspree.io
     * - mailchimp: URL action din embed Mailchimp
     * - netlify: form cu data-netlify (doar pe Netlify)
     * - local: salvare în browser (demo)
     */
    provider: "formspree",

    /** Formspree: ID din URL https://formspree.io/f/XXXXXX */
    formspreeId: "",

    /** Mailchimp: action URL complet din formularul embed */
    mailchimpAction: "",
    mailchimpHiddenName: "b_XXXXX", // câmp hidden name din Mailchimp
  },

  /** URL site live (pentru meta / sitemap) */
  siteUrl: "https://adiparvu.github.io/prv-projects-website-v.2",
};
