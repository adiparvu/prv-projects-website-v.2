/** PRV Shop — favorite toggle on product images */

import { ShopStore } from "./store.js";
import { t } from "./i18n.js";

export const FAV_ICON = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>`;

function escapeAttr(str) {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;");
}

export function favoriteIconButton(product, { id = "", extraClass = "" } = {}) {
  const isFav = ShopStore.isFavorite(product.id);
  const cls = ["shop-media-btn", "shop-fav-btn", isFav ? "is-active" : "", extraClass].filter(Boolean).join(" ");
  const idAttr = id ? ` id="${escapeAttr(id)}"` : "";
  const label = isFav ? t("shop.product.saved") : t("shop.product.favorite");
  return `<button type="button" class="${cls}"${idAttr}
    data-fav-id="${escapeAttr(product.id)}"
    aria-pressed="${isFav}"
    aria-label="${escapeAttr(label)}">${FAV_ICON}</button>`;
}

export function syncFavoriteButtons(root, productId, isFav) {
  if (!root) return;
  const label = isFav ? t("shop.product.saved") : t("shop.product.favorite");
  root.querySelectorAll(`[data-fav-id="${productId}"]`).forEach((btn) => {
    btn.classList.toggle("is-active", isFav);
    btn.setAttribute("aria-pressed", String(isFav));
    btn.setAttribute("aria-label", label);
  });
}

const wiredRoots = new WeakSet();

export function wireFavoriteButtons(root) {
  if (!root || wiredRoots.has(root)) return;
  wiredRoots.add(root);

  root.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-fav-id]");
    if (!btn || !root.contains(btn)) return;

    e.preventDefault();
    e.stopPropagation();

    const productId = btn.dataset.favId;
    const on = ShopStore.toggleFavorite(productId);
    syncFavoriteButtons(root, productId, on);
  });

  root.addEventListener("prv:favoriteschange", () => {
    const ids = new Set([...root.querySelectorAll("[data-fav-id]")].map((b) => b.dataset.favId));
    ids.forEach((id) => syncFavoriteButtons(root, id, ShopStore.isFavorite(id)));
  });
}
