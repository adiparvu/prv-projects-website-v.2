import { t } from "../../i18n.js";
import { accountDisclosureHtml } from "./disclosure-group.js";

/** @param {import('../types.js').ShopNotificationPreferences} prefs */
export function shopNotificationsSectionHtml(prefs) {
  const body = `
    <ul class="shop-acct-toggle-list">
      ${toggleRow("orders", "shop.profile.notifications.orders.title", "shop.profile.notifications.orders.desc", prefs.orders)}
      ${toggleRow("returns", "shop.profile.notifications.returns.title", "shop.profile.notifications.returns.desc", prefs.returns)}
      ${toggleRow("newsletters", "shop.profile.notifications.newsletters.title", "shop.profile.notifications.newsletters.desc", prefs.newsletters)}
    </ul>
    <p class="shop-acct-save-status is-success" data-notif-status hidden role="status"></p>
  `;
  return accountDisclosureHtml("shop.profile.sections.notifications", body, { id: "shop-profile-notifications" });
}

function toggleRow(key, titleKey, descKey, checked) {
  const id = `notif-${key}`;
  return `
    <li class="shop-acct-toggle-row glass-inset">
      <div class="shop-acct-toggle-row__text">
        <label for="${id}">${t(titleKey)}</label>
        <p>${t(descKey)}</p>
      </div>
      <button type="button" class="shop-acct-switch${checked ? " is-on" : ""}" id="${id}" role="switch" aria-checked="${checked}" data-notif-toggle="${key}">
        <span class="shop-acct-switch__thumb" aria-hidden="true"></span>
      </button>
    </li>
  `;
}

/** @param {HTMLElement} root @param {{ onChange: (key: string, value: boolean) => Promise<void> }} handlers */
export function wireShopNotificationsSection(root, handlers) {
  root.querySelectorAll("[data-notif-toggle]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const key = btn.getAttribute("data-notif-toggle");
      const next = !btn.classList.contains("is-on");
      btn.classList.toggle("is-on", next);
      btn.setAttribute("aria-checked", String(next));
      await handlers.onChange?.(key, next);
      const status = root.querySelector("[data-notif-status]");
      if (status) {
        status.hidden = false;
        status.textContent = t("shop.profile.saved");
        window.setTimeout(() => {
          status.hidden = true;
        }, 2000);
      }
    });
  });
}
