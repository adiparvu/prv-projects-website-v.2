/** PRV Shop — welcome offer popup (account signup, 10% once) */

import { ShopRoutes } from "./routes.js";
import { ShopStore } from "./store.js";
import { escapeHtml } from "./format.js";
import { t } from "./i18n.js";

const STORAGE_KEY = "prv_shop_welcome_promo_dismissed";

function shouldShow() {
  try {
    if (localStorage.getItem(STORAGE_KEY)) return false;
  } catch {
    /* ignore */
  }
  if (ShopStore.getAccount()) return false;
  return true;
}

function dismiss() {
  try {
    localStorage.setItem(STORAGE_KEY, "1");
  } catch {
    /* ignore */
  }
  closeWelcomePromo();
}

export function closeWelcomePromo() {
  const el = document.getElementById("shop-welcome-promo");
  if (!el) return;
  el.hidden = true;
  document.body.classList.remove("shop-promo-open");
}

export function mountWelcomePromo() {
  if (!shouldShow()) return;

  let root = document.getElementById("shop-welcome-promo");
  if (!root) {
    root = document.createElement("div");
    root.id = "shop-welcome-promo";
    root.className = "shop-promo-overlay";
    root.hidden = true;
    document.body.appendChild(root);
  }

  root.innerHTML = `
    <div class="shop-promo-backdrop" data-dismiss-promo tabindex="-1" aria-hidden="true"></div>
    <div class="shop-promo-dialog glass-panel" role="dialog" aria-modal="true" aria-labelledby="shop-welcome-promo-title" tabindex="-1">
      <button type="button" class="shop-promo-close" data-dismiss-promo aria-label="${escapeAttr(t("shop.welcomePromo.dismiss"))}">×</button>
      <p class="shop-promo-eyebrow">${escapeHtml(t("shop.welcomePromo.eyebrow"))}</p>
      <h2 id="shop-welcome-promo-title" class="shop-promo-title gradient-text">${escapeHtml(t("shop.welcomePromo.title"))}</h2>
      <p class="shop-promo-body">${escapeHtml(
        t("shop.welcomePromo.body", { pct: t("shop.welcomePromo.pct"), days: t("shop.welcomePromo.days") })
      )}</p>
      <div class="shop-promo-actions">
        <a href="${ShopRoutes.account()}" class="btn btn-primary" data-promo-cta>${escapeHtml(t("shop.welcomePromo.cta"))}</a>
        <button type="button" class="btn btn-glass" data-dismiss-promo>${escapeHtml(t("shop.welcomePromo.dismiss"))}</button>
      </div>
    </div>
  `;

  root.querySelectorAll("[data-dismiss-promo]").forEach((el) => {
    el.addEventListener("click", dismiss);
  });

  root.querySelector("[data-promo-cta]")?.addEventListener("click", dismiss);

  const onKey = (e) => {
    if (e.key === "Escape" && !root.hidden) dismiss();
  };
  window.addEventListener("keydown", onKey);

  requestAnimationFrame(() => {
    root.hidden = false;
    document.body.classList.add("shop-promo-open");
    root.querySelector(".shop-promo-dialog")?.focus?.();
  });
}

function escapeAttr(str) {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;");
}
