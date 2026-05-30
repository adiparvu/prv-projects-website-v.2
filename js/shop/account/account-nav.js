import { ShopRoutes } from "../routes.js";
import { t } from "../i18n.js";

export function accountNav(active) {
  const links = [
    ["overview", "shop.account.nav.account", ShopRoutes.account()],
    ["orders", "shop.account.nav.orders", ShopRoutes.orders()],
    ["returns", "shop.account.nav.returns", ShopRoutes.returns()],
    ["invoices", "shop.account.nav.invoices", ShopRoutes.invoices()],
    ["favorites", "shop.account.nav.favorites", ShopRoutes.favorites()],
  ];
  return `<nav class="shop-account-nav" aria-label="${t("shop.profile.navLabel")}">${links
    .map(
      ([key, labelKey, href]) =>
        `<a href="${href}" class="${active === key ? "is-active" : ""}">${t(labelKey)}</a>`
    )
    .join("")}</nav>`;
}
