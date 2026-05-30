/**
 * PRV Projects — Photo slider for project detail pages (touch swipe + drag)
 */

function initSingleProjectSlider(root) {
  const track = root.querySelector(".slider-track");
  const viewport = root.querySelector(".slider-viewport") || root;
  const slides = [...root.querySelectorAll(".slider-slide")];
  const dotsWrap = root.querySelector(".slider-dots");
  const prev = root.querySelector("[data-slider-prev]");
  const next = root.querySelector("[data-slider-next]");
  if (!track || slides.length === 0) return;

  let index = 0;
  let autoplayId;

  if (dotsWrap) dotsWrap.innerHTML = "";

  slides.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "slider-dot" + (i === 0 ? " is-active" : "");
    dot.setAttribute("aria-label", `Slide ${i + 1}`);
    dot.addEventListener("click", () => goTo(i));
    dotsWrap?.appendChild(dot);
  });

  const dots = dotsWrap ? [...dotsWrap.querySelectorAll(".slider-dot")] : [];

  function goTo(i) {
    index = (i + slides.length) % slides.length;
    track.style.transition = "transform 0.6s var(--ease-out-expo)";
    track.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((d, j) => d.classList.toggle("is-active", j === index));
  }

  function nextSlide() {
    goTo(index + 1);
  }

  function prevSlide() {
    goTo(index - 1);
  }

  prev?.addEventListener("click", prevSlide);
  next?.addEventListener("click", nextSlide);

  let isDragging = false;
  let startX = 0;
  let startY = 0;
  let dx = 0;
  let width = 1;

  function measure() {
    width = viewport.getBoundingClientRect().width || 1;
  }

  function setDragTransform(deltaPx) {
    track.style.transition = "none";
    track.style.transform = `translate3d(${-index * width + deltaPx}px, 0, 0)`;
  }

  function snap() {
    track.style.transition = "transform 0.6s var(--ease-out-expo)";
    track.style.transform = `translateX(-${index * 100}%)`;
  }

  function onStart(clientX, clientY) {
    stopAutoplay();
    measure();
    isDragging = true;
    startX = clientX;
    startY = clientY;
    dx = 0;
  }

  function onMove(clientX, clientY) {
    if (!isDragging) return { prevent: false };
    dx = clientX - startX;
    const dy = clientY - startY;
    if (Math.abs(dx) < 6 || Math.abs(dx) < Math.abs(dy) * 1.1) return { prevent: false };
    setDragTransform(dx);
    return { prevent: true };
  }

  function onEnd() {
    if (!isDragging) return;
    isDragging = false;
    const threshold = Math.max(40, Math.min(90, width * 0.18));
    if (Math.abs(dx) > threshold) (dx < 0 ? nextSlide : prevSlide)();
    else snap();
    startAutoplay();
  }

  if (window.PointerEvent) {
    viewport.addEventListener("pointerdown", (e) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      viewport.setPointerCapture?.(e.pointerId);
      onStart(e.clientX, e.clientY);
    });
    viewport.addEventListener("pointermove", (e) => {
      const { prevent } = onMove(e.clientX, e.clientY);
      if (prevent) e.preventDefault();
    });
    viewport.addEventListener("pointerup", onEnd);
    viewport.addEventListener("pointercancel", onEnd);
  } else {
    viewport.addEventListener(
      "touchstart",
      (e) => {
        const t = e.changedTouches[0];
        onStart(t.clientX, t.clientY);
      },
      { passive: true }
    );
    viewport.addEventListener(
      "touchmove",
      (e) => {
        const t = e.changedTouches[0];
        const { prevent } = onMove(t.clientX, t.clientY);
        if (prevent) e.preventDefault();
      },
      { passive: false }
    );
    viewport.addEventListener("touchend", onEnd, { passive: true });
  }

  window.addEventListener("resize", () => {
    measure();
    snap();
  });

  function startAutoplay() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    clearInterval(autoplayId);
    autoplayId = setInterval(nextSlide, 5500);
  }

  function stopAutoplay() {
    clearInterval(autoplayId);
  }

  root.addEventListener("mouseenter", stopAutoplay);
  root.addEventListener("mouseleave", startAutoplay);
  startAutoplay();
}

export function initProjectSlider() {
  document.querySelectorAll("[data-slider]").forEach(initSingleProjectSlider);
}
