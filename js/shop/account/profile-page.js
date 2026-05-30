/**
 * Customer profile page — composes all account sections
 */

import { t } from "../i18n.js";
import { validateEmail, validatePhone, validateRequired, validateAddress } from "./validation.js";
import { fetchCustomerProfile, saveCustomerProfile, addLoyaltyToWallet } from "./profile-api.js";
import { ProfileStore } from "./profile-store.js";
import { ShopStore } from "../store.js";
import { accountProfileHeaderHtml, wireAccountProfileHeader } from "./components/account-profile-header.js";
import { loyaltyCardHtml, wireLoyaltyCard } from "./components/loyalty-card.js";
import {
  personalDetailsFormHtml,
  wirePersonalDetailsForm,
  showFieldError,
} from "./components/personal-details-form.js";
import {
  favoriteAddressesSectionHtml,
  wireFavoriteAddressesSection,
} from "./components/favorite-addresses-section.js";
import {
  preferredPaymentMethodSectionHtml,
  wirePreferredPaymentMethodSection,
} from "./components/preferred-payment-method-section.js";
import {
  shopNotificationsSectionHtml,
  wireShopNotificationsSection,
} from "./components/shop-notifications-section.js";
import { appSettingsSectionHtml, wireAppSettingsSection } from "./components/app-settings-section.js";
import { ordersAndReturnsSectionHtml } from "./components/orders-and-returns-section.js";
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

  renderProfileShell(main, bundle, opts);
}

/** @param {import('./types.js').CustomerAccountBundle} bundle */
function renderProfileShell(main, bundle, opts) {
  const { profile, loyalty, notifications, appSettings, paymentMethods } = bundle;

  main.innerHTML = `
    <div class="shop-acct-page" data-profile-root>
      ${accountProfileHeaderHtml(profile)}
      ${loyaltyCardHtml(loyalty)}
      ${personalDetailsFormHtml(profile)}
      ${favoriteAddressesSectionHtml(profile.addresses)}
      ${preferredPaymentMethodSectionHtml(paymentMethods, profile.preferredPaymentMethodId)}
      ${shopNotificationsSectionHtml(notifications)}
      ${appSettingsSectionHtml(appSettings)}
      ${ordersAndReturnsSectionHtml()}
      <div class="shop-acct-logout-row">
        <button type="button" class="btn btn-glass" id="shop-logout">${t("shop.account.logout")}</button>
      </div>
    </div>
  `;

  const root = main.querySelector("[data-profile-root]");
  wireAccountProfileHeader(root, {});

  wireLoyaltyCard(root, {
    onAddWallet: async () => {
      const res = await addLoyaltyToWallet();
      if (res.ok) showAccountToast(main, t("shop.profile.loyalty.walletSuccess"));
      else showAccountToast(main, t("shop.profile.saveError"), "error");
    },
  });

  wirePersonalDetailsForm(root, {
    onSave: async (data) => saveProfileFields(root, data, bundle),
    onAvatarChange: async (avatarUrl) => {
      await persistBundle({ profile: { avatarUrl } }, bundle, root);
      bundle.profile.avatarUrl = avatarUrl;
    },
  });

  wireFavoriteAddressesSection(root, {
    onEditRequest: (id) => {
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
    },
    onRemove: async (id) => {
      const addresses = bundle.profile.addresses.filter((a) => a.id !== id);
      await persistBundle({ profile: { addresses } }, bundle, main);
      bundle.profile.addresses = addresses;
      refreshAddressesSection(root, bundle);
    },
    onSaveAddress: async (payload) => {
      let addresses = [...bundle.profile.addresses];
      const valid = validateAddress(payload);
      if (!valid.ok) {
        showAccountToast(main, t(valid.message), "error");
        return;
      }
      if (payload.isDefault) addresses = addresses.map((a) => ({ ...a, isDefault: false }));
      if (payload.id) {
        addresses = addresses.map((a) => (a.id === payload.id ? { ...a, ...payload, id: a.id } : a));
      } else {
        addresses.push({ ...payload, id: ProfileStore.newAddressId(), isDefault: payload.isDefault || addresses.length === 0 });
      }
      await persistBundle({ profile: { addresses } }, bundle, main);
      bundle.profile.addresses = addresses;
      refreshAddressesSection(root, bundle);
    },
  });

  wirePreferredPaymentMethodSection(root, {
    onChange: async (id) => {
      await persistBundle({ profile: { preferredPaymentMethodId: id } }, bundle, main);
      bundle.profile.preferredPaymentMethodId = id;
    },
  });

  wireShopNotificationsSection(root, {
    onChange: async (key, value) => {
      await persistBundle({ notifications: { [key]: value } }, bundle, main);
      bundle.notifications[key] = value;
    },
  });

  wireAppSettingsSection(root, {
    onToggle: async (key, value) => {
      await persistBundle({ appSettings: { [key]: value } }, bundle, main);
      bundle.appSettings[key] = value;
    },
    onLanguage: async (lang) => {
      await persistBundle({ appSettings: { language: lang } }, bundle, main);
      bundle.appSettings.language = lang;
      if (window.PRV_I18N?.applyLang) {
        await window.PRV_I18N.applyLang(lang, { save: true, notify: true });
        window.dispatchEvent(new CustomEvent("prv:langchange"));
      }
    },
    onShared: () => showAccountToast(main, t("shop.profile.settings.shareCopied")),
  });

  root.querySelector("#shop-logout")?.addEventListener("click", () => opts.onLogout?.());
}

async function saveProfileFields(root, data, bundle) {
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

  const res = await persistBundle(patch, bundle, root.closest(".shop-main") || root);
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

function refreshAddressesSection(root, bundle) {
  const section = root.querySelector("#shop-profile-addresses");
  if (!section) return;
  const tmp = document.createElement("div");
  tmp.innerHTML = favoriteAddressesSectionHtml(bundle.profile.addresses);
  const newSection = tmp.firstElementChild;
  section.replaceWith(newSection);
  wireFavoriteAddressesSection(root, {
    onEditRequest: (id) => {
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
      dialog.showModal();
    },
    onRemove: async (id) => {
      bundle.profile.addresses = bundle.profile.addresses.filter((a) => a.id !== id);
      await persistBundle({ profile: { addresses: bundle.profile.addresses } }, bundle, root);
      refreshAddressesSection(root, bundle);
    },
    onSaveAddress: async (payload) => {
      let addresses = [...bundle.profile.addresses];
      if (payload.isDefault) addresses = addresses.map((a) => ({ ...a, isDefault: false }));
      if (payload.id) {
        addresses = addresses.map((a) => (a.id === payload.id ? { ...a, ...payload, id: a.id } : a));
      } else {
        addresses.push({ ...payload, id: ProfileStore.newAddressId(), isDefault: payload.isDefault || addresses.length === 0 });
      }
      bundle.profile.addresses = addresses;
      await persistBundle({ profile: { addresses } }, bundle, root);
      refreshAddressesSection(root, bundle);
    },
  });
}

export { renderProfileShell };
