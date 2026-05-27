/**
 * PRV Projects — RO / EN translations
 */
(function () {
  const STORAGE_LANG = "prv-lang";

  const strings = {
    ro: {
      "nav.services": "Servicii",
      "nav.work": "Proiecte",
      "nav.why": "De ce noi",
      "nav.about": "Despre",
      "nav.contact": "Contact",
      "nav.cta": "Hai să vorbim",
      "hero.eyebrow": "Design digital · Liquid glass",
      "hero.line1": "Construim",
      "hero.line2": "experiențe",
      "hero.line3": "care prind viață.",
      "hero.sub":
        "Suntem studioul care transformă branduri ambițioase în experiențe digitale de top. Design liquid glass, strategie clară și execuție care te face să fii ales — nu doar văzut.",
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
      "services.title": "Tot ce ai nevoie, sub un singur acoperiș",
      "services.intro": "De la primul pixel la ultima campanie — construim ecosistemul tău digital ca să crești fără haos.",
      "services.s1.title": "Web & E-commerce",
      "services.s1.desc": "Site-uri responsive, rapide, optimizate SEO, cu UI liquid glass.",
      "services.s2.title": "Branding & Design",
      "services.s2.desc": "Identitate vizuală, logo, materiale marketing premium.",
      "services.s3.title": "Marketing digital",
      "services.s3.desc": "SEO, social media, campanii orientate spre conversie.",
      "services.s4.title": "Video & Motion",
      "services.s4.desc": "Producție video, animații, motion graphics immersive.",
      "work.tag": "Proiecte selectate",
      "work.title": "Proiecte care",
      "work.titleEm": "vând povestea ta",
      "work.intro": "Fiecare case study e o dovadă — nu o promisiune. Apasă pentru detalii, slider foto și ce am făcut diferit.",
      "work.viewCase": "Vezi case study →",
      "work.p1": "Fintech care inspiră încredere — dashboard live, glass UI, +38% engagement.",
      "work.p2": "Sănătate digitală cu empatie — accesibilitate nativă, +61% programări online.",
      "work.p3": "Immersive WebGL — poveste 3D care triplează timpul pe site.",
      "work.p4": "E-commerce premium — checkout care convertește, +27% vânzări.",
      "diff.tag": "De ce PRV Projects",
      "diff.title": "Nu suntem încă o agenție. Suntem partenerul tău de creștere.",
      "diff.intro": "Într-o piață plină de template-uri și promisiuni goale, livrăm experiențe care se simt scumpe, clare și memorabile.",
      "diff.c1.title": "Strategie înainte de pixel",
      "diff.c1.desc": "Înțelegem obiectivul tău de business — apoi designăm. Nu invers.",
      "diff.c2.title": "Liquid glass, nu trend de moment",
      "diff.c2.desc": "Sistem vizual propriu — premium, adaptiv, recognoscibil instant.",
      "diff.c3.title": "Livrare end-to-end",
      "diff.c3.desc": "Web, brand, social, video — un singur echipaj, un singur standard de calitate.",
      "diff.c4.title": "Transparență totală",
      "diff.c4.desc": "Știi mereu unde suntem, ce urmează și cât costă — fără surprize.",
      "diff.c5.title": "Obsesie pentru performanță",
      "diff.c5.desc": "Frumos și rapid — Lighthouse, SEO și conversie sunt parte din design.",
      "diff.c6.title": "Tu ești următorul proiect",
      "diff.c6.desc": "Fiecare brand pe care îl lansăm devine referința următorului client. Poți fi tu.",
      "diff.cta": "Începe colaborarea",
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
      "cta.sub": "Un mesaj de la tine e începutul unui produs pe care utilizatorii îl vor iubi. Răspundem în 24h — fără obligații.",
      "cta.placeholder": "tu@companie.ro",
      "cta.btn": "Începe un proiect",
      "footer.craft": "Crafted with liquid glass",
      "footer.tagline": "Partenerul tău digital pentru branduri care vor să iasă în evidență.",
      "footer.follow": "Urmărește-ne",
      "footer.more": "Mai multe",
      "footer.moreSocial": "Mai multe rețele sociale",
      "footer.explore": "Explorează",
      "footer.why": "De ce noi",
      "form.thanks": "Mulțumim — revenim curând",
      "project.back": "← Proiecte",
      "project.challenge": "Provocarea",
      "project.solution": "Soluția PRV",
      "project.results": "Rezultate",
      "project.diffTitle": "Ce ne diferențiază pe acest proiect",
      "project.ctaTitle": "Vrei același nivel de claritate pentru produsul tău?",
      "project.ctaSub": "Hai să construim împreună o experiență pe care utilizatorii o vor recomanda.",
      "project.ctaBtn": "Programează un call gratuit",
      "project.ctaShort": "Lucrează cu noi",
    },
    en: {
      "nav.services": "Services",
      "nav.work": "Work",
      "nav.why": "Why us",
      "nav.about": "About",
      "nav.contact": "Contact",
      "nav.cta": "Let's talk",
      "hero.eyebrow": "Digital craft · Liquid glass",
      "hero.line1": "We shape",
      "hero.line2": "immersive",
      "hero.line3": "experiences.",
      "hero.sub":
        "We're the studio that turns ambitious brands into top-tier digital experiences. Liquid glass design, clear strategy, and execution that gets you chosen — not just seen.",
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
      "services.title": "Everything you need, under one roof",
      "services.intro": "From the first pixel to the last campaign — we build your digital ecosystem so you grow without chaos.",
      "services.s1.title": "Web & E-commerce",
      "services.s1.desc": "Fast, responsive, SEO-optimized sites with liquid glass UI.",
      "services.s2.title": "Branding & Design",
      "services.s2.desc": "Visual identity, logos, premium marketing materials.",
      "services.s3.title": "Digital marketing",
      "services.s3.desc": "SEO, social media, conversion-focused campaigns.",
      "services.s4.title": "Video & Motion",
      "services.s4.desc": "Video production, animation, immersive motion graphics.",
      "work.tag": "Selected work",
      "work.title": "Projects that",
      "work.titleEm": "sell your story",
      "work.intro": "Every case study is proof — not a promise. Tap for details, photo slides, and what we did differently.",
      "work.viewCase": "View case study →",
      "work.p1": "Fintech that builds trust — live dashboard, glass UI, +38% engagement.",
      "work.p2": "Digital health with empathy — native accessibility, +61% online bookings.",
      "work.p3": "Immersive WebGL — 3D story that triples time on site.",
      "work.p4": "Premium e-commerce — checkout that converts, +27% sales.",
      "diff.tag": "Why PRV Projects",
      "diff.title": "Not just another agency. Your growth partner.",
      "diff.intro": "In a market full of templates and empty promises, we deliver experiences that feel premium, clear, and memorable.",
      "diff.c1.title": "Strategy before pixels",
      "diff.c1.desc": "We understand your business goal — then we design. Not the other way around.",
      "diff.c2.title": "Liquid glass, not a fad",
      "diff.c2.desc": "Our own visual system — premium, adaptive, instantly recognizable.",
      "diff.c3.title": "End-to-end delivery",
      "diff.c3.desc": "Web, brand, social, video — one crew, one quality bar.",
      "diff.c4.title": "Full transparency",
      "diff.c4.desc": "You always know where we are, what's next, and what it costs — no surprises.",
      "diff.c5.title": "Performance obsession",
      "diff.c5.desc": "Beautiful and fast — Lighthouse, SEO, and conversion are part of design.",
      "diff.c6.title": "You're the next project",
      "diff.c6.desc": "Every brand we launch becomes the next client's reference. It could be you.",
      "diff.cta": "Start collaborating",
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
      "cta.sub": "A message from you is the start of a product users will love. We reply within 24h — no obligation.",
      "cta.placeholder": "you@company.com",
      "cta.btn": "Start a project",
      "footer.craft": "Crafted with liquid glass",
      "footer.tagline": "Your digital partner for brands that want to stand out.",
      "footer.follow": "Follow us",
      "footer.more": "More",
      "footer.moreSocial": "More social networks",
      "footer.explore": "Explore",
      "footer.why": "Why us",
      "form.thanks": "Thanks — we'll be in touch",
      "project.back": "← Projects",
      "project.challenge": "The challenge",
      "project.solution": "The PRV solution",
      "project.results": "Results",
      "project.diffTitle": "What sets us apart on this project",
      "project.ctaTitle": "Want the same clarity for your product?",
      "project.ctaSub": "Let's build an experience users will recommend together.",
      "project.ctaBtn": "Book a free call",
      "project.ctaShort": "Work with us",
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

    document.querySelectorAll("[data-i18n-title]").forEach((el) => {
      const key = el.getAttribute("data-i18n-title");
      const text = strings[lang]?.[key];
      if (text != null) el.title = text;
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
