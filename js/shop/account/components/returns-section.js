import { t } from "../../i18n.js";
import { ShopRoutes } from "../../routes.js";

export function returnsBodyHtml() {
  return `
    <div class="shop-acct-detail-empty">
      <p class="shop-acct-detail-empty__title">${t("shop.returns.empty.title")}</p>
      <p class="shop-acct-detail-empty__desc">${t("shop.returns.empty.desc")}</p>
      <a href="${ShopRoutes.orders()}" class="btn btn-glass btn-sm">${t("shop.returns.viewOrders")}</a>
    </div>
    <p class="shop-acct-detail-foot">
      <a href="${ShopRoutes.returns()}" class="work-cta">${t("shop.profile.viewAllReturns")}</a>
    </p>
  `;
}

export function returnsSectionHtml() {
  return returnsBodyHtml();
}
