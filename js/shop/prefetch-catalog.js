/**
 * PRV Shop — prefetch catalog înainte de module (zero delay la boot)
 */
(function () {
  if (window.__PRV_CATALOG_PREFETCH_STARTED) return;
  window.__PRV_CATALOG_PREFETCH_STARTED = true;

  function catalogUrl() {
    const path = window.location.pathname;
    const m = path.match(/^(.*\/shop)(?:\/|$)/);
    const root = m ? m[1].replace(/\/shop$/, "") || "" : "";
    return `${root}/data/shop/catalog.json`.replace(/\/+/g, "/");
  }

  function readSession() {
    try {
      const raw = sessionStorage.getItem("prv_shop_catalog_v1");
      if (!raw) return null;
      const data = JSON.parse(raw);
      return data?.products?.length ? data : null;
    } catch {
      return null;
    }
  }

  const cached = readSession();
  if (cached) {
    window.__PRV_CATALOG_PREFETCH = cached;
    return;
  }

  fetch(catalogUrl(), { cache: "force-cache" })
    .then((r) => (r.ok ? r.json() : null))
    .then((data) => {
      if (data?.products?.length) window.__PRV_CATALOG_PREFETCH = data;
    })
    .catch(() => {});
})();
