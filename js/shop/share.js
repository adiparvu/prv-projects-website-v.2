/** PRV Shop — share product link */

import { t } from "./i18n.js";

export const SHARE_ICON = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>`;

function escapeAttr(str) {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;");
}

export function shareIconButton(product, { id = "", extraClass = "" } = {}) {
  const cls = ["shop-media-btn", "shop-share-btn", extraClass].filter(Boolean).join(" ");
  const idAttr = id ? ` id="${escapeAttr(id)}"` : "";
  return `<button type="button" class="${cls}"${idAttr}
    data-share-slug="${escapeAttr(product.slug)}"
    data-share-name="${escapeAttr(product.name)}"
    data-share-desc="${escapeAttr(product.shortDescription || "")}"
    aria-label="${escapeAttr(t("shop.product.share"))}">${SHARE_ICON}</button>`;
}

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

const wiredRoots = new WeakSet();

export function wireShareButtons(root) {
  if (!root || wiredRoots.has(root)) return;
  wiredRoots.add(root);

  root.addEventListener("click", async (e) => {
    const btn = e.target.closest("[data-share-slug]");
    if (!btn || !root.contains(btn)) return;

    e.preventDefault();
    e.stopPropagation();

    const result = await shareProduct({
      slug: btn.dataset.shareSlug,
      name: btn.dataset.shareName,
      description: btn.dataset.shareDesc,
    });

    if (result.ok && result.method === "clipboard") {
      btn.classList.add("is-copied");
      btn.setAttribute("aria-label", t("shop.product.shareCopied"));
      setTimeout(() => {
        btn.classList.remove("is-copied");
        btn.setAttribute("aria-label", t("shop.product.share"));
      }, 2000);
    }
  });
}
