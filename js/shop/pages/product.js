import { getProduct } from "../catalog.js";
import { breadcrumb } from "../components.js";
import { formatMoney, escapeHtml } from "../format.js";
import { ShopRoutes } from "../routes.js";
import { ShopStore } from "../store.js";

export function renderProduct(main, catalog, slug) {
  const product = getProduct(catalog, slug);
  if (!product) {
    main.innerHTML = `<div class="shop-empty glass-panel"><p>Produs negăsit.</p></div>`;
    return;
  }

  const cat = catalog.categories.find((c) => c.slug === product.categorySlug);
  const img = product.images?.[0]?.url || "";
  const isFav = ShopStore.isFavorite(product.id);

  main.innerHTML = `
    ${breadcrumb([
      { label: "Shop", href: ShopRoutes.home() },
      { label: cat?.name || "Produs", href: cat ? ShopRoutes.category(cat.slug) : null },
      { label: product.name },
    ])}
    <article class="shop-pdp glass-panel" style="margin-top:1rem;padding:1.5rem">
      <div class="shop-gallery">
        <div class="shop-gallery-main">
          <img src="${escapeHtml(img)}" alt="${escapeHtml(product.images?.[0]?.alt || product.name)}" />
        </div>
      </div>
      <div class="shop-pdp-info">
        <p class="shop-pdp-meta">SKU ${escapeHtml(product.sku)} · ${product.stock > 0 ? `${product.stock} în stoc` : "Indisponibil"}</p>
        <h1>${escapeHtml(product.name)}</h1>
        <div class="shop-pdp-price">${formatMoney(product.priceCents)}
          ${product.compareAtCents ? `<span class="shop-price-compare">${formatMoney(product.compareAtCents)}</span>` : ""}
        </div>
        <p>${escapeHtml(product.description)}</p>
        <div class="shop-qty-row">
          <div class="shop-qty">
            <button type="button" data-qty-minus aria-label="Mai puțin">−</button>
            <input type="number" id="shop-qty" value="1" min="1" max="${product.stock}" aria-label="Cantitate" />
            <button type="button" data-qty-plus aria-label="Mai mult">+</button>
          </div>
          <button type="button" class="btn btn-primary" id="shop-add-cart" ${product.stock < 1 ? "disabled" : ""}>Adaugă în coș</button>
          <button type="button" class="btn btn-glass" id="shop-fav" aria-pressed="${isFav}">${isFav ? "♥ Salvat" : "♡ Favorite"}</button>
        </div>
      </div>
    </article>
  `;

  const qtyInput = main.querySelector("#shop-qty");
  main.querySelector("[data-qty-minus]")?.addEventListener("click", () => {
    qtyInput.value = String(Math.max(1, parseInt(qtyInput.value, 10) - 1));
  });
  main.querySelector("[data-qty-plus]")?.addEventListener("click", () => {
    qtyInput.value = String(Math.min(product.stock, parseInt(qtyInput.value, 10) + 1));
  });
  main.querySelector("#shop-add-cart")?.addEventListener("click", () => {
    ShopStore.addToCart(product, parseInt(qtyInput.value, 10) || 1);
    const btn = main.querySelector("#shop-add-cart");
    btn.textContent = "Adăugat ✓";
    setTimeout(() => {
      btn.textContent = "Adaugă în coș";
    }, 1600);
  });
  main.querySelector("#shop-fav")?.addEventListener("click", (e) => {
    const on = ShopStore.toggleFavorite(product.id);
    e.currentTarget.setAttribute("aria-pressed", String(on));
    e.currentTarget.textContent = on ? "♥ Salvat" : "♡ Favorite";
  });
}
