/** PRV Shop — bootstrap */

import { initEcosystem } from "../prv-platform.js";
import { mountShopLayout, getMainEl } from "./layout.js";
import { loadCatalog } from "./catalog.js";
import { renderHome } from "./pages/home.js";
import { renderCategory } from "./pages/category.js";
import { renderProduct } from "./pages/product.js";
import { renderCart } from "./pages/cart.js";
import { renderCheckout } from "./pages/checkout-page.js";
import { renderConfirmation } from "./pages/confirmation.js";
import {
  renderAccountOverview,
  renderOrders,
  renderOrderDetail,
  renderInvoices,
  renderFavorites,
} from "./pages/account.js";

function getParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

export async function bootShop(page) {
  initEcosystem();
  document.body.classList.add("shop-body");
  mountShopLayout({ active: "shop" });

  const catalog = await loadCatalog();
  const main = getMainEl();
  if (!main) return;

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
      await renderFavorites(main, catalog);
      break;
    default:
      renderHome(main, catalog);
  }

  window.dispatchEvent(new CustomEvent("prv:footer-ready"));
  if (window.PRV_I18N?.applyLang) {
    window.PRV_I18N.applyLang(window.PRV_I18N.getLang?.() || "ro");
  }
}
