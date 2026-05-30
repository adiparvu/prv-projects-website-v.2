import { escapeHtml } from "../../format.js";
import { t } from "../../i18n.js";
import { ICONS } from "../icons.js";
import { accountSectionHtml } from "./states.js";

/** @param {import('../types.js').CustomerProfile} profile */
export function personalDetailsFormHtml(profile) {
  const body = `
    <form class="shop-acct-form" id="shop-profile-form" novalidate>
      <input type="file" id="shop-profile-avatar-input" accept="image/*" hidden />
      <div class="shop-acct-form__grid">
        <div class="shop-acct-field shop-acct-field--readonly">
          <label for="pf-customer-number">${t("shop.profile.fields.customerNumber")}</label>
          <div class="input-wrap glass-inset">
            <input id="pf-customer-number" name="customerNumber" value="${escapeHtml(profile.customerNumber)}" readonly aria-readonly="true" />
          </div>
        </div>
        <div class="shop-acct-field">
          <label for="pf-email">${t("shop.profile.fields.email")}</label>
          <div class="input-wrap glass-inset">
            <input id="pf-email" name="email" type="email" required value="${escapeHtml(profile.email)}" autocomplete="email" />
          </div>
          <p class="shop-acct-field__error" data-error-for="email" hidden></p>
        </div>
        <div class="shop-acct-field">
          <label for="pf-first">${t("shop.profile.fields.firstName")}</label>
          <div class="input-wrap glass-inset">
            <input id="pf-first" name="firstName" required value="${escapeHtml(profile.firstName)}" autocomplete="given-name" />
          </div>
          <p class="shop-acct-field__error" data-error-for="firstName" hidden></p>
        </div>
        <div class="shop-acct-field">
          <label for="pf-last">${t("shop.profile.fields.lastName")}</label>
          <div class="input-wrap glass-inset">
            <input id="pf-last" name="lastName" required value="${escapeHtml(profile.lastName)}" autocomplete="family-name" />
          </div>
          <p class="shop-acct-field__error" data-error-for="lastName" hidden></p>
        </div>
        <div class="shop-acct-field shop-acct-field--span-2">
          <label for="pf-phone">${t("shop.profile.fields.phone")} <span class="shop-acct-optional">${t("shop.profile.optional")}</span></label>
          <div class="input-wrap glass-inset">
            <input id="pf-phone" name="phone" type="tel" value="${escapeHtml(profile.phone || "")}" autocomplete="tel" />
          </div>
          <p class="shop-acct-field__error" data-error-for="phone" hidden></p>
        </div>
      </div>
      <div class="shop-acct-form__actions">
        <button type="submit" class="btn btn-primary" data-save-profile>${t("shop.profile.saveChanges")}</button>
        <p class="shop-acct-save-status" data-save-status hidden role="status"></p>
      </div>
    </form>
  `;
  return accountSectionHtml("shop.profile.sections.personal", body, { id: "shop-profile-personal" });
}

/** @param {HTMLElement} root @param {{ onSave: (data: object) => Promise<{ok: boolean}> }} handlers */
export function wirePersonalDetailsForm(root, handlers) {
  const form = root.querySelector("#shop-profile-form");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const status = form.querySelector("[data-save-status]");
    const btn = form.querySelector("[data-save-profile]");
    const fd = new FormData(form);

    clearErrors(form);
    btn.disabled = true;
    btn.classList.add("is-loading");
    if (status) {
      status.hidden = true;
      status.className = "shop-acct-save-status";
    }

    const payload = {
      email: fd.get("email"),
      firstName: fd.get("firstName"),
      lastName: fd.get("lastName"),
      phone: fd.get("phone"),
    };

    const result = await handlers.onSave(payload);
    btn.disabled = false;
    btn.classList.remove("is-loading");

    if (status) {
      status.hidden = false;
      status.textContent = result.ok ? t("shop.profile.saved") : t("shop.profile.saveError");
      status.classList.toggle("is-error", !result.ok);
      status.classList.toggle("is-success", result.ok);
    }
  });

  const avatarInput = root.querySelector("#shop-profile-avatar-input");
  avatarInput?.addEventListener("change", async () => {
    const file = avatarInput.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    const wrap = root.querySelector("[data-avatar-wrap]");
    if (wrap) {
      wrap.innerHTML = `
        <img src="${url}" alt="" class="shop-acct-avatar__img" />
        <button type="button" class="shop-acct-avatar__edit" data-edit-avatar aria-label="${t("shop.profile.editAvatar")}">${ICONS.camera}</button>
      `;
    }
    await handlers.onAvatarChange?.(url, file);
  });
}

function clearErrors(form) {
  form.querySelectorAll("[data-error-for]").forEach((el) => {
    el.hidden = true;
    el.textContent = "";
  });
}

export function showFieldError(form, field, messageKey) {
  const el = form.querySelector(`[data-error-for="${field}"]`);
  if (el) {
    el.hidden = false;
    el.textContent = t(messageKey);
  }
}
