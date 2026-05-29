/**
 * PRV Projects — 12 languages i18n
 */
(function () {
  const STORAGE_LANG = "prv-lang";
  const DEFAULT_LANG = "ro";
  const cache = {};

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
    if (saved) return saved;
    const codes = (window.PRV_LANGUAGES || []).map((l) => l.code);
    const browser = (navigator.language || "").toLowerCase();
    const match = codes.find((c) => browser.startsWith(c));
  return match || DEFAULT_LANG;
  }

  let currentLang = detectInitialLang();
  let strings = {};

  function applyToDOM() {
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      const text = strings[key];
      if (text != null) el.textContent = text;
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      const key = el.getAttribute("data-i18n-placeholder");
      if (strings[key] != null) el.placeholder = strings[key];
    });

    document.querySelectorAll("[data-i18n-title]").forEach((el) => {
      const key = el.getAttribute("data-i18n-title");
      if (strings[key] != null) el.title = strings[key];
    });

    document.querySelectorAll("[data-i18n-aria]").forEach((el) => {
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

  async function applyLang(lang, { save = true } = {}) {
    const codes = (window.PRV_LANGUAGES || []).map((l) => l.code);
    if (!codes.includes(lang)) lang = DEFAULT_LANG;

    delete cache[lang];

    try {
      strings = await loadLocale(lang);
    } catch {
      delete cache[DEFAULT_LANG];
      strings = await loadLocale(DEFAULT_LANG);
      lang = DEFAULT_LANG;
    }

    if (!strings["project.ctaTitle"]) {
      strings = { ...(await loadLocale(DEFAULT_LANG)), ...strings };
    }

    currentLang = lang;
    if (save) localStorage.setItem(STORAGE_LANG, lang);
    setDocumentDir(lang);
    applyToDOM();
    updatePickerUI();
    window.dispatchEvent(new CustomEvent("prv:langchange", { detail: { lang, strings } }));
  }

  const LANG_GLOBE_SVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 010 18M12 3a14 14 0 000 18"/></svg>`;

  function isMinimalLangHost(host) {
    return (
      host.classList.contains("lang-picker-host--minimal") ||
      !!host.closest(".footer-picker-slot, .footer-social-row, #footer-lang-slot")
    );
  }

  function buildLangPicker() {
    const host = document.getElementById("lang-picker");
    if (!host || !window.PRV_LANGUAGES) return;

    const minimal = isMinimalLangHost(host);
    if (minimal) host.classList.add("lang-picker-host--minimal");

    host.innerHTML = `
      <div class="lang-picker${minimal ? " lang-picker--minimal" : ""}">
        <button type="button" class="lang-trigger${minimal ? " lang-trigger--minimal nav-util-btn" : " glass-inset"}" id="lang-trigger" aria-haspopup="listbox" aria-expanded="false" data-i18n-aria="lang.choose">
          ${minimal ? `<span class="lang-trigger-icon">${LANG_GLOBE_SVG}</span>` : ""}
          <span class="lang-trigger-code">RO</span>
          ${minimal ? "" : `<span class="lang-trigger-name">Română</span>`}
          <svg class="lang-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>
        </button>
        <div class="lang-dropdown glass-panel" id="lang-dropdown" role="listbox" hidden>
          <p class="lang-dropdown-title" data-i18n="lang.choose">Alege limba</p>
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
        applyLang(l.code);
        closeDropdown();
      });
      options.appendChild(btn);
    });

    const trigger = host.querySelector("#lang-trigger");
    const dropdown = host.querySelector("#lang-dropdown");

    function openDropdown() {
      dropdown.hidden = false;
      trigger.setAttribute("aria-expanded", "true");
      host.classList.add("is-open");
    }

    function closeDropdown() {
      dropdown.hidden = true;
      trigger.setAttribute("aria-expanded", "false");
      host.classList.remove("is-open");
    }

    trigger.addEventListener("click", (e) => {
      e.stopPropagation();
      dropdown.hidden ? openDropdown() : closeDropdown();
    });

    document.addEventListener("click", (e) => {
      if (!host.contains(e.target)) closeDropdown();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeDropdown();
    });
  }

  window.PRV_I18N = {
    applyLang,
    getLang: () => currentLang,
    get strings() {
      return strings;
    },
    loadLocale,
    rebuildLangPicker: buildLangPicker,
  };

  async function init() {
    await applyLang(currentLang, { save: false });
    const mountLangUi = () => {
      if (document.getElementById("footer-lang-slot")) buildLangPicker();
    };
    document.addEventListener("prv:footer-ready", () => {
      mountLangUi();
      applyLang(currentLang);
    });
    mountLangUi();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
