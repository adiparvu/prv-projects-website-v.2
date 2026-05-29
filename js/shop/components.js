/** PRV Shop — UI components */

import { formatMoney, escapeHtml } from "./format.js";
import { ShopRoutes } from "./routes.js";
import { productMediaActions } from "./media-actions.js";
import { ShopStore } from "./store.js";
import { t } from "./i18n.js";

export function productCard(product, catalog) {
  const cat = catalog.categories.find((c) => c.slug === product.categorySlug);
  const img = product.images?.[0]?.url || "";
  const onSale = product.compareAtCents && product.compareAtCents > product.priceCents;
  const compare = onSale ? `<span class="shop-price-rrp">${t("shop.rrp")} ${formatMoney(product.compareAtCents)}</span>` : "";
  const badge = onSale
    ? `<span class="shop-badge shop-badge--sale">${t("shop.badge.sale")}</span>`
    : product.stock <= 5 && product.stock > 0
      ? `<span class="shop-badge shop-badge--low">${t("shop.badge.lowStock")}</span>`
      : "";

  return `
    <a href="${ShopRoutes.product(product.slug)}" class="shop-product-card glass-panel">
      <div class="shop-product-media">
        ${badge}
        <img src="${escapeHtml(img)}" alt="${escapeHtml(product.images?.[0]?.alt || product.name)}" loading="lazy" width="400" height="300" />
        ${productMediaActions(product)}
      </div>
      <div class="shop-product-body">
        ${cat ? `<span class="work-meta">${escapeHtml(cat.name)}</span>` : ""}
        <h3>${escapeHtml(product.name)}</h3>
        <p>${escapeHtml(product.shortDescription)}</p>
        <div class="shop-price-block">
          ${compare}
          <div class="shop-price">${formatMoney(product.priceCents)}</div>
          <span class="shop-price-vat">${t("shop.price.vatIncl")}</span>
        </div>
      </div>
    </a>
  `;
}

export function categoryStrip(categories) {
  return categories
    .sort((a, b) => (a.sort || 0) - (b.sort || 0))
    .map(
      (c) => `
    <a href="${ShopRoutes.category(c.slug)}" class="shop-cat-card glass-panel">
      <img src="${escapeHtml(c.image)}" alt="" loading="lazy" />
      <span>${escapeHtml(c.name)}</span>
    </a>
  `
    )
    .join("");
}

export function breadcrumb(items) {
  return `<nav class="breadcrumb glass-inset" aria-label="Breadcrumb">${items
    .map((item, i) => {
      const sep = i ? '<span aria-hidden="true">/</span>' : "";
      const inner = item.href ? `<a href="${item.href}">${escapeHtml(item.label)}</a>` : escapeHtml(item.label);
      return `${sep}${inner}`;
    })
    .join("")}</nav>`;
}

export function trustList() {
  return `
    <ul class="shop-trust">
      <li>${t("shop.trust.stripe")}</li>
      <li>${t("shop.trust.methods")}</li>
      <li>${t("shop.trust.invoice")}</li>
      <li>${t("shop.trust.delivery")}</li>
    </ul>
  `;
}

export function uspStrip() {
  return `
    <div class="shop-usp glass-inset" role="note">
      <span>${t("shop.usp.prices")}</span>
      <span>${t("shop.usp.warranty")}</span>
      <span>${t("shop.usp.shipping")}</span>
      <span>${t("shop.usp.vat")}</span>
    </div>
  `;
}

export function cartBadgeHtml() {
  const n = ShopStore.cartCount();
  return n > 0 ? `<span class="shop-cart-badge">${n > 99 ? "99+" : n}</span>` : "";
}

export function starRating(rating, max = 5) {
  const r = Math.min(max, Math.max(0, Math.round(rating)));
  return `<span class="shop-stars" aria-label="${r} / ${max}">${"★".repeat(r)}<span class="shop-stars-dim">${"★".repeat(max - r)}</span></span>`;
}

export function reviewsBlock(reviews) {
  if (!reviews?.length) return "";
  const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
  return `
    <section class="shop-reviews glass-panel">
      <div class="shop-reviews-head">
        <h2>${t("shop.reviews.title")}</h2>
        ${starRating(avg)} <span class="work-meta">(${reviews.length})</span>
      </div>
      <ul class="shop-reviews-list">
        ${reviews
          .map(
            (r) => `
          <li>
            <div class="shop-review-meta">${starRating(r.rating)} <strong>${escapeHtml(r.author)}</strong> · ${escapeHtml(r.date)}</div>
            <p>${escapeHtml(r.text)}</p>
          </li>`
          )
          .join("")}
      </ul>
    </section>
  `;
}

export function promoBanner() {
  return `
    <aside class="shop-promo glass-inset" role="note">
      ${t("shop.home.promo", {
        code: t("shop.promo.code"),
        pct: t("shop.promo.pct"),
        min: t("shop.promo.min"),
      })}
    </aside>
  `;
}

export function sortToolbar(current = "featured") {
  return `
    <div class="shop-toolbar glass-inset">
      <label for="shop-sort">${t("shop.sort.label")}</label>
      <select id="shop-sort" aria-label="${t("shop.sort.label")}">
        <option value="featured" ${current === "featured" ? "selected" : ""}>${t("shop.sort.featured")}</option>
        <option value="price-asc" ${current === "price-asc" ? "selected" : ""}>${t("shop.sort.priceAsc")}</option>
        <option value="price-desc" ${current === "price-desc" ? "selected" : ""}>${t("shop.sort.priceDesc")}</option>
        <option value="name" ${current === "name" ? "selected" : ""}>${t("shop.sort.name")}</option>
      </select>
    </div>
  `;
}

export function filterSidebar({ minEuro = "", maxEuro = "", inStockOnly = false, onSaleOnly = false, bounds = null } = {}) {
  const minHint = bounds ? (bounds.min / 100).toFixed(0) : "";
  const maxHint = bounds ? (bounds.max / 100).toFixed(0) : "";
  return `
    <aside class="shop-filters glass-panel" aria-label="${t("shop.filter.title")}">
      <h2 class="shop-filters-title">${t("shop.filter.title")}</h2>
      <fieldset class="shop-filter-group">
        <legend>${t("shop.filter.price")}</legend>
        <div class="shop-filter-row">
          <label>${t("shop.filter.min")}<input type="number" id="shop-filter-min" min="0" step="1" placeholder="${minHint}" value="${escapeHtml(minEuro)}" /></label>
          <label>${t("shop.filter.max")}<input type="number" id="shop-filter-max" min="0" step="1" placeholder="${maxHint}" value="${escapeHtml(maxEuro)}" /></label>
        </div>
      </fieldset>
      <label class="shop-filter-check"><input type="checkbox" id="shop-filter-stock" ${inStockOnly ? "checked" : ""} /> ${t("shop.filter.inStock")}</label>
      <label class="shop-filter-check"><input type="checkbox" id="shop-filter-sale" ${onSaleOnly ? "checked" : ""} /> ${t("shop.filter.onSale")}</label>
      <div class="shop-filter-actions">
        <button type="button" class="btn btn-primary btn-sm" id="shop-filter-apply">${t("shop.filter.apply")}</button>
        <button type="button" class="btn btn-glass btn-sm" id="shop-filter-clear">${t("shop.filter.clear")}</button>
      </div>
    </aside>
  `;
}

export function listingMeta(from, to, total) {
  if (!total) return "";
  return `<p class="shop-listing-meta work-meta">${t("shop.listing.range", { from, to, total })}</p>`;
}
