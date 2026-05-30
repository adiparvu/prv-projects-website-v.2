/** PRV Shop — shared chrome */

import { ShopRoutes } from "./routes.js";
import { cartBadgeHtml, uspStrip } from "./components.js";
import { ShopStore } from "./store.js";
import { escapeHtml } from "./format.js";
import { t } from "./i18n.js";
import { BACK_ARROW_SVG, wireShopHeaderBack } from "../prv-back.js";

const SEARCH_ICON = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>`;
const BACK_ICON = BACK_ARROW_SVG;
const ACCOUNT_ICON = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M20 21a8 8 0 10-16 0"/><circle cx="12" cy="8" r="4"/></svg>`;
const CART_ICON = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M6 2l1.5 6h9L18 2"/><path d="M4 8h16l-1 14H5L4 8z"/></svg>`;

function buildNavCats(catalog) {
  return (catalog?.categories || [])
    .slice()
    .sort((a, b) => (a.sort || 0) - (b.sort || 0))
    .map((c) => {
      const short = c.name.split(/[\s&]/)[0];
      return `<a href="${ShopRoutes.category(c.slug)}">${escapeHtml(short)}</a>`;
    })
    .join("");
}

function refreshCartBadge(root) {
  const btn = root.querySelector(".shop-cart-btn");
  if (!btn) return;
  btn.querySelector(".shop-cart-badge")?.remove();
  const html = cartBadgeHtml();
  if (html) btn.insertAdjacentHTML("beforeend", html);
}

function wireSearchOverlay(root) {
  if (root.dataset.searchWired === "1") return;
  root.dataset.searchWired = "1";

  const overlay = root.querySelector("#shop-search-overlay");
  const openBtn = root.querySelector("#shop-search-open");
  const input = root.querySelector("#shop-search-q");
  if (!overlay || !openBtn) return;

  const open = () => {
    overlay.hidden = false;
    openBtn.setAttribute("aria-expanded", "true");
    document.body.classList.add("shop-search-open");
    input?.focus({ preventScroll: true });
  };

  const close = () => {
    overlay.hidden = true;
    openBtn.setAttribute("aria-expanded", "false");
    document.body.classList.remove("shop-search-open");
    openBtn.focus({ preventScroll: true });
  };

  openBtn.addEventListener("click", () => {
    if (overlay.hidden) open();
    else close();
  });

  overlay.querySelectorAll("[data-close-search]").forEach((el) => {
    el.addEventListener("click", close);
  });

  overlay.querySelector(".shop-search-form")?.addEventListener("submit", () => close());

  if (!window.__prvShopSearchEsc) {
    window.__prvShopSearchEsc = true;
    window.addEventListener("keydown", (e) => {
      if (e.key !== "Escape") return;
      const o = document.querySelector("#shop-search-overlay");
      if (o && !o.hidden) {
        o.hidden = true;
        document.body.classList.remove("shop-search-open");
        document.querySelector("#shop-search-open")?.focus({ preventScroll: true });
      }
    });
  }
}

function wireCartBadgeOnce() {
  if (window.__prvShopCartBadgeWired) return;
  window.__prvShopCartBadgeWired = true;
  window.addEventListener("prv:cartchange", () => {
    const root = document.getElementById("shop-root");
    if (root) refreshCartBadge(root);
  });
}

export function updateShopLayout({ active = "shop", catalog = null, searchQuery = "" } = {}) {
  const root = document.getElementById("shop-root");
  if (!root?.querySelector(".shop-shell")) return false;

  const scroll = root.querySelector(".shop-categories-scroll");
  if (scroll) {
    scroll.innerHTML = `<a href="${ShopRoutes.home()}" class="${active === "shop" ? "is-active" : ""}">${t("shop.nav.home")}</a>${buildNavCats(catalog)}`;
  }

  root.querySelector(".shop-search-toggle")?.classList.toggle("is-active", active === "search");
  const input = root.querySelector("#shop-search-q");
  if (input) input.value = searchQuery || "";

  const account = ShopStore.getAccount();
  const accountLabel = account ? account.email.split("@")[0] : t("shop.nav.account");
  const accountBtn = root.querySelector(".shop-account-btn");
  if (accountBtn) {
    accountBtn.setAttribute("aria-label", accountLabel);
    accountBtn.setAttribute("title", account?.email || t("shop.nav.account"));
  }

  refreshCartBadge(root);
  return true;
}

export function mountShopLayout({ active = "shop", catalog = null, searchQuery = "" } = {}) {
  const root = document.getElementById("shop-root");
  if (!root) return;

  if (root.querySelector(".shop-shell") && updateShopLayout({ active, catalog, searchQuery })) {
    wireShopHeaderBack(root);
    return;
  }

  const account = ShopStore.getAccount();
  const accountLabel = account ? account.email.split("@")[0] : t("shop.nav.account");
  const navCats = buildNavCats(catalog);
  const q = escapeAttr(searchQuery);

  root.innerHTML = `
    <div class="shop-shell">
      ${uspStrip()}
      <div class="shop-header-wrap">
        <header class="shop-header glass-panel">
          <div class="shop-header-slot shop-header-slot--start">
            <a href="${ShopRoutes.siteHome()}" class="shop-icon-btn shop-back-btn" aria-label="${escapeAttr(t("shop.nav.backToSite"))}">
              ${BACK_ICON}
            </a>
          </div>
          <a href="${ShopRoutes.home()}" class="shop-header-brand logo logo-animated" aria-label="PRV Shop">
            <span class="shop-header-brand-line">
              <span class="logo-mark">PRV</span>
              <span class="logo-type">Projects</span>
            </span>
            <span class="shop-logo-sub">Shop</span>
          </a>
          <div class="shop-header-slot shop-header-slot--end" role="group" aria-label="${escapeAttr(t("shop.nav.actions"))}">
            <a href="${ShopRoutes.cart()}" class="shop-icon-btn shop-cart-btn" aria-label="${escapeAttr(t("shop.cart.title"))}">
              ${CART_ICON}
              ${cartBadgeHtml()}
            </a>
            <a href="${ShopRoutes.account()}" class="shop-icon-btn shop-account-btn" aria-label="${escapeAttr(accountLabel)}" title="${escapeAttr(account?.email || t("shop.nav.account"))}">
              ${ACCOUNT_ICON}
            </a>
            <button type="button" class="shop-icon-btn shop-search-toggle${active === "search" ? " is-active" : ""}" id="shop-search-open" aria-label="${escapeAttr(t("shop.nav.search"))}" aria-expanded="false" aria-controls="shop-search-overlay">
              ${SEARCH_ICON}
            </button>
          </div>
        </header>
      </div>
      <nav class="shop-subnav glass-inset" aria-label="${escapeAttr(t("shop.nav.categories"))}">
        <div class="shop-categories-scroll">
          <a href="${ShopRoutes.home()}" class="${active === "shop" ? "is-active" : ""}">${t("shop.nav.home")}</a>
          ${navCats}
        </div>
      </nav>
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
    </div>
  `;

  wireSearchOverlay(root);
  wireShopHeaderBack(root);
  wireCartBadgeOnce();
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
