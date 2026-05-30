import { formatMoney, formatDate, escapeHtml } from "../format.js";
import { ShopStore } from "../store.js";
import { ShopRoutes } from "../routes.js";
import { productCard, pageBackNav } from "../components.js";
import { getApiBase, requestMagicLink, fetchAccountOrders, fetchOrder, invoiceUrl } from "../api.js";
import { clearAuth } from "../auth.js";
import { t } from "../i18n.js";
import { accountNav } from "../account/account-nav.js";
import { mountCustomerProfilePage } from "../account/profile-page.js";
import { ProfileStore } from "../account/profile-store.js";

export { accountNav };

export async function renderAccountOverview(main) {
  const account = ShopStore.getAccount();
  const apiLive = getApiBase();

  main.innerHTML = `
    ${pageBackNav(ShopRoutes.home(), t("shop.breadcrumb.shop"))}
    <h1 class="section-title shop-acct-page-title">${t("shop.account.title")}</h1>
  `;

  if (!account) {
    const loginHost = document.createElement("div");
    loginHost.className = "glass-panel shop-acct-login";
    loginHost.innerHTML = `
      <p>${apiLive ? t("shop.account.magicHint") : t("shop.account.loginHint")}</p>
      <form id="shop-login-form" class="shop-checkout-form" style="margin-top:1rem;max-width:420px">
        <div class="input-wrap glass-inset"><label for="shop-login-email">${t("shop.account.email")}</label><input id="shop-login-email" type="email" name="email" required autocomplete="email" /></div>
        <button type="submit" class="btn btn-primary">${apiLive ? t("shop.account.magicSend") : t("shop.account.continue")}</button>
      </form>
      <p id="shop-login-msg" class="work-meta shop-acct-login-msg" hidden role="status"></p>
    `;
    main.appendChild(loginHost);

    loginHost.querySelector("#shop-login-form")?.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = new FormData(e.target).get("email");
      const msg = loginHost.querySelector("#shop-login-msg");
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
        ProfileStore.ensureForAccount(ShopStore.getAccount());
        await renderAccountOverview(main);
      }
    });
    return;
  }

  ProfileStore.ensureForAccount(account);

  const profileHost = document.createElement("div");
  profileHost.className = "shop-acct-profile-host";
  main.appendChild(profileHost);

  await mountCustomerProfilePage(profileHost, {
    onLogout: async () => {
      window.PRV_ACCOUNT_NAV = { canPop: () => false, pop: () => false };
      document.body.classList.remove("shop-acct-stack-deep");
      window.PRV_BACK?.updateShopHeaderBackContext?.();
      ShopStore.logout();
      clearAuth();
      await renderAccountOverview(main);
    },
  });
}

export async function renderReturns(main) {
  main.innerHTML = `
    ${pageBackNav(ShopRoutes.account(), t("shop.account.title"))}
    <h1 class="section-title shop-acct-page-title">${t("shop.returns.title")}</h1>
    ${accountNav("returns")}
    <div class="glass-panel shop-acct-state shop-acct-state--empty">
      <h3>${t("shop.returns.empty.title")}</h3>
      <p>${t("shop.returns.empty.desc")}</p>
      ${`<a href="${ShopRoutes.orders()}" class="btn btn-glass btn-sm">${t("shop.returns.viewOrders")}</a>`}
    </div>
  `;
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
    <h1 class="section-title shop-acct-page-title">${t("shop.orders.title")}</h1>
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
      <ul class="shop-acct-order-lines">
        ${order.items.map((i) => `<li>${escapeHtml(i.name)} × ${i.qty} — ${formatMoney(i.lineTotalCents || i.priceCents * i.qty)}</li>`).join("")}
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
    <h1 class="section-title shop-acct-page-title">${t("shop.invoices.title")}</h1>
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
    <h1 class="section-title shop-acct-page-title">${t("shop.favorites.title")}</h1>
    ${accountNav("favorites")}
    <div class="shop-grid">
      ${products.length ? products.map((p) => productCard(p, catalog)).join("") : `<p class="shop-empty glass-panel">${t("shop.favorites.empty")}</p>`}
    </div>
  `;
}
