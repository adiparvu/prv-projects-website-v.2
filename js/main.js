/**
 * PRV Projects — Liquid Glass Experience
 * Theme · Motion · Canvas · Text effects
 */

import { initProjectSlider } from "./project-slider.js";
import { initEffects, showFormSuccess } from "./effects.js";
import { initEcosystem } from "./prv-platform.js";
import { mountNavShopInActions } from "./site-paths.js";
import { initTheme } from "./prv-theme-picker.js";
import { initBackNav } from "./prv-back.js";
import { prefersReducedMotion, isFinePointer, rafThrottle } from "./prv-perf.js";

// ——— Liquid canvas background ———
function initLiquidCanvas() {
  const canvas = document.getElementById("liquid-canvas");
  if (!canvas || prefersReducedMotion() || !isFinePointer()) return;

  const ctx = canvas.getContext("2d");
  let mouse = { x: 0.5, y: 0.5 };
  let time = 0;
  let rafId = 0;
  let running = false;

  const blobs = Array.from({ length: 4 }, (_, i) => ({
    x: Math.random(),
    y: Math.random(),
    r: 0.14 + Math.random() * 0.1,
    speed: 0.00025 + i * 0.00008,
    phase: Math.random() * Math.PI * 2,
  }));

  function resize() {
    canvas.width = window.innerWidth * devicePixelRatio;
    canvas.height = window.innerHeight * devicePixelRatio;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  }

  function getColors() {
    const dark = document.documentElement.getAttribute("data-effective-theme") === "dark";
    return dark
      ? ["rgba(0,113,227,0.1)", "rgba(94,92,230,0.08)", "rgba(191,90,242,0.06)"]
      : ["rgba(0,113,227,0.06)", "rgba(94,92,230,0.05)", "rgba(191,90,242,0.04)"];
  }

  function draw() {
    if (!running) return;
    const w = window.innerWidth;
    const h = window.innerHeight;
    const colors = getColors();
    ctx.clearRect(0, 0, w, h);

    blobs.forEach((blob, i) => {
      const t = time * blob.speed + blob.phase;
      const mx = (mouse.x - 0.5) * 0.06;
      const my = (mouse.y - 0.5) * 0.06;
      const x = (blob.x + Math.sin(t) * 0.12 + mx) * w;
      const y = (blob.y + Math.cos(t * 1.2) * 0.1 + my) * h;
      const radius = blob.r * Math.min(w, h);
      const grad = ctx.createRadialGradient(x, y, 0, x, y, radius);
      grad.addColorStop(0, colors[i % colors.length]);
      grad.addColorStop(1, "transparent");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    });

    time += 1;
    rafId = requestAnimationFrame(draw);
  }

  function start() {
    if (running || document.hidden) return;
    running = true;
    rafId = requestAnimationFrame(draw);
  }

  function stop() {
    running = false;
    cancelAnimationFrame(rafId);
  }

  window.addEventListener(
    "mousemove",
    (e) => {
      mouse.x = e.clientX / window.innerWidth;
      mouse.y = e.clientY / window.innerHeight;
      start();
    },
    { passive: true }
  );

  window.addEventListener("resize", resize, { passive: true });
  document.addEventListener("visibilitychange", () => (document.hidden ? stop() : start()), { passive: true });

  resize();
  start();
}

// ——— Cursor glow ———
function initCursorGlow() {
  const glow = document.getElementById("cursor-glow");
  if (!glow || prefersReducedMotion() || !isFinePointer()) return;

  let x = 0;
  let y = 0;
  let targetX = 0;
  let targetY = 0;
  let rafId = 0;

  glow.style.willChange = "transform";
  document.body.classList.add("pointer-active");

  window.addEventListener(
    "mousemove",
    (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
      if (!rafId) tick();
    },
    { passive: true }
  );

  function tick() {
    x += (targetX - x) * 0.18;
    y += (targetY - y) * 0.18;
    glow.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;

    if (Math.abs(targetX - x) < 0.4 && Math.abs(targetY - y) < 0.4) {
      rafId = 0;
      return;
    }
    rafId = requestAnimationFrame(tick);
  }
}

// ——— Text split & reveal ———
function splitText(el) {
  const text = el.textContent;
  el.textContent = "";
  el.classList.add("split-ready");

  [...text].forEach((char, i) => {
    const span = document.createElement("span");
    span.className = "char";
    span.style.setProperty("--char-i", i);
    span.textContent = char === " " ? "\u00a0" : char;
    el.appendChild(span);
  });
}

function initTextEffects() {
  document.querySelectorAll("[data-split]").forEach(splitText);

  const splitObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("split-done");
          splitObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2, rootMargin: "0px 0px -40px 0px" }
  );

  document.querySelectorAll("[data-split]").forEach((el) => splitObserver.observe(el));

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          entry.target.style.animationDelay = `${i * 0.08}s`;
          entry.target.classList.add("revealed");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
  );

  document.querySelectorAll("[data-reveal]").forEach((el) => revealObserver.observe(el));

  // Hero lines stagger
  requestAnimationFrame(() => {
    document.querySelectorAll(".hero-title [data-split]").forEach((el, i) => {
      el.classList.add("split-done");
    });
    document.querySelector(".eyebrow[data-split]")?.classList.add("split-done");
  });
}

// ——— 3D tilt on glass cards ———
function initTilt() {
  if (prefersReducedMotion() || !isFinePointer()) return;

  document.querySelectorAll("[data-tilt]").forEach((el) => {
    const onMove = rafThrottle((e) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      el.style.transform = `perspective(800px) rotateX(${y * -8}deg) rotateY(${x * 8}deg)`;
    });
    el.addEventListener("mousemove", onMove, { passive: true });
    el.addEventListener("mouseleave", () => {
      el.style.transform = "";
    });
  });
}

// ——— Parallax ———
function initParallax() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const items = document.querySelectorAll("[data-parallax]");
  let ticking = false;

  function update() {
    const scrollY = window.scrollY;
    items.forEach((el) => {
      const factor = parseFloat(el.dataset.parallax) || 0.1;
      el.style.transform = `translateY(${scrollY * factor}px)`;
    });
    ticking = false;
  }

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    },
    { passive: true }
  );
}

// ——— Nav scroll hide ———
function initNav() {
  mountNavShopInActions();
  const nav = document.querySelector(".nav");
  const toggle = document.querySelector(".nav-toggle");
  let lastY = 0;
  let hidden = false;

  const onScroll = rafThrottle(() => {
    const y = window.scrollY;
    const shouldHide = y > lastY && y > 120;
    if (shouldHide !== hidden) {
      hidden = shouldHide;
      nav?.classList.toggle("nav-hidden", hidden);
    }
    lastY = y;
  });

  window.addEventListener("scroll", onScroll, { passive: true });

  toggle?.addEventListener("click", () => {
    const open = nav?.classList.toggle("nav-open");
    toggle.setAttribute("aria-expanded", String(open));
  });
}

// ——— Count-up stats ———
function initCounters() {
  const stats = document.querySelectorAll(".stat[data-count]");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const stat = entry.target;
        const target = parseInt(stat.dataset.count, 10);
        const suffix = stat.dataset.countSuffix || "";
        const numEl = stat.querySelector(".stat-num");
        const duration = 1800;
        const start = performance.now();

        function easeOut(t) {
          return 1 - Math.pow(1 - t, 4);
        }

        function frame(now) {
          const p = Math.min((now - start) / duration, 1);
          const n = Math.round(easeOut(p) * target);
          numEl.textContent = p >= 1 ? `${n}${suffix}` : String(n);
          if (p < 1) requestAnimationFrame(frame);
        }

        requestAnimationFrame(frame);
        observer.unobserve(stat);
      });
    },
    { threshold: 0.5 }
  );

  stats.forEach((s) => observer.observe(s));
}

// ——— Horizontal scroll: swipe on touch (team carousel etc.) ———
function attachHorizontalSwipeScroll(track) {
  if (!track || track.dataset.swipeBound === "1") return;
  track.dataset.swipeBound = "1";

  let startX = 0;
  let startY = 0;
  let dx = 0;
  let dragging = false;

  function onStart(clientX, clientY) {
    dragging = true;
    startX = clientX;
    startY = clientY;
    dx = 0;
  }

  function onMove(clientX, clientY) {
    if (!dragging) return;
    dx = clientX - startX;
    const dy = clientY - startY;
    if (Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(dy)) {
      track.classList.add("is-dragging");
    }
  }

  function onEnd() {
    if (!dragging) return;
    dragging = false;
    track.classList.remove("is-dragging");
    const threshold = 48;
    if (Math.abs(dx) > threshold) {
      const card = track.firstElementChild;
      const step = card ? card.getBoundingClientRect().width + 16 : 280;
      track.scrollBy({ left: dx < 0 ? step : -step, behavior: "smooth" });
    }
    dx = 0;
  }

  track.addEventListener(
    "touchstart",
    (e) => {
      const t = e.changedTouches[0];
      onStart(t.clientX, t.clientY);
    },
    { passive: true }
  );
  track.addEventListener(
    "touchmove",
    (e) => {
      const t = e.changedTouches[0];
      onMove(t.clientX, t.clientY);
    },
    { passive: true }
  );
  track.addEventListener("touchend", onEnd, { passive: true });
}

// ——— Max-visible carousel (show first N, rest as slider) ———
function initMaxVisibleCarousels() {
  document.querySelectorAll("[data-max-visible][data-overflow-mode='carousel']").forEach((grid) => {
    const max = parseInt(grid.getAttribute("data-max-visible") || "4", 10);
    const items = Array.from(grid.children);
    if (items.length <= max) return;

    const overflow = items.slice(max);
    overflow.forEach((el) => el.remove());

    const host = grid.parentElement?.querySelector("[data-carousel-host]");
    if (!host) return;

    host.hidden = false;
    host.innerHTML = `
      <div class="prv-carousel glass-panel" data-reveal>
        <div class="prv-carousel-track" data-track></div>
        <div class="prv-carousel-controls">
          <button type="button" class="btn btn-glass" data-prev>←</button>
          <button type="button" class="btn btn-glass" data-next>→</button>
        </div>
      </div>
    `;

    const track = host.querySelector("[data-track]");
    overflow.forEach((el) => {
      el.classList.add("glass-panel");
      track.appendChild(el);
    });

    function scrollByCard(dir) {
      const card = track.firstElementChild;
      const step = card ? card.getBoundingClientRect().width + 16 : 320;
      track.scrollBy({ left: dir * step, behavior: "smooth" });
    }

    host.querySelector("[data-prev]")?.addEventListener("click", () => scrollByCard(-1));
    host.querySelector("[data-next]")?.addEventListener("click", () => scrollByCard(1));
    attachHorizontalSwipeScroll(track);
  });

  document.querySelectorAll(".prv-carousel-track[data-track]").forEach(attachHorizontalSwipeScroll);
}

// ——— Magnetic buttons ———
function initMagneticButtons() {
  if (prefersReducedMotion() || !isFinePointer()) return;

  document.querySelectorAll(".btn-primary").forEach((btn) => {
    const onMove = rafThrottle((e) => {
      const rect = btn.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) * 0.12;
      const y = (e.clientY - rect.top - rect.height / 2) * 0.12;
      btn.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    });
    btn.addEventListener("mousemove", onMove, { passive: true });
    btn.addEventListener("mouseleave", () => {
      btn.style.transform = "";
    });
  });
}

// ——— Forms (ofertă + newsletter rapid) ———
function formStrings() {
  return window.PRV_I18N?.strings || {};
}

async function submitQuoteForm(form, btn) {
  const s = formStrings();
  const thanks = s["form.thanks"] || "Mulțumim — revenim curând";
  const sending = s["form.sending"] || "Se trimite…";
  const original = btn.textContent;
  const fd = new FormData(form);
  const email = (fd.get("email") || "").toString().trim();
  if (!email) return;

  const isFull = form.hasAttribute("data-quote-form");
  const payload = {
    type: isFull ? "contact-full" : "contact-quick",
    email,
    name: (fd.get("name") || "").toString().trim(),
    phone: (fd.get("phone") || "").toString().trim(),
    city: (fd.get("city") || "").toString().trim(),
    projectType: (fd.get("projectType") || "").toString().trim(),
    message: (fd.get("message") || "").toString().trim(),
  };

  btn.disabled = true;
  btn.textContent = sending;
  try {
    if (window.PRV_QUOTE) {
      await window.PRV_QUOTE.submit(payload);
    } else if (window.PRV_NEWSLETTER) {
      await window.PRV_NEWSLETTER.subscribe(email);
    }
  } catch {
    /* verifică spam / FormSubmit activation */
  }

  const useFx =
    window.PRV_CONFIG?.effectsEnabled !== false &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (useFx) {
    showFormSuccess(btn, thanks);
    form.reset();
    setTimeout(() => {
      const wrap = form.querySelector(".fx-form-success-wrap");
      wrap?.remove();
      if (btn.hidden) {
        btn.hidden = false;
        btn.disabled = false;
        btn.textContent = original;
      }
    }, 4500);
    return;
  }

  btn.textContent = thanks;
  form.reset();
  setTimeout(() => {
    btn.textContent = original;
    btn.disabled = false;
  }, 4000);
}

function initForm() {
  document.querySelectorAll(".cta-form, .quote-form").forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      if (btn) submitQuoteForm(form, btn);
    });
  });
}

// ——— Boot ———
document.getElementById("year") &&
  (document.getElementById("year").textContent = new Date().getFullYear());

initEcosystem();
initTheme();
if (!document.body.classList.contains("shop-body")) {
  initLiquidCanvas();
  initCursorGlow();
}
initTextEffects();
initTilt();
initParallax();
initNav();
initBackNav();
document.addEventListener("prv:langchange", () => initBackNav());

if (typeof window !== "undefined") {
  window.PRV_BACK = { initBackNav };
}
initCounters();
initMaxVisibleCarousels();
initMagneticButtons();
initForm();
initEffects();

if (document.querySelector("[data-slider]")) initProjectSlider();
