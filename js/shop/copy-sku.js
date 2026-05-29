/** PRV Shop — copiere cod produs (SKU) + confirmări */

import { t } from "./i18n.js";

export const COPY_SKU_ICON = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>`;

const FEEDBACK_MODES = ["toast", "inline", "spring"];

/** Mod activ: spring. Test: ?skuCopy=toast sau ?skuCopy=inline */
const DEFAULT_FEEDBACK = "spring";

function getFeedbackMode() {
  const fromUrl = new URLSearchParams(window.location.search).get("skuCopy");
  if (fromUrl && FEEDBACK_MODES.includes(fromUrl)) return fromUrl;
  const stored = sessionStorage.getItem("prv-sku-copy-mode");
  if (stored && FEEDBACK_MODES.includes(stored)) return stored;
  return DEFAULT_FEEDBACK;
}

/** Schimbă modul confirmare (toast | inline | spring) */
export function setSkuCopyFeedback(mode) {
  if (!FEEDBACK_MODES.includes(mode)) return;
  sessionStorage.setItem("prv-sku-copy-mode", mode);
}

function escapeAttr(str) {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;");
}

export function skuCopyRowHtml(sku) {
  const code = escapeAttr(sku);
  return `
    <span class="shop-sku-row">
      <span class="shop-sku-label">${t("shop.product.sku")}</span>
      <span class="shop-sku-code" id="shop-sku-value">${code}</span>
      <button
        type="button"
        class="shop-sku-copy-btn"
        id="shop-sku-copy"
        data-sku="${code}"
        aria-label="${escapeAttr(t("shop.product.copySku"))}"
        title="${escapeAttr(t("shop.product.copySku"))}"
      >${COPY_SKU_ICON}</button>
      <span class="shop-sku-copy-inline" id="shop-sku-copy-inline" role="status" aria-live="polite" hidden></span>
    </span>
  `;
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
      return true;
    } catch {
      return false;
    }
  }
}

function showToast(anchor, message) {
  let toast = document.getElementById("shop-sku-copy-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "shop-sku-copy-toast";
    toast.className = "shop-sku-copy-toast";
    toast.setAttribute("role", "status");
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  const rect = anchor.getBoundingClientRect();
  toast.style.left = `${rect.left + rect.width / 2}px`;
  toast.style.top = `${rect.top - 8}px`;
  toast.hidden = false;
  toast.classList.remove("is-visible");
  requestAnimationFrame(() => toast.classList.add("is-visible"));
  clearTimeout(showToast._timer);
  showToast._timer = window.setTimeout(() => {
    toast.classList.remove("is-visible");
    window.setTimeout(() => {
      toast.hidden = true;
    }, 280);
  }, 2000);
}

function feedbackInline(inlineEl, message) {
  if (!inlineEl) return;
  inlineEl.textContent = message;
  inlineEl.hidden = false;
  inlineEl.classList.add("is-visible");
  clearTimeout(feedbackInline._timer);
  feedbackInline._timer = window.setTimeout(() => {
    inlineEl.classList.remove("is-visible");
    window.setTimeout(() => {
      inlineEl.hidden = true;
      inlineEl.textContent = "";
    }, 220);
  }, 2000);
}

function feedbackSpring(btn) {
  btn.classList.add("is-spring", "is-copied");
  clearTimeout(feedbackSpring._timer);
  feedbackSpring._timer = window.setTimeout(() => {
    btn.classList.remove("is-spring", "is-copied");
  }, 520);
}

function runFeedback(mode, btn, inlineEl, message) {
  switch (mode) {
    case "toast":
      showToast(btn, message);
      break;
    case "inline":
      feedbackInline(inlineEl, message);
      break;
    case "spring":
      feedbackSpring(btn);
      break;
    default:
      showToast(btn, message);
      break;
  }
}

export function wireSkuCopy(root) {
  const btn = root?.querySelector("#shop-sku-copy");
  if (!btn || btn.dataset.wired === "1") return;
  btn.dataset.wired = "1";

  const inlineEl = root.querySelector("#shop-sku-copy-inline");
  const sku = btn.dataset.sku || root.querySelector("#shop-sku-value")?.textContent?.trim() || "";

  btn.addEventListener("click", async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!sku) return;

    const mode = getFeedbackMode();
    const ok = await copyText(sku);
    const message = ok ? t("shop.product.copySkuDone") : t("shop.product.copySkuFail");

    if (ok) {
      runFeedback(mode, btn, inlineEl, message);
    } else {
      feedbackInline(inlineEl, message);
    }
  });
}
