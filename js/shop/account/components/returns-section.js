import { t } from "../../i18n.js";
import { ShopRoutes } from "../../routes.js";
import { accountDisclosureHtml } from "./disclosure-group.js";

export function returnsSectionHtml() {
  const body = `
    <div class="shop-acct-disclosure-empty">
      <p class="shop-acct-disclosure-empty__title">${t("shop.returns.empty.title")}</p>
      <p class="shop-acct-disclosure-empty__desc">${t("shop.returns.empty.desc")}</p>
      <a href="${ShopRoutes.orders()}" class="btn btn-glass btn-sm">${t("shop.returns.viewOrders")}</a>
    </div>
    <p class="shop-acct-disclosure-foot">
      <a href="${ShopRoutes.returns()}" class="work-cta">${t("shop.profile.viewAllReturns")}</a>
    </p>
  `;

  return accountDisclosureHtml("shop.returns.title", body, { id: "shop-profile-returns" });
}
