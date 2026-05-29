import { formatMoney, formatDate, escapeHtml } from "../format.js";
import { ShopStore } from "../store.js";
import { ShopRoutes } from "../routes.js";
import { completeCheckout, fetchOrder } from "../api.js";
import { getApiBase } from "../api.js";
import { trackPurchase } from "../analytics.js";
import { t } from "../i18n.js";

export async function renderConfirmation(main, orderId) {
  const params = new URLSearchParams(window.location.search);
  const sessionId = params.get("session_id");
  let order = null;

  if (getApiBase()) {
    if (sessionId) {
      try {
        const data = await completeCheckout(sessionId, orderId);
        order = data?.order;
      } catch (e) {
        console.error("[confirmation]", e);
      }
    }
    if (!order && orderId) {
      for (let i = 0; i < 6 && (!order || order.status === "pending"); i++) {
        if (i > 0) await new Promise((r) => setTimeout(r, 1500));
        order = await fetchOrder(orderId);
        if (sessionId && (!order || order.status === "pending")) {
          const data = await completeCheckout(sessionId, orderId);
          if (data?.order) order = data.order;
        }
      }
    }
    if (order?.status === "paid") {
      ShopStore.cacheOrder(order);
      ShopStore.setCart({ id: ShopStore.getCart().id, items: [] });
      trackPurchase(order);
    }
  }

  if (!order) order = ShopStore.getOrder(orderId);

  if (!order) {
    main.innerHTML = `<div class="shop-empty glass-panel"><p>${t("shop.confirm.notFound")}</p></div>`;
    return;
  }

  main.innerHTML = `
    <section class="shop-hero glass-panel" style="text-align:center;align-items:center">
      <p class="eyebrow">${t("shop.confirm.thanks")}</p>
      <h1 class="gradient-text">${t("shop.confirm.order", { id: order.invoiceNumber || order.id.slice(-8) })}</h1>
      <p>${t("shop.confirm.meta", { date: formatDate(order.createdAt), total: formatMoney(order.totalCents) })}</p>
      ${order.payment?.demo ? `<p class="work-meta">${t("shop.confirm.demo")}</p>` : ""}
      ${order.status === "pending" ? `<p class="work-meta">${t("shop.checkout.processing")}</p>` : ""}
      <div class="shop-hero-cta" style="justify-content:center">
        <a href="${ShopRoutes.order(order.id)}" class="btn btn-primary">${t("shop.confirm.viewOrder")}</a>
        <a href="${ShopRoutes.home()}" class="btn btn-glass">${t("shop.confirm.continue")}</a>
      </div>
    </section>
  `;
}
