import { t } from "../../i18n.js";
import { accountDisclosureHtml } from "./disclosure-group.js";
import { personalDetailsFormBodyHtml } from "./personal-details-form.js";
import { favoriteAddressesBodyHtml } from "./favorite-addresses-section.js";
import { preferredPaymentMethodBodyHtml } from "./preferred-payment-method-section.js";

/** @param {import('../types.js').CustomerProfile} profile @param {import('../types.js').SavedPaymentMethod[]} paymentMethods */
export function profileDetailsSectionHtml(profile, paymentMethods) {
  const body = `
    <div class="shop-acct-disclosure-stack">
      <div class="shop-acct-disclosure-block">
        <h3 class="shop-acct-disclosure-block__title">${t("shop.profile.sections.personal")}</h3>
        ${personalDetailsFormBodyHtml(profile)}
      </div>
      <div class="shop-acct-disclosure-block" data-addresses-block id="shop-profile-addresses">
        <h3 class="shop-acct-disclosure-block__title">${t("shop.profile.sections.addresses")}</h3>
        ${favoriteAddressesBodyHtml(profile.addresses)}
      </div>
      <div class="shop-acct-disclosure-block" id="shop-profile-payment">
        <h3 class="shop-acct-disclosure-block__title">${t("shop.profile.sections.payment")}</h3>
        ${preferredPaymentMethodBodyHtml(paymentMethods, profile.preferredPaymentMethodId)}
      </div>
    </div>
  `;

  return accountDisclosureHtml("shop.profile.sections.profileDetails", body, { id: "shop-profile-details" });
}
