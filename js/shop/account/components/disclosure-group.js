import { escapeHtml } from "../../format.js";
import { t } from "../../i18n.js";
import { ICONS } from "../icons.js";

/**
 * Collapsible liquid-glass disclosure card — title + chevron only when collapsed.
 * @param {string} titleKey i18n key
 * @param {string} bodyHtml inner content
 * @param {{ id?: string, open?: boolean, className?: string }} [opts]
 */
export function accountDisclosureHtml(titleKey, bodyHtml, { id = "", open = false, className = "" } = {}) {
  const sectionId = id || `shop-disclosure-${titleKey.replace(/\W/g, "-")}`;
  const panelId = `${sectionId}-panel`;
  const openClass = open ? " is-open" : "";

  return `
    <section
      class="shop-acct-disclosure glass-panel${openClass}${className ? ` ${className}` : ""}"
      id="${escapeHtml(sectionId)}"
      data-disclosure
      data-disclosure-open="${open ? "true" : "false"}"
    >
      <button
        type="button"
        class="shop-acct-disclosure__trigger"
        aria-expanded="${open ? "true" : "false"}"
        aria-controls="${escapeHtml(panelId)}"
        data-disclosure-trigger
      >
        <span class="shop-acct-disclosure__title">${t(titleKey)}</span>
        <span class="shop-acct-disclosure__chevron" aria-hidden="true">${ICONS.chevron}</span>
      </button>
      <div class="shop-acct-disclosure__panel" id="${escapeHtml(panelId)}" data-disclosure-panel>
        <div class="shop-acct-disclosure__panel-inner">
          <div class="shop-acct-disclosure__content">${bodyHtml}</div>
        </div>
      </div>
    </section>
  `;
}

/** @param {HTMLElement} root @param {{ accordion?: boolean }} [opts] */
export function wireAccountDisclosures(root, { accordion = false } = {}) {
  root.querySelectorAll("[data-disclosure]").forEach((section) => {
    const trigger = section.querySelector("[data-disclosure-trigger]");
    if (!trigger || trigger.dataset.disclosureWired === "true") return;
    trigger.dataset.disclosureWired = "true";

    trigger.addEventListener("click", () => {
      const willOpen = !section.classList.contains("is-open");
      if (accordion && willOpen) {
        root.querySelectorAll("[data-disclosure].is-open").forEach((other) => {
          if (other !== section) setDisclosureOpen(other, false);
        });
      }
      setDisclosureOpen(section, willOpen);
    });
  });
}

/** @param {HTMLElement} section @param {boolean} open */
export function setDisclosureOpen(section, open) {
  const trigger = section.querySelector("[data-disclosure-trigger]");
  section.classList.toggle("is-open", open);
  section.dataset.disclosureOpen = open ? "true" : "false";
  if (trigger) trigger.setAttribute("aria-expanded", open ? "true" : "false");
}
