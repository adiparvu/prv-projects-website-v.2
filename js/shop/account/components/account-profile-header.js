import { escapeHtml } from "../../format.js";
import { t } from "../../i18n.js";
import { ICONS } from "../icons.js";

/** @param {import('../types.js').CustomerProfile} profile */
export function accountProfileHeaderHtml(profile) {
  const name = [profile.firstName, profile.lastName].filter(Boolean).join(" ") || profile.email;
  const initials = getInitials(profile);
  const avatarInner = profile.avatarUrl
    ? `<img src="${escapeHtml(profile.avatarUrl)}" alt="" class="shop-acct-avatar__img" />`
    : `<span class="shop-acct-avatar__initials" aria-hidden="true">${escapeHtml(initials)}</span>`;

  return `
    <header class="shop-acct-profile-header glass-panel">
      <div class="shop-acct-profile-header__main">
        <div class="shop-acct-avatar" data-avatar-wrap>
          ${avatarInner}
          <button type="button" class="shop-acct-avatar__edit" data-edit-avatar aria-label="${escapeAttr(t("shop.profile.editAvatar"))}">
            ${ICONS.camera}
          </button>
        </div>
        <div class="shop-acct-profile-header__meta">
          <h2 class="shop-acct-profile-header__name">${escapeHtml(name)}</h2>
          <p class="shop-acct-profile-header__email">${escapeHtml(profile.email)}</p>
          <p class="shop-acct-profile-header__number">${t("shop.profile.customerNumber")}: <span>${escapeHtml(profile.customerNumber)}</span></p>
        </div>
      </div>
      <button type="button" class="btn btn-glass btn-sm shop-acct-profile-header__edit" data-edit-profile>
        ${ICONS.edit}
        <span>${t("shop.profile.editProfile")}</span>
      </button>
    </header>
  `;
}

function getInitials(profile) {
  const a = profile.firstName?.[0] || "";
  const b = profile.lastName?.[0] || "";
  if (a || b) return `${a}${b}`.toUpperCase();
  return profile.email?.[0]?.toUpperCase() || "?";
}

function escapeAttr(str) {
  return String(str ?? "").replace(/"/g, "&quot;");
}

/** @param {HTMLElement} root @param {{ onEditProfile?: () => void, onEditAvatar?: () => void }} handlers */
export function wireAccountProfileHeader(root, handlers = {}) {
  root.querySelector("[data-edit-profile]")?.addEventListener("click", () => {
    handlers.onEditProfile?.();
    document.getElementById("shop-profile-personal")?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
  root.querySelector("[data-edit-avatar]")?.addEventListener("click", () => {
    handlers.onEditAvatar?.();
    document.getElementById("shop-profile-avatar-input")?.click();
  });
}
