/**
 * PRV — platform layer (web · PWA · iOS · Android)
 * @see docs/PRODUCT_ECOSYSTEM.md
 */

const STORAGE_INSTALL_DISMISS = "prv_install_dismissed";

function productConfig() {
  return window.PRV_CONFIG?.product || {};
}

/** @returns {"web"|"pwa"|"ios"|"android"} */
export function getPlatform() {
  const native = window.PRVNative?.platform;
  if (native === "ios" || native === "android") return native;
  const standalone =
    window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone === true;
  if (standalone) return "pwa";
  return "web";
}

export function isNativeShell() {
  return getPlatform() === "ios" || getPlatform() === "android";
}

export function isMobileViewport() {
  return window.matchMedia("(max-width: 768px)").matches;
}

export function getApiBase() {
  const product = productConfig();
  const base = product.api?.baseUrl || product.apiBase || "";
  return String(base).replace(/\/$/, "");
}

function assetPrefix() {
  const path = window.location.pathname;
  const shopIdx = path.indexOf("/shop/");
  if (shopIdx > 0) return path.slice(0, shopIdx);
  const segments = path.split("/").filter(Boolean);
  if (segments.length > 1 && !path.endsWith(".html") && path.endsWith("/")) {
    return `/${segments.slice(0, -1).join("/")}`;
  }
  if (segments.length > 0 && path.includes(".html")) {
    const dir = path.slice(0, path.lastIndexOf("/"));
    return dir || "";
  }
  return "";
}

function ensureLink(rel, href, extra = {}) {
  if (document.querySelector(`link[rel="${rel}"][href="${href}"]`)) return;
  const link = document.createElement("link");
  link.rel = rel;
  link.href = href;
  Object.assign(link, extra);
  document.head.appendChild(link);
}

function ensureMeta(name, content, attr = "name") {
  if (document.querySelector(`meta[${attr}="${name}"]`)) return;
  const meta = document.createElement("meta");
  meta.setAttribute(attr, name);
  meta.content = content;
  document.head.appendChild(meta);
}

/** PWA manifest, mobile meta, ecosystem CSS — safe for shop subpaths */
export function ensureEcosystemHead() {
  const prefix = assetPrefix();
  const manifestHref = `${prefix}/manifest.webmanifest`.replace(/\/+/g, "/");
  ensureLink("manifest", manifestHref);
  ensureMeta("mobile-web-app-capable", "yes");
  ensureMeta("apple-mobile-web-app-capable", "yes");
  ensureMeta("apple-mobile-web-app-status-bar-style", "black-translucent");
  if (!document.querySelector('link[href*="ecosystem.css"]')) {
    ensureLink("stylesheet", `${prefix}/css/ecosystem.css`.replace(/\/+/g, "/"));
  }
}

function applyPlatformClasses() {
  const root = document.documentElement;
  const platform = getPlatform();
  root.dataset.prvPlatform = platform;
  document.body.classList.add(`prv-platform-${platform}`);
  if (isMobileViewport()) document.body.classList.add("prv-mobile");
  if (isNativeShell()) document.body.classList.add("prv-native-shell");
  window.PRV_PLATFORM = {
    id: platform,
    isNative: isNativeShell(),
    isMobile: isMobileViewport(),
    apiBase: getApiBase(),
  };
}

/** Optional install hint (web only, once per session) */
function maybeInstallBanner() {
  const cfg = productConfig().pwa || {};
  if (!cfg.installPrompt || isNativeShell()) return;
  if (sessionStorage.getItem(STORAGE_INSTALL_DISMISS)) return;
  if (!window.deferredInstallPrompt) return;

  const bar = document.createElement("div");
  bar.className = "prv-install-bar glass-panel";
  bar.setAttribute("role", "region");
  bar.setAttribute("aria-label", "Instalează aplicația");
  bar.innerHTML = `
    <p>Instalează PRV pe telefon pentru acces rapid la shop și comenzi.</p>
    <div class="prv-install-bar-actions">
      <button type="button" class="btn btn-primary btn-sm" id="prv-install-accept">Instalează</button>
      <button type="button" class="btn btn-glass btn-sm" id="prv-install-dismiss">Nu acum</button>
    </div>
  `;
  document.body.appendChild(bar);

  bar.querySelector("#prv-install-accept")?.addEventListener("click", async () => {
    const prompt = window.deferredInstallPrompt;
    if (!prompt) return;
    prompt.prompt();
    await prompt.userChoice;
    window.deferredInstallPrompt = null;
    bar.remove();
  });
  bar.querySelector("#prv-install-dismiss")?.addEventListener("click", () => {
    sessionStorage.setItem(STORAGE_INSTALL_DISMISS, "1");
    bar.remove();
  });
}

export function initEcosystem() {
  applyPlatformClasses();
  ensureEcosystemHead();

  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    window.deferredInstallPrompt = e;
    maybeInstallBanner();
  });

  window.matchMedia("(max-width: 768px)").addEventListener("change", () => {
    document.body.classList.toggle("prv-mobile", isMobileViewport());
  });

  window.dispatchEvent(new CustomEvent("prv:platform-ready", { detail: window.PRV_PLATFORM }));
}
