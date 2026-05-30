/** PRV customer number — 14 chars, includes PRV prefix */

const PRV_PREFIX = "PRV";
const TOTAL_LENGTH = 14;
const SUFFIX_LENGTH = TOTAL_LENGTH - PRV_PREFIX.length;

/** @returns {string} e.g. PRV00012345678 */
export function generateCustomerNumber() {
  const max = 10 ** SUFFIX_LENGTH;
  const n = Math.floor(Math.random() * max);
  return `${PRV_PREFIX}${String(n).padStart(SUFFIX_LENGTH, "0")}`;
}

/** @param {string} value */
export function isValidCustomerNumber(value) {
  if (typeof value !== "string") return false;
  if (new RegExp(`^${PRV_PREFIX}\\d{${SUFFIX_LENGTH}}$`).test(value)) return true;
  return /^\d{5}PRV\d{6}$/.test(value);
}

/** Ensure existing profile has a valid number */
export function ensureCustomerNumber(existing) {
  if (isValidCustomerNumber(existing)) return existing;
  return generateCustomerNumber();
}
