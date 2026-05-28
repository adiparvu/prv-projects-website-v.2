/** PRV Shop — API boundary (customer vs admin). Replace base URL when dashboard backend is ready. */

function shopConfig() {
  return window.PRV_CONFIG?.shop || {};
}

export function getApiBase() {
  return shopConfig().apiBase || "";
}

/** Create Stripe Checkout Session — requires backend */
export async function createCheckoutSession(payload) {
  const base = getApiBase();
  if (!base) return { demo: true };

  const res = await fetch(`${base}/checkout/session`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("checkout_session_failed");
  return res.json();
}

/** Admin API stubs — used by dashboard/shop later */
export const AdminShopApi = {
  products: () => `${getApiBase()}/admin/shop/products`,
  orders: () => `${getApiBase()}/admin/shop/orders`,
  stock: () => `${getApiBase()}/admin/shop/stock`,
};
