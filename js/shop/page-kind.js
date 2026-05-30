/**
 * Shop page modes — storefront home vs utility pages (account, cart, etc.)
 */

const STOREFRONT_HOME = "home";

const UTILITY_PAGES = new Set([
  "account",
  "orders",
  "order",
  "invoices",
  "favorites",
  "returns",
  "cart",
  "checkout",
  "confirmation",
]);

/** @param {string} [page] bootShop page id */
export function normalizeShopPage(page) {
  return page || STOREFRONT_HOME;
}

/** Homepage shop — USP, categorii, boot enter */
export function isShopStorefrontHome(page) {
  return normalizeShopPage(page) === STOREFRONT_HOME;
}

/** Cont, coș, checkout, comenzi — layout simplu, fără efecte de storefront */
export function isShopUtilityPage(page) {
  return UTILITY_PAGES.has(normalizeShopPage(page));
}

/** Detect page id from URL (for shop-scroll-reset.js in <head>) */
export function detectShopPageFromPath(pathname = location.pathname) {
  if (!pathname.includes("/shop")) return null;
  const after = pathname.split("/shop/")[1] || "";
  const parts = after.split("/").filter(Boolean);

  if (parts.length === 0) return STOREFRONT_HOME;
  if (parts.length === 1 && parts[0] === "index.html") return STOREFRONT_HOME;

  if (parts[0] === "account") {
    const file = parts[1] || "index.html";
    if (file === "index.html") return "account";
    if (file === "orders.html") return "orders";
    if (file === "order.html") return "order";
    if (file === "invoices.html") return "invoices";
    if (file === "favorites.html") return "favorites";
    if (file === "returns.html") return "returns";
    return "account";
  }

  const file = parts[parts.length - 1] || "index.html";
  const map = {
    "index.html": STOREFRONT_HOME,
    "category.html": "category",
    "product.html": "product",
    "search.html": "search",
    "cart.html": "cart",
    "checkout.html": "checkout",
    "confirmation.html": "confirmation",
  };
  return map[file] || "category";
}
