/**
 * PRV — theme picker (light / dark / system)
 * Mount: shop color zones (.shop-theme-host), not main navbar.
 */

const STORAGE_KEY = "prv-theme";
const DEFAULT_THEME = "light";
const THEME_OPTIONS = ["light", "dark", "system"];

export const THEME_SVG = {
  light: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>`,
  dark: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true"><path d="M21 14.5A8.5 8.5 0 1111.5 3a6.5 6.5 0 109 11.5z"/></svg>`,
  system: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true"><rect x="3" y="5" width="18" height="11" rx="2"/><path d="M8 20h8"/></svg>`,
};

function getSystemTheme() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function getEffectiveTheme(preference) {
  if (!preference || preference === "system") return getSystemTheme();
  return preference;
}

function getThemeLabel(preference) {
  const i18n = window.PRV_I18N?.strings;
  const key = `theme.${preference}`;
  if (i18n?.[key]) return i18n[key];
  const labels = { light: "Light", dark: "Dark", system: "System" };
  return labels[preference] || preference;
}

function isMinimalHost(host) {
  return (
    host?.classList.contains("theme-picker-host--minimal") ||
    host?.classList.contains("shop-theme-host") ||
    host?.closest(".shop-gallery, .shop-filters, .shop-color-zone")
  );
}

export function applyThemeCore(preference) {
  const root = document.documentElement;
  const effective = getEffectiveTheme(preference);

  if (!preference || preference === "system") root.removeAttribute("data-theme");
  else root.setAttribute("data-theme", preference);

  root.setAttribute("data-effective-theme", effective);
  root.style.colorScheme = effective;

  const select = document.getElementById("theme-select");
  if (select && select.value !== preference) select.value = preference;

  document.querySelectorAll(".theme-option").forEach((btn) => {
    const isActive = btn.dataset.themeValue === preference;
    btn.classList.toggle("is-active", isActive);
    btn.setAttribute("aria-selected", String(isActive));
  });

  updateThemePickerTrigger(preference);
}

export function applyTheme(preference) {
  if (window.PRV_FX?.themeTransition) {
    window.PRV_FX.themeTransition(applyThemeCore, preference);
  } else {
    applyThemeCore(preference);
  }
}

export function updateThemePickerTrigger(preference) {
  const trigger = document.getElementById("theme-trigger");
  if (!trigger) return;
  const iconWrap = trigger.querySelector(".theme-trigger-icon");
  const code = trigger.querySelector(".theme-trigger-code");
  const name = trigger.querySelector(".theme-trigger-name");
  const svg = THEME_SVG[preference] || THEME_SVG.light;
  if (iconWrap) iconWrap.innerHTML = svg;
  else if (code) code.innerHTML = svg;
  if (name) name.textContent = getThemeLabel(preference);
}

export function ensureThemePickerHost() {
  const existing = document.getElementById("theme-picker");
  if (existing) return existing;

  const legacy = document.querySelector(".theme-switcher");
  if (legacy) {
    const host = document.createElement("div");
    host.id = "theme-picker";
    host.className = "theme-picker-host theme-picker-host--minimal";
    legacy.replaceWith(host);
    return host;
  }

  if (document.body.classList.contains("shop-body")) {
    const slot = document.getElementById("shop-theme-slot");
    if (!slot) return null;
    let host = slot.querySelector("#theme-picker");
    if (!host) {
      host = document.createElement("div");
      host.id = "theme-picker";
      host.className = "theme-picker-host theme-picker-host--minimal";
      slot.appendChild(host);
    }
    return host;
  }

  return null;
}

export function buildThemePicker() {
  const host = ensureThemePickerHost();
  if (!host || host.dataset.built === "1") return;

  const minimal = isMinimalHost(host);
  host.dataset.built = "1";
  const saved = localStorage.getItem(STORAGE_KEY) || DEFAULT_THEME;

  host.innerHTML = `
    <div class="theme-picker${minimal ? " theme-picker--minimal" : ""}">
      <label class="visually-hidden" for="theme-select" id="theme-select-label">Theme</label>
      <select id="theme-select" class="theme-select-native" aria-labelledby="theme-select-label" hidden>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
        <option value="system">System</option>
      </select>
      <button type="button" class="theme-trigger${minimal ? " theme-trigger--minimal nav-util-btn" : " glass-inset"}" id="theme-trigger" aria-haspopup="listbox" aria-expanded="false" title="${getThemeLabel(saved)}">
        <span class="theme-trigger-icon" aria-hidden="true">${THEME_SVG[saved] || THEME_SVG.light}</span>
        ${minimal ? "" : `<span class="theme-trigger-name" data-i18n="theme.light">Light</span>`}
        <svg class="theme-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>
      </button>
      <div class="theme-dropdown glass-panel" id="theme-dropdown" role="listbox" hidden>
        <p class="theme-dropdown-title" data-i18n="theme.choose">Alege tema</p>
        <div class="theme-options"></div>
      </div>
    </div>
  `;

  const select = host.querySelector("#theme-select");
  const optionsWrap = host.querySelector(".theme-options");
  const trigger = host.querySelector("#theme-trigger");
  const dropdown = host.querySelector("#theme-dropdown");
  const title = host.querySelector(".theme-dropdown-title");

  THEME_OPTIONS.forEach((value) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "theme-option";
    btn.role = "option";
    btn.dataset.themeValue = value;
    btn.innerHTML = `
      <span class="theme-option-icon" aria-hidden="true">${THEME_SVG[value]}</span>
      <span class="theme-option-label" data-i18n="theme.${value}">${getThemeLabel(value)}</span>
    `;
    btn.addEventListener("click", () => {
      localStorage.setItem(STORAGE_KEY, value);
      applyTheme(value);
      closeDropdown();
    });
    optionsWrap.appendChild(btn);
  });

  select.value = saved;
  select.addEventListener("change", () => {
    localStorage.setItem(STORAGE_KEY, select.value);
    applyTheme(select.value);
  });

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

  window.addEventListener("prv:langchange", () => {
    if (title && window.PRV_I18N?.strings?.["theme.choose"]) {
      title.textContent = window.PRV_I18N.strings["theme.choose"];
    }
    host.querySelectorAll(".theme-option-label").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      const text = window.PRV_I18N?.strings?.[key];
      if (text != null) el.textContent = text;
    });
    updateThemePickerTrigger(localStorage.getItem(STORAGE_KEY) || DEFAULT_THEME);
  });

  applyTheme(saved);
}

/** După re-render shop — temă în bara fixă de jos (stânga) */
export function remountThemePickerForShop() {
  const slot = document.getElementById("shop-theme-slot");
  if (!slot) return;

  let host = slot.querySelector("#theme-picker");
  if (!host) {
    host = document.createElement("div");
    host.id = "theme-picker";
    host.className = "theme-picker-host theme-picker-host--minimal";
    slot.appendChild(host);
  } else {
    delete host.dataset.built;
    host.innerHTML = "";
  }

  buildThemePicker();
}

export function initTheme() {
  buildThemePicker();
  const saved = localStorage.getItem(STORAGE_KEY) || DEFAULT_THEME;
  applyTheme(saved);

  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
    const current = localStorage.getItem(STORAGE_KEY) || DEFAULT_THEME;
    if (current === "system") applyTheme("system");
  });
}
