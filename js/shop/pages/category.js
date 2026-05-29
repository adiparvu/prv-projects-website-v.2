import { getCategory, productsByCategory, sortProducts } from "../catalog.js";
import { breadcrumb, productCard, sortToolbar } from "../components.js";
import { ShopRoutes } from "../routes.js";

export function renderCategory(main, catalog, slug) {
  const cat = getCategory(catalog, slug);
  if (!cat) {
    main.innerHTML = `<div class="shop-empty glass-panel"><p>Categorie negăsită.</p><a href="${ShopRoutes.home()}">Înapoi la shop</a></div>`;
    return;
  }

  let sortKey = "featured";

  function paint() {
    const products = sortProducts(productsByCategory(catalog, slug), sortKey);
    const grid = main.querySelector(".shop-grid");
    if (grid) {
      grid.innerHTML = products.length
        ? products.map((p) => productCard(p, catalog)).join("")
        : '<p class="shop-empty">Niciun produs în această categorie.</p>';
    }
    const countEl = main.querySelector("[data-product-count]");
    if (countEl) countEl.textContent = `${products.length} produse`;
  }

  main.innerHTML = `
    ${breadcrumb([
      { label: "Shop", href: ShopRoutes.home() },
      { label: cat.name },
    ])}
    <header class="shop-hero glass-panel" style="margin-top:1rem;padding:1.75rem">
      <h1>${cat.name}</h1>
      <p>${cat.description}</p>
      <p class="work-meta" data-product-count></p>
    </header>
    <div style="margin-top:1rem">${sortToolbar(sortKey)}</div>
    <div class="shop-grid" style="margin-top:1rem"></div>
  `;

  main.querySelector("#shop-sort")?.addEventListener("change", (e) => {
    sortKey = e.target.value;
    paint();
  });

  paint();
}
