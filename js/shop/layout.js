/** PRV Shop — shared chrome */

import { ShopRoutes } from "./routes.js";
import { cartBadgeHtml, uspStrip } from "./components.js";
import { ShopStore } from "./store.js";
import { t } from "./i18n.js";

const SEARCH_ICON = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>`;

export function mountShopLayout({ active = "shop", catalog = null, searchQuery = "" } = {}) {
  const root = document.getElementById("shop-root");
  if (!root) return;

  const account = ShopStore.getAccount();
  const accountLabel = account ? account.email.split("@")[0] : t("shop.nav.account");

  const categories = (catalog?.categories || [])
    .slice()
    .sort((a, b) => (a.sort || 0) - (b.sort || 0));

  const navCats = categories
    .map((c) => {
      const short = c.name.split(/[\s&]/)[0];
      return `<a href="${ShopRoutes.category(c.slug)}">${short}</a>`;
    })
    .join("");

  const q = escapeAttr(searchQuery);

  root.innerHTML = `
    <div class="shop-shell">
      ${uspStrip()}
      <header class="shop-header glass-panel">
        <a href="${ShopRoutes.siteHome()}" class="logo logo-animated" aria-label="PRV Projects">
          <span class="logo-mark">PRV</span>
          <span class="logo-type">Projects</span>
          <span class="shop-logo-sub">Shop</span>
        </a>
        <nav class="shop-nav" aria-label="Shop">
          <a href="${ShopRoutes.home()}" class="${active === "shop" ? "is-active" : ""}">${t("shop.nav.home")}</a>
          ${navCats}
        </nav>
        <div class="shop-header-actions">
          <button type="button" class="shop-icon-btn shop-search-toggle${active === "search" ? " is-active" : ""}" id="shop-search-open" aria-label="${escapeAttr(t("shop.nav.search"))}" aria-expanded="false" aria-controls="shop-search-overlay">
            ${SEARCH_ICON}
          </button>
          <div id="lang-picker" class="lang-picker-host"></div>
          <a href="${ShopRoutes.account()}" class="btn btn-glass btn-sm">${accountLabel}</a>
          <a href="${ShopRoutes.cart()}" class="shop-cart-btn" aria-label="${escapeAttr(t("shop.cart.title"))}">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2l1.5 6h9L18 2"/><path d="M4 8h16l-1 14H5L4 8z"/></svg>
            ${cartBadgeHtml()}
          </a>
        </div>
      </header>
      <div class="shop-search-overlay" id="shop-search-overlay" hidden>
        <div class="shop-search-backdrop" data-close-search tabindex="-1"></div>
        <div class="shop-search-panel glass-panel" role="dialog" aria-modal="true" aria-label="${escapeAttr(t("shop.search.title"))}">
          <form class="shop-search-form" action="${ShopRoutes.base()}/search.html" method="get" role="search">
            <label class="visually-hidden" for="shop-search-q">${t("shop.search.aria")}</label>
            <input id="shop-search-q" type="search" name="q" value="${q}" placeholder="${escapeAttr(t("shop.search.placeholder"))}" autocomplete="off" />
            <button type="submit" class="shop-search-btn" aria-label="${escapeAttr(t("shop.search.aria"))}">
              ${SEARCH_ICON}
            </button>
          </form>
          <button type="button" class="shop-search-close btn btn-glass btn-sm" data-close-search aria-label="${escapeAttr(t("shop.search.close"))}">×</button>
        </div>
      </div>
      <main class="shop-main" id="shop-main"></main>
      <footer id="site-footer"></footer>
    </div>
  `;

  wireSearchOverlay(root);

  if (window.PRV_I18N?.applyLang) {
    window.PRV_I18N.applyLang(window.PRV_I18N.getLang?.() || "ro");
  }

  const refreshBadge = () => {
    const btn = root.querySelector(".shop-cart-btn");
    if (!btn) return;
    const old = btn.querySelector(".shop-cart-badge");
    old?.remove();
    const html = cartBadgeHtml();
    if (html) btn.insertAdjacentHTML("beforeend", html);
  };

  window.addEventListener("prv:cartchange", refreshBadge);
}

function wireSearchOverlay(root) {
  const overlay = root.querySelector("#shop-search-overlay");
  const openBtn = root.querySelector("#shop-search-open");
  const input = root.querySelector("#shop-search-q");
  if (!overlay || !openBtn) return;

  const open = () => {
    overlay.hidden = false;
    openBtn.setAttribute("aria-expanded", "true");
    document.body.classList.add("shop-search-open");
    requestAnimationFrame(() => input?.focus());
  };

  const close = () => {
    overlay.hidden = true;
    openBtn.setAttribute("aria-expanded", "false");
    document.body.classList.remove("shop-search-open");
    openBtn.focus();
  };

  openBtn.addEventListener("click", () => {
    if (overlay.hidden) open();
    else close();
  });

  overlay.querySelectorAll("[data-close-search]").forEach((el) => {
    el.addEventListener("click", close);
  });

  overlay.querySelector(".shop-search-form")?.addEventListener("submit", () => close());

  window.addEventListener(
    "keydown",
    (e) => {
      if (e.key === "Escape" && !overlay.hidden) close();
    },
    { once: false }
  );
}

export function openShopSearch() {
  document.getElementById("shop-search-open")?.click();
}

function escapeAttr(str) {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;");
}

export function getMainEl() {
  return document.getElementById("shop-main");
}
