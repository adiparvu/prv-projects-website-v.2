import { escapeHtml } from "../../format.js";
import { t } from "../../i18n.js";
import { ICONS } from "../icons.js";

const LOYALTY_INFO =
  "For every 1 euro spent, you earn 1 point. When you reach 1000 points, you can generate a 10 euro discount code.";

export function loyaltyInfoTooltipHtml() {
  const tipId = "loyalty-info-tip";
  return `
    <div class="shop-acct-tooltip-wrap">
      <button type="button" class="shop-acct-tooltip-btn" aria-describedby="${tipId}" aria-label="${escapeAttr(t("shop.profile.loyalty.infoLabel"))}" data-loyalty-info>
        ${ICONS.info}
      </button>
      <div class="shop-acct-tooltip" id="${tipId}" role="tooltip" hidden>${LOYALTY_INFO}</div>
    </div>
  `;
}

/** @param {import('../types.js').LoyaltyAccount} loyalty */
export function loyaltyCardHtml(loyalty) {
  return `
    <article class="shop-acct-loyalty glass-panel" aria-labelledby="loyalty-card-title">
      <div class="shop-acct-loyalty__top">
        <div>
          <p class="shop-acct-loyalty__eyebrow">PRV</p>
          <h2 id="loyalty-card-title" class="shop-acct-loyalty__title">${t("shop.profile.loyalty.title")}</h2>
        </div>
        ${loyaltyInfoTooltipHtml()}
      </div>
      <div class="shop-acct-loyalty__points">
        <span class="shop-acct-loyalty__points-value" data-loyalty-points>${loyalty.points.toLocaleString()}</span>
        <span class="shop-acct-loyalty__points-label">${t("shop.profile.loyalty.points")}</span>
      </div>
      <button type="button" class="btn btn-primary shop-acct-loyalty__wallet" data-add-wallet ${loyalty.walletAdded ? "disabled" : ""}>
        ${ICONS.wallet}
        <span>${loyalty.walletAdded ? t("shop.profile.loyalty.walletAdded") : t("shop.profile.loyalty.addWallet")}</span>
      </button>
    </article>
  `;
}

function escapeAttr(str) {
  return String(str ?? "").replace(/"/g, "&quot;");
}

/** @param {HTMLElement} root @param {{ onAddWallet?: () => Promise<void> }} handlers */
export function wireLoyaltyCard(root, handlers = {}) {
  const infoBtn = root.querySelector("[data-loyalty-info]");
  const tip = root.querySelector(".shop-acct-tooltip");
  if (infoBtn && tip) {
    const show = () => {
      tip.hidden = false;
    };
    const hide = () => {
      tip.hidden = true;
    };
    infoBtn.addEventListener("mouseenter", show);
    infoBtn.addEventListener("focus", show);
    infoBtn.addEventListener("mouseleave", hide);
    infoBtn.addEventListener("blur", hide);
    infoBtn.addEventListener("click", (e) => {
      e.preventDefault();
      tip.hidden = !tip.hidden;
    });
  }

  root.querySelector("[data-add-wallet]")?.addEventListener("click", async (e) => {
    const btn = e.currentTarget;
    if (btn.disabled) return;
    btn.disabled = true;
    btn.classList.add("is-loading");
    try {
      await handlers.onAddWallet?.();
      btn.querySelector("span").textContent = t("shop.profile.loyalty.walletAdded");
    } finally {
      btn.classList.remove("is-loading");
    }
  });
}

export { wireLoyaltyCard as wireLoyaltyInfoTooltip };
