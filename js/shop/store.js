/** PRV Shop — client store (cart, account, orders) — syncs to localStorage until API is live */

import { uid } from "./format.js";

const KEYS = {
  cart: "prv_shop_cart",
  account: "prv_shop_account",
  orders: "prv_shop_orders",
  favorites: "prv_shop_favorites",
  reminders: "prv_shop_reminders",
};

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export const ShopStore = {
  getCart() {
    const cart = read(KEYS.cart, { id: uid("cart"), items: [], updatedAt: null });
    cart.items = cart.items || [];
    return cart;
  },

  setCart(cart) {
    cart.updatedAt = new Date().toISOString();
    write(KEYS.cart, cart);
    window.dispatchEvent(new CustomEvent("prv:cartchange"));
  },

  addToCart(product, qty = 1) {
    const cart = this.getCart();
    const existing = cart.items.find((i) => i.productId === product.id);
    if (existing) existing.qty += qty;
    else {
      cart.items.push({
        productId: product.id,
        slug: product.slug,
        name: product.name,
        priceCents: product.priceCents,
        image: product.images?.[0]?.url || "",
        qty,
      });
    }
    this.setCart(cart);
  },

  updateQty(productId, qty) {
    const cart = this.getCart();
    const item = cart.items.find((i) => i.productId === productId);
    if (!item) return;
    if (qty <= 0) cart.items = cart.items.filter((i) => i.productId !== productId);
    else item.qty = qty;
    this.setCart(cart);
  },

  cartCount() {
    return this.getCart().items.reduce((s, i) => s + i.qty, 0);
  },

  getAccount() {
    return read(KEYS.account, null);
  },

  login(email, name = "") {
    const account = { email, name, loggedInAt: new Date().toISOString() };
    write(KEYS.account, account);
    return account;
  },

  logout() {
    localStorage.removeItem(KEYS.account);
  },

  getOrders() {
    return read(KEYS.orders, []);
  },

  saveOrder(order) {
    const orders = this.getOrders();
    orders.unshift(order);
    write(KEYS.orders, orders);
  },

  getOrder(id) {
    return this.getOrders().find((o) => o.id === id);
  },

  getFavorites() {
    return read(KEYS.favorites, []);
  },

  toggleFavorite(productId) {
    const favs = this.getFavorites();
    const idx = favs.indexOf(productId);
    if (idx >= 0) favs.splice(idx, 1);
    else favs.push(productId);
    write(KEYS.favorites, favs);
    window.dispatchEvent(new CustomEvent("prv:favoriteschange"));
    return favs.includes(productId);
  },

  isFavorite(productId) {
    return this.getFavorites().includes(productId);
  },

  getReminders() {
    return read(KEYS.reminders, []);
  },

  hasReminder(productId) {
    return this.getReminders().some((r) => r.productId === productId);
  },

  setReminder(productId, email) {
    const reminders = this.getReminders().filter((r) => r.productId !== productId);
    reminders.push({
      productId,
      email,
      createdAt: new Date().toISOString(),
    });
    write(KEYS.reminders, reminders);
    window.dispatchEvent(new CustomEvent("prv:reminderschange"));
    return true;
  },

  removeReminder(productId) {
    const reminders = this.getReminders().filter((r) => r.productId !== productId);
    write(KEYS.reminders, reminders);
    window.dispatchEvent(new CustomEvent("prv:reminderschange"));
  },
};
