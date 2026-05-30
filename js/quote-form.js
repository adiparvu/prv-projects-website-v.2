/**
 * PRV Projects — Cereri ofertă (FormSubmit)
 */
window.PRV_QUOTE = {
  async submit(payload) {
    const root = window.PRV_CONFIG || {};
    const to = root.formsubmitEmail || root.contactEmail;
    if (!to) throw new Error("no-email");

    const lang = window.PRV_I18N?.getLang?.() || document.documentElement.lang || "nl";
    const page = location.pathname + location.search;

    const res = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(to)}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        _subject: `PRV Projects — Cerere ofertă (${payload.type || "contact"})`,
        _template: "table",
        _captcha: "false",
        type: payload.type || "contact",
        name: payload.name || "—",
        email: payload.email,
        phone: payload.phone || "—",
        city: payload.city || "—",
        project_type: payload.projectType || "—",
        message: payload.message || "—",
        language: lang,
        page,
        source: "prv-website",
      }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok && data.success !== "true") throw new Error("formsubmit");
    return { ok: true };
  },
};
