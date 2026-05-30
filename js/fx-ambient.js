/**
 * PRV — ambient background FX (liquid canvas + cursor glow)
 * Shared by website (main.js) and shop (boot.js).
 */

export function initLiquidCanvas() {
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

export function initCursorGlow() {
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

export function initAmbientFx() {
  initLiquidCanvas();
  initCursorGlow();
}
