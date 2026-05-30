import { t } from "../../i18n.js";
import { ShopRoutes } from "../../routes.js";
import { ICONS } from "../icons.js";

export function ordersAndReturnsSectionHtml() {
  return `
    <section class="shop-acct-section glass-panel" aria-labelledby="shop-acct-nav-title">
      <header class="shop-acct-section__head">
        <h2 id="shop-acct-nav-title" class="shop-acct-section__title">${t("shop.profile.sections.ordersReturns")}</h2>
      </header>
      <div class="shop-acct-nav-cards">
        <a href="${ShopRoutes.orders()}" class="shop-acct-nav-card glass-inset">
          <span class="shop-acct-nav-card__icon">${ICONS.orders}</span>
          <span class="shop-acct-nav-card__text">
            <strong>${t("shop.orders.title")}</strong>
            <span>${t("shop.profile.ordersReturns.ordersDesc")}</span>
          </span>
          ${ICONS.chevron}
        </a>
        <a href="${ShopRoutes.returns()}" class="shop-acct-nav-card glass-inset">
          <span class="shop-acct-nav-card__icon">${ICONS.returns}</span>
          <span class="shop-acct-nav-card__text">
            <strong>${t("shop.returns.title")}</strong>
            <span>${t("shop.profile.ordersReturns.returnsDesc")}</span>
          </span>
          ${ICONS.chevron}
        </a>
        <a href="${ShopRoutes.invoices()}" class="shop-acct-nav-card glass-inset">
          <span class="shop-acct-nav-card__icon">${ICONS.shield}</span>
          <span class="shop-acct-nav-card__text">
            <strong>${t("shop.invoices.title")}</strong>
            <span>${t("shop.profile.ordersReturns.invoicesDesc")}</span>
          </span>
          ${ICONS.chevron}
        </a>
        <a href="${ShopRoutes.favorites()}" class="shop-acct-nav-card glass-inset">
          <span class="shop-acct-nav-card__icon">${ICONS.star}</span>
          <span class="shop-acct-nav-card__text">
            <strong>${t("shop.favorites.title")}</strong>
            <span>${t("shop.profile.ordersReturns.favoritesDesc")}</span>
          </span>
          ${ICONS.chevron}
        </a>
      </div>
    </section>
  `;
}
