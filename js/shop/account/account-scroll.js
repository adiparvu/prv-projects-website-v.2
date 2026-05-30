/**
 * Scroll ușor la schimbarea categoriei în cont (fără hack-uri de boot shop).
 */

function navOffset() {
  const raw = getComputedStyle(document.documentElement).getPropertyValue("--nav-height");
  const n = parseFloat(raw);
  return Number.isFinite(n) ? n : 80;
}

/** @param {HTMLElement} profileHost */
export function scrollAccountViewToTop(profileHost) {
  if (!profileHost) return;

  const shopMain = profileHost.closest("#shop-main");
  const target =
    shopMain?.querySelector(".shop-acct-detail-page-title") ||
    shopMain?.querySelector(".shop-acct-page-title") ||
    shopMain;

  if (!target) return;

  const top = target.getBoundingClientRect().top + window.scrollY - navOffset() - 12;
  window.scrollTo({ top: Math.max(0, top), left: 0, behavior: "auto" });
}
