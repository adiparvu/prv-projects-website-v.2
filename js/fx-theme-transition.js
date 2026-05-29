/**
 * PRV — crossfade light/dark (site + shop)
 */

function prefersReduced() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function isFxEnabled() {
  const cfg = window.PRV_CONFIG || {};
  if (cfg.effectsEnabled === false) return false;
  if (document.body?.dataset.fxOff === "true") return false;
  return true;
}

function ensureThemeOverlay() {
  let el = document.getElementById("fx-theme-overlay");
  if (!el) {
    el = document.createElement("div");
    el.id = "fx-theme-overlay";
    el.setAttribute("aria-hidden", "true");
    document.body.appendChild(el);
  }
  return el;
}

/** Înregistrează PRV_FX.themeTransition (idempotent) */
export function initThemeTransition() {
  if (window.PRV_FX?.themeTransition) return;

  const overlay = ensureThemeOverlay();
  let busy = false;

  window.PRV_FX = window.PRV_FX || {};
  window.PRV_FX.themeTransition = (applyFn, preference) => {
    if (!isFxEnabled() || prefersReduced() || busy) {
      applyFn(preference);
      return;
    }
    busy = true;
    overlay.classList.add("is-active");
    setTimeout(() => {
      applyFn(preference);
      requestAnimationFrame(() => {
        overlay.classList.remove("is-active");
        setTimeout(() => {
          busy = false;
        }, 320);
      });
    }, 150);
  };
}
