/** PRV Shop — URL helpers (static-friendly; pretty paths when dashboard API is connected) */

function shopBase() {
  const path = window.location.pathname;
  const m = path.match(/^(.*\/shop)(?:\/|$)/);
  if (m) return m[1];
  return "/shop";
}

function rootPrefix() {
  const path = window.location.pathname;
  const m = path.match(/^(.*)\/shop(?:\/|$)/);
  if (m && m[1]) return m[1];
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
  search: (q) => `${shopBase()}/search.html?q=${encodeURIComponent(q)}`,
  siteHome: () => `${rootPrefix()}/index.html`,
};
