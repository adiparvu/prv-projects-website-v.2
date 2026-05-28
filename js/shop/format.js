/** PRV Shop — formatting helpers */

export function formatMoney(cents, currency = "EUR") {
  const amount = (cents || 0) / 100;
  return new Intl.NumberFormat("ro-BE", { style: "currency", currency }).format(amount);
}

export function formatDate(iso) {
  if (!iso) return "—";
  return new Intl.DateTimeFormat("ro-BE", { dateStyle: "medium" }).format(new Date(iso));
}

export function uid(prefix = "id") {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 9)}`;
}

export function escapeHtml(str) {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
