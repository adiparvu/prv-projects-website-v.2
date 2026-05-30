/**
 * PRV — săgeată back (aceeași ca în shop header), peste tot
 */

import { getSiteBase, getShopUrl } from "./site-paths.js";

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

function backAriaLabel() {
  return window.PRV_I18N?.strings?.["nav.back"] || "Back";
}

/** Link back: săgeată + etichetă (fără chenar) */
export function backLinkHtml({ href, label = "", ariaLabel = "", className = "", i18nKey = "" } = {}) {
  const clean = stripArrowPrefix(label);
  const aria = escapeAttr(ariaLabel || clean || backAriaLabel());
  const cls = ["prv-back-link", className].filter(Boolean).join(" ");
  const i18nAttr = i18nKey ? ` data-i18n="${escapeAttr(i18nKey)}"` : "";
  const labelHtml = clean
    ? `<span class="prv-back-link__label"${i18nAttr}>${escapeHtml(clean)}</span>`
    : "";
  return `<a href="${escapeAttr(href)}" class="${cls}" aria-label="${aria}" data-prv-back-smart>${BACK_ARROW_SVG}${labelHtml}</a>`;
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

  const hasIcon = anchor.querySelector(".prv-back-link__icon, svg");
  if (hasIcon) {
    anchor.classList.add("prv-back-link");
    syncBackLabel(anchor);
    anchor.removeAttribute("data-i18n");
    anchor.dataset.prvBackDone = "1";
    if (!anchor.hasAttribute("data-prv-back-smart")) anchor.setAttribute("data-prv-back-smart", "");
    return;
  }

  delete anchor.dataset.prvBackDone;

  anchor.classList.add("prv-back-link");
  const i18nEl = anchor.querySelector("[data-i18n]");
  const i18nKey = i18nEl?.getAttribute("data-i18n") || anchor.getAttribute("data-i18n") || "";
  const raw = (i18nEl?.textContent || anchor.textContent || "").trim();
  const label = stripArrowPrefix(raw);

  anchor.removeAttribute("data-i18n");
  anchor.innerHTML = `${BACK_ARROW_SVG}<span class="prv-back-link__label"${i18nKey ? ` data-i18n="${escapeAttr(i18nKey)}"` : ""}>${escapeHtml(label)}</span>`;
  if (!anchor.getAttribute("aria-label")) anchor.setAttribute("aria-label", label || backAriaLabel());
  anchor.setAttribute("data-prv-back-smart", "");
  anchor.dataset.prvBackDone = "1";
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

function isShopHome() {
  const path = location.pathname;
  if (!path.includes("/shop")) return false;
  const tail = path.split("/shop")[1] || "/";
  const seg = tail.replace(/^\/+|\/+$/g, "").split("/").filter(Boolean);
  return seg.length === 0 || (seg.length === 1 && seg[0] === "index.html");
}

function getSmartBackFallback() {
  const base = getSiteBase();
  const path = location.pathname;
  const siteHome = base === "." ? "index.html" : `${base}/index.html`;

  if (path.includes("/shop")) {
    if (isShopHome()) return siteHome;
    return getShopUrl();
  }

  if (path.includes("/projects/")) {
    return base === "." ? "proiecte.html" : `${base}/proiecte.html`;
  }

  if (path.includes("/blog/")) {
    const tail = path.split("/blog/")[1] || "";
    if (tail && tail !== "index.html") {
      return base === "." ? "blog/index.html" : `${base}/blog/index.html`;
    }
  }

  return siteHome;
}

/** history.back dacă e posibil, altfel href fallback */
export function wireSmartBack(el, { fallbackHref } = {}) {
  if (!el || el.dataset.prvBackSmartWired === "1") return;
  el.dataset.prvBackSmartWired = "1";

  const fallback = fallbackHref || el.getAttribute("href") || getSmartBackFallback();
  if (el.tagName === "A" && fallback && !el.getAttribute("href")) {
    el.setAttribute("href", fallback);
  }

  el.addEventListener("click", (e) => {
    if (canGoBackInSite()) {
      e.preventDefault();
      window.history.back();
    }
  });
}

function wireSmartBackLinks(root = document) {
  root.querySelectorAll("[data-prv-back-smart], .prv-back-link[href], .shop-page-back a[href], .breadcrumb > a[href]").forEach((el) => {
    wireSmartBack(el);
  });
}

/** Montează săgeata pe breadcrumb-uri și linkuri back din conținut */
export function initBackNav(root = document) {
  root.querySelectorAll(".breadcrumb > a[href]").forEach((a, i, list) => {
    if (a === list[0]) enhanceBackLink(a);
  });

  root.querySelectorAll(".prv-back-link[data-prv-back], [data-prv-back]:not([data-prv-back-done])").forEach((el) => {
    if (el.tagName === "A") enhanceBackLink(el);
  });

  root.querySelectorAll(".shop-page-back .prv-back-link[href]").forEach((a) => {
    if (!a.querySelector("svg")) enhanceBackLink(a);
    else a.setAttribute("data-prv-back-smart", "");
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

  wireSmartBackLinks(root);
}

/** Header shop: history.back dacă e posibil, altfel href */
export function wireShopHeaderBack(root = document) {
  const btn = root.querySelector(".shop-back-btn");
  if (!btn || btn.dataset.prvBackWired === "1") return;
  btn.dataset.prvBackWired = "1";

  const fallback = isShopHome() ? (getSiteBase() === "." ? "index.html" : `${getSiteBase()}/index.html`) : getShopUrl();
  if (!btn.getAttribute("href")) btn.setAttribute("href", fallback);
  btn.setAttribute("data-prv-back-smart", "");
  btn.setAttribute("data-i18n-aria", "nav.back");

  wireSmartBack(btn, { fallbackHref: fallback });
}
