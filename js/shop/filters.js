/** PRV Shop — catalog filters (Toolnation-style sidebar) */

export function filterProducts(products, { minCents = null, maxCents = null, inStockOnly = false, onSaleOnly = false } = {}) {
  return products.filter((p) => {
    if (inStockOnly && p.stock < 1) return false;
    if (onSaleOnly && !(p.compareAtCents && p.compareAtCents > p.priceCents)) return false;
    if (minCents != null && minCents !== "" && p.priceCents < Number(minCents)) return false;
    if (maxCents != null && maxCents !== "" && p.priceCents > Number(maxCents)) return false;
    return true;
  });
}

export function priceBounds(products) {
  if (!products.length) return { min: 0, max: 0 };
  const prices = products.map((p) => p.priceCents);
  return { min: Math.min(...prices), max: Math.max(...prices) };
}

export function eurosToCents(v) {
  const n = parseFloat(String(v).replace(",", "."));
  if (Number.isNaN(n) || n < 0) return null;
  return Math.round(n * 100);
}
