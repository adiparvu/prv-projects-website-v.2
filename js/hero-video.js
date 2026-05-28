/**
 * PRV Projects — Hero video (muted, loop, glass overlay)
 */

function prefersReduced() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function initHeroVideo() {
  const wrap = document.querySelector("[data-hero-video]");
  const video = wrap?.querySelector(".hero-video");
  if (!video) return;

  const cfg = window.PRV_CONFIG?.heroVideo || {};
  const mp4 = cfg.mp4 || video.dataset.srcMp4;
  const webm = cfg.webm || video.dataset.srcWebm;
  const poster = cfg.poster || video.getAttribute("poster");

  if (poster) video.setAttribute("poster", poster);

  const sources = [];
  if (webm) sources.push({ src: webm, type: "video/webm" });
  if (mp4) sources.push({ src: mp4, type: "video/mp4" });

  if (sources.length) {
    video.innerHTML = "";
    sources.forEach(({ src, type }) => {
      const s = document.createElement("source");
      s.src = src;
      s.type = type;
      video.appendChild(s);
    });
    video.load();
  }

  video.muted = true;
  video.defaultMuted = true;
  video.loop = true;
  video.playsInline = true;
  video.setAttribute("playsinline", "");
  video.setAttribute("webkit-playsinline", "");

  if (prefersReduced()) {
    video.pause();
    video.removeAttribute("autoplay");
    return;
  }

  video.autoplay = true;

  const tryPlay = () => {
    const p = video.play();
    if (p?.catch) p.catch(() => {});
  };

  if (video.readyState >= 2) tryPlay();
  else video.addEventListener("loadeddata", tryPlay, { once: true });

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") tryPlay();
    else video.pause();
  });

  video.addEventListener("error", () => {
    wrap?.classList.add("hero-video-fallback");
    if (poster) video.style.backgroundImage = `url(${poster})`;
  });
}
