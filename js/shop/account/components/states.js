import { escapeHtml } from "../../format.js";
import { t } from "../../i18n.js";

/** @param {string} titleKey */
export function accountSectionHtml(titleKey, bodyHtml, { id = "", className = "" } = {}) {
  const idAttr = id ? ` id="${escapeHtml(id)}"` : "";
  return `
    <section class="shop-acct-section glass-panel ${className}"${idAttr}>
      <header class="shop-acct-section__head">
        <h2 class="shop-acct-section__title">${t(titleKey)}</h2>
      </header>
      <div class="shop-acct-section__body">${bodyHtml}</div>
    </section>
  `;
}

export function accountLoadingHtml(messageKey = "shop.profile.loading") {
  return `<div class="shop-acct-state shop-acct-state--loading glass-panel" role="status" aria-live="polite">
    <span class="shop-acct-state__icon">${/* spinner injected by caller */""}</span>
    <p>${t(messageKey)}</p>
  </div>`;
}

export function accountEmptyHtml({ titleKey, descKey, ctaHtml = "" }) {
  return `<div class="shop-acct-state shop-acct-state--empty glass-panel">
    <h3>${t(titleKey)}</h3>
    ${descKey ? `<p>${t(descKey)}</p>` : ""}
    ${ctaHtml}
  </div>`;
}

export function accountSuccessToastHtml(message) {
  return `<div class="shop-acct-toast shop-acct-toast--success" role="status" aria-live="polite">${escapeHtml(message)}</div>`;
}

export function accountErrorBannerHtml(message) {
  return `<div class="shop-acct-banner shop-acct-banner--error" role="alert">${escapeHtml(message)}</div>`;
}

/** @param {HTMLElement} root */
export function showAccountToast(root, message, type = "success") {
  const existing = root.querySelector(".shop-acct-toast-host");
  const host = existing || document.createElement("div");
  host.className = "shop-acct-toast-host";
  host.innerHTML = `<div class="shop-acct-toast shop-acct-toast--${type}" role="status">${escapeHtml(message)}</div>`;
  if (!existing) root.prepend(host);
  window.setTimeout(() => host.remove(), 3200);
}
