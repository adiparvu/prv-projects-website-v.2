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
