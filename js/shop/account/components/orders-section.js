import { escapeHtml, formatMoney, formatDate } from "../../format.js";
import { t } from "../../i18n.js";
import { ShopRoutes } from "../../routes.js";

/** @param {Array<{ id: string, invoiceNumber?: string, createdAt: string, totalCents: number, status: string }>} orders */
export function ordersBodyHtml(orders) {
  if (orders.length === 0) {
    return `<p class="shop-acct-empty-inline">${t("shop.orders.empty")}</p>`;
  }

  return `
    <div class="shop-acct-detail-table-wrap">
      <table class="shop-table">
        <thead>
          <tr>
            <th>${t("shop.orders.colOrder")}</th>
            <th>${t("shop.orders.colDate")}</th>
            <th>${t("shop.orders.colTotal")}</th>
            <th>${t("shop.orders.colStatus")}</th>
          </tr>
        </thead>
        <tbody>
          ${orders
            .map(
              (o) => `<tr>
                <td><a href="${ShopRoutes.order(o.id)}">${escapeHtml(o.invoiceNumber || o.id)}</a></td>
                <td>${formatDate(o.createdAt)}</td>
                <td>${formatMoney(o.totalCents)}</td>
                <td>${escapeHtml(o.status)}</td>
              </tr>`
            )
            .join("")}
        </tbody>
      </table>
    </div>
    <p class="shop-acct-detail-foot">
      <a href="${ShopRoutes.orders()}" class="work-cta">${t("shop.profile.viewAllOrders")}</a>
    </p>`;
}

/** @param {Array<{ id: string, invoiceNumber?: string, createdAt: string, totalCents: number, status: string }>} orders */
export function ordersSectionHtml(orders) {
  return ordersBodyHtml(orders);
}
