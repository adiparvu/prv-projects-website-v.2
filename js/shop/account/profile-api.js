/**
 * Backend integration boundary for customer profile.
 * Demo: resolves from ProfileStore; Live: GET/PATCH /v1/account/profile
 */

import { getApiBase } from "../api.js";
import { getJson, postJson, apiRequest } from "../../api/client.js";
import { ProfileStore } from "./profile-store.js";

export async function fetchCustomerProfile() {
  const base = getApiBase();
  if (!base) {
    return ProfileStore.getBundle();
  }

  try {
    const data = await getJson("/account/profile");
    if (data?.profile) {
      ProfileStore.setBundle(data);
      return data;
    }
  } catch (err) {
    console.warn("[profile-api] fetch failed, using local", err);
  }

  return ProfileStore.getBundle();
}

/** @param {import('./types.js').CustomerAccountBundle} partial */
export async function saveCustomerProfile(partial) {
  const merged = ProfileStore.mergeBundle(partial);
  const base = getApiBase();

  if (!base) {
    ProfileStore.setBundle(merged);
    return { ok: true, data: merged, demo: true };
  }

  try {
    const data = await apiRequest("/account/profile", {
      method: "PATCH",
      body: JSON.stringify(merged),
    });
    if (data?.profile) ProfileStore.setBundle(data);
    return { ok: true, data: data || merged };
  } catch (err) {
    console.error("[profile-api] save failed", err);
    return { ok: false, error: err };
  }
}

export async function addLoyaltyToWallet() {
  const base = getApiBase();
  if (!base) {
    ProfileStore.mergeBundle({ loyalty: { walletAdded: true } });
    return { ok: true, demo: true };
  }

  try {
    await postJson("/account/loyalty/wallet", {});
    ProfileStore.mergeBundle({ loyalty: { walletAdded: true } });
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err };
  }
}
