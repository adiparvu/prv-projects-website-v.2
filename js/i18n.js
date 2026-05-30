/**
 * PRV Projects — 12 languages i18n (default: NL)
 */
(function () {
  const STORAGE_LANG = "prv-lang";
  const DEFAULT_LANG = "nl";
  const cache = {};
  let applyPromise = null;

  function getBasePath() {
    const p = location.pathname;
    if (/\/shop(\/|$)/.test(p)) {
      const rest = p.split("/shop")[1] || "";
      const dirs = rest.split("/").filter((s) => s && !/\.html?$/i.test(s));
      const levels = dirs.length + 1;
      return levels <= 1 ? ".." : Array(levels).fill("..").join("/");
    }
    if (/\/projects\//.test(p) || /\/blog\//.test(p)) return "..";
    return ".";
  }

  function getLangMeta(code) {
    return (window.PRV_LANGUAGES || []).find((l) => l.code === code);
  }

  async function loadLocale(code) {
    if (cache[code]) return cache[code];
    const base = getBasePath();
    const [mainRes, shopRes] = await Promise.all([
      fetch(`${base}/js/translations/${code}.json`),
      fetch(`${base}/js/translations/shop/${code}.json`),
    ]);
    if (!mainRes.ok) throw new Error(`Locale ${code} not found`);
    const data = await mainRes.json();
    if (shopRes.ok) {
      const shop = await shopRes.json();
      Object.assign(data, shop);
    }
    cache[code] = data;
    return data;
  }

  function detectInitialLang() {
    const saved = localStorage.getItem(STORAGE_LANG);
    if (saved && (window.PRV_LANGUAGES || []).some((l) => l.code === saved)) return saved;
    const codes = (window.PRV_LANGUAGES || []).map((l) => l.code);
    const browser = (navigator.language || "").toLowerCase();
    const match = codes.find((c) => browser.startsWith(c));
    return match || DEFAULT_LANG;
  }

  let currentLang = detectInitialLang();
  let strings = {};

  function applyToDOM(root = document) {
    root.querySelectorAll("[data-i18n]").forEach((el) => {
      if (el.querySelector("[data-i18n]")) return;
      const key = el.getAttribute("data-i18n");
      const text = strings[key];
      if (text != null) el.textContent = text;
    });

    root.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      const key = el.getAttribute("data-i18n-placeholder");
      if (strings[key] != null) el.placeholder = strings[key];
    });

    root.querySelectorAll("[data-i18n-title]").forEach((el) => {
      const key = el.getAttribute("data-i18n-title");
      if (strings[key] != null) el.title = strings[key];
    });

    root.querySelectorAll("[data-i18n-aria]").forEach((el) => {
      const key = el.getAttribute("data-i18n-aria");
      if (strings[key] != null) el.setAttribute("aria-label", strings[key]);
    });
  }

  function updatePickerUI() {
    const trigger = document.getElementById("lang-trigger");
    const meta = getLangMeta(currentLang);
    if (trigger && meta) {
      const code = trigger.querySelector(".lang-trigger-code");
      const name = trigger.querySelector(".lang-trigger-name");
      if (code) code.textContent = meta.code.toUpperCase();
      if (name) name.textContent = meta.native;
    }
    document.querySelectorAll(".lang-option").forEach((btn) => {
      const active = btn.dataset.lang === currentLang;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-selected", String(active));
    });
  }

  function setDocumentDir(lang) {
    const meta = getLangMeta(lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = meta?.rtl ? "rtl" : "ltr";
    document.body.classList.toggle("is-rtl", !!meta?.rtl);
  }

  async function applyLang(lang, { save = true, notify = true } = {}) {
    const codes = (window.PRV_LANGUAGES || []).map((l) => l.code);
    if (!codes.includes(lang)) lang = DEFAULT_LANG;

    if (lang === currentLang && Object.keys(strings).length > 0 && cache[lang]) {
      if (save) localStorage.setItem(STORAGE_LANG, lang);
      setDocumentDir(lang);
      applyToDOM();
      updatePickerUI();
      if (notify) {
        window.dispatchEvent(new CustomEvent("prv:langchange", { detail: { lang, strings } }));
      }
      window.PRV_BACK?.initBackNav?.();
      return;
    }

    const run = async () => {
      try {
        strings = await loadLocale(lang);
      } catch {
        if (!cache[DEFAULT_LANG]) {
          try {
            strings = await loadLocale(DEFAULT_LANG);
            lang = DEFAULT_LANG;
          } catch {
            strings = {};
          }
        } else {
          strings = cache[DEFAULT_LANG];
          lang = DEFAULT_LANG;
        }
      }

      if (!strings["project.ctaTitle"] && cache[DEFAULT_LANG]) {
        strings = { ...cache[DEFAULT_LANG], ...strings };
      }

      currentLang = lang;
      if (save) localStorage.setItem(STORAGE_LANG, lang);
      setDocumentDir(lang);
      applyToDOM();
      updatePickerUI();
      if (notify) {
        window.dispatchEvent(new CustomEvent("prv:langchange", { detail: { lang, strings } }));
      }
      window.PRV_BACK?.initBackNav?.();
    };

    applyPromise = run();
    await applyPromise;
    applyPromise = null;
  }

  function prefetchLocales() {
    const codes = (window.PRV_LANGUAGES || []).map((l) => l.code).filter((c) => c !== currentLang);
    const load = () => codes.forEach((c) => loadLocale(c).catch(() => {}));
    if (typeof requestIdleCallback === "function") requestIdleCallback(load, { timeout: 4000 });
    else setTimeout(load, 1500);
  }

  const LANG_GLOBE_SVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 010 18M12 3a14 14 0 000 18"/></svg>`;

  function isMinimalLangHost(host) {
    return (
      host.classList.contains("lang-picker-host--minimal") ||
      !!host.closest(".footer-picker-slot, .footer-social-row, #footer-lang-slot")
    );
  }

  function bindPickerGlobalListeners() {
    if (window.__prvLangPickerDocBound) return;
    window.__prvLangPickerDocBound = true;

    document.addEventListener("click", (e) => {
      document.querySelectorAll(".lang-picker-host.is-open").forEach((host) => {
        if (!host.contains(e.target)) {
          const dropdown = host.querySelector(".lang-dropdown");
          const trigger = host.querySelector(".lang-trigger");
          if (dropdown) dropdown.hidden = true;
          if (trigger) trigger.setAttribute("aria-expanded", "false");
          host.classList.remove("is-open");
        }
      });
    });

    document.addEventListener("keydown", (e) => {
      if (e.key !== "Escape") return;
      document.querySelectorAll(".lang-picker-host.is-open").forEach((host) => {
        const dropdown = host.querySelector(".lang-dropdown");
        const trigger = host.querySelector(".lang-trigger");
        if (dropdown) dropdown.hidden = true;
        if (trigger) trigger.setAttribute("aria-expanded", "false");
        host.classList.remove("is-open");
      });
    });
  }

  function buildLangPicker() {
    const host = document.getElementById("lang-picker");
    if (!host || !window.PRV_LANGUAGES) return;

    bindPickerGlobalListeners();

    const minimal = isMinimalLangHost(host);
    if (minimal) host.classList.add("lang-picker-host--minimal");

    host.dataset.built = "1";
    host.innerHTML = `
      <div class="lang-picker${minimal ? " lang-picker--minimal" : ""}">
        <button type="button" class="lang-trigger${minimal ? " lang-trigger--minimal nav-util-btn" : " glass-inset"}" id="lang-trigger" aria-haspopup="listbox" aria-expanded="false" data-i18n-aria="lang.choose">
          ${minimal ? `<span class="lang-trigger-icon">${LANG_GLOBE_SVG}</span>` : ""}
          <span class="lang-trigger-code">NL</span>
          ${minimal ? "" : `<span class="lang-trigger-name">Nederlands</span>`}
          <svg class="lang-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>
        </button>
        <div class="lang-dropdown glass-panel" id="lang-dropdown" role="listbox" hidden>
          <p class="lang-dropdown-title" data-i18n="lang.choose">Kies een taal</p>
          <div class="lang-options"></div>
        </div>
      </div>
    `;

    const options = host.querySelector(".lang-options");
    window.PRV_LANGUAGES.forEach((l) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "lang-option";
      btn.role = "option";
      btn.dataset.lang = l.code;
      btn.innerHTML = `<span class="lang-option-flag">${l.flag}</span><span class="lang-option-native">${l.native}</span><span class="lang-option-label">${l.label}</span>`;
      btn.addEventListener("click", () => {
        applyLang(l.code, { save: true, notify: true });
        const dropdown = host.querySelector(".lang-dropdown");
        const trigger = host.querySelector(".lang-trigger");
        if (dropdown) dropdown.hidden = true;
        if (trigger) trigger.setAttribute("aria-expanded", "false");
        host.classList.remove("is-open");
      });
      options.appendChild(btn);
    });

    const trigger = host.querySelector("#lang-trigger");
    const dropdown = host.querySelector("#lang-dropdown");

    trigger.addEventListener("click", (e) => {
      e.stopPropagation();
      const open = host.classList.contains("is-open");
      if (open) {
        dropdown.hidden = true;
        trigger.setAttribute("aria-expanded", "false");
        host.classList.remove("is-open");
      } else {
        dropdown.hidden = false;
        trigger.setAttribute("aria-expanded", "true");
        host.classList.add("is-open");
      }
    });

    applyToDOM(host);
    updatePickerUI();
  }

  window.PRV_I18N = {
    applyLang,
    applyToDOM,
    updatePickerUI,
    getLang: () => currentLang,
    get strings() {
      return strings;
    },
    loadLocale,
    prefetchLocales,
    rebuildLangPicker: buildLangPicker,
    DEFAULT_LANG,
  };

  async function init() {
    await applyLang(currentLang, { save: true });
    prefetchLocales();

    const mountLangUi = () => {
      if (document.getElementById("footer-lang-slot")) buildLangPicker();
    };

    document.addEventListener("prv:footer-ready", () => {
      mountLangUi();
      applyToDOM();
      updatePickerUI();
      window.PRV_BACK?.initBackNav?.();
    });

    mountLangUi();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
