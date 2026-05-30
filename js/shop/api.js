/** PRV Shop — API boundary */

import { getApiBase, postJson, getJson, apiRequest } from "../api/client.js";

export { getApiBase };

export function isApiLive() {
  return Boolean(getApiBase());
}

export async function fetchCatalog(lang) {
  if (!isApiLive()) return null;
  return getJson(`/shop/catalog?lang=${encodeURIComponent(lang || "nl")}`);
}

export async function prepareCheckout(payload) {
  if (!isApiLive()) return null;
  try {
    return await postJson("/shop/checkout/prepare", payload);
  } catch (e) {
    if (e.code === "API_DEMO") return null;
    throw e;
  }
}

export async function createCheckoutSession(payload) {
  if (!isApiLive()) return { demo: true };
  try {
    return await postJson("/shop/checkout/session", payload);
  } catch (e) {
    if (e.code === "API_DEMO") return { demo: true };
    throw e;
  }
}

export async function createPaymentIntent(payload) {
  if (!isApiLive()) return { demo: true };
  try {
    return await postJson("/shop/checkout/payment-intent", payload);
  } catch (e) {
    if (e.code === "API_DEMO") return { demo: true };
    throw e;
  }
}

export async function completeCheckout(sessionId, orderId) {
  if (!isApiLive()) return null;
  const q = new URLSearchParams();
  if (sessionId) q.set("session_id", sessionId);
  if (orderId) q.set("orderId", orderId);
  return getJson(`/shop/checkout/complete?${q}`);
}

export async function fetchOrder(orderId) {
  if (!isApiLive()) return null;
  try {
    const data = await getJson(`/shop/orders/${encodeURIComponent(orderId)}`);
    return data?.order || null;
  } catch {
    return null;
  }
}

export async function requestMagicLink(email) {
  if (!isApiLive()) return { demo: true };
  return postJson("/auth/magic-link", { email });
}

export async function fetchAccountOrders() {
  if (!isApiLive()) return null;
  try {
    const data = await getJson("/account/orders");
    return data?.orders || [];
  } catch {
    return null;
  }
}

import { getAuthToken } from "./auth.js";

export function invoiceUrl(orderId) {
  const base = getApiBase();
  if (!base) return null;
  const token = getAuthToken();
  const q = new URLSearchParams({ format: "html" });
  if (token) q.set("access_token", token);
  return `${base}/v1/account/invoices/${encodeURIComponent(orderId)}?${q}`;
}

export async function addStockReminder({ productId, email, lang }) {
  if (!isApiLive()) return null;
  return postJson("/shop/reminders", { productId, email, lang });
}

export async function removeStockReminder({ productId, email }) {
  if (!isApiLive()) return null;
  return apiRequest("/shop/reminders", {
    method: "DELETE",
    body: JSON.stringify({ productId, email }),
  });
}

export const AdminShopApi = {
  products: () => `${getApiBase()}/admin/shop/products`,
  orders: () => `${getApiBase()}/admin/shop/orders`,
  stock: () => `${getApiBase()}/admin/shop/stock`,
};
