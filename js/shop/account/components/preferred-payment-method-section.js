import { escapeHtml } from "../../format.js";
import { t } from "../../i18n.js";

/** @param {import('../types.js').SavedPaymentMethod[]} methods @param {string|null} preferredId */
export function preferredPaymentMethodBodyHtml(methods, preferredId) {
  if (methods.length === 0) {
    return `<p class="shop-acct-empty-inline">${t("shop.profile.payment.empty")}</p>`;
  }

  return `<div class="shop-acct-payment-list">${methods
    .map(
      (m) => `
          <label class="shop-acct-payment-item glass-inset">
            <input type="radio" name="preferredPayment" value="${escapeHtml(m.id)}" ${m.id === preferredId ? "checked" : ""} />
            <span class="shop-acct-payment-item__label">
              <strong>${escapeHtml(m.label)}</strong>
              ${m.last4 ? `<span class="work-meta">•••• ${escapeHtml(m.last4)}</span>` : ""}
            </span>
          </label>`
    )
    .join("")}</div>`;
}

/** @param {import('../types.js').SavedPaymentMethod[]} methods @param {string|null} preferredId */
export function preferredPaymentMethodSectionHtml(methods, preferredId) {
  return preferredPaymentMethodBodyHtml(methods, preferredId);
}

/** @param {HTMLElement} root @param {{ onChange: (id: string) => void }} handlers */
export function wirePreferredPaymentMethodSection(root, handlers) {
  root.querySelectorAll('input[name="preferredPayment"]').forEach((input) => {
    input.addEventListener("change", () => {
      if (input.checked) handlers.onChange?.(input.value);
    });
  });
}
