#!/usr/bin/env node
/**
 * PRV Shop API — Stripe, webhooks, auth, catalog, reminders
 */

import http from "node:http";
import { config } from "./lib/config.mjs";
import { db } from "./lib/db.mjs";
import { getCatalog, invalidateCatalogCache } from "./lib/catalog.mjs";
import {
  createPendingOrder,
  getOrderForCustomer,
  listOrdersForEmail,
  invoiceHtml,
} from "./lib/orders.mjs";
import { authFromHeader, authFromToken, requestMagicLink, verifyMagicToken } from "./lib/auth.mjs";
import { addReminder, removeReminder, startReminderCron } from "./lib/reminders.mjs";
import {
  stripe,
  createCheckoutSession,
  createPaymentIntent,
  handleStripeWebhook,
  completeCheckoutSession,
} from "./lib/stripe.mjs";

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": config.corsOrigin,
    "Access-Control-Allow-Methods": "GET, POST, DELETE, PATCH, OPTIONS",
    "Access-Control-Allow-Headers":
      "Content-Type, Authorization, Stripe-Signature, X-PRV-Platform, X-PRV-App-Version",
  };
}

function json(res, status, body) {
  res.writeHead(status, { ...corsHeaders(), "Content-Type": "application/json" });
  res.end(JSON.stringify(body));
}

function html(res, status, body) {
  res.writeHead(status, { ...corsHeaders(), "Content-Type": "text/html; charset=utf-8" });
  res.end(body);
}

async function readRawBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  return Buffer.concat(chunks);
}

async function readJsonBody(req) {
  const raw = await readRawBody(req);
  return raw.length ? JSON.parse(raw.toString("utf8")) : {};
}

const server = http.createServer(async (req, res) => {
  if (req.method === "OPTIONS") {
    res.writeHead(204, corsHeaders());
    res.end();
    return;
  }

  const url = new URL(req.url || "/", `http://${req.headers.host}`);
  const path = url.pathname;
  let auth = authFromHeader(req);
  if (!auth && url.searchParams.get("access_token")) {
    auth = authFromToken(url.searchParams.get("access_token"));
  }

  try {
    if (req.method === "GET" && path === "/v1/health") {
      return json(res, 200, {
        ok: true,
        stripe: Boolean(stripe),
        email: Boolean(config.resendApiKey),
        webhook: Boolean(config.stripeWebhookSecret),
      });
    }

    if (req.method === "GET" && path === "/v1/shop/catalog") {
      const lang = url.searchParams.get("lang") || "ro";
      return json(res, 200, getCatalog(lang));
    }

    if (req.method === "POST" && path === "/v1/shop/checkout/prepare") {
      const body = await readJsonBody(req);
      const order = createPendingOrder({
        items: body.items,
        customer: body.customer,
        discountCode: body.discountCode,
        paymentMethod: body.paymentMethod,
        lang: body.lang || "ro",
      });
      return json(res, 200, { order, demo: !stripe });
    }

    if (req.method === "POST" && path === "/v1/shop/checkout/session") {
      const body = await readJsonBody(req);
      let order = body.orderId ? db.getOrder(body.orderId) : null;
      if (!order) {
        order = createPendingOrder({
          items: body.items,
          customer: body.customer,
          discountCode: body.discountCode,
          paymentMethod: body.paymentMethod,
          lang: body.lang || "ro",
        });
      }
      const session = await createCheckoutSession(order, {
        successUrl:
          body.successUrl ||
          `${config.shopPublicUrl}/shop/confirmation.html?orderId=${order.id}&session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: body.cancelUrl || config.shopPublicUrl,
        paymentMethodTypes: body.paymentMethodTypes,
      });
      db.upsertOrder(order);
      return json(res, 200, { url: session.url, id: session.id, orderId: order.id });
    }

    if (req.method === "POST" && path === "/v1/shop/checkout/payment-intent") {
      const body = await readJsonBody(req);
      let order = body.orderId ? db.getOrder(body.orderId) : null;
      if (!order) {
        order = createPendingOrder({
          items: body.items,
          customer: body.customer,
          discountCode: body.discountCode,
          paymentMethod: body.paymentMethod,
          lang: body.lang || "ro",
        });
      }
      const intent = await createPaymentIntent(order);
      db.upsertOrder(order);
      return json(res, 200, { clientSecret: intent.clientSecret, id: intent.id, orderId: order.id });
    }

    if (req.method === "GET" && path === "/v1/shop/checkout/complete") {
      const sessionId = url.searchParams.get("session_id");
      const orderId = url.searchParams.get("orderId");
      if (sessionId) {
        const order = await completeCheckoutSession(sessionId);
        if (order) return json(res, 200, { order });
      }
      if (orderId) {
        return json(res, 200, { order: db.getOrder(orderId) || null });
      }
      return json(res, 400, { error: "missing_params" });
    }

    if (req.method === "POST" && path === "/v1/shop/webhooks/stripe") {
      const raw = await readRawBody(req);
      const sig = req.headers["stripe-signature"];
      return json(res, 200, await handleStripeWebhook(raw, sig));
    }

    if (req.method === "GET" && path.startsWith("/v1/shop/orders/")) {
      const id = path.split("/").pop();
      const email = auth?.email || url.searchParams.get("email");
      const order = getOrderForCustomer(id, email);
      if (!order) return json(res, 404, { error: "not_found" });
      return json(res, 200, { order });
    }

    if (req.method === "POST" && path === "/v1/auth/magic-link") {
      const body = await readJsonBody(req);
      await requestMagicLink(body.email);
      return json(res, 200, { ok: true });
    }

    if (req.method === "GET" && path === "/v1/auth/verify") {
      const session = verifyMagicToken(url.searchParams.get("token"));
      if (!session) return json(res, 401, { error: "invalid_token" });
      return json(res, 200, session);
    }

    if (req.method === "GET" && path === "/v1/account/me") {
      if (!auth) return json(res, 401, { error: "unauthorized" });
      return json(res, 200, { email: auth.email });
    }

    if (req.method === "GET" && path === "/v1/account/orders") {
      if (!auth) return json(res, 401, { error: "unauthorized" });
      return json(res, 200, { orders: listOrdersForEmail(auth.email) });
    }

    if (req.method === "GET" && path.startsWith("/v1/account/invoices/")) {
      if (!auth) return json(res, 401, { error: "unauthorized" });
      const orderId = path.split("/").pop();
      const order = getOrderForCustomer(orderId, auth.email);
      if (!order || order.status !== "paid") return json(res, 404, { error: "not_found" });
      if (url.searchParams.get("format") === "html") {
        return html(res, 200, invoiceHtml(order));
      }
      return json(res, 200, {
        invoice: {
          id: order.invoiceId,
          number: order.invoiceNumber,
          orderId: order.id,
          htmlUrl: `${config.apiPublicUrl}/v1/account/invoices/${order.id}?format=html`,
        },
      });
    }

    if (req.method === "POST" && path === "/v1/shop/reminders") {
      const body = await readJsonBody(req);
      return json(res, 200, addReminder({
        productId: body.productId,
        email: body.email || auth?.email,
        lang: body.lang || "ro",
      }));
    }

    if (req.method === "DELETE" && path === "/v1/shop/reminders") {
      const body = await readJsonBody(req);
      return json(res, 200, removeReminder({ productId: body.productId, email: body.email || auth?.email }));
    }

    if (req.method === "POST" && path === "/v1/admin/catalog/reload") {
      if (req.headers["x-admin-key"] !== process.env.ADMIN_API_KEY) return json(res, 403, { error: "forbidden" });
      invalidateCatalogCache();
      return json(res, 200, { ok: true });
    }

    if (req.method === "PATCH" && path === "/v1/admin/stock") {
      if (req.headers["x-admin-key"] !== process.env.ADMIN_API_KEY) return json(res, 403, { error: "forbidden" });
      const body = await readJsonBody(req);
      const stock = db.getStockOverrides();
      Object.assign(stock, body.stock || {});
      db.saveStockOverrides(stock);
      invalidateCatalogCache();
      const { processStockReminders } = await import("./lib/reminders.mjs");
      await processStockReminders();
      return json(res, 200, { ok: true, stock });
    }

    return json(res, 404, { error: "not_found" });
  } catch (err) {
    console.error("[api]", path, err);
    return json(res, 500, { error: err.message || "server_error", code: err.code });
  }
});

db.init();
startReminderCron();

server.listen(config.port, () => {
  console.log(`PRV Shop API http://localhost:${config.port}`);
});
