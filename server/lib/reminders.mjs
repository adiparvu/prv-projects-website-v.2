import { config } from "./config.mjs";
import { db } from "./db.mjs";
import { getCatalog, getProductById } from "./catalog.mjs";
import { sendStockReminderEmail } from "./email.mjs";

export function addReminder({ productId, email, lang = "ro" }) {
  const product = getProductById(productId, lang);
  if (!product) throw new Error("product_not_found");
  const normalized = String(email || "")
    .trim()
    .toLowerCase();
  if (!normalized.includes("@")) throw new Error("invalid_email");

  const list = db.getReminders().filter((r) => !(r.productId === productId && r.email === normalized));
  list.push({
    productId,
    email: normalized,
    productName: product.name,
    productSlug: product.slug,
    lang,
    createdAt: new Date().toISOString(),
  });
  db.saveReminders(list);
  return { ok: true };
}

export function removeReminder({ productId, email }) {
  const normalized = String(email || "").toLowerCase();
  const list = db.getReminders().filter(
    (r) => !(r.productId === productId && r.email === normalized)
  );
  db.saveReminders(list);
  return { ok: true };
}

export async function processStockReminders() {
  const catalog = getCatalog("ro");
  const list = db.getReminders();
  if (!list.length) return { sent: 0 };

  const inStock = new Set(catalog.products.filter((p) => p.stock > 0).map((p) => p.id));
  const remaining = [];
  let sent = 0;

  for (const r of list) {
    if (!inStock.has(r.productId)) {
      remaining.push(r);
      continue;
    }
    const product = catalog.products.find((p) => p.id === r.productId);
    const url = `${config.shopPublicUrl}/shop/product.html?slug=${encodeURIComponent(r.productSlug || product?.slug || "")}`;
    try {
      await sendStockReminderEmail({
        to: r.email,
        productName: r.productName || product?.name || "Produs",
        productUrl: url,
      });
      sent++;
    } catch (e) {
      console.error("[reminder]", r.productId, e.message);
      remaining.push(r);
    }
  }

  db.saveReminders(remaining);
  return { sent, remaining: remaining.length };
}

export function startReminderCron() {
  const run = () => processStockReminders().catch((e) => console.error("[reminder-cron]", e));
  run();
  setInterval(run, config.reminderCheckIntervalMs);
}
