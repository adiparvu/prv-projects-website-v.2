import { ShopStore } from "../store.js";
import { ShopRoutes } from "../routes.js";
import { trustList } from "../components.js";
import { computeTotals, renderSummaryHtml, submitCheckout } from "../checkout.js";
import { getApiBase, createPaymentIntent } from "../api.js";
import { isStripeLive, mountPaymentElement, confirmPayment, destroyPaymentElement } from "../stripe.js";
import { t } from "../i18n.js";
import { uid } from "../format.js";

export function renderCheckout(main, catalog) {
  const cart = ShopStore.getCart();
  if (!cart.items.length) {
    location.href = ShopRoutes.cart();
    return;
  }

  const account = ShopStore.getAccount();
  const stripeLive = isStripeLive();

  main.innerHTML = `
    <h1 class="section-title" style="margin-bottom:1rem">${t("shop.checkout.title")}</h1>
    ${!stripeLive ? `<div class="shop-demo-banner">${t("shop.checkout.demo")}</div>` : ""}
    <div class="shop-layout-2">
      <form class="glass-panel shop-checkout-form" style="padding:1.25rem" id="shop-checkout-form">
        <h2 style="font-size:1.1rem;margin-bottom:0.5rem">${t("shop.checkout.shipping")}</h2>
        <div class="input-wrap glass-inset">
          <label for="co-name">${t("shop.checkout.name")}</label>
          <input id="co-name" name="name" required value="${account?.name || ""}" />
        </div>
        <div class="input-wrap glass-inset">
          <label for="co-email">${t("shop.checkout.email")}</label>
          <input id="co-email" name="email" type="email" required value="${account?.email || ""}" />
        </div>
        <div class="input-wrap glass-inset">
          <label for="co-phone">${t("shop.checkout.phone")}</label>
          <input id="co-phone" name="phone" type="tel" />
        </div>
        <div class="input-wrap glass-inset">
          <label for="co-address">${t("shop.checkout.address")}</label>
          <input id="co-address" name="address" required />
        </div>
        <div class="input-wrap glass-inset">
          <label for="co-discount">${t("shop.checkout.discount")}</label>
          <input id="co-discount" name="discount" placeholder="${t("shop.checkout.discountPh")}" />
        </div>
        <h2 style="font-size:1.1rem;margin:1rem 0 0.5rem">${t("shop.checkout.payment")}</h2>
        <div class="shop-payment-methods">
          <label class="shop-pay-opt"><input type="radio" name="pay" value="card" checked /> ${t("shop.checkout.pay.card")}</label>
          <label class="shop-pay-opt"><input type="radio" name="pay" value="apple_pay" /> ${t("shop.checkout.pay.apple")}</label>
          <label class="shop-pay-opt"><input type="radio" name="pay" value="paypal" /> ${t("shop.checkout.pay.paypal")}</label>
          <label class="shop-pay-opt"><input type="radio" name="pay" value="bancontact" /> ${t("shop.checkout.pay.bancontact")}</label>
        </div>
        <div id="shop-stripe-mount" class="shop-stripe-mount" ${stripeLive ? "" : "hidden"}></div>
        <button type="submit" class="btn btn-primary btn-lg" style="width:100%;margin-top:1rem">${t("shop.checkout.submit")}</button>
      </form>
      <aside class="shop-summary glass-panel" id="checkout-summary"></aside>
    </div>
  `;

  const summaryEl = main.querySelector("#checkout-summary");
  const discountInput = main.querySelector("#co-discount");
  const stripeMount = main.querySelector("#shop-stripe-mount");
  let pendingOrderId = uid("ord");

  const refreshSummary = () => {
    const totals = computeTotals(catalog, ShopStore.getCart(), discountInput.value.trim());
    summaryEl.innerHTML = `${renderSummaryHtml(totals, discountInput.value.trim())}${trustList()}`;
    return totals;
  };
  refreshSummary();
  discountInput?.addEventListener("input", refreshSummary);

  async function initStripeElement() {
    if (!stripeLive || !stripeMount) return;
    destroyPaymentElement();
    const fd = new FormData(main.querySelector("#shop-checkout-form"));
    const totals = computeTotals(catalog, ShopStore.getCart(), discountInput.value.trim());
    const intent = await createPaymentIntent({
      orderId: pendingOrderId,
      items: ShopStore.getCart().items,
      discountCents: totals.discountCents,
      customer: { email: fd.get("email"), name: fd.get("name") },
    });
    if (intent?.clientSecret) {
      await mountPaymentElement({ mountEl: stripeMount, clientSecret: intent.clientSecret });
    }
  }

  if (stripeLive) {
    initStripeElement().catch(console.error);
    discountInput?.addEventListener("change", () => initStripeElement().catch(console.error));
  }

  main.querySelectorAll('input[name="pay"]').forEach((radio) => {
    radio.addEventListener("change", () => {
      const isCard = radio.value === "card" && radio.checked;
      if (stripeMount) stripeMount.hidden = !stripeLive || !isCard;
    });
  });

  main.querySelector("#shop-checkout-form")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const btn = e.target.querySelector('[type="submit"]');
    btn.disabled = true;
    btn.textContent = t("shop.checkout.processing");

    const customer = {
      name: fd.get("name"),
      email: fd.get("email"),
      phone: fd.get("phone"),
      address: fd.get("address"),
    };
    const paymentMethod = fd.get("pay");
    const discountCode = fd.get("discount");

    try {
      if (stripeLive && paymentMethod === "card") {
        const returnUrl = `${location.origin}${location.pathname.replace("checkout.html", "confirmation.html")}?orderId=${pendingOrderId}`;
        await confirmPayment({ returnUrl });
        return;
      }

      const order = await submitCheckout({
        catalog,
        customer,
        paymentMethod,
        discountCode,
        orderId: pendingOrderId,
      });
      if (order) location.href = ShopRoutes.confirmation(order.id);
    } catch {
      btn.textContent = t("shop.checkout.error");
      btn.disabled = false;
      pendingOrderId = uid("ord");
      if (stripeLive) initStripeElement().catch(console.error);
    }
  });
}
