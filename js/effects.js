/**
 * PRV Projects — Micro-interacțiuni & efecte (fx)
 */

const NAV_OFFSET = 88;
const STAGGER_MS = 100;

function prefersReduced() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function isEnabled() {
  const cfg = window.PRV_CONFIG || {};
  if (cfg.effectsEnabled === false) return false;
  if (document.body?.dataset.fxOff === "true") return false;
  return true;
}

// ——— 3. Smooth scroll ancore ———
function initSmoothScroll() {
  const nav = document.querySelector(".nav");
  const offset = () => (nav ? nav.getBoundingClientRect().height + 12 : NAV_OFFSET);

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    const href = link.getAttribute("href");
    if (!href || href === "#" || href.length < 2) return;

    link.addEventListener("click", (e) => {
      const id = href.slice(1);
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - offset();
      window.scrollTo({ top: Math.max(0, top), behavior: prefersReduced() ? "auto" : "smooth" });
      history.pushState(null, "", href);
    });
  });
}

// ——— 2. Stagger reveal ———
function initStagger() {
  document.querySelectorAll("[data-stagger]").forEach((grid) => {
    const children = [...grid.children];
    children.forEach((child, i) => {
      child.style.setProperty("--stagger-i", String(i));
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("fx-stagger-go");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    observer.observe(grid);
  });
}

// ——— 8. Lazy image fade ———
function initLazyImages() {
  document.querySelectorAll("img.fx-img").forEach((img) => {
    const reveal = () => img.classList.add("is-loaded");

    if (img.complete && img.naturalWidth > 0) {
      reveal();
      return;
    }

    img.addEventListener("load", reveal, { once: true });
    img.addEventListener("error", reveal, { once: true });
  });
}

// ——— 4. Icon stroke draw ———
function initIconDraw() {
  document.querySelectorAll(".feature-icon svg.fx-icon-draw").forEach((svg) => {
    const paths = svg.querySelectorAll("path, line, polyline, rect, circle");
    paths.forEach((el) => {
      try {
        const len = el.getTotalLength?.() || 120;
        el.style.strokeDasharray = String(len);
        el.style.strokeDashoffset = String(len);
      } catch {
        /* ignore */
      }
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("fx-drawn");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.35 }
    );
    observer.observe(svg);
  });
}

// ——— 7. Page enter ———
function initPageEnter() {
  if (!document.body.classList.contains("fx-page-enter")) return;
  if (prefersReduced()) {
    document.body.classList.add("fx-page-ready");
    return;
  }
  requestAnimationFrame(() => {
    requestAnimationFrame(() => document.body.classList.add("fx-page-ready"));
  });
}

// ——— 10. Ripple ———
function initRipple() {
  document.querySelectorAll(".btn.fx-ripple, .btn-glass.fx-ripple").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      if (prefersReduced()) return;
      const rect = btn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const wave = document.createElement("span");
      wave.className = "fx-ripple-wave";
      wave.style.width = wave.style.height = `${size}px`;
      wave.style.left = `${e.clientX - rect.left - size / 2}px`;
      wave.style.top = `${e.clientY - rect.top - size / 2}px`;
      btn.appendChild(wave);
      wave.addEventListener("animationend", () => wave.remove());
    });
  });
}

// ——— 11. FAQ polish ———
function initFaqFx() {
  document.querySelectorAll(".faq-item.fx-faq").forEach((item) => {
    item.classList.add("fx-faq");
  });
}

// ——— 14. CTA particles ———
function initCtaParticles() {
  document.querySelectorAll(".btn-primary.fx-particles").forEach((btn) => {
    let layer = btn.querySelector(".fx-particle-layer");
    if (!layer) {
      layer = document.createElement("span");
      layer.className = "fx-particle-layer";
      layer.setAttribute("aria-hidden", "true");
      btn.prepend(layer);
    }

    const spawn = (e) => {
      if (prefersReduced()) return;
      const rect = btn.getBoundingClientRect();
      const cx = (e?.clientX ?? rect.left + rect.width / 2) - rect.left;
      const cy = (e?.clientY ?? rect.top + rect.height / 2) - rect.top;
      const count = 10;
      for (let i = 0; i < count; i += 1) {
        const p = document.createElement("span");
        p.className = "fx-particle";
        const angle = (Math.PI * 2 * i) / count + Math.random() * 0.4;
        const dist = 28 + Math.random() * 36;
        p.style.left = `${cx}px`;
        p.style.top = `${cy}px`;
        p.style.setProperty("--px", `${Math.cos(angle) * dist}px`);
        p.style.setProperty("--py", `${Math.sin(angle) * dist}px`);
        layer.appendChild(p);
        p.addEventListener("animationend", () => p.remove());
      }
    };

    btn.addEventListener("mouseenter", spawn);
    btn.addEventListener("focus", spawn);
  });
}

// ——— 13. Theme crossfade ———
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

function initThemeTransition() {
  const overlay = ensureThemeOverlay();
  let busy = false;

  window.PRV_FX = window.PRV_FX || {};
  window.PRV_FX.themeTransition = (applyFn, preference) => {
    if (prefersReduced() || busy) {
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

// ——— 9. Form success (export for main.js) ———
export function showFormSuccess(btn, message) {
  if (!btn) return;
  const wrap = document.createElement("span");
  wrap.className = "fx-form-success-wrap";
  wrap.innerHTML = `
    <span class="fx-form-check" aria-hidden="true">
      <svg viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"/></svg>
    </span>
    <span>${message}</span>
  `;
  const parent = btn.parentElement;
  if (parent?.classList.contains("cta-form") || parent?.classList.contains("quote-form")) {
    btn.hidden = true;
    parent.appendChild(wrap);
    return;
  }
  btn.replaceWith(wrap);
}

// ——— Sweep auto on hero/CTA glass ———
function initSweepTargets() {
  document.querySelectorAll(".fx-sweep").forEach((el) => {
    if (!el.classList.contains("glass-panel") && !el.classList.contains("glass-card")) {
      el.classList.add("glass-panel");
    }
  });
}

// ——— Boot ———
export function initEffects() {
  if (!isEnabled()) return;

  initThemeTransition();
  initSmoothScroll();
  initStagger();
  initLazyImages();
  initIconDraw();
  initPageEnter();
  initRipple();
  initFaqFx();
  initCtaParticles();
  initSweepTargets();

  if (!prefersReduced()) {
    document.body.classList.add("fx-scroll-driven");
  }
}
