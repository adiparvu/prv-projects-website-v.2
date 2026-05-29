/**
 * PRV — contextual menu (hamburger) cu material backdrop + spring
 */

const MOBILE_MQ = window.matchMedia("(max-width: 768px)");

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function isMobileNav() {
  return MOBILE_MQ.matches;
}

function buildMenuItems(nav) {
  const items = [];

  nav.querySelectorAll(".nav-links a").forEach((link) => {
    if (link.classList.contains("nav-shop-link")) return;
    items.push({
      href: link.getAttribute("href") || "#",
      label: link.querySelector("[data-i18n]")?.textContent?.trim() || link.textContent?.trim() || "",
      ariaLabel: link.getAttribute("aria-label") || "",
      icon: link.querySelector("svg")?.outerHTML || "",
      primary: false,
    });
  });

  const cta = nav.querySelector(".nav-actions .btn-primary:not(.nav-shop-link)");
  if (cta) {
    items.push({
      href: cta.getAttribute("href") || "#",
      label: cta.textContent?.trim() || "",
      ariaLabel: cta.getAttribute("aria-label") || "",
      icon: "",
      primary: true,
    });
  }

  return items.filter((item) => item.href && item.label);
}

function renderMenuPanel(panel, items) {
  panel.innerHTML = `
    <p class="nav-ctx-title" data-i18n="nav.menu">Meniu</p>
    <div class="nav-ctx-list" role="presentation">
      ${items
        .map(
          (item, i) => `
        <a
          href="${item.href}"
          class="nav-ctx-item${item.primary ? " nav-ctx-item--primary" : ""}"
          role="menuitem"
          style="--ctx-i: ${i}"
          ${item.ariaLabel ? `aria-label="${item.ariaLabel}"` : ""}
        >
          ${item.icon ? `<span class="nav-ctx-icon" aria-hidden="true">${item.icon}</span>` : ""}
          <span class="nav-ctx-label">${item.label}</span>
        </a>`
        )
        .join("")}
    </div>
  `;
}

export function initNavContextMenu() {
  const nav = document.querySelector(".nav");
  const toggle = document.querySelector(".nav-toggle");
  if (!nav || !toggle) return;

  let root = document.getElementById("nav-context-menu");
  if (!root) {
    root = document.createElement("div");
    root.id = "nav-context-menu";
    root.className = "nav-ctx";
    root.hidden = true;
    root.innerHTML = `
      <div class="nav-ctx-backdrop material-backdrop" data-nav-ctx-close tabindex="-1" aria-hidden="true"></div>
      <div class="nav-ctx-panel material-vibrancy glass-panel" role="menu" aria-label="Meniu principal"></div>
    `;
    document.body.appendChild(root);
  }

  const backdrop = root.querySelector(".nav-ctx-backdrop");
  const panel = root.querySelector(".nav-ctx-panel");
  let open = false;
  let items = buildMenuItems(nav);

  const positionPanel = () => {
    const rect = toggle.getBoundingClientRect();
    const gap = 10;
    const panelWidth = Math.min(300, window.innerWidth - 24);
    const top = rect.bottom + gap;
    let right = window.innerWidth - rect.right;

    right = Math.max(12, Math.min(right, window.innerWidth - panelWidth - 12));

    panel.style.top = `${top}px`;
    panel.style.right = `${right}px`;
    panel.style.width = `${panelWidth}px`;
  };

  const setOpenState = (next) => {
    open = next;
    toggle.classList.toggle("is-active", open);
    toggle.setAttribute("aria-expanded", String(open));
    nav.classList.toggle("nav-menu-open", open);
    root.classList.toggle("is-open", open);
    root.hidden = !open;
    root.setAttribute("aria-hidden", String(!open));
    document.body.classList.toggle("nav-ctx-open", open);

    if (open) {
      items = buildMenuItems(nav);
      renderMenuPanel(panel, items);
      positionPanel();
      if (window.PRV_I18N?.applyLang) {
        window.PRV_I18N.applyLang(window.PRV_I18N.getLang?.() || "ro", { save: false });
      }
      const first = panel.querySelector(".nav-ctx-item");
      first?.focus();
    }
  };

  const close = () => {
    if (!open) return;
    if (prefersReducedMotion()) {
      setOpenState(false);
      return;
    }
    root.classList.add("is-closing");
    const done = () => {
      root.classList.remove("is-closing");
      setOpenState(false);
      panel.removeEventListener("animationend", done);
    };
    panel.addEventListener("animationend", done, { once: true });
    window.setTimeout(() => {
      if (root.classList.contains("is-closing")) done();
    }, 320);
  };

  const openMenu = () => {
    if (!isMobileNav()) return;
    setOpenState(true);
  };

  toggle.addEventListener("click", (e) => {
    e.stopPropagation();
    if (!isMobileNav()) return;
    if (open) close();
    else openMenu();
  });

  backdrop?.addEventListener("click", close);

  panel.addEventListener("click", (e) => {
    if (e.target.closest(".nav-ctx-item")) close();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && open) {
      e.preventDefault();
      close();
      toggle.focus();
    }
  });

  window.addEventListener(
    "resize",
    () => {
      if (open) positionPanel();
      if (open && !isMobileNav()) close();
    },
    { passive: true }
  );

  MOBILE_MQ.addEventListener?.("change", () => {
    if (!isMobileNav() && open) close();
  });

  window.addEventListener("prv:langchange", () => {
    if (!open) return;
    items = buildMenuItems(nav);
    renderMenuPanel(panel, items);
  });
}
