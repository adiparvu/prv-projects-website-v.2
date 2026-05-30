/**
 * PRV — săgeată back simplă în Floating Glass Header (ca shop)
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

/** Link back cu săgeată + etichetă (doar zone de conținut, ex. empty state) */
export function backLinkHtml({ href, label = "", ariaLabel = "", className = "", i18nKey = "" } = {}) {
  const clean = stripArrowPrefix(label);
  const aria = escapeAttr(ariaLabel || clean || backAriaLabel());
  const cls = ["prv-back-link", className].filter(Boolean).join(" ");
  const i18nAttr = i18nKey ? ` data-i18n="${escapeAttr(i18nKey)}"` : "";
  const labelHtml = clean
    ? `<span class="prv-back-link__label"${i18nAttr}>${escapeHtml(clean)}</span>`
    : "";
  return `<a href="${escapeAttr(href)}" class="${cls}" aria-label="${aria}">${BACK_ARROW_SVG}${labelHtml}</a>`;
}

/** Icon simplu pentru glass header (site) */
export function glassHeaderBackHtml(href) {
  return `<a href="${escapeAttr(href)}" class="nav-icon-btn nav-back-btn" aria-label="${escapeAttr(backAriaLabel())}" data-i18n-aria="nav.back" data-prv-glass-back>${BACK_ARROW_SVG}</a>`;
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

function isSiteHome() {
  const path = location.pathname;
  if (/\/(shop|projects|blog)(\/|$)/.test(path)) return false;
  const file = path.split("/").filter(Boolean).pop() || "index.html";
  return file === "index.html" || file === "";
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

function shouldShowGlassBack() {
  if (document.body.classList.contains("shop-body")) return true;
  if (isSiteHome()) return false;
  return true;
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
    if (typeof window.PRV_ACCOUNT_NAV?.pop === "function") {
      e.preventDefault();
      window.PRV_ACCOUNT_NAV.pop();
      return;
    }
    if (canGoBackInSite()) {
      e.preventDefault();
      window.history.back();
    }
  });
}

/** Săgeată simplă în header glass site (layout ca shop — stânga, fără text) */
export function mountGlassHeaderBack(root = document) {
  if (document.body.classList.contains("shop-body")) return;

  root.querySelectorAll("header.nav").forEach((nav) => {
    if (nav.closest(".shop-shell") || nav.querySelector(".nav-header-slot--start")) return;
    if (!shouldShowGlassBack()) return;

    const fallback = getSmartBackFallback();
    const slot = document.createElement("div");
    slot.className = "nav-header-slot nav-header-slot--start";
    slot.innerHTML = glassHeaderBackHtml(fallback);
    nav.insertBefore(slot, nav.firstChild);
    nav.classList.add("nav--has-back");

    wireSmartBack(slot.querySelector("[data-prv-glass-back]"), { fallbackHref: fallback });
  });

  window.PRV_I18N?.applyToDOM?.(root);
}

/** Inițializare back — doar glass header (+ shop header via wireShopHeaderBack) */
export function initBackNav(root = document) {
  mountGlassHeaderBack(root);
}

/** Header shop: săgeată simplă, history.back sau fallback */
export function wireShopHeaderBack(root = document) {
  const btn = root.querySelector(".shop-back-btn");
  if (!btn || btn.dataset.prvBackWired === "1") return;
  btn.dataset.prvBackWired = "1";

  const fallback = isShopHome()
    ? getSiteBase() === "."
      ? "index.html"
      : `${getSiteBase()}/index.html`
    : getShopUrl();
  if (!btn.getAttribute("href")) btn.setAttribute("href", fallback);
  btn.setAttribute("data-i18n-aria", "nav.back");

  wireSmartBack(btn, { fallbackHref: fallback });
}
