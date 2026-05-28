import { formatMoney, formatDate } from "../format.js";
import { ShopStore } from "../store.js";
import { ShopRoutes } from "../routes.js";
import { escapeHtml } from "../format.js";

export function renderConfirmation(main, orderId) {
  const order = ShopStore.getOrder(orderId);

  if (!order) {
    main.innerHTML = `<div class="shop-empty glass-panel"><p>Comandă negăsită.</p></div>`;
    return;
  }

  main.innerHTML = `
    <section class="shop-hero glass-panel" style="text-align:center;align-items:center">
      <p class="eyebrow">Mulțumim</p>
      <h1 class="gradient-text">Comanda #${escapeHtml(order.invoiceNumber || order.id.slice(-8))}</h1>
      <p>Confirmată ${formatDate(order.createdAt)} · ${formatMoney(order.totalCents)}</p>
      ${order.payment?.demo ? '<p class="work-meta">Plată demonstrație (Stripe va fi activ la conectarea API).</p>' : ""}
      <div class="shop-hero-cta" style="justify-content:center">
        <a href="${ShopRoutes.order(order.id)}" class="btn btn-primary">Vezi comanda</a>
        <a href="${ShopRoutes.home()}" class="btn btn-glass">Continuă cumpărăturile</a>
      </div>
    </section>
  `;
}
