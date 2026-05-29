/** PRV Shop — Stripe.js Payment Element (embedded checkout) */

let stripeInstance = null;
let elementsInstance = null;
let paymentElement = null;

function publishableKey() {
  return window.PRV_CONFIG?.shop?.stripePublishableKey || "";
}

export function isStripeLive() {
  return Boolean(publishableKey() && window.PRV_CONFIG?.shop?.apiBase);
}

function loadStripeJs() {
  if (window.Stripe) return Promise.resolve(window.Stripe);
  return new Promise((resolve, reject) => {
    const existing = document.querySelector('script[src*="js.stripe.com/v3"]');
    if (existing) {
      existing.addEventListener("load", () => resolve(window.Stripe));
      existing.addEventListener("error", reject);
      return;
    }
    const s = document.createElement("script");
    s.src = "https://js.stripe.com/v3/";
    s.async = true;
    s.onload = () => resolve(window.Stripe);
    s.onerror = reject;
    document.head.appendChild(s);
  });
}

export async function mountPaymentElement({ mountEl, clientSecret, appearance = {} }) {
  if (!mountEl || !clientSecret) return null;

  const Stripe = await loadStripeJs();
  const key = publishableKey();
  if (!key) throw new Error("stripe_key_missing");

  stripeInstance = Stripe(key);
  elementsInstance = stripeInstance.elements({
    clientSecret,
    appearance: {
      theme: document.documentElement.dataset.theme === "dark" ? "night" : "stripe",
      variables: { colorPrimary: "#c9a227", borderRadius: "12px" },
      ...appearance,
    },
  });

  paymentElement = elementsInstance.create("payment", {
    layout: { type: "tabs" },
  });
  paymentElement.mount(mountEl);
  return { stripe: stripeInstance, elements: elementsInstance, paymentElement };
}

export async function confirmPayment({ returnUrl }) {
  if (!stripeInstance || !elementsInstance) throw new Error("stripe_not_mounted");
  const { error } = await stripeInstance.confirmPayment({
    elements: elementsInstance,
    confirmParams: { return_url: returnUrl },
  });
  if (error) throw error;
}

export function destroyPaymentElement() {
  paymentElement?.destroy?.();
  paymentElement = null;
  elementsInstance = null;
  stripeInstance = null;
}

export async function createPaymentIntent(payload) {
  const { postJson } = await import("../api/client.js");
  return postJson("/shop/checkout/payment-intent", payload);
}
