/** PRV Shop — i18n helper (uses PRV_I18N + shop.* keys) */

export function t(key, vars = {}) {
  const raw = window.PRV_I18N?.strings?.[key];
  const s = raw != null ? raw : key;
  return Object.entries(vars).reduce(
    (acc, [k, v]) => acc.replace(new RegExp(`\\{${k}\\}`, "g"), String(v)),
    s
  );
}

export function getLang() {
  return window.PRV_I18N?.getLang?.() || "ro";
}

export function onShopLangChange(callback) {
  window.addEventListener("prv:langchange", callback);
}
