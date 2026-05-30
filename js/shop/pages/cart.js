import { formatMoney, escapeHtml } from "../format.js";
import { trustList, pageBackNav, backLinkHtml } from "../components.js";
import { ShopRoutes } from "../routes.js";
import { ShopStore } from "../store.js";
import { computeTotals, renderSummaryHtml } from "../checkout.js";
import { t } from "../i18n.js";

export function renderCart(main, catalog) {
  const cart = ShopStore.getCart();

  if (!cart.items.length) {
    main.innerHTML = `
      <div class="shop-empty glass-panel">
        <h2>${t("shop.cart.empty.title")}</h2>
        <p>${t("shop.cart.empty.sub")}</p>
        ${backLinkHtml({ href: ShopRoutes.home(), label: t("shop.cart.back"), className: "prv-back-link--cta" })}
      </div>`;
    return;
  }

  const totals = computeTotals(catalog, cart);

  main.innerHTML = `
    ${pageBackNav(ShopRoutes.home(), t("shop.cart.back"))}
    <h1 class="section-title" style="margin-bottom:1.25rem">${t("shop.cart.title")}</h1>
    <div class="shop-layout-2">
      <div class="glass-panel shop-cart-lines">
        ${cart.items
          .map(
            (item) => `
          <div class="shop-line-item" data-product-id="${escapeHtml(item.productId)}">
            <img src="${escapeHtml(item.image)}" alt="" />
            <div>
              <a href="${ShopRoutes.product(item.slug)}"><strong>${escapeHtml(item.name)}</strong></a>
              <p class="work-meta">${formatMoney(item.priceCents)} / buc</p>
              <div class="shop-qty" style="margin-top:0.5rem">
                <button type="button" data-line-minus>−</button>
                <input type="number" value="${item.qty}" min="1" data-line-qty />
                <button type="button" data-line-plus>+</button>
              </div>
            </div>
            <div class="shop-line-actions">
              <strong>${formatMoney(item.priceCents * item.qty)}</strong>
              <button type="button" class="shop-line-remove" data-line-remove aria-label="${t("shop.cart.remove")}">${t("shop.cart.remove")}</button>
            </div>
          </div>`
          )
          .join("")}
      </div>
      <aside class="shop-summary glass-panel">
        ${renderSummaryHtml(totals)}
        ${trustList()}
        <a href="${ShopRoutes.checkout()}" class="btn btn-primary btn-lg" style="width:100%;margin-top:1rem">${t("shop.cart.checkout")}</a>
      </aside>
    </div>
  `;

  main.querySelectorAll(".shop-line-item").forEach((row) => {
    const id = row.dataset.productId;
    row.querySelector("[data-line-minus]")?.addEventListener("click", () => {
      const input = row.querySelector("[data-line-qty]");
      ShopStore.updateQty(id, parseInt(input.value, 10) - 1);
      renderCart(main, catalog);
    });
    row.querySelector("[data-line-plus]")?.addEventListener("click", () => {
      const input = row.querySelector("[data-line-qty]");
      ShopStore.updateQty(id, parseInt(input.value, 10) + 1);
      renderCart(main, catalog);
    });
    row.querySelector("[data-line-qty]")?.addEventListener("change", (e) => {
      ShopStore.updateQty(id, parseInt(e.target.value, 10) || 1);
      renderCart(main, catalog);
    });
    row.querySelector("[data-line-remove]")?.addEventListener("click", () => {
      ShopStore.updateQty(id, 0);
      renderCart(main, catalog);
    });
  });
}
