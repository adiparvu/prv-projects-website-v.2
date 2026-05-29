import { formatMoney, formatDate, escapeHtml } from "../format.js";
import { ShopStore } from "../store.js";
import { ShopRoutes } from "../routes.js";
import { productCard } from "../components.js";
import { t } from "../i18n.js";

function accountNav(active) {
  const links = [
    ["overview", "shop.account.nav.account", ShopRoutes.account()],
    ["orders", "shop.account.nav.orders", ShopRoutes.orders()],
    ["invoices", "shop.account.nav.invoices", ShopRoutes.invoices()],
    ["favorites", "shop.account.nav.favorites", ShopRoutes.favorites()],
  ];
  return `<nav class="shop-account-nav">${links
    .map(
      ([key, labelKey, href]) =>
        `<a href="${href}" class="${active === key ? "is-active" : ""}">${t(labelKey)}</a>`
    )
    .join("")}</nav>`;
}

export function renderAccountOverview(main) {
  const account = ShopStore.getAccount();
  main.innerHTML = `
    <h1 class="section-title" style="margin-bottom:0.75rem">${t("shop.account.title")}</h1>
    ${accountNav("overview")}
    <div class="glass-panel" style="padding:1.5rem">
      ${
        account
          ? `<p>${t("shop.account.welcome", { email: escapeHtml(account.email) })}</p><button type="button" class="btn btn-glass" id="shop-logout" style="margin-top:1rem">${t("shop.account.logout")}</button>`
          : `<p>${t("shop.account.loginHint")}</p>
             <form id="shop-login-form" class="shop-checkout-form" style="margin-top:1rem;max-width:360px">
               <div class="input-wrap glass-inset"><label>${t("shop.account.email")}</label><input type="email" name="email" required /></div>
               <button type="submit" class="btn btn-primary">${t("shop.account.continue")}</button>
             </form>`
      }
    </div>
  `;

  main.querySelector("#shop-login-form")?.addEventListener("submit", (e) => {
    e.preventDefault();
    ShopStore.login(new FormData(e.target).get("email"));
    renderAccountOverview(main);
  });
  main.querySelector("#shop-logout")?.addEventListener("click", () => {
    ShopStore.logout();
    renderAccountOverview(main);
  });
}

export function renderOrders(main) {
  const orders = ShopStore.getOrders();
  main.innerHTML = `
    <h1 class="section-title" style="margin-bottom:0.75rem">${t("shop.orders.title")}</h1>
    ${accountNav("orders")}
    <div class="glass-panel" style="padding:1rem;overflow-x:auto">
      ${
        orders.length
          ? `<table class="shop-table"><thead><tr><th>${t("shop.orders.colOrder")}</th><th>${t("shop.orders.colDate")}</th><th>${t("shop.orders.colTotal")}</th><th>${t("shop.orders.colStatus")}</th></tr></thead><tbody>
        ${orders
          .map(
            (o) => `<tr>
              <td><a href="${ShopRoutes.order(o.id)}">${escapeHtml(o.invoiceNumber || o.id)}</a></td>
              <td>${formatDate(o.createdAt)}</td>
              <td>${formatMoney(o.totalCents)}</td>
              <td>${escapeHtml(o.status)}</td>
            </tr>`
          )
          .join("")}
        </tbody></table>`
          : `<p class="shop-empty">${t("shop.orders.empty")}</p>`
      }
    </div>
  `;
}

export function renderOrderDetail(main, orderId) {
  const order = ShopStore.getOrder(orderId);
  if (!order) {
    main.innerHTML = `<div class="shop-empty glass-panel">${t("shop.empty.order")}</div>`;
    return;
  }
  main.innerHTML = `
    ${accountNav("orders")}
    <div class="glass-panel" style="padding:1.25rem">
      <h1>${escapeHtml(order.invoiceNumber || order.id)}</h1>
      <p class="work-meta">${formatDate(order.createdAt)} · ${escapeHtml(order.status)}</p>
      <ul style="margin:1rem 0;padding:0;list-style:none">
        ${order.items.map((i) => `<li style="padding:0.35rem 0">${escapeHtml(i.name)} × ${i.qty} — ${formatMoney(i.priceCents * i.qty)}</li>`).join("")}
      </ul>
      <p><strong>${t("shop.cart.total")}: ${formatMoney(order.totalCents)}</strong></p>
    </div>
  `;
}

export function renderInvoices(main) {
  const orders = ShopStore.getOrders().filter((o) => o.status === "paid" || o.payment?.demo);
  main.innerHTML = `
    <h1 class="section-title" style="margin-bottom:0.75rem">${t("shop.invoices.title")}</h1>
    ${accountNav("invoices")}
    <div class="glass-panel" style="padding:1rem">
      ${
        orders.length
          ? `<table class="shop-table"><thead><tr><th>${t("shop.invoices.colInvoice")}</th><th>${t("shop.invoices.colOrder")}</th><th>${t("shop.invoices.colDate")}</th><th>${t("shop.invoices.colAmount")}</th></tr></thead><tbody>
          ${orders
            .map(
              (o) => `<tr>
                <td>${escapeHtml(o.invoiceNumber || o.invoiceId)}</td>
                <td><a href="${ShopRoutes.order(o.id)}">${escapeHtml(o.id)}</a></td>
                <td>${formatDate(o.createdAt)}</td>
                <td>${formatMoney(o.totalCents)}</td>
              </tr>`
            )
            .join("")}
          </tbody></table>
          <p class="work-meta" style="margin-top:1rem">${t("shop.invoices.pdfHint")}</p>`
          : `<p class="shop-empty">${t("shop.invoices.empty")}</p>`
      }
    </div>
  `;
}

export async function renderFavorites(main, catalog) {
  const favIds = ShopStore.getFavorites();
  const products = favIds.map((id) => catalog.products.find((p) => p.id === id)).filter(Boolean);

  main.innerHTML = `
    <h1 class="section-title" style="margin-bottom:0.75rem">${t("shop.favorites.title")}</h1>
    ${accountNav("favorites")}
    <div class="shop-grid">
      ${products.length ? products.map((p) => productCard(p, catalog)).join("") : `<p class="shop-empty glass-panel">${t("shop.favorites.empty")}</p>`}
    </div>
  `;
}
