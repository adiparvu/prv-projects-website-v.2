/** PRV Shop — catalog loader */

let cache = null;

function catalogPath() {
  const path = window.location.pathname;
  const shopIdx = path.indexOf("/shop");
  if (shopIdx !== -1) {
    const root = path.slice(0, shopIdx);
    return `${root}/data/shop/catalog.json`;
  }
  return "data/shop/catalog.json";
}

export async function loadCatalog() {
  if (cache) return cache;
  const res = await fetch(catalogPath());
  if (!res.ok) throw new Error("catalog_load_failed");
  cache = await res.json();
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
  const list = [...products];
  switch (sortKey) {
    case "price-asc":
      return list.sort((a, b) => a.priceCents - b.priceCents);
    case "price-desc":
      return list.sort((a, b) => b.priceCents - a.priceCents);
    case "name":
      return list.sort((a, b) => a.name.localeCompare(b.name, "ro"));
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
