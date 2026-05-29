import { featuredProducts } from "../catalog.js";
import { categoryStrip, productCard } from "../components.js";
import { ShopRoutes } from "../routes.js";
import { t } from "../i18n.js";

export function renderHome(main, catalog) {
  const featured = featuredProducts(catalog, 8);

  main.innerHTML = `
    <section class="shop-hero glass-panel">
      <p class="eyebrow">${t("shop.home.eyebrow")}</p>
      <h1 class="gradient-text">${t("shop.home.title")}</h1>
      <p>${t("shop.home.sub")}</p>
      <div class="shop-hero-cta">
        <a href="${ShopRoutes.category("finisaje")}" class="btn btn-primary">${t("shop.home.ctaFinishes")}</a>
        <a href="${ShopRoutes.category("pachete")}" class="btn btn-glass">${t("shop.home.ctaPackages")}</a>
      </div>
    </section>

    <div class="shop-section-head">
      <h2>${t("shop.home.categories")}</h2>
      <a href="${ShopRoutes.category("finisaje")}" class="work-cta">${t("shop.home.all")}</a>
    </div>
    <div class="shop-categories">${categoryStrip(catalog.categories)}</div>

    <div class="shop-section-head">
      <h2>${t("shop.home.featured")}</h2>
    </div>
    <div class="shop-grid">${featured.map((p) => productCard(p, catalog)).join("")}</div>
  `;
}
