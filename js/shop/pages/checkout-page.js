import { ShopStore } from "../store.js";
import { ShopRoutes } from "../routes.js";
import { trustList } from "../components.js";
import { computeTotals, renderSummaryHtml, submitCheckout } from "../checkout.js";
import { getApiBase } from "../api.js";

export function renderCheckout(main, catalog) {
  const cart = ShopStore.getCart();
  if (!cart.items.length) {
    location.href = ShopRoutes.cart();
    return;
  }

  const account = ShopStore.getAccount();
  const isDemo = !getApiBase() && !(window.PRV_CONFIG?.shop?.stripePublishableKey);

  main.innerHTML = `
    <h1 class="section-title" style="margin-bottom:1rem">Checkout</h1>
    ${isDemo ? '<div class="shop-demo-banner">Mod demonstrație — comanda se salvează local. Conectează <code>PRV_CONFIG.shop.apiBase</code> + Stripe pentru plăți live.</div>' : ""}
    <div class="shop-layout-2">
      <form class="glass-panel shop-checkout-form" style="padding:1.25rem" id="shop-checkout-form">
        <h2 style="font-size:1.1rem;margin-bottom:0.5rem">Date livrare</h2>
        <div class="input-wrap glass-inset">
          <label for="co-name">Nume complet</label>
          <input id="co-name" name="name" required value="${account?.name || ""}" />
        </div>
        <div class="input-wrap glass-inset">
          <label for="co-email">Email</label>
          <input id="co-email" name="email" type="email" required value="${account?.email || ""}" />
        </div>
        <div class="input-wrap glass-inset">
          <label for="co-phone">Telefon</label>
          <input id="co-phone" name="phone" type="tel" />
        </div>
        <div class="input-wrap glass-inset">
          <label for="co-address">Adresă (stradă, nr, oraș)</label>
          <input id="co-address" name="address" required />
        </div>
        <div class="input-wrap glass-inset">
          <label for="co-discount">Cod reducere</label>
          <input id="co-discount" name="discount" placeholder="ex. PRV10" />
        </div>
        <h2 style="font-size:1.1rem;margin:1rem 0 0.5rem">Plată</h2>
        <div class="shop-payment-methods">
          <label class="shop-pay-opt"><input type="radio" name="pay" value="card" checked /> Card</label>
          <label class="shop-pay-opt"><input type="radio" name="pay" value="apple_pay" /> Apple Pay</label>
          <label class="shop-pay-opt"><input type="radio" name="pay" value="paypal" /> PayPal</label>
          <label class="shop-pay-opt"><input type="radio" name="pay" value="bancontact" /> Bancontact</label>
        </div>
        <div id="shop-stripe-mount" ${isDemo ? 'hidden' : ""}></div>
        <button type="submit" class="btn btn-primary btn-lg" style="width:100%;margin-top:1rem">Plătește în siguranță</button>
      </form>
      <aside class="shop-summary glass-panel" id="checkout-summary"></aside>
    </div>
  `;

  const summaryEl = main.querySelector("#checkout-summary");
  const discountInput = main.querySelector("#co-discount");

  const refreshSummary = () => {
    const totals = computeTotals(catalog, ShopStore.getCart(), discountInput.value.trim());
    summaryEl.innerHTML = `${renderSummaryHtml(totals, discountInput.value.trim())}${trustList()}`;
  };
  refreshSummary();
  discountInput?.addEventListener("input", refreshSummary);

  main.querySelector("#shop-checkout-form")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const btn = e.target.querySelector('[type="submit"]');
    btn.disabled = true;
    btn.textContent = "Se procesează…";
    try {
      const order = await submitCheckout({
        catalog,
        customer: {
          name: fd.get("name"),
          email: fd.get("email"),
          phone: fd.get("phone"),
          address: fd.get("address"),
        },
        paymentMethod: fd.get("pay"),
        discountCode: fd.get("discount"),
      });
      if (order) location.href = ShopRoutes.confirmation(order.id);
    } catch {
      btn.textContent = "Eroare — încearcă din nou";
      btn.disabled = false;
    }
  });
}
