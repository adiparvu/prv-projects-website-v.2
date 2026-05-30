/**
 * PRV Shop — boot scroll guard doar pe homepage shop (nu account / coș / etc.)
 */
(function () {
  if (typeof history !== "undefined" && "scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }

  const page = (function detect() {
    const path = location.pathname;
    if (!path.includes("/shop")) return null;
    const after = path.split("/shop/")[1] || "";
    const parts = after.split("/").filter(Boolean);
    if (parts.length === 0) return "home";
    if (parts.length === 1 && parts[0] === "index.html") return "home";
    return "utility";
  })();

  if (page !== "home") {
    document.documentElement.classList.add("shop-utility-page");
    return;
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
