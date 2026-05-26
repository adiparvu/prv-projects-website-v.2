/**
 * PRV Projects — RO / EN translations
 */
(function () {
  const STORAGE_LANG = "prv-lang";

  const strings = {
    ro: {
      "nav.services": "Servicii",
      "nav.work": "Proiecte",
      "nav.about": "Despre",
      "nav.contact": "Contact",
      "nav.cta": "Hai să vorbim",
      "hero.eyebrow": "Design digital · Liquid glass",
      "hero.line1": "Construim",
      "hero.line2": "experiențe",
      "hero.line3": "care prind viață.",
      "hero.sub":
        "PRV Projects îmbină glassmorphism în stil Apple cu mișcare cinematică — interfețe fluide, teme adaptive și efecte immersive pe orice dispozitiv.",
      "hero.cta1": "Vezi proiectele",
      "hero.cta2": "Serviciile noastre",
      "hero.scroll": "Scroll",
      "card1.label": "Mișcare",
      "card1.title": "Adâncime fluidă",
      "card1.desc": "Parallax & fizică spring",
      "card2.label": "Sticlă",
      "card2.title": "Blur lichid",
      "card2.desc": "Reflexii & refracție",
      "card3.label": "Temă",
      "card3.title": "Adaptiv",
      "card3.desc": "Dark · Light · System",
      "services.tag": "Ce oferim",
      "services.title": "Soluții digitale complete",
      "services.s1.title": "Web & E-commerce",
      "services.s1.desc": "Site-uri responsive, rapide, optimizate SEO, cu UI liquid glass.",
      "services.s2.title": "Branding & Design",
      "services.s2.desc": "Identitate vizuală, logo, materiale marketing premium.",
      "services.s3.title": "Marketing digital",
      "services.s3.desc": "SEO, social media, campanii orientate spre conversie.",
      "services.s4.title": "Video & Motion",
      "services.s4.desc": "Producție video, animații, motion graphics immersive.",
      "work.tag": "Proiecte selectate",
      "work.title": "Construite să pară",
      "work.titleEm": "firești",
      "work.p1": "Dashboard-uri în timp real cu panouri glass depth-mapped.",
      "work.p2": "Fluxuri calme, accesibile, contrast adaptiv.",
      "work.p3": "WebGL + UI frosted — poveste spațială la 120fps feel.",
      "stats.s1": "Proiecte livrate",
      "stats.s2": "Ani de experiență UI",
      "stats.s3": "Scoruri Lighthouse",
      "feat.f1.title": "Sistem liquid glass",
      "feat.f1.desc": "Blur multi-strat, noise și margini speculare per temă.",
      "feat.f2.title": "Mișcare immersive",
      "feat.f2.desc": "Parallax la scroll, butoane magnetice, text reveal.",
      "feat.f3.title": "Teme inteligente",
      "feat.f3.desc": "Respectă prefers-color-scheme + override manual.",
      "cta.line1": "Pregătit pentru",
      "cta.line2": "ceva fluid?",
      "cta.sub": "Spune-ne despre proiectul tău. Răspundem în 24 de ore.",
      "cta.placeholder": "tu@companie.ro",
      "cta.btn": "Începe un proiect",
      "footer.craft": "Crafted with liquid glass",
      "footer.email": "Email",
      "form.thanks": "Mulțumim — revenim curând",
    },
    en: {
      "nav.services": "Services",
      "nav.work": "Work",
      "nav.about": "About",
      "nav.contact": "Contact",
      "nav.cta": "Let's talk",
      "hero.eyebrow": "Digital craft · Liquid glass",
      "hero.line1": "We shape",
      "hero.line2": "immersive",
      "hero.line3": "experiences.",
      "hero.sub":
        "PRV Projects blends Apple-inspired glassmorphism with cinematic motion — fluid interfaces, adaptive themes, and immersive effects on every device.",
      "hero.cta1": "Explore work",
      "hero.cta2": "Our services",
      "hero.scroll": "Scroll",
      "card1.label": "Motion",
      "card1.title": "Fluid depth",
      "card1.desc": "Parallax & spring physics",
      "card2.label": "Glass",
      "card2.title": "Liquid blur",
      "card2.desc": "Specular highlights & refraction",
      "card3.label": "Theme",
      "card3.title": "Adaptive",
      "card3.desc": "Dark · Light · System",
      "services.tag": "What we offer",
      "services.title": "Complete digital solutions",
      "services.s1.title": "Web & E-commerce",
      "services.s1.desc": "Fast, responsive, SEO-optimized sites with liquid glass UI.",
      "services.s2.title": "Branding & Design",
      "services.s2.desc": "Visual identity, logos, premium marketing materials.",
      "services.s3.title": "Digital marketing",
      "services.s3.desc": "SEO, social media, conversion-focused campaigns.",
      "services.s4.title": "Video & Motion",
      "services.s4.desc": "Video production, animation, immersive motion graphics.",
      "work.tag": "Selected work",
      "work.title": "Built to feel",
      "work.titleEm": "effortless",
      "work.p1": "Real-time dashboards with depth-mapped glass panels.",
      "work.p2": "Calm, accessible flows with adaptive contrast.",
      "work.p3": "WebGL meets frosted UI — spatial storytelling at 120fps feel.",
      "stats.s1": "Projects shipped",
      "stats.s2": "Years crafting UI",
      "stats.s3": "Lighthouse scores",
      "feat.f1.title": "Liquid glass system",
      "feat.f1.desc": "Multi-layer blur, noise, and specular edges per theme.",
      "feat.f2.title": "Immersive motion",
      "feat.f2.desc": "Scroll parallax, magnetic buttons, text reveals.",
      "feat.f3.title": "Theme intelligence",
      "feat.f3.desc": "Respects prefers-color-scheme with manual override.",
      "cta.line1": "Ready for",
      "cta.line2": "something fluid?",
      "cta.sub": "Tell us about your product. We'll respond within 24 hours.",
      "cta.placeholder": "you@company.com",
      "cta.btn": "Start a project",
      "footer.craft": "Crafted with liquid glass",
      "footer.email": "Email",
      "form.thanks": "Thanks — we'll be in touch",
    },
  };

  let currentLang = localStorage.getItem(STORAGE_LANG) || "ro";

  function applyLang(lang) {
    currentLang = lang;
    localStorage.setItem(STORAGE_LANG, lang);
    document.documentElement.lang = lang;

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      const text = strings[lang]?.[key];
      if (text != null) el.textContent = text;
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      const key = el.getAttribute("data-i18n-placeholder");
      const text = strings[lang]?.[key];
      if (text != null) el.placeholder = text;
    });

    const toggle = document.getElementById("lang-toggle");
    if (toggle) toggle.textContent = lang.toUpperCase();

    window.dispatchEvent(new CustomEvent("prv:langchange", { detail: { lang } }));
  }

  document.getElementById("lang-toggle")?.addEventListener("click", () => {
    applyLang(currentLang === "ro" ? "en" : "ro");
  });

  window.PRV_I18N = { applyLang, strings, getLang: () => currentLang };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => applyLang(currentLang));
  } else {
    applyLang(currentLang);
  }
})();
