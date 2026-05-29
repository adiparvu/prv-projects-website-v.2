/**
 * PRV Shop — minimal Stripe API server
 * Run: cd server && npm install && STRIPE_SECRET_KEY=sk_test_... npm start
 * Set PRV_CONFIG.shop.apiBase to http://localhost:8787
 */

import http from "node:http";
import Stripe from "stripe";

const PORT = Number(process.env.PORT || 8787);
const stripeKey = process.env.STRIPE_SECRET_KEY || "";
const stripe = stripeKey ? new Stripe(stripeKey) : null;

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-PRV-Platform, X-PRV-App-Version",
};

function json(res, status, body) {
  res.writeHead(status, { ...cors, "Content-Type": "application/json" });
  res.end(JSON.stringify(body));
}

async function readBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString("utf8");
  return raw ? JSON.parse(raw) : {};
}

function lineItems(items = []) {
  return items.map((item) => ({
    price_data: {
      currency: "eur",
      unit_amount: item.priceCents,
      product_data: { name: item.name || item.slug || "PRV Shop item" },
    },
    quantity: item.qty || 1,
  }));
}

async function handleCheckoutSession(body) {
  if (!stripe) throw new Error("stripe_not_configured");
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: body.paymentMethodTypes || ["card", "bancontact"],
    line_items: lineItems(body.items),
    success_url: body.successUrl,
    cancel_url: body.cancelUrl,
    customer_email: body.customer?.email,
    metadata: { orderId: body.orderId || "" },
  });
  return { url: session.url, id: session.id };
}

async function handlePaymentIntent(body) {
  if (!stripe) throw new Error("stripe_not_configured");
  const amount = (body.items || []).reduce((s, i) => s + i.priceCents * (i.qty || 1), 0);
  const shipping = amount > 15000 ? 0 : 1500;
  const total = Math.max(50, amount + shipping - (body.discountCents || 0));

  const intent = await stripe.paymentIntents.create({
    amount: total,
    currency: "eur",
    automatic_payment_methods: { enabled: true },
    metadata: {
      orderId: body.orderId || "",
      customerEmail: body.customer?.email || "",
    },
  });
  return { clientSecret: intent.client_secret, id: intent.id };
}

const server = http.createServer(async (req, res) => {
  if (req.method === "OPTIONS") {
    res.writeHead(204, cors);
    res.end();
    return;
  }

  const url = new URL(req.url || "/", `http://${req.headers.host}`);

  if (req.method === "GET" && url.pathname === "/v1/health") {
    return json(res, 200, { ok: true, stripe: Boolean(stripe) });
  }

  if (req.method !== "POST") {
    return json(res, 404, { error: "not_found" });
  }

  try {
    const body = await readBody(req);

    if (url.pathname === "/v1/shop/checkout/session") {
      const data = await handleCheckoutSession(body);
      return json(res, 200, data);
    }

    if (url.pathname === "/v1/shop/checkout/payment-intent") {
      const data = await handlePaymentIntent(body);
      return json(res, 200, data);
    }

    return json(res, 404, { error: "not_found" });
  } catch (err) {
    console.error("[shop-api]", err);
    return json(res, 500, { error: err.message || "server_error" });
  }
});

server.listen(PORT, () => {
  console.log(`PRV Shop API http://localhost:${PORT}`);
  console.log(stripe ? "Stripe: configured" : "Stripe: STRIPE_SECRET_KEY not set (demo only)");
});
