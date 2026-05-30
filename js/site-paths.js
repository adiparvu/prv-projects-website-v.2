/**
 * PRV — relative paths for site ↔ shop (GitHub Pages, local, subfolders)
 */

export function getSiteBase() {
  const path = location.pathname;
  if (path.includes("/shop/")) {
    const rest = path.split("/shop/")[1] || "";
    const dirs = rest.split("/").filter((s) => s && !/\.html?$/i.test(s));
    const levels = dirs.length + 1;
    return levels <= 1 ? ".." : Array(levels).fill("..").join("/");
  }
  if (/\/projects\//.test(path) || /\/blog\//.test(path)) return "..";
  return ".";
}

/** URL către homepage shop de pe orice pagină */
export function getShopUrl() {
  const path = location.pathname;
  if (path.includes("/shop/")) {
    const rest = path.split("/shop/")[1] || "";
    const dirs = rest.split("/").filter((s) => s && !/\.html?$/i.test(s));
    const prefix = dirs.length ? "../".repeat(dirs.length) : "";
    return `${prefix}index.html`;
  }
  const base = getSiteBase();
  return base === "." ? "shop/index.html" : `${base}/shop/index.html`;
}

const NAV_SHOP_SVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M6 2l1.5 6h9L18 2"/><path d="M4 8h16l-1 14H5L4 8z"/></svg>`;

/** Shop în navbar dreapta (lângă limbă + CTA), cu același efect fx-particles */
export function mountNavShopInActions() {
  if (document.body.classList.contains("shop-body")) return;

  const nav = document.querySelector(".nav");
  if (!nav) return;

  nav.querySelectorAll(".nav-links .nav-shop-link").forEach((el) => el.remove());

  const actions = nav.querySelector(".nav-actions");
  if (!actions) return;

  let link = actions.querySelector(".nav-shop-link");
  if (!link) {
    link = document.createElement("a");
    link.className = "nav-shop-link nav-util-btn nav-shop-glow";
    link.setAttribute("data-prv-shop-link", "");
    link.setAttribute("data-i18n-aria", "nav.shop");
    link.setAttribute("aria-label", "Shop");
    link.setAttribute("title", "Shop");
    link.innerHTML = NAV_SHOP_SVG;

    actions.querySelector("#lang-picker")?.remove();
    const cta = actions.querySelector(".btn-primary");
    if (cta) actions.insertBefore(link, cta);
    else actions.appendChild(link);
  } else {
    link.classList.remove("btn", "btn-primary", "fx-particles");
    link.classList.add("nav-util-btn", "nav-shop-glow");
    if (!link.querySelector("svg")) link.innerHTML = NAV_SHOP_SVG;
    link.querySelector("span")?.remove();
  }

  actions.querySelector("#lang-picker")?.remove();

  wireShopNavLinks();

  if (window.PRV_I18N?.applyLang) {
    window.PRV_I18N.applyLang(window.PRV_I18N.getLang?.() || "ro", { save: false, notify: false });
  }
}

/** Meniu site — butonul Shop → magazin */
export function wireShopNavLinks() {
  const url = getShopUrl();
  document.querySelectorAll("a.nav-shop-link, [data-prv-shop-link]").forEach((a) => {
    a.href = url;
  });
}

/** Prefix pentru linkuri footer (gol = rădăcină site) */
export function getFooterBasePrefix() {
  const b = getSiteBase();
  return b === "." ? "" : b;
}
