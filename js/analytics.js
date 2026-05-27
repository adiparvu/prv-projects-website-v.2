/**
 * PRV Projects — Google Analytics 4 (doar după consimțământ cookies)
 */
(function () {
  const CONSENT_KEY = "prv-cookie-consent";

  function getGaId() {
    return window.PRV_CONFIG?.gaMeasurementId?.trim() || "";
  }

  function hasAnalyticsConsent() {
    try {
      const c = JSON.parse(localStorage.getItem(CONSENT_KEY) || "{}");
      return c.analytics === true;
    } catch {
      return false;
    }
  }

  function loadGA() {
    const id = getGaId();
    if (!id || window.__prvGaLoaded) return;

    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag() {
      window.dataLayer.push(arguments);
    }
    window.gtag = gtag;
    gtag("js", new Date());
    gtag("config", id, { anonymize_ip: true });
    window.__prvGaLoaded = true;
  }

  function tryInit() {
    if (hasAnalyticsConsent()) loadGA();
  }

  window.PRV_ANALYTICS = { loadGA, tryInit, hasAnalyticsConsent };

  document.addEventListener("prv:cookies-accepted", (e) => {
    if (e.detail?.analytics) loadGA();
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", tryInit);
  } else {
    tryInit();
  }
})();
