/** Form validation helpers for customer profile */

export function validateEmail(value) {
  const v = String(value || "").trim();
  if (!v) return { ok: false, message: "shop.profile.validation.emailRequired" };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return { ok: false, message: "shop.profile.validation.emailInvalid" };
  return { ok: true, value: v };
}

export function validatePhone(value) {
  const v = String(value || "").trim();
  if (!v) return { ok: true, value: "" };
  const digits = v.replace(/[\s\-().+]/g, "");
  if (digits.length < 8 || digits.length > 15) {
    return { ok: false, message: "shop.profile.validation.phoneInvalid" };
  }
  return { ok: true, value: v };
}

export function validateRequired(value, messageKey = "shop.profile.validation.required") {
  const v = String(value || "").trim();
  if (!v) return { ok: false, message: messageKey };
  return { ok: true, value: v };
}

export function validateAddress(address) {
  const line1 = validateRequired(address?.line1, "shop.profile.validation.addressLine");
  if (!line1.ok) return line1;
  const city = validateRequired(address?.city, "shop.profile.validation.city");
  if (!city.ok) return city;
  const postalCode = validateRequired(address?.postalCode, "shop.profile.validation.postal");
  if (!postalCode.ok) return postalCode;
  const country = validateRequired(address?.country, "shop.profile.validation.country");
  if (!country.ok) return country;
  return { ok: true };
}
