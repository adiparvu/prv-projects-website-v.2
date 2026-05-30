/**
 * PRV — săgeată back (aceeași ca în shop header), peste tot
 */

export const BACK_ARROW_SVG = `<svg class="prv-back-link__icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M15 18l-6-6 6-6"/></svg>`;

function escapeAttr(str) {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;");
}

function escapeHtml(str) {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function stripArrowPrefix(text) {
  return String(text || "")
    .replace(/^←\s*/, "")
    .trim();
}

/** Link back: săgeată + etichetă (fără chenar) */
export function backLinkHtml({ href, label = "", ariaLabel = "", className = "", i18nKey = "" } = {}) {
  const clean = stripArrowPrefix(label);
  const aria = escapeAttr(ariaLabel || clean || "Back");
  const cls = ["prv-back-link", className].filter(Boolean).join(" ");
  const i18nAttr = i18nKey ? ` data-i18n="${escapeAttr(i18nKey)}"` : "";
  const labelHtml = clean
    ? `<span class="prv-back-link__label"${i18nAttr}>${escapeHtml(clean)}</span>`
    : "";
  return `<a href="${escapeAttr(href)}" class="${cls}" aria-label="${aria}">${BACK_ARROW_SVG}${labelHtml}</a>`;
}

/** Buton back (icon only) — ca în header shop */
export function backButtonHtml({ href = "", ariaLabel = "Back", className = "", id = "" } = {}) {
  const cls = ["prv-back-btn", "shop-icon-btn", className].filter(Boolean).join(" ");
  const idAttr = id ? ` id="${escapeAttr(id)}"` : "";
  if (href) {
    return `<a href="${escapeAttr(href)}" class="${cls}"${idAttr} aria-label="${escapeAttr(ariaLabel)}">${BACK_ARROW_SVG}</a>`;
  }
  return `<button type="button" class="${cls}"${idAttr} aria-label="${escapeAttr(ariaLabel)}" data-prv-back-history>${BACK_ARROW_SVG}</button>`;
}

function syncBackLabel(anchor) {
  const labelEl = anchor.querySelector(".prv-back-link__label");
  if (!labelEl) return;
  const label = stripArrowPrefix(labelEl.textContent);
  if (labelEl.textContent !== label) labelEl.textContent = label;
  const aria = anchor.getAttribute("aria-label");
  if (aria && /^←/.test(aria)) anchor.setAttribute("aria-label", stripArrowPrefix(aria));
}

function enhanceBackLink(anchor) {
  if (!anchor) return;
  if (anchor.querySelector(".prv-back-link__icon, svg")) {
    anchor.classList.add("prv-back-link");
    syncBackLabel(anchor);
    anchor.dataset.prvBackDone = "1";
    return;
  }
  if (anchor.dataset.prvBackDone === "1") return;

  anchor.classList.add("prv-back-link");
  const i18nEl = anchor.querySelector("[data-i18n]");
  const i18nKey = i18nEl?.getAttribute("data-i18n") || anchor.getAttribute("data-i18n") || "";
  const raw = (i18nEl?.textContent || anchor.textContent || "").trim();
  const label = stripArrowPrefix(raw);

  anchor.innerHTML = `${BACK_ARROW_SVG}<span class="prv-back-link__label"${i18nKey ? ` data-i18n="${escapeAttr(i18nKey)}"` : ""}>${escapeHtml(label)}</span>`;
  if (!anchor.getAttribute("aria-label")) anchor.setAttribute("aria-label", label);
  anchor.dataset.prvBackDone = "1";
}

/** Montează săgeata pe breadcrumb-uri și linkuri marcate */
export function initBackNav(root = document) {
  root.querySelectorAll(".breadcrumb > a[href]").forEach((a, i, list) => {
    if (a === list[0]) enhanceBackLink(a);
  });

  root.querySelectorAll(".prv-back-link[data-prv-back], [data-prv-back]:not([data-prv-back-done])").forEach((el) => {
    if (el.tagName === "A") enhanceBackLink(el);
  });

  root.querySelectorAll("[data-prv-back-history]").forEach((btn) => {
    if (btn.dataset.prvBackHistoryBound === "1") return;
    btn.dataset.prvBackHistoryBound = "1";
    btn.addEventListener("click", (e) => {
      if (canGoBackInSite()) {
        e.preventDefault();
        window.history.back();
      }
    });
  });
}

function canGoBackInSite() {
  if (window.history.length <= 1) return false;
  try {
    const ref = document.referrer;
    if (!ref) return true;
    return new URL(ref).origin === window.location.origin;
  } catch {
    return true;
  }
}

/** Header shop: history.back dacă e posibil, altfel href */
export function wireShopHeaderBack(root = document) {
  const btn = root.querySelector(".shop-back-btn");
  if (!btn || btn.dataset.prvBackWired === "1") return;
  btn.dataset.prvBackWired = "1";
  btn.addEventListener("click", (e) => {
    if (canGoBackInSite()) {
      e.preventDefault();
      window.history.back();
    }
  });
}
