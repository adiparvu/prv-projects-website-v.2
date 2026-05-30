/**
 * Keep account in-page navigation pinned to the content top (no footer flash).
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
    shopMain?.querySelector(".shop-acct-page") ||
    shopMain;

  if (!target) {
    window.scrollTo(0, 0);
    return;
  }

  const top = target.getBoundingClientRect().top + window.scrollY - navOffset() - 12;
  window.scrollTo({ top: Math.max(0, top), left: 0, behavior: "auto" });
}

/** @param {HTMLElement} profileHost @param {() => void} update */
export function withStableAccountScroll(profileHost, update) {
  update();
  scrollAccountViewToTop(profileHost);
  requestAnimationFrame(() => {
    scrollAccountViewToTop(profileHost);
    requestAnimationFrame(() => scrollAccountViewToTop(profileHost));
  });
}

/** @param {HTMLElement} profileHost */
export function bindAccountScrollStabilizers(profileHost) {
  if (!profileHost || profileHost.dataset.acctScrollBound === "true") return;
  profileHost.dataset.acctScrollBound = "true";

  const resync = () => {
    if (document.body.classList.contains("shop-acct-stack-deep")) {
      scrollAccountViewToTop(profileHost);
    }
  };

  window.addEventListener("prv:footer-ready", resync);
  window.addEventListener("load", resync, { once: true });

  if (document.fonts?.ready) {
    document.fonts.ready.then(resync).catch(() => {});
  }
}

/** Skip boot scroll reset while drilling into account categories */
export function shouldSkipShopBootScrollReset() {
  return document.body.classList.contains("shop-acct-stack-deep");
}
