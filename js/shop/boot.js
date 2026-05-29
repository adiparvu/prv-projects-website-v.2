/** PRV Shop — bootstrap */

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
import { wireFavoriteButtons } from "./favorites.js";

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

let activePage = "home";
let activeCatalog = null;

function renderPage(page, main, catalog) {
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
      renderConfirmation(main, getParam("orderId"));
      break;
    case "account":
      renderAccountOverview(main);
      break;
    case "orders":
      renderOrders(main);
      break;
    case "order":
      renderOrderDetail(main, getParam("id"));
      break;
    case "invoices":
      renderInvoices(main);
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
  try {
    initEcosystem();
    wireShopNavLinks();
    document.body.classList.add("shop-body");

    if (!window.PRV_I18N?.strings || !Object.keys(window.PRV_I18N.strings).some((k) => k.startsWith("shop."))) {
      await window.PRV_I18N?.applyLang?.(window.PRV_I18N.getLang?.() || "ro", { save: false });
    }

    activeCatalog = await loadCatalog();
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

    renderPage(page, main, activeCatalog);
    wireShareButtons(main);
    wireFavoriteButtons(main);

    window.dispatchEvent(new CustomEvent("prv:footer-ready"));
    if (window.PRV_I18N?.applyLang) {
      window.PRV_I18N.applyLang(window.PRV_I18N.getLang?.() || "ro");
    }

    if (!window.__prvShopLangBound) {
      window.__prvShopLangBound = true;
      onShopLangChange(async () => {
        if (!document.body.classList.contains("shop-body")) return;
        activeCatalog = await loadCatalog(true);
        mountShopLayout({
          active: layoutActive(activePage),
          catalog: activeCatalog,
          searchQuery: activePage === "search" ? getParam("q") || "" : "",
        });
        const m = getMainEl();
        if (m && activeCatalog) {
          renderPage(activePage, m, activeCatalog);
          wireShareButtons(m);
          wireFavoriteButtons(m);
        }
        window.dispatchEvent(new CustomEvent("prv:footer-ready"));
      });
    }
  } catch (err) {
    console.error("[PRV Shop]", err);
    showShopFatal("Catalog or scripts failed to load.");
  }
}
