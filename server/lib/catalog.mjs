import fs from "node:fs";
import path from "node:path";
import { config } from "./config.mjs";
import { db } from "./db.mjs";

let baseCatalog = null;
const localeCache = new Map();

function loadBaseCatalog() {
  if (baseCatalog) return baseCatalog;
  const raw = fs.readFileSync(config.catalogPath, "utf8");
  baseCatalog = JSON.parse(raw);
  return baseCatalog;
}

function localePath(lang) {
  const dir = path.dirname(config.catalogPath);
  return path.join(dir, "i18n", `${lang}.json`);
}

function loadLocaleOverlay(lang) {
  if (lang === "ro" || !lang) return null;
  if (localeCache.has(lang)) return localeCache.get(lang);
  const fp = localePath(lang);
  if (!fs.existsSync(fp)) return null;
  const overlay = JSON.parse(fs.readFileSync(fp, "utf8"));
  localeCache.set(lang, overlay);
  return overlay;
}

function applyLocale(catalog, overlay) {
  if (!overlay) return catalog;
  return {
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
}

export function getCatalog(lang = "ro") {
  const base = structuredClone(loadBaseCatalog());
  const overrides = db.getStockOverrides();
  base.products = base.products.map((p) => ({
    ...p,
    stock: overrides[p.id] !== undefined ? overrides[p.id] : p.stock,
  }));
  const overlay = loadLocaleOverlay(lang);
  return applyLocale(base, overlay);
}

export function getProductById(productId, lang = "ro") {
  return getCatalog(lang).products.find((p) => p.id === productId);
}

export function invalidateCatalogCache() {
  baseCatalog = null;
  localeCache.clear();
}
