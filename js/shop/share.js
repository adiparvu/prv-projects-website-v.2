/** PRV Shop — share product link */

import { t } from "./i18n.js";

export async function shareProduct({ name, slug, description = "" }) {
  const { ShopRoutes } = await import("./routes.js");
  const url = `${window.location.origin}${ShopRoutes.product(slug)}`;
  const payload = {
    title: name,
    text: description || name,
    url,
  };

  if (navigator.share) {
    try {
      await navigator.share(payload);
      return { ok: true, method: "share" };
    } catch (err) {
      if (err?.name === "AbortError") return { ok: false, aborted: true };
    }
  }

  try {
    await navigator.clipboard.writeText(url);
    return { ok: true, method: "clipboard" };
  } catch {
    const ta = document.createElement("textarea");
    ta.value = url;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    ta.remove();
    return { ok: true, method: "clipboard" };
  }
}

export function shareFeedback(method) {
  return method === "clipboard" ? t("shop.product.shareCopied") : t("shop.product.share");
}
