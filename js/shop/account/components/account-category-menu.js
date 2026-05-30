import { t } from "../../i18n.js";
import { ICONS } from "../icons.js";

/** @typedef {{ id: string, titleKey: string, descKey: string, icon: string }} AccountCategory */

/** @returns {AccountCategory[]} */
export function getAccountCategories() {
  return [
    {
      id: "profile-details",
      titleKey: "shop.profile.sections.profileDetails",
      descKey: "shop.profile.categories.profileDetailsDesc",
      icon: ICONS.user,
    },
    {
      id: "orders",
      titleKey: "shop.orders.title",
      descKey: "shop.profile.categories.ordersDesc",
      icon: ICONS.orders,
    },
    {
      id: "returns",
      titleKey: "shop.returns.title",
      descKey: "shop.profile.categories.returnsDesc",
      icon: ICONS.returns,
    },
    {
      id: "notifications",
      titleKey: "shop.profile.sections.notifications",
      descKey: "shop.profile.categories.notificationsDesc",
      icon: ICONS.bell,
    },
    {
      id: "app-settings",
      titleKey: "shop.profile.sections.appSettings",
      descKey: "shop.profile.categories.appSettingsDesc",
      icon: ICONS.settings,
    },
  ];
}

export function accountCategoryMenuHtml() {
  const items = getAccountCategories()
    .map(
      (cat) => `
    <li class="shop-acct-settings-menu__item">
      <button type="button" class="shop-acct-settings-menu__btn" data-sheet-open="${cat.id}">
        <span class="shop-acct-settings-menu__icon" aria-hidden="true">${cat.icon}</span>
        <span class="shop-acct-settings-menu__text">
          <strong>${t(cat.titleKey)}</strong>
          <span>${t(cat.descKey)}</span>
        </span>
        <span class="shop-acct-settings-menu__chevron" aria-hidden="true">${ICONS.chevron}</span>
      </button>
    </li>`
    )
    .join("");

  return `
    <nav class="shop-acct-settings-menu glass-panel" aria-label="${t("shop.profile.navLabel")}">
      <ul class="shop-acct-settings-menu__list">${items}</ul>
    </nav>
  `;
}

/** @param {string} categoryId */
export function getAccountCategoryTitleKey(categoryId) {
  return getAccountCategories().find((c) => c.id === categoryId)?.titleKey || "shop.account.title";
}
