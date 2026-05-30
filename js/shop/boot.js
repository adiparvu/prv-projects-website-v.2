/** PRV Shop — bootstrap (intrare rapidă, fără așteptări inutile) */

import { initEcosystem } from "../prv-platform.js";
import { wireShopNavLinks } from "../site-paths.js";
import { mountShopLayout, getMainEl } from "./layout.js";
import { loadCatalog } from "./catalog.js";
import { renderHome } from "./pages/home.js";
import { renderCategory } from "./pages/category.js";
import { renderProduct } from "./pages/product.js";
import { renderCart } from "./pages/cart.js";
import { renderCheckout } from "./pages/checkout-page.js";
import { renderConfirmation } from "./pages/confirmation.js";
import { renderSearch } from "./pages/search.js";
import {
  renderAccountOverview,
  renderOrders,
  renderOrderDetail,
  renderInvoices,
  renderFavorites,
} from "./pages/account.js";
import { onShopLangChange } from "./i18n.js";
import { wireShareButtons } from "./share.js";
import { initShopAuth, handleMagicLinkFromUrl } from "./auth.js";
import { wireFavoriteButtons } from "./favorites.js";
import { mountWelcomePromo } from "./welcome-promo.js";
import { remountShopPickers } from "./picker-mount.js";
import { initTheme } from "../prv-theme-picker.js";
import { initThemeTransition } from "../fx-theme-transition.js";
import { initBackNav } from "../prv-back.js";

if (typeof window !== "undefined") {
  window.PRV_BACK = { initBackNav };
}

function getParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

function layoutActive(page) {
  if (page === "home") return "shop";
  if (page === "category" || page === "search") return page;
  return "shop";
}

function showShopFatal(message) {
  const root = document.getElementById("shop-root");
  if (!root) return;
  root.innerHTML = `
    <div class="glass-panel" style="max-width:520px;margin:2rem auto;padding:1.25rem">
      <h1 style="font-size:1.15rem;margin:0 0 0.5rem">Shop</h1>
      <p style="margin:0 0 1rem;opacity:0.85">${message}</p>
      <a href="index.html" class="btn btn-primary">OK</a>
    </div>
  `;
}

function shopPromoEnabled() {
  return window.PRV_CONFIG?.shop?.welcomePromo !== false;
}

async function ensureShopI18n() {
  if (!window.PRV_I18N?.applyLang) throw new Error("i18n_missing");
  const strings = window.PRV_I18N.strings || {};
  if (Object.keys(strings).some((k) => k.startsWith("shop."))) return;
  await window.PRV_I18N.applyLang(window.PRV_I18N.getLang?.() || "ro", { save: false });
}

let activePage = "home";
let activeCatalog = null;
let shopLangBusy = false;

async function renderPage(page, main, catalog) {
  switch (page) {
    case "home":
      renderHome(main, catalog);
      break;
    case "category":
      renderCategory(main, catalog, getParam("slug") || "finisaje");
      break;
    case "product":
      renderProduct(main, catalog, getParam("slug"));
      break;
    case "search":
      renderSearch(main, catalog, getParam("q"));
      break;
    case "cart":
      renderCart(main, catalog);
      break;
    case "checkout":
      renderCheckout(main, catalog);
      break;
    case "confirmation":
      await renderConfirmation(main, getParam("orderId"));
      break;
    case "account":
      await renderAccountOverview(main);
      break;
    case "orders":
      await renderOrders(main);
      break;
    case "order":
      await renderOrderDetail(main, getParam("id"));
      break;
    case "invoices":
      await renderInvoices(main);
      break;
    case "favorites":
      renderFavorites(main, catalog);
      break;
    default:
      renderHome(main, catalog);
  }
}

export async function bootShop(page) {
  activePage = page;
  document.body.classList.add("shop-body", "fx-page-ready");

  try {
    if (!window.PRV_I18N?.applyLang) throw new Error("i18n_missing");

    initThemeTransition();
    initTheme();
    initEcosystem();
    initShopAuth();
    wireShopNavLinks();

    const catalogPromise = loadCatalog();
    const i18nPromise = ensureShopI18n();

    if (getParam("magic")) await handleMagicLinkFromUrl();

    const [catalog] = await Promise.all([catalogPromise, i18nPromise]);
    activeCatalog = catalog;

    mountShopLayout({
      active: layoutActive(page),
      catalog: activeCatalog,
      searchQuery: page === "search" ? getParam("q") || "" : "",
    });

    const main = getMainEl();
    if (!main) {
      showShopFatal("Layout error");
      return;
    }

    await renderPage(page, main, activeCatalog);
    wireShareButtons(main);
    wireFavoriteButtons(main);
    initBackNav(main);

    [...document.body.classList]
      .filter((c) => c.startsWith("shop-page-"))
      .forEach((c) => document.body.classList.remove(c));
    document.body.classList.add(`shop-page-${page}`);
    remountShopPickers();

    window.dispatchEvent(new CustomEvent("prv:footer-ready"));

    if (shopPromoEnabled()) {
      requestAnimationFrame(() => mountWelcomePromo());
    }

    if (!window.__prvShopLangBound) {
      window.__prvShopLangBound = true;
      onShopLangChange(async () => {
        if (!document.body.classList.contains("shop-body") || shopLangBusy) return;
        shopLangBusy = true;
        try {
          activeCatalog = await loadCatalog(true);
          mountShopLayout({
            active: layoutActive(activePage),
            catalog: activeCatalog,
            searchQuery: activePage === "search" ? getParam("q") || "" : "",
          });
          const m = getMainEl();
          if (m && activeCatalog) {
            await renderPage(activePage, m, activeCatalog);
            wireShareButtons(m);
            wireFavoriteButtons(m);
            initBackNav(m);
          }
          remountShopPickers();
          window.PRV_I18N?.applyLang?.(window.PRV_I18N.getLang?.() || "ro", { save: false, notify: false });
          window.dispatchEvent(new CustomEvent("prv:footer-ready"));
        } finally {
          shopLangBusy = false;
        }
      });
    }
  } catch (err) {
    console.error("[PRV Shop]", err);
    const hint =
      err.message === "catalog_load_failed"
        ? "Nu s-a putut încărca catalogul. Verifică că deschizi /shop/index.html (nu doar /shop) și că fișierul data/shop/catalog.json există."
        : err.message === "i18n_missing"
          ? "Traducerile nu s-au încărcat. Reîncarcă pagina sau verifică js/translations/."
          : "Catalog sau scripturi — reîncarcă pagina.";
    showShopFatal(hint);
  }
}
