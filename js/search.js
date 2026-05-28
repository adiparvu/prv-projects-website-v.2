/**
 * PRV Projects — căutare internă
 */
(function () {
  const input = document.getElementById("search-input");
  const resultsEl = document.getElementById("search-results");
  const emptyEl = document.getElementById("search-empty");
  const countEl = document.getElementById("search-count");
  if (!input || !resultsEl || !window.PRV_SEARCH_INDEX) return;

  const isNested = /\/projects\//.test(location.pathname) || /\/blog\//.test(location.pathname);
  const base = isNested ? ".." : ".";

  function labelFor(item) {
    if (item.i18n && window.PRV_I18N?.strings?.[item.i18n]) {
      return window.PRV_I18N.strings[item.i18n];
    }
    if (item.title) return item.title;
    const typeLabels = window.PRV_I18N?.strings || {};
    if (item.type === "project") return typeLabels["search.typeProject"] || "Proiect";
    if (item.type === "blog") return typeLabels["search.typeBlog"] || "Blog";
    return typeLabels["search.typePage"] || "Pagină";
  }

  function typeBadge(item) {
    const s = window.PRV_I18N?.strings || {};
    if (item.type === "project") return s["search.typeProject"] || "Proiect";
    if (item.type === "blog") return s["search.typeBlog"] || "Blog";
    return s["search.typePage"] || "Pagină";
  }

  function search(query) {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    return window.PRV_SEARCH_INDEX.filter((item) => {
      const title = labelFor(item).toLowerCase();
      const blob = [title, item.tags || "", item.title || "", item.url].join(" ").toLowerCase();
      return blob.includes(q) || q.split(/\s+/).every((w) => blob.includes(w));
    });
  }

  function render(query) {
    const items = search(query);
    resultsEl.innerHTML = "";

    if (countEl) {
      const tpl = window.PRV_I18N?.strings?.["search.resultsCount"] || "{n} rezultate";
      countEl.textContent = query.trim() ? tpl.replace("{n}", String(items.length)) : "";
      countEl.hidden = !query.trim();
    }

    if (!query.trim()) {
      emptyEl.hidden = true;
      return;
    }

    if (items.length === 0) {
      emptyEl.hidden = false;
      return;
    }

    emptyEl.hidden = true;
    items.forEach((item) => {
      const a = document.createElement("a");
      a.className = "search-result glass-panel";
      a.href = `${base}/${item.url}`.replace(/([^:]\/)\/+/g, "$1");
      a.innerHTML = `
        <span class="search-result-type">${typeBadge(item)}</span>
        <span class="search-result-title">${labelFor(item)}</span>
        <span class="search-result-arrow" aria-hidden="true">→</span>
      `;
      resultsEl.appendChild(a);
    });
  }

  const params = new URLSearchParams(location.search);
  const initial = params.get("q") || "";
  if (initial) input.value = initial;
  render(initial);

  input.addEventListener("input", () => render(input.value));
  document.querySelector(".search-form")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const q = input.value.trim();
    history.replaceState(null, "", q ? `?q=${encodeURIComponent(q)}` : location.pathname);
    render(q);
  });

  window.addEventListener("prv:langchange", () => render(input.value));
})();
