/**
 * PRV Shop — reset scroll before first paint (evită flash la footer / orbi)
 */
(function () {
  if (typeof history !== "undefined" && "scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }

  window.scrollTo(0, 0);
  document.documentElement.classList.add("shop-entering");

  window.addEventListener(
    "pageshow",
    (event) => {
      if (event.persisted) window.scrollTo(0, 0);
    },
    { passive: true }
  );
})();
