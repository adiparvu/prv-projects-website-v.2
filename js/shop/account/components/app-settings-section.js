import { escapeHtml } from "../../format.js";
import { t } from "../../i18n.js";
import { ICONS } from "../icons.js";
import { accountSectionHtml } from "./states.js";

const LANGS = [
  ["nl", "Nederlands"],
  ["en", "English"],
  ["fr", "Français"],
  ["de", "Deutsch"],
  ["ro", "Română"],
];

/** @param {import('../types.js').AppSettings} settings */
export function appSettingsSectionHtml(settings) {
  const langOptions = LANGS.map(
    ([code, label]) => `<option value="${code}" ${settings.language === code ? "selected" : ""}>${label}</option>`
  ).join("");

  const body = `
    <ul class="shop-acct-settings-list">
      <li class="shop-acct-toggle-row glass-inset">
        <div class="shop-acct-toggle-row__text">
          <label for="setting-autoplay">${t("shop.profile.settings.autoplay")}</label>
          <p>${t("shop.profile.settings.autoplayDesc")}</p>
        </div>
        <button type="button" class="shop-acct-switch${settings.autoplayVideos ? " is-on" : ""}" id="setting-autoplay" role="switch" aria-checked="${settings.autoplayVideos}" data-setting-toggle="autoplayVideos">
          <span class="shop-acct-switch__thumb"></span>
        </button>
      </li>
      <li class="shop-acct-settings-row glass-inset">
        <div>
          <label for="setting-language">${t("shop.profile.settings.language")}</label>
          <p>${t("shop.profile.settings.languageDesc")}</p>
        </div>
        <div class="input-wrap glass-inset shop-acct-lang-select">
          <select id="setting-language" data-setting-language>${langOptions}</select>
        </div>
      </li>
      <li class="shop-acct-settings-link glass-inset">
        <a href="../../confidentialitate.html" target="_blank" rel="noopener">
          ${ICONS.shield}
          <span>${t("shop.profile.settings.privacy")}</span>
          ${ICONS.chevron}
        </a>
      </li>
      <li class="shop-acct-toggle-row glass-inset">
        <div class="shop-acct-toggle-row__text">
          <label for="setting-tracking">${t("shop.profile.settings.tracking")}</label>
          <p>${t("shop.profile.settings.trackingDesc")}</p>
        </div>
        <button type="button" class="shop-acct-switch${settings.dataTracking ? " is-on" : ""}" id="setting-tracking" role="switch" aria-checked="${settings.dataTracking}" data-setting-toggle="dataTracking">
          <span class="shop-acct-switch__thumb"></span>
        </button>
      </li>
      <li class="shop-acct-settings-link glass-inset">
        <button type="button" class="shop-acct-settings-action" data-action-rate>
          ${ICONS.star}
          <span>${t("shop.profile.settings.rate")}</span>
          ${ICONS.chevron}
        </button>
      </li>
      <li class="shop-acct-settings-link glass-inset">
        <button type="button" class="shop-acct-settings-action" data-action-share>
          ${ICONS.share}
          <span>${t("shop.profile.settings.share")}</span>
          ${ICONS.chevron}
        </button>
      </li>
      <li class="shop-acct-settings-link glass-inset">
        <button type="button" class="shop-acct-settings-action" data-action-feedback>
          ${ICONS.message}
          <span>${t("shop.profile.settings.feedback")}</span>
          ${ICONS.chevron}
        </button>
      </li>
    </ul>
  `;

  return accountSectionHtml("shop.profile.sections.appSettings", body, { id: "shop-profile-settings" });
}

/** @param {HTMLElement} root @param {{ onToggle: Function, onLanguage: Function }} handlers */
export function wireAppSettingsSection(root, handlers) {
  root.querySelectorAll("[data-setting-toggle]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const key = btn.getAttribute("data-setting-toggle");
      const next = !btn.classList.contains("is-on");
      btn.classList.toggle("is-on", next);
      btn.setAttribute("aria-checked", String(next));
      handlers.onToggle?.(key, next);
    });
  });

  root.querySelector("[data-setting-language]")?.addEventListener("change", (e) => {
    handlers.onLanguage?.(e.target.value);
  });

  root.querySelector("[data-action-rate]")?.addEventListener("click", () => {
    window.open("https://forms.gle/prv-rate-app", "_blank", "noopener");
  });

  root.querySelector("[data-action-share]")?.addEventListener("click", async () => {
    const url = window.location.origin + (window.PRV_CONFIG?.shopPath || "/shop/");
    const title = "PRV Shop";
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        /* cancelled */
      }
    } else {
      await navigator.clipboard?.writeText(url);
      handlers.onShared?.();
    }
  });

  root.querySelector("[data-action-feedback]")?.addEventListener("click", () => {
    window.location.href = `mailto:hello@prvprojects.be?subject=${encodeURIComponent(t("shop.profile.settings.feedbackSubject"))}`;
  });
}
