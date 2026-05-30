/**
 * PRV Projects — CTA mobil (WhatsApp + ofertă)
 */
(function () {
  const cfg = window.PRV_CONFIG || {};
  if (cfg.floatingCtaEnabled === false) return;
  const wa = (cfg.whatsappNumber || "").replace(/\D/g, "");
  if (!wa && !cfg.contactEmail) return;

  const isNested = /\/projects\//.test(location.pathname) || /\/blog\//.test(location.pathname);
  const base = isNested ? ".." : ".";
  const contactHref = `${base}/contact.html`;

  const wrap = document.createElement("div");
  wrap.className = "floating-cta";
  wrap.setAttribute("aria-label", "Acțiuni rapide");

  if (wa) {
    const waLink = document.createElement("a");
    waLink.className = "floating-cta-btn floating-cta-btn--wa";
    waLink.href = `https://wa.me/${wa}?text=${encodeURIComponent("Bună, aș dori o ofertă pentru o renovare.")}`;
    waLink.target = "_blank";
    waLink.rel = "noopener noreferrer";
    waLink.setAttribute("aria-label", "WhatsApp");
    waLink.innerHTML =
      '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 0 0 .614.614l4.458-1.495A11.95 11.95 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.77 9.77 0 0 1-4.988-1.364l-.358-.214-2.663.893.893-2.597-.233-.375A9.818 9.818 0 0 1 2.182 12c0-5.422 4.396-9.818 9.818-9.818 5.422 0 9.818 4.396 9.818 9.818 0 5.422-4.396 9.818-9.818 9.818z"/></svg>';
    wrap.appendChild(waLink);
  }

  const offer = document.createElement("a");
  offer.className = "floating-cta-btn floating-cta-btn--offer btn btn-primary";
  offer.href = contactHref;
  offer.setAttribute("data-i18n", "nav.cta");
  offer.textContent = "Cere o ofertă";
  wrap.appendChild(offer);

  document.body.appendChild(wrap);
  window.addEventListener("prv:langchange", () => {
    if (window.PRV_I18N?.strings?.["nav.cta"]) offer.textContent = window.PRV_I18N.strings["nav.cta"];
  });
})();
