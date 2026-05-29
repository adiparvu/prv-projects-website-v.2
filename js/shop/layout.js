/** PRV Shop — shared chrome */

import { ShopRoutes } from "./routes.js";
import { cartBadgeHtml, uspStrip } from "./components.js";
import { ShopStore } from "./store.js";
import { t } from "./i18n.js";

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
        <form class="shop-search-form" action="${ShopRoutes.base()}/search.html" method="get" role="search">
          <label class="visually-hidden" for="shop-search-q">${t("shop.search.aria")}</label>
          <input id="shop-search-q" type="search" name="q" value="${q}" placeholder="${escapeAttr(t("shop.search.placeholder"))}" autocomplete="off" />
          <button type="submit" class="shop-search-btn" aria-label="${escapeAttr(t("shop.search.aria"))}">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>
          </button>
        </form>
        <nav class="shop-nav" aria-label="Shop">
          <a href="${ShopRoutes.home()}" class="${active === "shop" ? "is-active" : ""}">${t("shop.nav.home")}</a>
          ${navCats}
        </nav>
        <div class="shop-header-actions">
          <div id="lang-picker" class="lang-picker-host"></div>
          <a href="${ShopRoutes.account()}" class="btn btn-glass btn-sm">${accountLabel}</a>
          <a href="${ShopRoutes.cart()}" class="shop-cart-btn" aria-label="${escapeAttr(t("shop.cart.title"))}">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2l1.5 6h9L18 2"/><path d="M4 8h16l-1 14H5L4 8z"/></svg>
            ${cartBadgeHtml()}
          </a>
        </div>
      </header>
      <main class="shop-main" id="shop-main"></main>
      <footer id="site-footer"></footer>
    </div>
  `;

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

function escapeAttr(str) {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;");
}

export function getMainEl() {
  return document.getElementById("shop-main");
}
