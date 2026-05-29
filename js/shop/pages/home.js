import { featuredProducts } from "../catalog.js";
import { categoryStrip, productCard, promoBanner } from "../components.js";
import { ShopRoutes } from "../routes.js";

export function renderHome(main, catalog) {
  const featured = featuredProducts(catalog, 8);

  main.innerHTML = `
    <section class="shop-hero glass-panel">
      <p class="eyebrow">PRV SHOP</p>
      <h1 class="gradient-text">Materiale premium pentru proiecte care țin cont de detaliu</h1>
      <p>Finisaje, sanitare, iluminat și pachete pentru șantier — același standard PRV, experiență deschisă și clară la checkout.</p>
      <div class="shop-hero-cta">
        <a href="${ShopRoutes.category("finisaje")}" class="btn btn-primary">Explorează finisajele</a>
        <a href="${ShopRoutes.category("pachete")}" class="btn btn-glass">Pachete & consultanță</a>
      </div>
    </section>

    ${promoBanner()}

    <div class="shop-section-head">
      <h2>Categorii</h2>
      <a href="${ShopRoutes.category("finisaje")}" class="work-cta">Toate →</a>
    </div>
    <div class="shop-categories">${categoryStrip(catalog.categories)}</div>

    <div class="shop-section-head">
      <h2>Recomandate</h2>
    </div>
    <div class="shop-grid">${featured.map((p) => productCard(p, catalog)).join("")}</div>
  `;
}
