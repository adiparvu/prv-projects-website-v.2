import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const config = {
  port: Number(process.env.PORT || 8787),
  dataDir: process.env.DATA_DIR || path.join(__dirname, "../data"),
  catalogPath:
    process.env.CATALOG_PATH ||
    path.join(__dirname, "../../data/shop/catalog.json"),
  stripeSecretKey: process.env.STRIPE_SECRET_KEY || "",
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET || "",
  jwtSecret: process.env.JWT_SECRET || process.env.STRIPE_SECRET_KEY || "prv-dev-change-me",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "30d",
  resendApiKey: process.env.RESEND_API_KEY || "",
  emailFrom: process.env.EMAIL_FROM || "PRV Shop <shop@prvprojects.be>",
  shopPublicUrl: (process.env.SHOP_PUBLIC_URL || "http://localhost:8765").replace(/\/$/, ""),
  apiPublicUrl: (process.env.API_PUBLIC_URL || `http://localhost:${process.env.PORT || 8787}`).replace(/\/$/, ""),
  corsOrigin: process.env.CORS_ORIGIN || "*",
  shippingCents: 1500,
  freeShippingThresholdCents: 15000,
  reminderCheckIntervalMs: Number(process.env.REMINDER_INTERVAL_MS || 3600000),
};
