import { config } from "./config.mjs";
import { getCatalog } from "./catalog.mjs";

const SHIPPING = config.shippingCents;
const FREE_SHIP = config.freeShippingThresholdCents;

export function applyDiscount(catalog, code, subtotalCents) {
  if (!code) return { discountCents: 0, discount: null };
  const disc = catalog.discounts?.find(
    (d) => d.active && d.code.toUpperCase() === String(code).toUpperCase()
  );
  if (!disc) return { discountCents: 0, discount: null, error: "invalid_code" };
  if (disc.minSubtotalCents && subtotalCents < disc.minSubtotalCents) {
    return { discountCents: 0, discount: null, error: "min_subtotal" };
  }
  if (disc.type === "percent") {
    return { discountCents: Math.round((subtotalCents * disc.value) / 100), discount: disc };
  }
  return { discountCents: disc.valueCents || disc.value || 0, discount: disc };
}

/**
 * Validate cart lines against catalog — anti-tampering.
 * @param {{ productId: string, qty: number, priceCents?: number }[]} items
 */
export function validateCartItems(items, { discountCode = "", lang = "ro" } = {}) {
  const catalog = getCatalog(lang);
  const lines = [];
  let subtotalCents = 0;

  for (const item of items || []) {
    const product = catalog.products.find((p) => p.id === item.productId);
    if (!product) {
      const err = new Error("invalid_product");
      err.code = "INVALID_PRODUCT";
      err.productId = item.productId;
      throw err;
    }
    const qty = Math.max(1, Math.min(99, Number(item.qty) || 1));
    if (product.stock < qty) {
      const err = new Error("insufficient_stock");
      err.code = "INSUFFICIENT_STOCK";
      err.productId = product.id;
      throw err;
    }
    const lineTotal = product.priceCents * qty;
    subtotalCents += lineTotal;
    lines.push({
      productId: product.id,
      slug: product.slug,
      sku: product.sku,
      name: product.name,
      priceCents: product.priceCents,
      image: product.images?.[0]?.url || "",
      qty,
      lineTotalCents: lineTotal,
    });
  }

  const { discountCents, discount, error: discountError } = applyDiscount(
    catalog,
    discountCode,
    subtotalCents
  );
  const shippingCents = subtotalCents > FREE_SHIP ? 0 : SHIPPING;
  const totalCents = Math.max(50, subtotalCents - discountCents + shippingCents);

  return {
    catalog,
    lines,
    subtotalCents,
    discountCents,
    discountCode: discount?.code || discountCode || "",
    discountError,
    shippingCents,
    totalCents,
    currency: catalog.meta?.currency || "EUR",
  };
}

export function stripeLineItems(lines) {
  return lines.map((line) => ({
    price_data: {
      currency: "eur",
      unit_amount: line.priceCents,
      product_data: { name: line.name, metadata: { productId: line.productId, sku: line.sku || "" } },
    },
    quantity: line.qty,
  }));
}
