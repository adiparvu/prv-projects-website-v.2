import { searchProducts } from "../catalog.js";
import { breadcrumb, productCard } from "../components.js";
import { ShopRoutes } from "../routes.js";
import { escapeHtml } from "../format.js";

export function renderSearch(main, catalog, query) {
  const q = (query || "").trim();
  const results = q ? searchProducts(catalog, q) : [];

  main.innerHTML = `
    ${breadcrumb([
      { label: "Shop", href: ShopRoutes.home() },
      { label: q ? `Căutare: ${q}` : "Căutare" },
    ])}
    <header class="shop-hero glass-panel" style="margin-top:1rem;padding:1.5rem">
      <h1>${q ? `Rezultate pentru „${escapeHtml(q)}”` : "Caută în shop"}</h1>
      <p>${results.length ? `${results.length} produse găsite` : q ? "Niciun produs — încearcă alt termen sau explorează categoriile." : "Introdu un termen în bara de căutare din header."}</p>
    </header>
    <div class="shop-grid" style="margin-top:1.5rem">
      ${results.length ? results.map((p) => productCard(p, catalog)).join("") : ""}
    </div>
    ${
      !results.length && q
        ? `<p class="shop-empty"><a href="${ShopRoutes.home()}" class="btn btn-primary">Înapoi la shop</a></p>`
        : ""
    }
  `;
}
