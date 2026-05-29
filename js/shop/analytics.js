/** PRV Shop — GA4 ecommerce events (when gaMeasurementId is set) */

function gaId() {
  return window.PRV_CONFIG?.gaMeasurementId || "";
}

function gtagSafe(event, params) {
  if (!gaId() || typeof window.gtag !== "function") return;
  window.gtag("event", event, params);
}

export function trackViewItem(product) {
  gtagSafe("view_item", {
    currency: "EUR",
    value: (product.priceCents || 0) / 100,
    items: [{ item_id: product.id, item_name: product.name }],
  });
}

export function trackAddToCart(product, qty = 1) {
  gtagSafe("add_to_cart", {
    currency: "EUR",
    value: ((product.priceCents || 0) * qty) / 100,
    items: [{ item_id: product.id, item_name: product.name, quantity: qty }],
  });
}

export function trackBeginCheckout(cartItems, totalCents) {
  gtagSafe("begin_checkout", {
    currency: "EUR",
    value: totalCents / 100,
    items: cartItems.map((i) => ({
      item_id: i.productId,
      item_name: i.name,
      quantity: i.qty,
    })),
  });
}

export function trackPurchase(order) {
  gtagSafe("purchase", {
    transaction_id: order.id,
    currency: order.currency || "EUR",
    value: order.totalCents / 100,
    items: (order.items || []).map((i) => ({
      item_id: i.productId,
      item_name: i.name,
      quantity: i.qty,
    })),
  });
}
