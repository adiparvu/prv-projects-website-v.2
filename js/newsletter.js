/**
 * PRV Projects — Newsletter (Formspree / Mailchimp / Netlify / local)
 */
window.PRV_NEWSLETTER = {
  async subscribe(email) {
    const cfg = window.PRV_CONFIG?.newsletter || {};
    const provider = cfg.provider || "local";

    if (provider === "formspree" && cfg.formspreeId) {
      const res = await fetch(`https://formspree.io/f/${cfg.formspreeId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email,
          _subject: "PRV Projects Newsletter",
          source: "website-footer",
        }),
      });
      if (!res.ok) throw new Error("formspree");
      return { ok: true, provider: "formspree" };
    }

    if (provider === "mailchimp" && cfg.mailchimpAction) {
      const body = new FormData();
      body.append("EMAIL", email);
      if (cfg.mailchimpHiddenName) {
        body.append(cfg.mailchimpHiddenName, "");
      }
      await fetch(cfg.mailchimpAction, {
        method: "POST",
        body,
        mode: "no-cors",
      });
      return { ok: true, provider: "mailchimp" };
    }

    if (provider === "netlify") {
      const form = document.getElementById("footer-newsletter");
      if (form?.checkValidity()) {
        const fd = new FormData(form);
        fd.set("email", email);
        const res = await fetch("/", { method: "POST", body: fd });
        if (!res.ok) throw new Error("netlify");
        return { ok: true, provider: "netlify" };
      }
    }

    const subs = JSON.parse(localStorage.getItem("prv-newsletter") || "[]");
    if (!subs.includes(email)) subs.push(email);
    localStorage.setItem("prv-newsletter", JSON.stringify(subs));
    return { ok: true, provider: "local" };
  },
};
