/** PRV — utilitare performanță (instant / smooth) */

export function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function isFinePointer() {
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}

export function isShopPage() {
  return /\/shop(\/|$)/.test(window.location.pathname) || document.body.classList.contains("shop-body");
}

export function rafThrottle(fn) {
  let scheduled = false;
  let lastArgs;
  return (...args) => {
    lastArgs = args;
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      fn(...lastArgs);
    });
  };
}

export function dispatchFooterReadyOnce() {
  if (window.__prvFooterReadyDone) return false;
  window.__prvFooterReadyDone = true;
  window.dispatchEvent(new CustomEvent("prv:footer-ready"));
  return true;
}

export function bindVisibilityPause({ onShow, onHide }) {
  const sync = () => (document.hidden ? onHide?.() : onShow?.());
  document.addEventListener("visibilitychange", sync, { passive: true });
  sync();
}
