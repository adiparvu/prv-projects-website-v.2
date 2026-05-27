/**
 * PRV Projects — Liquid Glass Experience
 * Theme · Motion · Canvas · Text effects
 */

const STORAGE_KEY = "prv-theme";

// ——— Theme system (light / dark / system) ———
function getSystemTheme() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function getEffectiveTheme(preference) {
  if (preference === "system") return getSystemTheme();
  return preference;
}

function applyTheme(preference) {
  const root = document.documentElement;
  const effective = getEffectiveTheme(preference);
  root.setAttribute("data-theme", preference);
  root.setAttribute("data-effective-theme", effective);
  root.style.colorScheme = effective;

  document.querySelectorAll("[data-theme-set]").forEach((btn) => {
    const isActive = btn.dataset.themeSet === preference;
    btn.classList.toggle("active", isActive);
    btn.setAttribute("aria-pressed", String(isActive));
  });
}

function initTheme() {
  const saved = localStorage.getItem(STORAGE_KEY) || "system";
  applyTheme(saved);

  document.querySelectorAll("[data-theme-set]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const theme = btn.dataset.themeSet;
      localStorage.setItem(STORAGE_KEY, theme);
      applyTheme(theme);
    });
  });

  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
    const current = localStorage.getItem(STORAGE_KEY) || "system";
    if (current === "system") applyTheme("system");
  });
}

// ——— Liquid canvas background ———
function initLiquidCanvas() {
  const canvas = document.getElementById("liquid-canvas");
  if (!canvas || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const ctx = canvas.getContext("2d");
  let width = 0;
  let height = 0;
  let time = 0;
  let mouse = { x: 0.5, y: 0.5 };
  let rafId;

  const blobs = Array.from({ length: 5 }, (_, i) => ({
    x: Math.random(),
    y: Math.random(),
    r: 0.15 + Math.random() * 0.12,
    speed: 0.0003 + i * 0.0001,
    phase: Math.random() * Math.PI * 2,
  }));

  function resize() {
    width = canvas.width = window.innerWidth * devicePixelRatio;
    height = canvas.height = window.innerHeight * devicePixelRatio;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  }

  function getColors() {
    const dark = document.documentElement.getAttribute("data-effective-theme") === "dark";
    return dark
      ? ["rgba(0,113,227,0.12)", "rgba(94,92,230,0.1)", "rgba(191,90,242,0.08)"]
      : ["rgba(0,113,227,0.08)", "rgba(94,92,230,0.07)", "rgba(191,90,242,0.06)"];
  }

  function draw() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const colors = getColors();

    ctx.clearRect(0, 0, w, h);

    blobs.forEach((blob, i) => {
      const t = time * blob.speed + blob.phase;
      const mx = (mouse.x - 0.5) * 0.08;
      const my = (mouse.y - 0.5) * 0.08;
      const x = (blob.x + Math.sin(t) * 0.15 + mx) * w;
      const y = (blob.y + Math.cos(t * 1.3) * 0.12 + my) * h;
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

  window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX / window.innerWidth;
    mouse.y = e.clientY / window.innerHeight;
  });

  window.addEventListener("resize", resize);
  resize();
  draw();

  const observer = new MutationObserver(() => {
    /* redraw picks up new colors */
  });
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-effective-theme"],
  });

  return () => {
    cancelAnimationFrame(rafId);
    observer.disconnect();
  };
}

// ——— Cursor glow ———
function initCursorGlow() {
  const glow = document.getElementById("cursor-glow");
  if (!glow || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  let x = 0;
  let y = 0;
  let targetX = 0;
  let targetY = 0;

  document.body.classList.add("pointer-active");

  window.addEventListener("mousemove", (e) => {
    targetX = e.clientX;
    targetY = e.clientY;
  });

  function tick() {
    x += (targetX - x) * 0.08;
    y += (targetY - y) * 0.08;
    glow.style.left = `${x}px`;
    glow.style.top = `${y}px`;
    requestAnimationFrame(tick);
  }
  tick();
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
      setTimeout(() => el.classList.add("split-done"), 200 + i * 120);
    });
    document.querySelector(".eyebrow[data-split]")?.classList.add("split-done");
  });
}

// ——— 3D tilt on glass cards ———
function initTilt() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  document.querySelectorAll("[data-tilt]").forEach((el) => {
    el.addEventListener("mousemove", (e) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      const rotateX = y * -12;
      const rotateY = x * 12;
      el.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

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
  const nav = document.querySelector(".nav");
  const toggle = document.querySelector(".nav-toggle");
  let lastY = 0;

  window.addEventListener(
    "scroll",
    () => {
      const y = window.scrollY;
      if (y > lastY && y > 120) nav?.classList.add("nav-hidden");
      else nav?.classList.remove("nav-hidden");
      lastY = y;
    },
    { passive: true }
  );

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

// ——— Magnetic buttons ———
function initMagneticButtons() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  document.querySelectorAll(".btn-primary").forEach((btn) => {
    btn.addEventListener("mousemove", (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px) scale(1.02)`;
    });
    btn.addEventListener("mouseleave", () => {
      btn.style.transform = "";
    });
  });
}

// ——— Form ———
async function initForm() {
  document.querySelector(".cta-form")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const input = e.target.querySelector('input[type="email"]');
    const btn = e.target.querySelector("button");
    const original = btn.textContent;
    const thanks = window.PRV_I18N?.strings?.["form.thanks"] || "Mulțumim — revenim curând";
    const email = input?.value?.trim();
    if (!email) return;

    btn.disabled = true;
    try {
      if (window.PRV_NEWSLETTER) {
        await window.PRV_NEWSLETTER.subscribe(email);
      }
    } catch {
      /* tot arătăm mulțumim — verifică spam */
    }
    btn.textContent = thanks;
    input.value = "";
    setTimeout(() => {
      btn.textContent = original;
      btn.disabled = false;
    }, 3000);
  });
}

// ——— Boot ———
document.getElementById("year") &&
  (document.getElementById("year").textContent = new Date().getFullYear());

document.addEventListener("prv:footer-ready", () => {
  if (window.PRV_I18N?.applyLang) {
    window.PRV_I18N.applyLang(window.PRV_I18N.getLang());
  }
  document.querySelectorAll("[data-reveal]").forEach((el) => {
    if (!el.classList.contains("revealed")) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("revealed");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15 }
      );
      observer.observe(el);
    }
  });
});

initTheme();
initLiquidCanvas();
initCursorGlow();
initTextEffects();
initTilt();
initParallax();
initNav();
initCounters();
initMagneticButtons();
initForm();
