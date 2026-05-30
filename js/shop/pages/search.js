import { searchProducts } from "../catalog.js";
import { breadcrumb, productCard } from "../components.js";
import { ShopRoutes } from "../routes.js";
import { backLinkHtml } from "../prv-back.js";
import { escapeHtml } from "../format.js";
import { t } from "../i18n.js";

export function renderSearch(main, catalog, query) {
  const q = (query || "").trim();
  const results = q ? searchProducts(catalog, q) : [];

  main.innerHTML = `
    ${breadcrumb([
      { label: t("shop.breadcrumb.shop"), href: ShopRoutes.home() },
      { label: q ? t("shop.search.results", { q }) : t("shop.search.title") },
    ])}
    <header class="shop-hero glass-panel" style="margin-top:1rem;padding:1.5rem">
      <h1>${q ? t("shop.search.results", { q: escapeHtml(q) }) : t("shop.search.title")}</h1>
      <p>${results.length ? t("shop.search.found", { n: results.length }) : q ? t("shop.search.none") : t("shop.search.hint")}</p>
    </header>
    <div class="shop-grid" style="margin-top:1.5rem">
      ${results.length ? results.map((p) => productCard(p, catalog)).join("") : ""}
    </div>
    ${
      !results.length && q
        ? `<p class="shop-empty">${backLinkHtml({ href: ShopRoutes.home(), label: t("shop.cart.back"), className: "prv-back-link--cta" })}</p>`
        : ""
    }
  `;
}
