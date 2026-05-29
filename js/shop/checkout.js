/** PRV Shop — checkout (Stripe-ready) */

import { uid, formatMoney } from "./format.js";
import { ShopStore } from "./store.js";
import { applyDiscount } from "./catalog.js";
import { createCheckoutSession } from "./api.js";
import { t } from "./i18n.js";

const SHIPPING_CENTS = 1500;

export function computeTotals(catalog, cart, discountCode = "") {
  const subtotalCents = cart.items.reduce((s, i) => s + i.priceCents * i.qty, 0);
  const { discountCents } = discountCode ? applyDiscount(catalog, discountCode, subtotalCents) : { discountCents: 0 };
  const shippingCents = subtotalCents > 15000 ? 0 : SHIPPING_CENTS;
  const totalCents = Math.max(0, subtotalCents - discountCents + shippingCents);
  return { subtotalCents, discountCents, shippingCents, totalCents };
}

export async function submitCheckout({ catalog, customer, paymentMethod, discountCode, orderId: externalOrderId }) {
  const cart = ShopStore.getCart();
  if (!cart.items.length) throw new Error("empty_cart");

  const totals = computeTotals(catalog, cart, discountCode);
  const orderId = externalOrderId || uid("ord");

  const order = {
    id: orderId,
    status: "pending",
    items: cart.items.map((i) => ({ ...i })),
    ...totals,
    currency: catalog.meta?.currency || "EUR",
    customer,
    payment: {
      provider: "stripe",
      method: paymentMethod,
      status: "pending",
    },
    invoiceId: uid("inv"),
    invoiceNumber: `PRV-${new Date().getFullYear()}-${orderId.slice(-6).toUpperCase()}`,
    createdAt: new Date().toISOString(),
  };

  const payload = {
    orderId,
    items: cart.items,
    customer,
    paymentMethod,
    discountCode,
    successUrl: `${location.origin}${location.pathname.replace("checkout.html", "confirmation.html")}?orderId=${orderId}`,
    cancelUrl: location.href,
    paymentMethodTypes: ["card", "bancontact", "paypal"],
  };

  try {
    const session = await createCheckoutSession(payload);
    if (session?.url) {
      window.location.href = session.url;
      return null;
    }
  } catch {
    /* demo fallback */
  }

  order.status = "paid";
  order.payment.status = "paid_demo";
  order.payment.demo = true;
  ShopStore.saveOrder(order);
  ShopStore.setCart({ id: cart.id, items: [] });
  if (customer.email) ShopStore.login(customer.email, customer.name);

  return order;
}

export function renderSummaryHtml(totals, discountCode = "") {
  return `
    <div class="shop-summary-row"><span>${t("shop.cart.subtotal")}</span><span>${formatMoney(totals.subtotalCents)}</span></div>
    ${totals.discountCents ? `<div class="shop-summary-row"><span>${t("shop.cart.discount", { code: escapeHtml(discountCode) })}</span><span>−${formatMoney(totals.discountCents)}</span></div>` : ""}
    <div class="shop-summary-row"><span>${t("shop.cart.shipping")}</span><span>${totals.shippingCents ? formatMoney(totals.shippingCents) : t("shop.cart.freeShipping")}</span></div>
    <div class="shop-summary-row total"><span>${t("shop.cart.total")}</span><span>${formatMoney(totals.totalCents)}</span></div>
  `;
}

function escapeHtml(str) {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;");
}
