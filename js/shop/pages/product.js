import { getProduct, getReviews, relatedProducts } from "../catalog.js";
import { breadcrumb, productCard, reviewsBlock } from "../components.js";
import { formatMoney, escapeHtml } from "../format.js";
import { ShopRoutes } from "../routes.js";
import { ShopStore } from "../store.js";

function galleryHtml(product) {
  const images = product.images?.length ? product.images : [{ url: "", alt: product.name }];
  const main = images[0];
  const thumbs =
    images.length > 1
      ? `<div class="shop-gallery-thumbs">${images
          .map(
            (img, i) =>
              `<button type="button" class="shop-thumb${i === 0 ? " is-active" : ""}" data-img="${escapeHtml(img.url)}" data-alt="${escapeHtml(img.alt || product.name)}">
            <img src="${escapeHtml(img.url)}" alt="" loading="lazy" />
          </button>`
          )
          .join("")}</div>`
      : "";

  return `
    <div class="shop-gallery">
      <div class="shop-gallery-main">
        <img id="shop-pdp-img" src="${escapeHtml(main.url)}" alt="${escapeHtml(main.alt || product.name)}" />
      </div>
      ${thumbs}
    </div>
  `;
}

export function renderProduct(main, catalog, slug) {
  const product = getProduct(catalog, slug);
  if (!product) {
    main.innerHTML = `<div class="shop-empty glass-panel"><p>Produs negăsit.</p><a href="${ShopRoutes.home()}">Înapoi la shop</a></div>`;
    return;
  }

  const cat = catalog.categories.find((c) => c.slug === product.categorySlug);
  const isFav = ShopStore.isFavorite(product.id);
  const reviews = getReviews(catalog, product.id);
  const related = relatedProducts(catalog, product);

  main.innerHTML = `
    ${breadcrumb([
      { label: "Shop", href: ShopRoutes.home() },
      { label: cat?.name || "Produs", href: cat ? ShopRoutes.category(cat.slug) : null },
      { label: product.name },
    ])}
    <article class="shop-pdp glass-panel" style="margin-top:1rem;padding:1.5rem">
      ${galleryHtml(product)}
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
    ${reviewsBlock(reviews)}
    ${
      related.length
        ? `<div class="shop-section-head" style="margin-top:2rem"><h2>Produse similare</h2></div>
           <div class="shop-grid">${related.map((p) => productCard(p, catalog)).join("")}</div>`
        : ""
    }
  `;

  main.querySelectorAll(".shop-thumb").forEach((btn) => {
    btn.addEventListener("click", () => {
      main.querySelectorAll(".shop-thumb").forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      const img = main.querySelector("#shop-pdp-img");
      if (img) {
        img.src = btn.dataset.img;
        img.alt = btn.dataset.alt || "";
      }
    });
  });

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
