/** PRV Shop — catalog loader + locale overlays */

import { getApiBase, fetchCatalog as fetchCatalogApi } from "./api.js";
import { catalogJsonUrl, dataShopRoot } from "./paths.js";

let cache = null;
let localeCache = {};

function getLang() {
  return window.PRV_I18N?.getLang?.() || "ro";
}

async function fetchWithTimeout(url, ms = 5000) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), ms);
  try {
    return await fetch(url, { signal: ctrl.signal, cache: "no-store" });
  } finally {
    clearTimeout(timer);
  }
}

async function loadLocaleOverlay(lang) {
  if (lang === "ro") return null;
  if (localeCache[lang]) return localeCache[lang];
  try {
    const res = await fetchWithTimeout(`${dataShopRoot()}/i18n/${lang}.json`);
    if (!res.ok) return null;
    localeCache[lang] = await res.json();
    return localeCache[lang];
  } catch {
    return null;
  }
}

export function applyCatalogLocale(catalog, overlay) {
  if (!overlay) return catalog;
  const out = {
    ...catalog,
    categories: catalog.categories.map((c) => {
      const loc = overlay.categories?.[c.id];
      return loc ? { ...c, name: loc.name ?? c.name, description: loc.description ?? c.description } : c;
    }),
    products: catalog.products.map((p) => {
      const loc = overlay.products?.[p.id];
      if (!loc) return p;
      const images = (p.images || []).map((img, i) => ({
        ...img,
        alt: loc.imageAlts?.[i] ?? img.alt,
      }));
      return {
        ...p,
        name: loc.name ?? p.name,
        shortDescription: loc.shortDescription ?? p.shortDescription,
        description: loc.description ?? p.description,
        images,
      };
    }),
    reviews: (catalog.reviews || []).map((r) => {
      const key = `${r.productId}|${r.date}`;
      const loc = overlay.reviews?.[key];
      return loc?.text ? { ...r, text: loc.text } : r;
    }),
  };
  return out;
}

export function invalidateCatalogCache() {
  cache = null;
  localeCache = {};
}

export async function loadCatalog(force = false) {
  if (cache && !force) return cache;

  const lang = getLang();

  if (getApiBase()) {
    try {
      const fromApi = await Promise.race([
        fetchCatalogApi(lang),
        new Promise((_, rej) => setTimeout(() => rej(new Error("api_timeout")), 5000)),
      ]);
      if (fromApi?.products?.length) {
        cache = fromApi;
        return cache;
      }
    } catch (e) {
      console.warn("[catalog] API fallback to static", e);
    }
  }

  const res = await fetchWithTimeout(catalogJsonUrl());
  if (!res.ok) throw new Error("catalog_load_failed");
  const base = await res.json();
  const overlay = await loadLocaleOverlay(lang);
  cache = applyCatalogLocale(base, overlay);
  return cache;
}

export function getProduct(catalog, slugOrId) {
  return catalog.products.find((p) => p.slug === slugOrId || p.id === slugOrId);
}

export function getCategory(catalog, slug) {
  return catalog.categories.find((c) => c.slug === slug);
}

export function productsByCategory(catalog, categorySlug) {
  return catalog.products.filter((p) => p.categorySlug === categorySlug);
}

export function featuredProducts(catalog, limit = 8) {
  return catalog.products.filter((p) => p.featured).slice(0, limit);
}

export function searchProducts(catalog, query) {
  const q = String(query || "")
    .trim()
    .toLowerCase();
  if (!q) return [];
  return catalog.products.filter((p) => {
    const hay = [
      p.name,
      p.shortDescription,
      p.description,
      p.sku,
      ...(p.tags || []),
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return hay.includes(q);
  });
}

export function getReviews(catalog, productId) {
  return (catalog.reviews || []).filter((r) => r.productId === productId);
}

export function relatedProducts(catalog, product, limit = 4) {
  return catalog.products
    .filter((p) => p.id !== product.id && p.categorySlug === product.categorySlug)
    .slice(0, limit);
}

export function sortProducts(products, sortKey = "featured") {
  const lang = getLang();
  const list = [...products];
  switch (sortKey) {
    case "price-asc":
      return list.sort((a, b) => a.priceCents - b.priceCents);
    case "price-desc":
      return list.sort((a, b) => b.priceCents - a.priceCents);
    case "name":
      return list.sort((a, b) => a.name.localeCompare(b.name, lang));
    case "stock":
      return list.sort((a, b) => b.stock - a.stock);
    default:
      return list.sort((a, b) => Number(b.featured) - Number(a.featured));
  }
}

export function applyDiscount(catalog, code, subtotalCents) {
  const disc = catalog.discounts?.find((d) => d.active && d.code.toUpperCase() === code.toUpperCase());
  if (!disc) return { discountCents: 0, discount: null };
  if (disc.minSubtotalCents && subtotalCents < disc.minSubtotalCents) {
    return { discountCents: 0, discount: null, error: "min_subtotal" };
  }
  if (disc.type === "percent") {
    return { discountCents: Math.round((subtotalCents * disc.value) / 100), discount: disc };
  }
  return { discountCents: disc.valueCents || disc.value || 0, discount: disc };
}
