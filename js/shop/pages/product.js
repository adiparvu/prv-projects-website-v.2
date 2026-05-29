import { getProduct, getReviews, relatedProducts } from "../catalog.js";
import { breadcrumb, productCard, reviewsBlock } from "../components.js";
import { formatMoney, escapeHtml } from "../format.js";
import { ShopRoutes } from "../routes.js";
import { ShopStore } from "../store.js";
import { productMediaActions } from "../media-actions.js";
import { trackViewItem } from "../analytics.js";
import { t } from "../i18n.js";

const BELL_ICON = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M18 8a6 6 0 10-12 0c0 7-3 7-3 7h18s-3 0-3-7"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>`;

function galleryHtml(product) {
  const images = product.images?.length ? product.images : [{ url: "", alt: product.name }];
  const main = images[0];
  const thumbs =
    images.length > 1
      ? `<div class="shop-gallery-thumbs">${images
          .map(
            (img, i) =>
              `<button type="button" class="shop-thumb${i === 0 ? " is-active" : ""}" data-img="${escapeHtml(img.url)}" data-alt="${escapeHtml(img.alt || product.name)}">
            <img src="${escapeHtml(img.url)}" alt="" loading="lazy" />
          </button>`
          )
          .join("")}</div>`
      : "";

  return `
    <div class="shop-gallery shop-color-zone">
      <div class="shop-gallery-main">
        <img id="shop-pdp-img" src="${escapeHtml(main.url)}" alt="${escapeHtml(main.alt || product.name)}" />
        ${productMediaActions(product, { favorite: { id: "shop-fav" }, share: { id: "shop-share" } })}
      </div>
      ${thumbs}
      <div class="shop-color-zone-tools" aria-label="${escapeHtml(t("shop.nav.themeZone"))}">
        <span class="shop-color-zone-label">${escapeHtml(t("shop.nav.theme"))}</span>
        <div class="shop-theme-host shop-theme-host--gallery"></div>
      </div>
    </div>
  `;
}

export function renderProduct(main, catalog, slug) {
  const product = getProduct(catalog, slug);
  if (!product) {
    main.innerHTML = `<div class="shop-empty glass-panel"><p>${t("shop.empty.product")}</p><a href="${ShopRoutes.home()}">${t("shop.empty.categoryBack")}</a></div>`;
    return;
  }

  const cat = catalog.categories.find((c) => c.slug === product.categorySlug);
  const hasReminder = ShopStore.hasReminder(product.id);
  const outOfStock = product.stock < 1;
  const reviews = getReviews(catalog, product.id);
  const related = relatedProducts(catalog, product);
  const onSale = product.compareAtCents && product.compareAtCents > product.priceCents;
  trackViewItem(product);

  main.innerHTML = `
    ${breadcrumb([
      { label: t("shop.breadcrumb.shop"), href: ShopRoutes.home() },
      { label: cat?.name || "Produs", href: cat ? ShopRoutes.category(cat.slug) : null },
      { label: product.name },
    ])}
    <article class="shop-pdp glass-panel" style="margin-top:1rem;padding:1.5rem">
      ${galleryHtml(product)}
      <div class="shop-pdp-info">
        <p class="shop-pdp-meta">${t("shop.product.sku")} ${escapeHtml(product.sku)} · ${product.stock > 0 ? t("shop.product.inStock", { n: product.stock }) : t("shop.product.outOfStock")}</p>
        <h1>${escapeHtml(product.name)}</h1>
        <div class="shop-pdp-price-block">
          ${onSale ? `<span class="shop-price-rrp">${t("shop.rrp")} ${formatMoney(product.compareAtCents)}</span>` : ""}
          <div class="shop-pdp-price">${formatMoney(product.priceCents)}</div>
          <span class="shop-price-vat">${t("shop.price.vatIncl")}</span>
        </div>
        <p>${escapeHtml(product.description)}</p>
        ${
          outOfStock
            ? `<div class="shop-pdp-actions shop-pdp-actions--oos">
          <button type="button" class="btn btn-primary" id="shop-reminder" aria-pressed="${hasReminder}">${BELL_ICON} ${hasReminder ? t("shop.product.reminderSet") : t("shop.product.reminder")}</button>
        </div>`
            : `<div class="shop-qty-row">
          <div class="shop-qty">
            <button type="button" data-qty-minus aria-label="−">−</button>
            <input type="number" id="shop-qty" value="1" min="1" max="${product.stock}" aria-label="Qty" />
            <button type="button" data-qty-plus aria-label="+">+</button>
          </div>
          <button type="button" class="btn btn-primary" id="shop-add-cart">${t("shop.product.addCart")}</button>
        </div>`
        }
      </div>
    </article>
    ${reviewsBlock(reviews)}
    ${
      related.length
        ? `<div class="shop-section-head" style="margin-top:2rem"><h2>${t("shop.product.similar")}</h2></div>
           <div class="shop-grid">${related.map((p) => productCard(p, catalog)).join("")}</div>`
        : ""
    }
  `;

  main.querySelectorAll(".shop-thumb").forEach((btn) => {
    btn.addEventListener("click", () => {
      main.querySelectorAll(".shop-thumb").forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      const img = main.querySelector("#shop-pdp-img");
      if (img) {
        img.src = btn.dataset.img;
        img.alt = btn.dataset.alt || "";
      }
    });
  });

  if (!outOfStock) {
    const qtyInput = main.querySelector("#shop-qty");
    main.querySelector("[data-qty-minus]")?.addEventListener("click", () => {
      qtyInput.value = String(Math.max(1, parseInt(qtyInput.value, 10) - 1));
    });
    main.querySelector("[data-qty-plus]")?.addEventListener("click", () => {
      qtyInput.value = String(Math.min(product.stock, parseInt(qtyInput.value, 10) + 1));
    });
    main.querySelector("#shop-add-cart")?.addEventListener("click", () => {
      ShopStore.addToCart(product, parseInt(qtyInput.value, 10) || 1);
      const btn = main.querySelector("#shop-add-cart");
      btn.textContent = t("shop.product.added");
      setTimeout(() => {
        btn.textContent = t("shop.product.addCart");
      }, 1600);
    });
  }

  main.querySelector("#shop-reminder")?.addEventListener("click", async (e) => {
    const btn = e.currentTarget;
    if (ShopStore.hasReminder(product.id)) {
      const account = ShopStore.getAccount();
      const { getApiBase, removeStockReminder } = await import("../api.js");
      if (getApiBase()) {
        await removeStockReminder({ productId: product.id, email: account?.email }).catch(() => {});
      }
      ShopStore.removeReminder(product.id);
      btn.setAttribute("aria-pressed", "false");
      btn.innerHTML = `${BELL_ICON} ${t("shop.product.reminder")}`;
      return;
    }

    const account = ShopStore.getAccount();
    let email = account?.email || "";
    if (!email) {
      email = window.prompt(t("shop.product.reminderPrompt"), "")?.trim() || "";
    }
    if (!email || !email.includes("@")) return;

    const { getApiBase, addStockReminder } = await import("../api.js");
    if (getApiBase()) {
      try {
        await addStockReminder({
          productId: product.id,
          email,
          lang: window.PRV_I18N?.getLang?.() || "ro",
        });
      } catch (err) {
        console.error(err);
        return;
      }
    }

    if (!account) ShopStore.login(email);
    ShopStore.setReminder(product.id, email);
    btn.setAttribute("aria-pressed", "true");
    btn.innerHTML = `${BELL_ICON} ${t("shop.product.reminderSet")}`;
  });
}
