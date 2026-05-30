import { escapeHtml } from "../../format.js";
import { t } from "../../i18n.js";
import { ICONS } from "../icons.js";
import { accountSectionHtml } from "./states.js";

/** @param {import('../types.js').CustomerAddress[]} addresses */
export function favoriteAddressesSectionHtml(addresses) {
  const list =
    addresses.length === 0
      ? `<p class="shop-acct-empty-inline">${t("shop.profile.addresses.empty")}</p>`
      : `<ul class="shop-acct-address-list">${addresses
          .map((a) => addressItemHtml(a))
          .join("")}</ul>`;

  const body = `
    ${list}
    <button type="button" class="btn btn-glass btn-sm shop-acct-add-btn" data-add-address>
      ${ICONS.plus}
      <span>${t("shop.profile.addresses.add")}</span>
    </button>
    <dialog class="shop-acct-dialog glass-panel" id="shop-address-dialog">
      <form method="dialog" class="shop-acct-dialog__form" id="shop-address-form">
        <h3 class="shop-acct-dialog__title" data-address-dialog-title>${t("shop.profile.addresses.add")}</h3>
        <input type="hidden" name="addressId" value="" />
        <div class="shop-acct-form__grid shop-acct-form__grid--1">
          <div class="shop-acct-field">
            <label>${t("shop.profile.addresses.label")}</label>
            <div class="input-wrap glass-inset"><input name="label" required placeholder="${escapeAttr(t("shop.profile.addresses.labelPh"))}" /></div>
          </div>
          <div class="shop-acct-field">
            <label>${t("shop.profile.addresses.line1")}</label>
            <div class="input-wrap glass-inset"><input name="line1" required /></div>
          </div>
          <div class="shop-acct-field">
            <label>${t("shop.profile.addresses.line2")} <span class="shop-acct-optional">${t("shop.profile.optional")}</span></label>
            <div class="input-wrap glass-inset"><input name="line2" /></div>
          </div>
          <div class="shop-acct-field">
            <label>${t("shop.profile.addresses.city")}</label>
            <div class="input-wrap glass-inset"><input name="city" required /></div>
          </div>
          <div class="shop-acct-field">
            <label>${t("shop.profile.addresses.postal")}</label>
            <div class="input-wrap glass-inset"><input name="postalCode" required /></div>
          </div>
          <div class="shop-acct-field">
            <label>${t("shop.profile.addresses.country")}</label>
            <div class="input-wrap glass-inset"><input name="country" required value="Belgium" /></div>
          </div>
          <label class="shop-acct-check"><input type="checkbox" name="isDefault" /> ${t("shop.profile.addresses.default")}</label>
        </div>
        <div class="shop-acct-dialog__actions">
          <button type="button" class="btn btn-glass" data-close-address-dialog>${t("shop.profile.cancel")}</button>
          <button type="submit" class="btn btn-primary">${t("shop.profile.save")}</button>
        </div>
      </form>
    </dialog>
  `;

  return accountSectionHtml("shop.profile.sections.addresses", body, { id: "shop-profile-addresses" });
}

function addressItemHtml(a) {
  return `
    <li class="shop-acct-address-item glass-inset" data-address-id="${escapeHtml(a.id)}">
      <div>
        <strong>${escapeHtml(a.label)}${a.isDefault ? ` · <span class="shop-acct-default-badge">${escapeHtml(t("shop.profile.addresses.defaultBadge"))}</span>` : ""}</strong>
        <p>${escapeHtml(a.line1)}${a.line2 ? `, ${escapeHtml(a.line2)}` : ""}</p>
        <p>${escapeHtml(a.postalCode)} ${escapeHtml(a.city)}, ${escapeHtml(a.country)}</p>
      </div>
      <div class="shop-acct-address-item__actions">
        <button type="button" class="shop-acct-icon-btn" data-edit-address="${escapeHtml(a.id)}" aria-label="Edit">${ICONS.edit}</button>
        <button type="button" class="shop-acct-icon-btn shop-acct-icon-btn--danger" data-remove-address="${escapeHtml(a.id)}" aria-label="Remove">${ICONS.trash}</button>
      </div>
    </li>
  `;
}

function escapeAttr(str) {
  return String(str ?? "").replace(/"/g, "&quot;");
}

/** @param {HTMLElement} root @param {{ onChange: (addresses: import('../types.js').CustomerAddress[]) => Promise<void> }} handlers */
export function wireFavoriteAddressesSection(root, handlers) {
  const dialog = root.querySelector("#shop-address-dialog");
  const form = root.querySelector("#shop-address-form");
  if (!dialog || !form) return;

  const openDialog = (address = null) => {
    form.reset();
    form.querySelector("[name=addressId]").value = address?.id || "";
    if (address) {
      form.label.value = address.label;
      form.line1.value = address.line1;
      form.line2.value = address.line2 || "";
      form.city.value = address.city;
      form.postalCode.value = address.postalCode;
      form.country.value = address.country;
      form.isDefault.checked = Boolean(address.isDefault);
      root.querySelector("[data-address-dialog-title]").textContent = t("shop.profile.addresses.edit");
    } else {
      root.querySelector("[data-address-dialog-title]").textContent = t("shop.profile.addresses.add");
    }
    dialog.showModal();
  };

  root.querySelector("[data-add-address]")?.addEventListener("click", () => openDialog());
  root.querySelector("[data-close-address-dialog]")?.addEventListener("click", () => dialog.close());

  root.querySelectorAll("[data-edit-address]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-edit-address");
      const item = root.querySelector(`[data-address-id="${id}"]`);
      if (!item) return;
      // Re-read from DOM text is fragile — handlers pass bundle refresh instead
      handlers.onEditRequest?.(id);
    });
  });

  root.querySelectorAll("[data-remove-address]").forEach((btn) => {
    btn.addEventListener("click", () => handlers.onRemove?.(btn.getAttribute("data-remove-address")));
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    handlers.onSaveAddress?.({
      id: fd.get("addressId") || undefined,
      label: fd.get("label"),
      line1: fd.get("line1"),
      line2: fd.get("line2"),
      city: fd.get("city"),
      postalCode: fd.get("postalCode"),
      country: fd.get("country"),
      isDefault: fd.get("isDefault") === "on",
    });
    dialog.close();
  });
}

export { addressItemHtml };
