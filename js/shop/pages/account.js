import { formatMoney, formatDate, escapeHtml } from "../format.js";
import { ShopStore } from "../store.js";
import { ShopRoutes } from "../routes.js";
import { getProduct, loadCatalog } from "../catalog.js";
import { productCard } from "../components.js";

function accountNav(active) {
  const links = [
    ["overview", "Cont", ShopRoutes.account()],
    ["orders", "Comenzi", ShopRoutes.orders()],
    ["invoices", "Facturi", ShopRoutes.invoices()],
    ["favorites", "Favorite", ShopRoutes.favorites()],
  ];
  return `<nav class="shop-account-nav">${links
    .map(
      ([key, label, href]) =>
        `<a href="${href}" class="${active === key ? "is-active" : ""}">${label}</a>`
    )
    .join("")}</nav>`;
}

export function renderAccountOverview(main) {
  const account = ShopStore.getAccount();
  main.innerHTML = `
    <h1 class="section-title" style="margin-bottom:0.75rem">Contul meu</h1>
    ${accountNav("overview")}
    <div class="glass-panel" style="padding:1.5rem">
      ${
        account
          ? `<p>Bun venit, <strong>${escapeHtml(account.email)}</strong></p><button type="button" class="btn btn-glass" id="shop-logout" style="margin-top:1rem">Deconectare</button>`
          : `<p>Introdu emailul pentru a accesa comenzile și facturile.</p>
             <form id="shop-login-form" class="shop-checkout-form" style="margin-top:1rem;max-width:360px">
               <div class="input-wrap glass-inset"><label>Email</label><input type="email" name="email" required /></div>
               <button type="submit" class="btn btn-primary">Continuă</button>
             </form>`
      }
    </div>
  `;

  main.querySelector("#shop-login-form")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = new FormData(e.target).get("email");
    ShopStore.login(email);
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
    <h1 class="section-title" style="margin-bottom:0.75rem">Comenzile mele</h1>
    ${accountNav("orders")}
    <div class="glass-panel" style="padding:1rem;overflow-x:auto">
      ${
        orders.length
          ? `<table class="shop-table"><thead><tr><th>Comandă</th><th>Data</th><th>Total</th><th>Status</th></tr></thead><tbody>
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
          : '<p class="shop-empty">Nu ai comenzi încă.</p>'
      }
    </div>
  `;
}

export function renderOrderDetail(main, orderId) {
  const order = ShopStore.getOrder(orderId);
  if (!order) {
    main.innerHTML = `<div class="shop-empty glass-panel">Comandă negăsită</div>`;
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
      <p><strong>Total: ${formatMoney(order.totalCents)}</strong></p>
    </div>
  `;
}

export function renderInvoices(main) {
  const orders = ShopStore.getOrders().filter((o) => o.status === "paid" || o.payment?.demo);
  main.innerHTML = `
    <h1 class="section-title" style="margin-bottom:0.75rem">Facturi</h1>
    ${accountNav("invoices")}
    <div class="glass-panel" style="padding:1rem">
      ${
        orders.length
          ? `<table class="shop-table"><thead><tr><th>Factură</th><th>Comandă</th><th>Data</th><th>Sumă</th></tr></thead><tbody>
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
          <p class="work-meta" style="margin-top:1rem">PDF-urile vor fi disponibile după conectarea la dashboard.</p>`
          : '<p class="shop-empty">Nicio factură încă.</p>'
      }
    </div>
  `;
}

export async function renderFavorites(main, catalog) {
  const favIds = ShopStore.getFavorites();
  const products = favIds.map((id) => catalog.products.find((p) => p.id === id)).filter(Boolean);

  main.innerHTML = `
    <h1 class="section-title" style="margin-bottom:0.75rem">Favorite</h1>
    ${accountNav("favorites")}
    <div class="shop-grid">
      ${products.length ? products.map((p) => productCard(p, catalog)).join("") : '<p class="shop-empty glass-panel">Nicio favorită salvată.</p>'}
    </div>
  `;
}
