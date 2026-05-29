import { getCategory, productsByCategory, sortProducts } from "../catalog.js";
import { breadcrumb, productCard, sortToolbar, filterSidebar, listingMeta } from "../components.js";
import { filterProducts, priceBounds, eurosToCents } from "../filters.js";
import { ShopRoutes } from "../routes.js";
import { t } from "../i18n.js";

export function renderCategory(main, catalog, slug) {
  const cat = getCategory(catalog, slug);
  if (!cat) {
    main.innerHTML = `<div class="shop-empty glass-panel"><p>${t("shop.empty.category")}</p><a href="${ShopRoutes.home()}">${t("shop.empty.categoryBack")}</a></div>`;
    return;
  }

  const allInCat = productsByCategory(catalog, slug);
  const bounds = priceBounds(allInCat);

  let sortKey = "featured";
  let filters = { minEuro: "", maxEuro: "", inStockOnly: false, onSaleOnly: false, minCents: null, maxCents: null };

  function filtered() {
    return sortProducts(
      filterProducts(allInCat, {
        minCents: filters.minCents,
        maxCents: filters.maxCents,
        inStockOnly: filters.inStockOnly,
        onSaleOnly: filters.onSaleOnly,
      }),
      sortKey
    );
  }

  function paint() {
    const products = filtered();
    const grid = main.querySelector(".shop-grid");
    const countEl = main.querySelector("[data-product-count]");
    const rangeEl = main.querySelector("[data-listing-range]");
    const total = products.length;

    if (grid) {
      grid.innerHTML = products.length
        ? products.map((p) => productCard(p, catalog)).join("")
        : `<p class="shop-empty">${t("shop.search.none")}</p>`;
    }
    if (countEl) countEl.textContent = t("shop.count.products", { n: total });
    if (rangeEl) rangeEl.innerHTML = total ? listingMeta(1, total, total) : "";
  }

  function mountFilters() {
    const slot = main.querySelector("[data-filter-slot]");
    if (!slot) return;
    slot.innerHTML = filterSidebar({ ...filters, bounds });
  }

  main.innerHTML = `
    ${breadcrumb([
      { label: t("shop.breadcrumb.shop"), href: ShopRoutes.home() },
      { label: cat.name },
    ])}
    <header class="shop-hero glass-panel" style="margin-top:1rem;padding:1.75rem">
      <h1>${cat.name}</h1>
      <p>${cat.description}</p>
      <p class="work-meta" data-product-count></p>
    </header>
    <div class="shop-catalog-layout">
      <div data-filter-slot></div>
      <div class="shop-catalog-main">
        <div class="shop-toolbar-row">
          ${sortToolbar(sortKey)}
          <div data-listing-range></div>
        </div>
        <div class="shop-grid" style="margin-top:1rem"></div>
      </div>
    </div>
  `;

  mountFilters();

  main.addEventListener("click", (e) => {
    if (e.target.closest("#shop-filter-apply")) {
      filters.minEuro = main.querySelector("#shop-filter-min")?.value || "";
      filters.maxEuro = main.querySelector("#shop-filter-max")?.value || "";
      filters.inStockOnly = main.querySelector("#shop-filter-stock")?.checked || false;
      filters.onSaleOnly = main.querySelector("#shop-filter-sale")?.checked || false;
      filters.minCents = eurosToCents(filters.minEuro);
      filters.maxCents = eurosToCents(filters.maxEuro);
      paint();
    }
    if (e.target.closest("#shop-filter-clear")) {
      filters = { minEuro: "", maxEuro: "", inStockOnly: false, onSaleOnly: false, minCents: null, maxCents: null };
      mountFilters();
      paint();
    }
  });

  main.querySelector("#shop-sort")?.addEventListener("change", (e) => {
    sortKey = e.target.value;
    paint();
  });

  paint();
}
