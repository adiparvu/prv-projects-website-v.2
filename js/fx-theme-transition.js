/**
 * PRV — crossfade light/dark (site + shop)
 */

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

export function prefersReducedMotion() {
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

function isFxEnabled() {
  const cfg = window.PRV_CONFIG || {};
  if (cfg.effectsEnabled === false) return false;
  if (document.body?.dataset.fxOff === "true") return false;
  return true;
}

function syncReducedMotionState() {
  document.documentElement.classList.toggle("reduced-motion", prefersReducedMotion());
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
  syncReducedMotionState();

  const motionMq = window.matchMedia(REDUCED_MOTION_QUERY);
  if (typeof motionMq.addEventListener === "function") {
    motionMq.addEventListener("change", syncReducedMotionState);
  } else if (typeof motionMq.addListener === "function") {
    motionMq.addListener(syncReducedMotionState);
  }

  if (window.PRV_FX?.themeTransition) return;

  const overlay = ensureThemeOverlay();
  let busy = false;

  window.PRV_FX = window.PRV_FX || {};
  window.PRV_FX.themeTransition = (applyFn, preference) => {
    if (!isFxEnabled() || prefersReducedMotion() || busy) {
      applyFn(preference);
      return;
    }
    busy = true;
    overlay.classList.add("is-active");
    window.setTimeout(() => {
      applyFn(preference);
      requestAnimationFrame(() => {
        overlay.classList.remove("is-active");
        window.setTimeout(() => {
          busy = false;
        }, 320);
      });
    }, 150);
  };
}

/** Crossfade doar dacă animația e permisă (user toggle + motion OK) */
export function shouldAnimateThemeChange() {
  return isFxEnabled() && !prefersReducedMotion() && typeof window.PRV_FX?.themeTransition === "function";
}
