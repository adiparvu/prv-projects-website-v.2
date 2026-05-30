/** PRV Shop — resolve site root for catalog/assets (GitHub Pages, subfolders, tunnel) */

export function siteRootPrefix() {
  const path = window.location.pathname;
  const m = path.match(/^(.*\/shop)(?:\/|$)/);
  if (m) return m[1].replace(/\/shop$/, "") || "";
  return "";
}

export function catalogJsonUrl() {
  const root = siteRootPrefix();
  return root ? `${root}/data/shop/catalog.json` : "/data/shop/catalog.json";
}

export function dataShopRoot() {
  const root = siteRootPrefix();
  return root ? `${root}/data/shop` : "/data/shop";
}
