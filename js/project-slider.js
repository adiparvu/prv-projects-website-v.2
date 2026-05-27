/**
 * PRV Projects — Photo slider for project detail pages
 */
export function initProjectSlider() {
  const root = document.querySelector("[data-slider]");
  if (!root) return;

  const track = root.querySelector(".slider-track");
  const slides = [...root.querySelectorAll(".slider-slide")];
  const dotsWrap = root.querySelector(".slider-dots");
  const prev = root.querySelector("[data-slider-prev]");
  const next = root.querySelector("[data-slider-next]");
  let index = 0;
  let autoplayId;

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

  let touchX = 0;
  root.addEventListener(
    "touchstart",
    (e) => {
      touchX = e.changedTouches[0].screenX;
    },
    { passive: true }
  );
  root.addEventListener(
    "touchend",
    (e) => {
      const dx = e.changedTouches[0].screenX - touchX;
      if (Math.abs(dx) > 50) dx < 0 ? nextSlide() : prevSlide();
    },
    { passive: true }
  );

  function startAutoplay() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    autoplayId = setInterval(nextSlide, 5500);
  }

  function stopAutoplay() {
    clearInterval(autoplayId);
  }

  root.addEventListener("mouseenter", stopAutoplay);
  root.addEventListener("mouseleave", startAutoplay);
  startAutoplay();
}
