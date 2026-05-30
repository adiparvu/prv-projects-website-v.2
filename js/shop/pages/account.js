import { formatMoney, formatDate, escapeHtml } from "../format.js";
import { ShopStore } from "../store.js";
import { ShopRoutes } from "../routes.js";
import { productCard, pageBackNav } from "../components.js";
import { getApiBase, requestMagicLink, fetchAccountOrders, fetchOrder, invoiceUrl } from "../api.js";
import { clearAuth } from "../auth.js";
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

export async function renderAccountOverview(main) {
  const account = ShopStore.getAccount();
  const apiLive = getApiBase();

  main.innerHTML = `
    ${pageBackNav(ShopRoutes.home(), t("shop.breadcrumb.shop"))}
    <h1 class="section-title" style="margin-bottom:0.75rem">${t("shop.account.title")}</h1>
    ${accountNav("overview")}
    <div class="glass-panel">
      ${
        account
          ? `<p>${t("shop.account.welcome", { email: escapeHtml(account.email) })}</p><button type="button" class="btn btn-glass" id="shop-logout" style="margin-top:1rem">${t("shop.account.logout")}</button>`
          : `<p>${apiLive ? t("shop.account.magicHint") : t("shop.account.loginHint")}</p>
             <form id="shop-login-form" class="shop-checkout-form" style="margin-top:1rem;max-width:360px">
               <div class="input-wrap glass-inset"><label>${t("shop.account.email")}</label><input type="email" name="email" required /></div>
               <button type="submit" class="btn btn-primary">${apiLive ? t("shop.account.magicSend") : t("shop.account.continue")}</button>
             </form>
             <p id="shop-login-msg" class="work-meta" style="margin-top:0.75rem" hidden></p>`
      }
    </div>
  `;

  main.querySelector("#shop-login-form")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = new FormData(e.target).get("email");
    const msg = main.querySelector("#shop-login-msg");
    if (apiLive) {
      try {
        await requestMagicLink(email);
        if (msg) {
          msg.hidden = false;
          msg.textContent = t("shop.account.magicSent");
        }
      } catch {
        if (msg) {
          msg.hidden = false;
          msg.textContent = t("shop.checkout.error");
        }
      }
    } else {
      ShopStore.login(email);
      await renderAccountOverview(main);
    }
  });

  main.querySelector("#shop-logout")?.addEventListener("click", async () => {
    ShopStore.logout();
    clearAuth();
    await renderAccountOverview(main);
  });
}

export async function renderOrders(main) {
  let orders = ShopStore.getOrders();
  if (getApiBase()) {
    const fromApi = await fetchAccountOrders();
    if (fromApi) {
      orders = fromApi;
      ShopStore.syncOrdersFromApi(orders);
    }
  }

  main.innerHTML = `
    ${pageBackNav(ShopRoutes.account(), t("shop.account.title"))}
    <h1 class="section-title" style="margin-bottom:0.75rem">${t("shop.orders.title")}</h1>
    ${accountNav("orders")}
    <div class="glass-panel shop-table-wrap" style="overflow-x:auto">
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

export async function renderOrderDetail(main, orderId) {
  let order = ShopStore.getOrder(orderId);
  if (getApiBase()) {
    const fromApi = await fetchOrder(orderId);
    if (fromApi) {
      order = fromApi;
      ShopStore.cacheOrder(order);
    }
  }

  if (!order) {
    main.innerHTML = `<div class="shop-empty glass-panel">${t("shop.empty.order")}</div>`;
    return;
  }

  const invLink =
    order.status === "paid" && getApiBase()
      ? `<p style="margin-top:1rem"><a class="btn btn-glass btn-sm" href="${invoiceUrl(order.id)}" target="_blank" rel="noopener">${t("shop.invoices.download")}</a></p>`
      : "";

  main.innerHTML = `
    ${pageBackNav(ShopRoutes.orders(), t("shop.orders.title"))}
    ${accountNav("orders")}
    <div class="glass-panel">
      <h1>${escapeHtml(order.invoiceNumber || order.id)}</h1>
      <p class="work-meta">${formatDate(order.createdAt)} · ${escapeHtml(order.status)}</p>
      <ul style="margin:1rem 0;padding:0;list-style:none">
        ${order.items.map((i) => `<li style="padding:0.35rem 0">${escapeHtml(i.name)} × ${i.qty} — ${formatMoney((i.lineTotalCents || i.priceCents * i.qty))}</li>`).join("")}
      </ul>
      <p><strong>${t("shop.cart.total")}: ${formatMoney(order.totalCents)}</strong></p>
      ${invLink}
    </div>
  `;
}

export async function renderInvoices(main) {
  let orders = ShopStore.getOrders().filter((o) => o.status === "paid" || o.payment?.demo);
  if (getApiBase()) {
    const fromApi = await fetchAccountOrders();
    if (fromApi) {
      orders = fromApi.filter((o) => o.status === "paid");
      ShopStore.syncOrdersFromApi(fromApi);
    }
  }

  main.innerHTML = `
    ${pageBackNav(ShopRoutes.account(), t("shop.account.title"))}
    <h1 class="section-title" style="margin-bottom:0.75rem">${t("shop.invoices.title")}</h1>
    ${accountNav("invoices")}
    <div class="glass-panel">
      ${
        orders.length
          ? `<table class="shop-table"><thead><tr><th>${t("shop.invoices.colInvoice")}</th><th>${t("shop.invoices.colOrder")}</th><th>${t("shop.invoices.colDate")}</th><th>${t("shop.invoices.colAmount")}</th><th></th></tr></thead><tbody>
          ${orders
            .map((o) => {
              const pdf = getApiBase() ? invoiceUrl(o.id) : null;
              return `<tr>
                <td>${escapeHtml(o.invoiceNumber || o.invoiceId)}</td>
                <td><a href="${ShopRoutes.order(o.id)}">${escapeHtml(o.id)}</a></td>
                <td>${formatDate(o.createdAt)}</td>
                <td>${formatMoney(o.totalCents)}</td>
                <td>${pdf ? `<a href="${pdf}" target="_blank" rel="noopener" class="work-cta">${t("shop.invoices.download")}</a>` : "—"}</td>
              </tr>`;
            })
            .join("")}
          </tbody></table>`
          : `<p class="shop-empty">${t("shop.invoices.empty")}</p>`
      }
    </div>
  `;
}

export async function renderFavorites(main, catalog) {
  const favIds = ShopStore.getFavorites();
  const products = favIds.map((id) => catalog.products.find((p) => p.id === id)).filter(Boolean);

  main.innerHTML = `
    ${pageBackNav(ShopRoutes.account(), t("shop.account.title"))}
    <h1 class="section-title" style="margin-bottom:0.75rem">${t("shop.favorites.title")}</h1>
    ${accountNav("favorites")}
    <div class="shop-grid">
      ${products.length ? products.map((p) => productCard(p, catalog)).join("") : `<p class="shop-empty glass-panel">${t("shop.favorites.empty")}</p>`}
    </div>
  `;
}
