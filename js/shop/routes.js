/** PRV Shop — URL helpers (static-friendly; pretty paths when dashboard API is connected) */

function shopBase() {
  const path = window.location.pathname;
  if (path.includes("/shop/")) {
    const idx = path.indexOf("/shop/");
    return path.slice(0, idx + "/shop".length);
  }
  return "/shop";
}

function rootPrefix() {
  const path = window.location.pathname;
  const shopIdx = path.indexOf("/shop/");
  if (shopIdx > 0) return path.slice(0, shopIdx);
  return "";
}

export const ShopRoutes = {
  base: shopBase,
  prefix: rootPrefix,
  home: () => `${shopBase()}/index.html`,
  category: (slug) => `${shopBase()}/category.html?slug=${encodeURIComponent(slug)}`,
  product: (slug) => `${shopBase()}/product.html?slug=${encodeURIComponent(slug)}`,
  cart: () => `${shopBase()}/cart.html`,
  checkout: () => `${shopBase()}/checkout.html`,
  confirmation: (orderId) => `${shopBase()}/confirmation.html?orderId=${encodeURIComponent(orderId)}`,
  account: () => `${shopBase()}/account/index.html`,
  orders: () => `${shopBase()}/account/orders.html`,
  order: (id) => `${shopBase()}/account/order.html?id=${encodeURIComponent(id)}`,
  invoices: () => `${shopBase()}/account/invoices.html`,
  favorites: () => `${shopBase()}/account/favorites.html`,
  siteHome: () => `${rootPrefix()}/index.html`,
};
