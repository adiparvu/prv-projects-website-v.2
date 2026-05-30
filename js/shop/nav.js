/** PRV Shop — același floating glass nav ca pe website */

export function initShopNav() {
  const nav = document.getElementById("shop-top-nav");
  if (!nav || nav.dataset.prvNavBound === "1") return;
  nav.dataset.prvNavBound = "1";

  let lastY = 0;
  window.addEventListener(
    "scroll",
    () => {
      const y = window.scrollY;
      if (y > lastY && y > 120) nav.classList.add("nav-hidden");
      else nav.classList.remove("nav-hidden");
      lastY = y;
    },
    { passive: true }
  );
}
