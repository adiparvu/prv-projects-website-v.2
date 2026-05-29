import { config } from "./config.mjs";
import { getProductById } from "./catalog.mjs";

async function resendSend({ to, subject, html }) {
  if (!config.resendApiKey) {
    console.log("[email:demo]", { to, subject });
    return { id: "demo" };
  }
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: config.emailFrom,
      to: [to],
      subject,
      html,
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`resend_failed: ${err}`);
  }
  return res.json();
}

export async function sendMagicLinkEmail({ to, link }) {
  return resendSend({
    to,
    subject: "Conectare cont PRV Shop",
    html: `<p>Bună,</p><p>Apasă linkul pentru a accesa contul tău PRV Shop (valabil 15 minute):</p>
<p><a href="${link}">${link}</a></p><p>Dacă nu ai solicitat acest email, ignoră-l.</p><p>PRV Projects</p>`,
  });
}

export async function sendStockReminderEmail({ to, productName, productUrl }) {
  return resendSend({
    to,
    subject: `Înapoi în stoc: ${productName}`,
    html: `<p>Bună,</p><p>Produsul <strong>${productName}</strong> este din nou disponibil în PRV Shop.</p>
<p><a href="${productUrl}">Vezi produsul →</a></p><p>PRV Projects</p>`,
  });
}

export async function sendOrderConfirmationEmail({ to, order }) {
  const inv = order.invoiceNumber || order.id;
  return resendSend({
    to,
    subject: `Comandă confirmată ${inv}`,
    html: `<p>Bună ${order.customer?.name || ""},</p>
<p>Comanda ta <strong>${inv}</strong> a fost confirmată. Total: €${(order.totalCents / 100).toFixed(2)}.</p>
<p>Poți vedea detaliile în contul tău PRV Shop.</p><p>Mulțumim,<br/>PRV Projects</p>`,
  });
}

export { getProductById };
