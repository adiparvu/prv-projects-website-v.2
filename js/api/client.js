/**
 * PRV — unified API client for web, PWA, and native shells.
 * All surfaces (shop, account, future dashboard mobile) use this boundary.
 */

import { getApiBase as getPlatformApiBase } from "../prv-platform.js";

const API_VERSION = "v1";

function productConfig() {
  return window.PRV_CONFIG?.product || {};
}

export function getApiBase() {
  const shopBase = window.PRV_CONFIG?.shop?.apiBase;
  if (shopBase) return shopBase.replace(/\/$/, "");
  return getPlatformApiBase();
}

export function apiUrl(path) {
  const base = getApiBase();
  const clean = path.startsWith("/") ? path : `/${path}`;
  if (!base) return clean;
  return `${base}/${API_VERSION}${clean}`;
}

export function apiHeaders(extra = {}) {
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    "X-PRV-Platform": window.PRV_PLATFORM?.id || "web",
    ...extra,
  };
  const version =
    window.PRVNative?.appVersion || productConfig().native?.webVersion || "web";
  headers["X-PRV-App-Version"] = version;
  const token = window.PRV_AUTH?.token;
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

export async function apiRequest(path, options = {}) {
  const base = getApiBase();
  if (!base) {
    const err = new Error("api_unconfigured");
    err.code = "API_DEMO";
    throw err;
  }

  const res = await fetch(apiUrl(path), {
    ...options,
    headers: apiHeaders(options.headers || {}),
  });

  if (!res.ok) {
    const err = new Error(`api_${res.status}`);
    err.status = res.status;
    try {
      err.body = await res.json();
    } catch {
      /* ignore */
    }
    throw err;
  }

  const ct = res.headers.get("content-type") || "";
  if (ct.includes("application/json")) return res.json();
  return res.text();
}

export async function postJson(path, body) {
  return apiRequest(path, { method: "POST", body: JSON.stringify(body) });
}

export async function getJson(path) {
  return apiRequest(path, { method: "GET" });
}
