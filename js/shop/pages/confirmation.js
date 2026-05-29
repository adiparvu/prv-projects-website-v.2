import { formatMoney, formatDate, escapeHtml } from "../format.js";
import { ShopStore } from "../store.js";
import { ShopRoutes } from "../routes.js";
import { t } from "../i18n.js";

export function renderConfirmation(main, orderId) {
  const order = ShopStore.getOrder(orderId);

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
      <div class="shop-hero-cta" style="justify-content:center">
        <a href="${ShopRoutes.order(order.id)}" class="btn btn-primary">${t("shop.confirm.viewOrder")}</a>
        <a href="${ShopRoutes.home()}" class="btn btn-glass">${t("shop.confirm.continue")}</a>
      </div>
    </section>
  `;
}
