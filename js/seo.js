/**
 * PRV Projects — SEO: canonical, Open Graph image, JSON-LD
 */
(function () {
  const cfg = window.PRV_CONFIG || {};
  const siteUrl = (cfg.siteUrl || "").replace(/\/$/, "");
  if (!siteUrl) return;

  const path = location.pathname.replace(/^\//, "") || "";
  const canonical = `${siteUrl}/${path}${location.search || ""}`.replace(/([^:]\/)\/+/g, "$1");

  if (!document.querySelector('link[rel="canonical"]')) {
    const link = document.createElement("link");
    link.rel = "canonical";
    link.href = canonical.split("?")[0];
    document.head.appendChild(link);
  }

  const ogImage = `${siteUrl}/app-icon-512.png`;
  if (!document.querySelector('meta[property="og:image"]')) {
    const m = document.createElement("meta");
    m.setAttribute("property", "og:image");
    m.content = ogImage;
    document.head.appendChild(m);
  }
  if (!document.querySelector('meta[property="og:url"]')) {
    const m = document.createElement("meta");
    m.setAttribute("property", "og:url");
    m.content = canonical.split("?")[0];
    document.head.appendChild(m);
  }
  if (!document.querySelector('meta[name="twitter:image"]')) {
    const m = document.createElement("meta");
    m.name = "twitter:image";
    m.content = ogImage;
    document.head.appendChild(m);
  }

  if (document.getElementById("prv-jsonld")) return;

  const business = {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    "@id": `${siteUrl}/#organization`,
    name: "PRV Projects",
    url: siteUrl,
    email: cfg.contactEmail || "hello@prvprojects.be",
    description:
      "Renovări interioare premium la cheie în Belgia — apartamente, case și spații comerciale.",
    areaServed: {
      "@type": "Country",
      name: "Belgium",
    },
    address: {
      "@type": "PostalAddress",
      addressCountry: "BE",
      addressRegion: "Brussels-Capital",
    },
    knowsLanguage: ["nl", "en", "ro", "fr", "de", "pl", "es", "it", "tr", "ar", "ru", "uk"],
    priceRange: "€€€",
  };

  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.id = "prv-jsonld";
  script.textContent = JSON.stringify(business);
  document.head.appendChild(script);
})();
