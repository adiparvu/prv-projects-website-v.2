/** PRV Shop — session auth (JWT from magic link) */

const TOKEN_KEY = "prv_shop_token";

export function getAuthToken() {
  try {
    return localStorage.getItem(TOKEN_KEY) || "";
  } catch {
    return "";
  }
}

export function setAuthToken(token) {
  if (!token) {
    clearAuth();
    return;
  }
  localStorage.setItem(TOKEN_KEY, token);
  window.PRV_AUTH = { token };
}

export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  window.PRV_AUTH = { token: null };
}

export function initShopAuth() {
  const token = getAuthToken();
  if (token) window.PRV_AUTH = { token };
}

export async function handleMagicLinkFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const magic = params.get("magic");
  if (!magic) return false;

  const { getApiBase } = await import("./api.js");
  if (!getApiBase()) return false;

  const { getJson } = await import("../api/client.js");
  try {
    const data = await getJson(`/auth/verify?token=${encodeURIComponent(magic)}`);
    if (data?.token) {
      setAuthToken(data.token);
      const { ShopStore } = await import("./store.js");
      ShopStore.login(data.email);
      params.delete("magic");
      const qs = params.toString();
      const next = `${window.location.pathname}${qs ? `?${qs}` : ""}`;
      window.history.replaceState({}, "", next);
      return true;
    }
  } catch (e) {
    console.error("[auth]", e);
  }
  return false;
}
