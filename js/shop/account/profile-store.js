import { PROFILE_STORAGE_KEY } from "./types.js";
import { createMockCustomerBundle } from "./mock-data.js";
import { ensureCustomerNumber } from "./customer-number.js";
import { uid } from "../format.js";

function read() {
  try {
    const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function write(bundle) {
  localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(bundle));
}

function normalize(bundle) {
  if (!bundle?.profile) return bundle;
  bundle.profile.customerNumber = ensureCustomerNumber(bundle.profile.customerNumber);
  bundle.profile.updatedAt = bundle.profile.updatedAt || new Date().toISOString();
  return bundle;
}

export const ProfileStore = {
  getBundle() {
    const stored = read();
    if (stored?.profile) return normalize(stored);
    return null;
  },

  /** @param {{ email?: string, firstName?: string, lastName?: string }} account */
  ensureForAccount(account) {
    let bundle = this.getBundle();
    if (!bundle) {
      bundle = createMockCustomerBundle({
        email: account?.email,
        firstName: account?.name?.split(" ")?.[0],
        lastName: account?.name?.split(" ")?.slice(1).join(" "),
      });
    } else if (account?.email && bundle.profile.email !== account.email) {
      bundle.profile.email = account.email;
    }
    write(normalize(bundle));
    return bundle;
  },

  /** @param {import('./types.js').CustomerAccountBundle} bundle */
  setBundle(bundle) {
    write(normalize({ ...bundle, profile: { ...bundle.profile, updatedAt: new Date().toISOString() } }));
    window.dispatchEvent(new CustomEvent("prv:profilechange", { detail: bundle }));
    return bundle;
  },

  /** @param {Partial<import('./types.js').CustomerAccountBundle>} patch */
  mergeBundle(patch) {
    const current = this.getBundle() || createMockCustomerBundle();
    const next = {
      profile: { ...current.profile, ...(patch.profile || {}) },
      loyalty: { ...current.loyalty, ...(patch.loyalty || {}) },
      notifications: { ...current.notifications, ...(patch.notifications || {}) },
      appSettings: { ...current.appSettings, ...(patch.appSettings || {}) },
      paymentMethods: patch.paymentMethods || current.paymentMethods,
    };
    this.setBundle(next);
    return next;
  },

  clear() {
    localStorage.removeItem(PROFILE_STORAGE_KEY);
  },

  newAddressId() {
    return uid("addr");
  },
};
