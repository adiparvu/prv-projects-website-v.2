import { db } from "./db.mjs";
import { validateCartItems } from "./pricing.mjs";

function uid(prefix) {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 9)}`;
}

export function createPendingOrder({ items, customer, discountCode, paymentMethod, lang }) {
  const priced = validateCartItems(items, { discountCode, lang });
  const orderId = uid("ord");
  const invoiceNumber = `PRV-${new Date().getFullYear()}-${orderId.slice(-6).toUpperCase()}`;

  const order = {
    id: orderId,
    status: "pending",
    items: priced.lines,
    subtotalCents: priced.subtotalCents,
    discountCents: priced.discountCents,
    discountCode: priced.discountCode || "",
    shippingCents: priced.shippingCents,
    totalCents: priced.totalCents,
    currency: priced.currency,
    customer: {
      name: customer?.name || "",
      email: (customer?.email || "").toLowerCase().trim(),
      phone: customer?.phone || "",
      address: customer?.address || "",
    },
    payment: {
      provider: "stripe",
      method: paymentMethod || "card",
      status: "pending",
    },
    invoiceId: uid("inv"),
    invoiceNumber,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.upsertOrder(order);
  return order;
}

export function markOrderPaid(orderId, { stripeSessionId, stripePaymentIntentId, stripeEventId } = {}) {
  const order = db.getOrder(orderId);
  if (!order) return null;
  if (order.status === "paid") return order;

  order.status = "paid";
  order.payment.status = "paid";
  order.payment.paidAt = new Date().toISOString();
  if (stripeSessionId) order.payment.stripeSessionId = stripeSessionId;
  if (stripePaymentIntentId) order.payment.stripePaymentIntentId = stripePaymentIntentId;
  if (stripeEventId) order.payment.stripeEventId = stripeEventId;
  order.updatedAt = new Date().toISOString();
  db.upsertOrder(order);
  return order;
}

export function getOrderForCustomer(orderId, email) {
  const order = db.getOrder(orderId);
  if (!order) return null;
  if (email && order.customer?.email?.toLowerCase() !== email.toLowerCase()) return null;
  return order;
}

export function listOrdersForEmail(email) {
  const e = (email || "").toLowerCase();
  return db.getOrders().filter((o) => o.customer?.email?.toLowerCase() === e);
}

export function invoiceHtml(order) {
  const rows = (order.items || [])
    .map(
      (i) =>
        `<tr><td>${escapeHtml(i.name)}</td><td>${i.qty}</td><td align="right">${fmt(i.priceCents)}</td><td align="right">${fmt(i.lineTotalCents || i.priceCents * i.qty)}</td></tr>`
    )
    .join("");

  return `<!DOCTYPE html><html lang="ro"><head><meta charset="utf-8"/><title>${escapeHtml(order.invoiceNumber)}</title>
<style>body{font-family:system-ui,sans-serif;max-width:720px;margin:2rem auto;padding:1rem;color:#111}
table{width:100%;border-collapse:collapse}th,td{padding:0.5rem;border-bottom:1px solid #ddd;text-align:left}
.total{font-weight:700;font-size:1.1rem}</style></head><body>
<h1>PRV Projects — Factură</h1>
<p><strong>${escapeHtml(order.invoiceNumber)}</strong><br/>Data: ${escapeHtml(order.createdAt?.slice(0, 10) || "")}</p>
<p>${escapeHtml(order.customer?.name || "")}<br/>${escapeHtml(order.customer?.email || "")}<br/>${escapeHtml(order.customer?.address || "")}</p>
<table><thead><tr><th>Produs</th><th>Qty</th><th>Preț</th><th>Total</th></tr></thead><tbody>${rows}</tbody></table>
<p>Subtotal: ${fmt(order.subtotalCents)}</p>
${order.discountCents ? `<p>Reducere: −${fmt(order.discountCents)}</p>` : ""}
<p>Livrare: ${order.shippingCents ? fmt(order.shippingCents) : "Gratuită"}</p>
<p class="total">Total: ${fmt(order.totalCents)} ${escapeHtml(order.currency || "EUR")}</p>
<p style="margin-top:2rem;font-size:0.85rem;color:#666">PRV Projects · Belgia · TVA inclus conform legislației în vigoare.</p>
</body></html>`;
}

function fmt(cents) {
  return `€${(cents / 100).toFixed(2)}`;
}

function escapeHtml(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
