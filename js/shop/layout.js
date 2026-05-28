/** PRV Shop — shared chrome */

import { ShopRoutes } from "./routes.js";
import { cartBadgeHtml } from "./components.js";
import { ShopStore } from "./store.js";

function activeClass(href) {
  const path = window.location.pathname + window.location.search;
  return path.includes(href.split("?")[0].split("/").pop()) ? "is-active" : "";
}

export function mountShopLayout({ active = "shop" } = {}) {
  const root = document.getElementById("shop-root");
  if (!root) return;

  const account = ShopStore.getAccount();
  const accountLabel = account ? account.email.split("@")[0] : "Cont";

  root.innerHTML = `
    <div class="shop-shell">
      <header class="shop-header glass-panel">
        <a href="${ShopRoutes.siteHome()}" class="logo logo-animated" aria-label="PRV Projects">
          <span class="logo-mark">PRV</span>
          <span class="logo-type">Projects</span>
          <span class="shop-logo-sub">Shop</span>
        </a>
        <nav class="shop-nav" aria-label="Shop">
          <a href="${ShopRoutes.home()}" class="${active === "shop" ? "is-active" : ""}">Acasă</a>
          <a href="${ShopRoutes.category("finisaje")}">Finisaje</a>
          <a href="${ShopRoutes.category("bai-bucatarii")}">Băi</a>
          <a href="${ShopRoutes.category("pachete")}">Pachete</a>
        </nav>
        <div class="shop-header-actions">
          <div id="lang-picker" class="lang-picker-host"></div>
          <a href="${ShopRoutes.account()}" class="btn btn-glass btn-sm">${accountLabel}</a>
          <a href="${ShopRoutes.cart()}" class="shop-cart-btn" aria-label="Coș">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2l1.5 6h9L18 2"/><path d="M4 8h16l-1 14H5L4 8z"/></svg>
            ${cartBadgeHtml()}
          </a>
        </div>
      </header>
      <main class="shop-main" id="shop-main"></main>
      <footer id="site-footer"></footer>
    </div>
  `;

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

export function getMainEl() {
  return document.getElementById("shop-main");
}
