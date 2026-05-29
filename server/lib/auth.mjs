import crypto from "node:crypto";
import { config } from "./config.mjs";
import { db } from "./db.mjs";
import { sendMagicLinkEmail } from "./email.mjs";

const MAGIC_TTL_MS = 15 * 60 * 1000;

function b64url(buf) {
  return Buffer.from(buf)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function signJwt(payload) {
  const header = { alg: "HS256", typ: "JWT" };
  const h = b64url(JSON.stringify(header));
  const p = b64url(JSON.stringify(payload));
  const sig = crypto.createHmac("sha256", config.jwtSecret).update(`${h}.${p}`).digest();
  return `${h}.${p}.${b64url(sig)}`;
}

function verifyJwt(token) {
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [h, p, s] = parts;
  const expected = b64url(crypto.createHmac("sha256", config.jwtSecret).update(`${h}.${p}`).digest());
  if (s !== expected) return null;
  try {
    const payload = JSON.parse(Buffer.from(p.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString());
    if (payload.exp && Date.now() / 1000 > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}

function parseExpiresIn(str) {
  const m = String(str).match(/^(\d+)([dhms])$/);
  if (!m) return 30 * 24 * 3600;
  const n = Number(m[1]);
  const u = { d: 86400, h: 3600, m: 60, s: 1 }[m[2]] || 86400;
  return n * u;
}

export function issueSessionToken(email) {
  const exp = Math.floor(Date.now() / 1000) + parseExpiresIn(config.jwtExpiresIn);
  return signJwt({ sub: email.toLowerCase(), email: email.toLowerCase(), exp });
}

export function authFromHeader(req) {
  const h = req.headers.authorization || "";
  const m = h.match(/^Bearer\s+(.+)$/i);
  if (m) return authFromToken(m[1]);
  return null;
}

export function authFromToken(token) {
  if (!token) return null;
  const payload = verifyJwt(token);
  if (!payload?.email) return null;
  return { email: payload.email };
}

export async function requestMagicLink(email) {
  const normalized = String(email || "")
    .trim()
    .toLowerCase();
  if (!normalized.includes("@")) throw new Error("invalid_email");

  const token = crypto.randomBytes(32).toString("hex");
  const tokens = db.getMagicTokens();
  tokens[token] = { email: normalized, exp: Date.now() + MAGIC_TTL_MS };
  db.saveMagicTokens(tokens);

  const users = db.getUsers();
  if (!users[normalized]) {
    users[normalized] = { email: normalized, createdAt: new Date().toISOString() };
    db.saveUsers(users);
  }

  const link = `${config.shopPublicUrl}/shop/account/index.html?magic=${token}`;
  await sendMagicLinkEmail({ to: normalized, link });
  return { ok: true, message: "magic_link_sent" };
}

export function verifyMagicToken(token) {
  const tokens = db.getMagicTokens();
  const entry = tokens[token];
  if (!entry || entry.exp < Date.now()) {
    if (entry) {
      delete tokens[token];
      db.saveMagicTokens(tokens);
    }
    return null;
  }
  delete tokens[token];
  db.saveMagicTokens(tokens);
  const sessionToken = issueSessionToken(entry.email);
  return { email: entry.email, token: sessionToken };
}
