/** PRV Shop — UI components */

import { formatMoney, escapeHtml } from "./format.js";
import { ShopRoutes } from "./routes.js";
import { ShopStore } from "./store.js";

export function productCard(product, catalog) {
  const cat = catalog.categories.find((c) => c.slug === product.categorySlug);
  const img = product.images?.[0]?.url || "";
  const compare =
    product.compareAtCents && product.compareAtCents > product.priceCents
      ? `<span class="shop-price-compare">${formatMoney(product.compareAtCents)}</span>`
      : "";
  const badge =
    product.compareAtCents && product.compareAtCents > product.priceCents
      ? `<span class="shop-badge shop-badge--sale">Reducere</span>`
      : product.stock <= 5
        ? `<span class="shop-badge shop-badge--low">Stoc limitat</span>`
        : "";

  return `
    <a href="${ShopRoutes.product(product.slug)}" class="shop-product-card glass-panel">
      <div class="shop-product-media">
        ${badge}
        <img src="${escapeHtml(img)}" alt="${escapeHtml(product.images?.[0]?.alt || product.name)}" loading="lazy" width="400" height="300" />
      </div>
      <div class="shop-product-body">
        ${cat ? `<span class="work-meta">${escapeHtml(cat.name)}</span>` : ""}
        <h3>${escapeHtml(product.name)}</h3>
        <p>${escapeHtml(product.shortDescription)}</p>
        <div class="shop-price">${formatMoney(product.priceCents)}${compare}</div>
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
      <li>Plată securizată Stripe</li>
      <li>Apple Pay · PayPal · Bancontact</li>
      <li>Factură conformă Belgia</li>
      <li>Livrare sau ridicare șantier</li>
    </ul>
  `;
}

export function cartBadgeHtml() {
  const n = ShopStore.cartCount();
  return n > 0 ? `<span class="shop-cart-badge">${n > 99 ? "99+" : n}</span>` : "";
}

export function starRating(rating, max = 5) {
  const r = Math.min(max, Math.max(0, Math.round(rating)));
  return `<span class="shop-stars" aria-label="${r} din ${max} stele">${"★".repeat(r)}<span class="shop-stars-dim">${"★".repeat(max - r)}</span></span>`;
}

export function reviewsBlock(reviews) {
  if (!reviews?.length) return "";
  const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
  return `
    <section class="shop-reviews glass-panel">
      <div class="shop-reviews-head">
        <h2>Recenzii clienți</h2>
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
      <strong>PRV10</strong> — 10% reducere la prima comandă peste €100 · <span class="work-meta">Introdu codul la checkout</span>
    </aside>
  `;
}

export function sortToolbar(current = "featured") {
  return `
    <div class="shop-toolbar glass-inset">
      <label for="shop-sort">Sortează</label>
      <select id="shop-sort" aria-label="Sortează produse">
        <option value="featured" ${current === "featured" ? "selected" : ""}>Recomandate</option>
        <option value="price-asc" ${current === "price-asc" ? "selected" : ""}>Preț: crescător</option>
        <option value="price-desc" ${current === "price-desc" ? "selected" : ""}>Preț: descrescător</option>
        <option value="name" ${current === "name" ? "selected" : ""}>Nume A–Z</option>
      </select>
    </div>
  `;
}
