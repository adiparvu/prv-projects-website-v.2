/** PRV Shop — bootstrap instant (fără delay, fără overlay promo) */

import { initEcosystem } from "../prv-platform.js";
import { wireShopNavLinks } from "../site-paths.js";
import { mountShopLayout, getMainEl } from "./layout.js";
import { loadCatalog, getInstantCatalog } from "./catalog.js";
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

function hasShopStrings() {
  return Object.keys(window.PRV_I18N?.strings || {}).some((k) => k.startsWith("shop."));
}

function kickShopI18n() {
  if (!window.PRV_I18N?.applyLang || hasShopStrings()) return;
  window.PRV_I18N.applyLang(window.PRV_I18N.getLang?.() || "ro", { save: false }).catch(() => {});
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

function finishPage(page, main, catalog) {
  wireShareButtons(main);
  wireFavoriteButtons(main);
  initBackNav(main);

  [...document.body.classList]
    .filter((c) => c.startsWith("shop-page-"))
    .forEach((c) => document.body.classList.remove(c));
  document.body.classList.add(`shop-page-${page}`);

  queueMicrotask(() => {
    remountShopPickers();
    window.dispatchEvent(new CustomEvent("prv:footer-ready"));
  });
}

export async function bootShop(page) {
  activePage = page;
  document.body.classList.add("shop-body", "fx-page-ready");

  if (!window.PRV_I18N?.applyLang) {
    showShopFatal("Traducerile nu s-au încărcat.");
    return;
  }

  initThemeTransition();
  initTheme();
  initShopAuth();
  wireShopNavLinks();
  kickShopI18n();

  const instant = getInstantCatalog();
  const layoutOpts = {
    active: layoutActive(page),
    catalog: instant,
    searchQuery: page === "search" ? getParam("q") || "" : "",
  };

  mountShopLayout(layoutOpts);

  const main = getMainEl();
  if (!main) {
    showShopFatal("Layout error");
    return;
  }

  if (instant) {
    activeCatalog = instant;
    await renderPage(page, main, instant);
    finishPage(page, main, instant);
  }

  queueMicrotask(() => initEcosystem());

  try {
    if (getParam("magic")) await handleMagicLinkFromUrl();

    const catalog = await loadCatalog(false);
    activeCatalog = catalog;

    if (!instant) {
      mountShopLayout({ ...layoutOpts, catalog });
      const m = getMainEl();
      if (!m) return;
      await renderPage(page, m, catalog);
      finishPage(page, m, catalog);
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
            finishPage(activePage, m, activeCatalog);
          }
          window.PRV_I18N?.applyLang?.(window.PRV_I18N.getLang?.() || "ro", { save: false, notify: false });
        } finally {
          shopLangBusy = false;
        }
      });
    }
  } catch (err) {
    console.error("[PRV Shop]", err);
    if (instant) return;
    const hint =
      err.message === "catalog_load_failed"
        ? "Nu s-a putut încărca catalogul. Deschide /shop/index.html și verifică data/shop/catalog.json."
        : "Reîncarcă pagina.";
    showShopFatal(hint);
  }
}
