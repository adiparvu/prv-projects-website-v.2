/**
 * Customer profile page — settings-style navigation stack
 */

import { t } from "../i18n.js";
import { getApiBase, fetchAccountOrders } from "../api.js";
import { validateEmail, validatePhone, validateRequired, validateAddress } from "./validation.js";
import { fetchCustomerProfile, saveCustomerProfile, addLoyaltyToWallet } from "./profile-api.js";
import { ProfileStore } from "./profile-store.js";
import { ShopStore } from "../store.js";
import { createAccountNavStack, stackScreenClass } from "./account-nav-stack.js";
import { accountCategoryMenuHtml, getAccountCategoryTitleKey } from "./components/account-category-menu.js";
import { accountProfileHeaderHtml, wireAccountProfileHeader } from "./components/account-profile-header.js";
import { loyaltyCardHtml, wireLoyaltyCard } from "./components/loyalty-card.js";
import { wirePersonalDetailsForm, showFieldError } from "./components/personal-details-form.js";
import { favoriteAddressesBodyHtml, wireFavoriteAddressesSection } from "./components/favorite-addresses-section.js";
import { wirePreferredPaymentMethodSection } from "./components/preferred-payment-method-section.js";
import { shopNotificationsBodyHtml, wireShopNotificationsSection } from "./components/shop-notifications-section.js";
import { appSettingsBodyHtml, wireAppSettingsSection } from "./components/app-settings-section.js";
import { profileDetailsBodyHtml } from "./components/profile-details-section.js";
import { ordersBodyHtml } from "./components/orders-section.js";
import { returnsBodyHtml } from "./components/returns-section.js";
import { scrollAccountViewToTop } from "./account-scroll.js";
import { accountLoadingHtml, accountErrorBannerHtml, showAccountToast } from "./components/states.js";
import { ICONS } from "./icons.js";

/** @param {HTMLElement} main @param {{ onLogout?: () => void }} opts */
export async function mountCustomerProfilePage(main, opts = {}) {
  main.innerHTML = accountLoadingHtml();
  main.querySelector(".shop-acct-state")?.insertAdjacentHTML(
    "afterbegin",
    `<span class="shop-acct-state__icon">${ICONS.spinner}</span>`
  );

  let bundle;
  try {
    bundle = await fetchCustomerProfile();
    if (!bundle?.profile) {
      const acct = ShopStore.getAccount();
      if (acct) bundle = ProfileStore.ensureForAccount(acct);
    }
  } catch {
    main.innerHTML = accountErrorBannerHtml(t("shop.profile.loadError"));
    return;
  }

  if (!bundle?.profile) {
    main.innerHTML = accountErrorBannerHtml(t("shop.profile.loadError"));
    return;
  }

  const orders = await loadProfileOrders();
  initProfileNavigation(main, bundle, orders, opts);
}

async function loadProfileOrders() {
  let orders = ShopStore.getOrders();
  if (getApiBase()) {
    try {
      const fromApi = await fetchAccountOrders();
      if (fromApi) {
        orders = fromApi;
        ShopStore.syncOrdersFromApi(orders);
      }
    } catch {
      /* keep local orders */
    }
  }
  return orders;
}

/** @param {import('./types.js').CustomerAccountBundle} bundle */
function initProfileNavigation(main, bundle, orders, opts) {
  const navStack = createAccountNavStack();
  /** @type {{ bundle: import('./types.js').CustomerAccountBundle, orders: object[], opts: object, main: HTMLElement }} */
  const ctx = { bundle, orders, opts, main };

  main.innerHTML = `
    <div class="shop-acct-page" data-profile-root>
      <div class="shop-acct-stack-viewport" data-acct-stack-viewport></div>
    </div>
  `;

  const viewport = main.querySelector("[data-acct-stack-viewport]");
  if (!viewport) return;

  const render = () => {
    const direction = navStack.consumeDirection();
    const screen = navStack.current();
    const animClass = stackScreenClass(direction);

    viewport.innerHTML =
      screen === "root"
        ? renderRootScreen(ctx, animClass)
        : renderDetailScreen(screen, ctx, animClass);

    wireCurrentScreen(main, ctx, navStack);
    syncAccountHeaderBack(navStack, render);
    updateAccountPageTitle(ctx, navStack.current());

    if (screen !== "root") {
      scrollAccountViewToTop(main);
    }
  };

  viewport.addEventListener("click", (e) => {
    const pushBtn = e.target.closest("[data-stack-push]");
    if (pushBtn) {
      e.preventDefault();
      if (navStack.push(pushBtn.getAttribute("data-stack-push"))) render();
    }
  });

  render();
}

/** @param {{ bundle: import('./types.js').CustomerAccountBundle, orders: object[] }} ctx */
function renderRootScreen(ctx, animClass) {
  const { profile, loyalty } = ctx.bundle;

  return `
    <div class="shop-acct-stack-screen ${animClass}" data-stack-screen="root">
      ${accountProfileHeaderHtml(profile)}
      ${loyaltyCardHtml(loyalty)}
      ${accountCategoryMenuHtml()}
      <div class="shop-acct-logout-row">
        <button type="button" class="btn btn-glass" id="shop-logout">${t("shop.account.logout")}</button>
      </div>
    </div>
  `;
}

/** @param {{ bundle: import('./types.js').CustomerAccountBundle, orders: object[] }} ctx */
function renderDetailScreen(screenId, ctx, animClass) {
  const titleKey = getAccountCategoryTitleKey(screenId);

  return `
    <div class="shop-acct-stack-screen ${animClass}" data-stack-screen="${screenId}">
      <h2 class="shop-acct-detail-page-title">${t(titleKey)}</h2>
      <div class="shop-acct-detail glass-panel">${renderCategoryBody(screenId, ctx)}</div>
    </div>
  `;
}

function syncAccountHeaderBack(navStack, render) {
  window.PRV_ACCOUNT_NAV = window.PRV_ACCOUNT_NAV || {};

  window.PRV_ACCOUNT_NAV.canPop = () => !navStack.isRoot();
  window.PRV_ACCOUNT_NAV.pop = () => {
    if (!navStack.pop()) return false;
    render();
    return true;
  };

  document.body.classList.toggle("shop-acct-stack-deep", !navStack.isRoot());
  window.PRV_BACK?.updateShopHeaderBackContext?.();
}

/** @param {{ main: HTMLElement }} ctx @param {string} screenId */
function updateAccountPageTitle(ctx, screenId) {
  const titleEl = ctx.main.closest("#shop-main")?.querySelector(".shop-acct-page-title");
  if (!titleEl) return;
  titleEl.textContent =
    screenId === "root" ? t("shop.account.title") : t(getAccountCategoryTitleKey(screenId));
}

/** @param {{ bundle: import('./types.js').CustomerAccountBundle, orders: object[] }} ctx */
function renderCategoryBody(screenId, ctx) {
  const { profile, notifications, appSettings, paymentMethods } = ctx.bundle;

  switch (screenId) {
    case "profile-details":
      return profileDetailsBodyHtml(profile, paymentMethods);
    case "orders":
      return ordersBodyHtml(ctx.orders);
    case "returns":
      return returnsBodyHtml();
    case "notifications":
      return shopNotificationsBodyHtml(notifications);
    case "app-settings":
      return appSettingsBodyHtml(appSettings);
    default:
      return `<p class="shop-acct-empty-inline">${t("shop.profile.loadError")}</p>`;
  }
}

/** @param {HTMLElement} main */
function wireCurrentScreen(main, ctx, navStack) {
  const root = main.querySelector("[data-profile-root]");
  if (!root) return;

  const screen = navStack.current();

  if (screen === "root") {
    wireAccountProfileHeader(root, {});
    wireLoyaltyCard(root, {
      onAddWallet: async () => {
        const res = await addLoyaltyToWallet();
        if (res.ok) showAccountToast(main, t("shop.profile.loyalty.walletSuccess"));
        else showAccountToast(main, t("shop.profile.saveError"), "error");
      },
    });
    root.querySelector("#shop-logout")?.addEventListener("click", () => ctx.opts.onLogout?.());
    return;
  }

  if (screen === "profile-details") {
    wirePersonalDetailsForm(root, {
      onSave: async (data) => saveProfileFields(root, data, ctx.bundle, main),
      onAvatarChange: async (avatarUrl) => {
        await persistBundle({ profile: { avatarUrl } }, ctx.bundle, main);
        ctx.bundle.profile.avatarUrl = avatarUrl;
      },
    });

    wireFavoriteAddressesSection(root, {
      onEditRequest: (id) => openAddressDialog(root, ctx.bundle, id),
      onRemove: async (id) => {
        ctx.bundle.profile.addresses = ctx.bundle.profile.addresses.filter((a) => a.id !== id);
        await persistBundle({ profile: { addresses: ctx.bundle.profile.addresses } }, ctx.bundle, main);
        refreshAddressesSection(root, ctx);
      },
      onSaveAddress: async (payload) => {
        await saveAddressPayload(root, ctx, main, payload);
      },
    });

    wirePreferredPaymentMethodSection(root, {
      onChange: async (id) => {
        await persistBundle({ profile: { preferredPaymentMethodId: id } }, ctx.bundle, main);
        ctx.bundle.profile.preferredPaymentMethodId = id;
      },
    });
    return;
  }

  if (screen === "notifications") {
    wireShopNotificationsSection(root, {
      onChange: async (key, value) => {
        await persistBundle({ notifications: { [key]: value } }, ctx.bundle, main);
        ctx.bundle.notifications[key] = value;
      },
    });
    return;
  }

  if (screen === "app-settings") {
    wireAppSettingsSection(root, {
      onToggle: async (key, value) => {
        await persistBundle({ appSettings: { [key]: value } }, ctx.bundle, main);
        ctx.bundle.appSettings[key] = value;
      },
      onLanguage: async (lang) => {
        await persistBundle({ appSettings: { language: lang } }, ctx.bundle, main);
        ctx.bundle.appSettings.language = lang;
        if (window.PRV_I18N?.applyLang) {
          await window.PRV_I18N.applyLang(lang, { save: true, notify: true });
          window.dispatchEvent(new CustomEvent("prv:langchange"));
        }
      },
      onShared: () => showAccountToast(main, t("shop.profile.settings.shareCopied")),
    });
  }
}

/** @param {HTMLElement} root @param {import('./types.js').CustomerAccountBundle} bundle @param {string} id */
function openAddressDialog(root, bundle, id) {
  const addr = bundle.profile.addresses.find((a) => a.id === id);
  const dialog = root.querySelector("#shop-address-dialog");
  const form = root.querySelector("#shop-address-form");
  if (!addr || !dialog || !form) return;
  form.querySelector("[name=addressId]").value = addr.id;
  form.label.value = addr.label;
  form.line1.value = addr.line1;
  form.line2.value = addr.line2 || "";
  form.city.value = addr.city;
  form.postalCode.value = addr.postalCode;
  form.country.value = addr.country;
  form.isDefault.checked = Boolean(addr.isDefault);
  root.querySelector("[data-address-dialog-title]").textContent = t("shop.profile.addresses.edit");
  dialog.showModal();
}

/** @param {HTMLElement} root @param {{ bundle: import('./types.js').CustomerAccountBundle }} ctx @param {HTMLElement} main */
async function saveAddressPayload(root, ctx, main, payload) {
  let addresses = [...ctx.bundle.profile.addresses];
  const valid = validateAddress(payload);
  if (!valid.ok) {
    showAccountToast(main, t(valid.message), "error");
    return;
  }
  if (payload.isDefault) addresses = addresses.map((a) => ({ ...a, isDefault: false }));
  if (payload.id) {
    addresses = addresses.map((a) => (a.id === payload.id ? { ...a, ...payload, id: a.id } : a));
  } else {
    addresses.push({
      ...payload,
      id: ProfileStore.newAddressId(),
      isDefault: payload.isDefault || addresses.length === 0,
    });
  }
  ctx.bundle.profile.addresses = addresses;
  await persistBundle({ profile: { addresses } }, ctx.bundle, main);
  refreshAddressesSection(root, ctx);
}

async function saveProfileFields(root, data, bundle, main) {
  const form = root.querySelector("#shop-profile-form");
  const email = validateEmail(data.email);
  const firstName = validateRequired(data.firstName, "shop.profile.validation.firstName");
  const lastName = validateRequired(data.lastName, "shop.profile.validation.lastName");
  const phone = validatePhone(data.phone);

  if (!email.ok) {
    showFieldError(form, "email", email.message);
    return { ok: false };
  }
  if (!firstName.ok) {
    showFieldError(form, "firstName", firstName.message);
    return { ok: false };
  }
  if (!lastName.ok) {
    showFieldError(form, "lastName", lastName.message);
    return { ok: false };
  }
  if (!phone.ok) {
    showFieldError(form, "phone", phone.message);
    return { ok: false };
  }

  const patch = {
    profile: {
      email: email.value,
      firstName: firstName.value,
      lastName: lastName.value,
      phone: phone.value,
      ...(data.avatarUrl ? { avatarUrl: data.avatarUrl } : {}),
    },
  };

  const res = await persistBundle(patch, bundle, main);
  if (res.ok) {
    Object.assign(bundle.profile, patch.profile);
    const header = root.querySelector(".shop-acct-profile-header");
    if (header) {
      header.outerHTML = accountProfileHeaderHtml(bundle.profile);
      wireAccountProfileHeader(root, {});
    }
  }
  return res;
}

async function persistBundle(patch, bundle, main) {
  const merged = {
    profile: { ...bundle.profile, ...(patch.profile || {}) },
    loyalty: { ...bundle.loyalty, ...(patch.loyalty || {}) },
    notifications: { ...bundle.notifications, ...(patch.notifications || {}) },
    appSettings: { ...bundle.appSettings, ...(patch.appSettings || {}) },
    paymentMethods: patch.paymentMethods || bundle.paymentMethods,
  };
  const res = await saveCustomerProfile(merged);
  if (!res.ok) showAccountToast(main, t("shop.profile.saveError"), "error");
  return res;
}

/** @param {HTMLElement} root @param {{ bundle: import('./types.js').CustomerAccountBundle }} ctx */
function refreshAddressesSection(root, ctx) {
  const block = root.querySelector("[data-addresses-block]");
  if (!block) return;
  const title = block.querySelector(".shop-acct-detail-block__title");
  block.innerHTML = `${title?.outerHTML || ""}${favoriteAddressesBodyHtml(ctx.bundle.profile.addresses)}`;
  wireFavoriteAddressesSection(root, {
    onEditRequest: (id) => openAddressDialog(root, ctx.bundle, id),
    onRemove: async (id) => {
      ctx.bundle.profile.addresses = ctx.bundle.profile.addresses.filter((a) => a.id !== id);
      await persistBundle({ profile: { addresses: ctx.bundle.profile.addresses } }, ctx.bundle, ctx.main);
      refreshAddressesSection(root, ctx);
    },
    onSaveAddress: async (payload) => {
      await saveAddressPayload(root, ctx, ctx.main, payload);
    },
  });
}

export { initProfileNavigation as renderProfileShell };
