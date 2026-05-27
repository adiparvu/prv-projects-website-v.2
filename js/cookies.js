/**
 * PRV Projects — GDPR cookie consent
 */
(function () {
  const STORAGE_KEY = "prv-cookie-consent";

  function getConsent() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    } catch {
      return null;
    }
  }

  function saveConsent(essential, analytics) {
    const data = {
      essential: true,
      analytics: !!analytics,
      ts: Date.now(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    document.getElementById("cookie-banner")?.remove();
    document.dispatchEvent(
      new CustomEvent("prv:cookies-accepted", { detail: data })
    );
    if (window.PRV_ANALYTICS) window.PRV_ANALYTICS.tryInit();
    if (window.PRV_I18N?.applyLang) {
      window.PRV_I18N.applyLang(window.PRV_I18N.getLang());
    }
  }

  function buildBanner() {
    if (getConsent()) return;

    const banner = document.createElement("div");
    banner.id = "cookie-banner";
    banner.className = "cookie-banner glass-panel";
    banner.setAttribute("role", "dialog");
    banner.setAttribute("aria-labelledby", "cookie-title");
    banner.innerHTML = `
      <div class="cookie-inner">
        <div class="cookie-text">
          <h2 id="cookie-title" class="cookie-title" data-i18n="cookie.title">Confidențialitate &amp; cookies</h2>
          <p data-i18n="cookie.desc">Folosim cookies esențiale pentru funcționarea site-ului și, cu acordul tău, analytics pentru a îmbunătăți experiența. Poți alege ce accepți.</p>
          <a href="#" class="cookie-policy-link" data-i18n="cookie.policy">Politica de confidențialitate</a>
        </div>
        <div class="cookie-actions">
          <button type="button" class="btn btn-glass cookie-btn-reject" data-i18n="cookie.reject">Doar esențiale</button>
          <button type="button" class="btn btn-primary cookie-btn-accept" data-i18n="cookie.accept">Accept toate</button>
        </div>
      </div>
    `;

    document.body.appendChild(banner);

    banner.querySelector(".cookie-btn-accept")?.addEventListener("click", () => {
      saveConsent(true, true);
    });
    banner.querySelector(".cookie-btn-reject")?.addEventListener("click", () => {
      saveConsent(true, false);
    });
    banner.querySelector(".cookie-policy-link")?.addEventListener("click", (e) => {
      e.preventDefault();
      alert(
        window.PRV_I18N?.strings?.["cookie.policyText"] ||
          "PRV Projects: datele sunt procesate conform GDPR. Contact: hello@prvprojects.be"
      );
    });

    requestAnimationFrame(() => banner.classList.add("is-visible"));
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", buildBanner);
  } else {
    buildBanner();
  }
})();
