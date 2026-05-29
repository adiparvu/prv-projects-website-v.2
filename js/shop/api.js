/** PRV Shop — API boundary (customer vs admin). Uses unified js/api/client.js */

import { getApiBase, postJson } from "../api/client.js";

export { getApiBase };

/** Create Stripe Checkout Session — requires backend */
export async function createCheckoutSession(payload) {
  const base = getApiBase();
  if (!base) return { demo: true };

  try {
    return await postJson("/shop/checkout/session", payload);
  } catch (e) {
    if (e.code === "API_DEMO") return { demo: true };
    throw e;
  }
}

/** Create PaymentIntent for embedded Payment Element */
export async function createPaymentIntent(payload) {
  const base = getApiBase();
  if (!base) return { demo: true };

  try {
    return await postJson("/shop/checkout/payment-intent", payload);
  } catch (e) {
    if (e.code === "API_DEMO") return { demo: true };
    throw e;
  }
}

/** Admin API stubs — used by dashboard/shop later */
export const AdminShopApi = {
  products: () => `${getApiBase()}/admin/shop/products`,
  orders: () => `${getApiBase()}/admin/shop/orders`,
  stock: () => `${getApiBase()}/admin/shop/stock`,
};
