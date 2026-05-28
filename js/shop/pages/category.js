import { getCategory, productsByCategory } from "../catalog.js";
import { breadcrumb, productCard } from "../components.js";
import { ShopRoutes } from "../routes.js";

export function renderCategory(main, catalog, slug) {
  const cat = getCategory(catalog, slug);
  if (!cat) {
    main.innerHTML = `<div class="shop-empty glass-panel"><p>Categorie negăsită.</p><a href="${ShopRoutes.home()}">Înapoi la shop</a></div>`;
    return;
  }

  const products = productsByCategory(catalog, slug);

  main.innerHTML = `
    ${breadcrumb([
      { label: "Shop", href: ShopRoutes.home() },
      { label: cat.name },
    ])}
    <header class="shop-hero glass-panel" style="margin-top:1rem;padding:1.75rem">
      <h1>${cat.name}</h1>
      <p>${cat.description}</p>
    </header>
    <div class="shop-grid" style="margin-top:1.5rem">
      ${products.length ? products.map((p) => productCard(p, catalog)).join("") : '<p class="shop-empty">Niciun produs în această categorie.</p>'}
    </div>
  `;
}
