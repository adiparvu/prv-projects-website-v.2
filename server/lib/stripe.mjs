import Stripe from "stripe";
import { config } from "./config.mjs";
import { markOrderPaid } from "./orders.mjs";
import { sendOrderConfirmationEmail } from "./email.mjs";

export const stripe = config.stripeSecretKey ? new Stripe(config.stripeSecretKey) : null;

export async function createCheckoutSession(order, { successUrl, cancelUrl, paymentMethodTypes }) {
  if (!stripe) throw new Error("stripe_not_configured");

  let lines = order.items.map((line) => ({
    priceCents: line.priceCents,
    qty: line.qty,
    name: line.name,
    productId: line.productId,
  }));

  if (order.discountCents > 0) {
    const subtotal = lines.reduce((s, l) => s + l.priceCents * l.qty, 0);
    lines = lines.map((line) => {
      const share = (line.priceCents * line.qty) / subtotal;
      const lineDisc = Math.round(order.discountCents * share);
      const newLineTotal = Math.max(1, line.priceCents * line.qty - lineDisc);
      return { ...line, priceCents: Math.max(1, Math.round(newLineTotal / line.qty)) };
    });
  }

  const lineItems = lines.map((line) => ({
    price_data: {
      currency: "eur",
      unit_amount: line.priceCents,
      product_data: { name: line.name, metadata: { productId: line.productId } },
    },
    quantity: line.qty,
  }));

  if (order.shippingCents > 0) {
    lineItems.push({
      price_data: {
        currency: "eur",
        unit_amount: order.shippingCents,
        product_data: { name: "Livrare" },
      },
      quantity: 1,
    });
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: paymentMethodTypes || ["card", "bancontact"],
    line_items: lineItems,
    success_url: successUrl,
    cancel_url: cancelUrl,
    customer_email: order.customer?.email || undefined,
    metadata: { orderId: order.id },
    payment_intent_data: order.discountCents
      ? undefined
      : { metadata: { orderId: order.id } },
  });

  order.payment.stripeSessionId = session.id;
  return { url: session.url, id: session.id, sessionId: session.id };
}

export async function createPaymentIntent(order) {
  if (!stripe) throw new Error("stripe_not_configured");

  const intent = await stripe.paymentIntents.create({
    amount: order.totalCents,
    currency: "eur",
    automatic_payment_methods: { enabled: true },
    metadata: {
      orderId: order.id,
      customerEmail: order.customer?.email || "",
    },
  });

  order.payment.stripePaymentIntentId = intent.id;
  return { clientSecret: intent.client_secret, id: intent.id };
}

export async function handleStripeWebhook(rawBody, signature) {
  if (!stripe || !config.stripeWebhookSecret) {
    throw new Error("webhook_not_configured");
  }

  const event = stripe.webhooks.constructEvent(rawBody, signature, config.stripeWebhookSecret);

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const orderId = session.metadata?.orderId;
    if (orderId) {
      const order = markOrderPaid(orderId, { stripeSessionId: session.id, stripeEventId: event.id });
      if (order?.customer?.email) {
        await sendOrderConfirmationEmail({ to: order.customer.email, order }).catch(console.error);
      }
    }
  }

  if (event.type === "payment_intent.succeeded") {
    const pi = event.data.object;
    const orderId = pi.metadata?.orderId;
    if (orderId) {
      const order = markOrderPaid(orderId, {
        stripePaymentIntentId: pi.id,
        stripeEventId: event.id,
      });
      if (order?.customer?.email) {
        await sendOrderConfirmationEmail({ to: order.customer.email, order }).catch(console.error);
      }
    }
  }

  return { received: true };
}

export async function completeCheckoutSession(sessionId) {
  if (!stripe) return null;
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  if (session.payment_status !== "paid") return null;
  const orderId = session.metadata?.orderId;
  if (!orderId) return null;
  return markOrderPaid(orderId, { stripeSessionId: session.id });
}
