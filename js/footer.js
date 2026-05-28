/**
 * PRV Projects — Footer + social (primary + slider for more)
 */
(function () {
  const isNested = /\/projects\//.test(location.pathname) || /\/blog\//.test(location.pathname);
  const base = isNested ? ".." : ".";

  const socialPrimary = [
    {
      id: "instagram",
      label: "Instagram",
      href: "https://instagram.com/prvprojects",
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>`,
    },
    {
      id: "facebook",
      label: "Facebook",
      href: "https://facebook.com/prvprojects",
      icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.07C24 5.41 18.63 0 12 0S0 5.4 0 12.07c0 6.02 4.39 11.02 10.13 11.92v-8.4H7.08v-3.52h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.95h-1.51c-1.49 0-1.95.93-1.95 1.88v2.26h3.32l-.53 3.52h-2.79v8.43C19.61 23.09 24 18.09 24 12.07z"/></svg>`,
    },
    {
      id: "x",
      label: "X",
      href: "https://x.com/prvprojects",
      icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.9 2H22l-6.8 7.8L23.5 22h-7.2l-5.6-7.3L4.2 22H1.1l7.3-8.4L.5 2h7.4l5.1 6.8L18.9 2zm-1.3 18h2L7.1 4H4.9l12.7 16z"/></svg>`,
    },
    {
      id: "youtube",
      label: "YouTube",
      href: "https://youtube.com/@prvprojects",
      icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.5 31.5 0 0 0 0 12a31.5 31.5 0 0 0 .6 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.5 31.5 0 0 0 24 12a31.5 31.5 0 0 0-.5-5.8zM9.5 15.6V8.4L15.8 12l-6.3 3.6z"/></svg>`,
    },
    {
      id: "linkedin",
      label: "LinkedIn",
      href: "https://linkedin.com/company/prvprojects",
      icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zm1.78 13.02H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z"/></svg>`,
    },
    {
      id: "pinterest",
      label: "Pinterest",
      href: "https://pinterest.com/prvprojects",
      icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 0C5.39 0 0 5.39 0 12.04c0 5.1 3.19 9.44 7.68 11.2-.11-.95-.21-2.41.05-3.45.23-.9 1.5-5.73 1.5-5.73s-.38-.76-.38-1.88c0-1.76 1.02-3.07 2.29-3.07 1.08 0 1.6.81 1.6 1.78 0 1.08-.69 2.69-1.04 4.18-.29 1.25.62 2.27 1.85 2.27 2.22 0 3.93-2.34 3.93-5.72 0-2.99-2.15-5.08-5.22-5.08-3.56 0-5.65 2.67-5.65 5.43 0 1.08.42 2.24.94 2.87.1.12.12.23.09.36-.1.4-.33 1.25-.37 1.42-.06.23-.2.28-.46.17-1.71-.8-2.78-3.31-2.78-5.33 0-4.34 3.15-8.33 9.09-8.33 4.77 0 8.48 3.4 8.48 7.95 0 4.74-2.99 8.56-7.14 8.56-1.39 0-2.7-.72-3.15-1.57l-.86 3.28c-.31 1.19-1.15 2.68-1.71 3.59 1.29.4 2.65.62 4.07.62C18.61 24.08 24 18.69 24 12.04 24 5.39 18.69 0 12.04 0z\"/></svg>`,
    },
  ];

  const socialMore = [
    {
      id: "tiktok",
      label: "TikTok",
      href: "https://tiktok.com/@prvprojects",
      icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 1 1-2.89-2.89c.28 0 .55.04.81.12V9.45a6.34 6.34 0 1 0 5.04 6.18V8.68a8.18 8.18 0 0 0 4.26 1.19V6.47a4.85 4.85 0 0 1-1-.78z"/></svg>`,
    },
    {
      id: "behance",
      label: "Behance",
      href: "https://behance.net/prvprojects",
      icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M22 7h-7V5h7v2zm1.77 8.76c-.36 2.43-2.28 4.09-4.87 4.09-3.28 0-5.5-2.5-5.5-6.1S15.62 7.5 18.7 7.5c2.45 0 4.1 1.17 4.78 3.24h-3.5c-.33-.9-1-1.36-1.95-1.36-1.38 0-2.2 1.12-2.32 3.05h6.4c.05.4.07.8.07 1.23zM0 5h6.5c4 0 6.2 2.1 6.2 5.35 0 2.05-1 3.65-2.75 4.3C11.8 16.5 13.5 19 17 19H24v-2.5h-5.8c-2.5 0-3.9-1.4-4.2-3.9H0V5zm6.2 7.5c-2.1 0-3.2-1.2-3.2-3.3S4.1 6 6.2 6H4.5v6.5h1.7z"/></svg>`,
    },
  ];

  function socialLink(item, extra = false) {
    return `<a href="${item.href}" class="social-icon${extra ? " social-icon--extra" : ""}" target="_blank" rel="noopener noreferrer" aria-label="${item.label}" title="${item.label}">${item.icon}</a>`;
  }

  const primaryHtml = socialPrimary.map((s) => socialLink(s)).join("");
  const moreHtml = socialMore.map((s) => socialLink(s, true)).join("");

  const footer = document.getElementById("site-footer");
  if (!footer) return;

  footer.className = "footer glass-panel";
  footer.dataset.reveal = "";
  footer.innerHTML = `
    <div class="footer-shell">
      <div class="footer-grid-top">
        <div class="footer-brand">
          <a href="${base}/index.html#hero" class="footer-logo">PRV <span>Projects</span></a>
          <p class="footer-tagline" data-i18n="footer.tagline">Partenerul tău pentru renovări interioare premium. Bruxelles și împrejurimi.</p>
        </div>
        <div class="footer-newsletter-col">
          <span class="footer-heading" data-i18n="footer.newsletter.title">Newsletter</span>
          <p class="footer-newsletter-desc" data-i18n="footer.newsletter.desc">Insight-uri design, proiecte noi și oferte — o dată pe lună, fără spam.</p>
          <form class="footer-newsletter-form" id="footer-newsletter" name="newsletter" method="POST" data-netlify="true" netlify-honeypot="bot-field" novalidate>
            <input type="hidden" name="form-name" value="newsletter" />
            <p class="hidden" aria-hidden="true"><input name="bot-field" tabindex="-1" autocomplete="off" /></p>
            <div class="footer-newsletter-row glass-inset">
              <input type="email" name="email" required autocomplete="email" data-i18n-placeholder="footer.newsletter.placeholder" placeholder="email@exemplu.ro" aria-label="Email newsletter" />
              <button type="submit" class="btn btn-primary" data-i18n="footer.newsletter.btn">Abonează-te</button>
            </div>
            <p class="footer-newsletter-note" data-i18n="footer.newsletter.privacy">Prin abonare accepți comunicări de la PRV Projects. Dezabonare oricând.</p>
            <p class="footer-newsletter-msg" id="newsletter-msg" role="status" hidden></p>
          </form>
        </div>
        <div class="footer-col footer-nav-col">
          <span class="footer-heading" data-i18n="footer.explore">Explorează</span>
          <nav class="footer-links" aria-label="Footer">
            <a href="${base}/servicii.html" data-i18n="nav.services">Servicii</a>
            <a href="${base}/proiecte.html" data-i18n="nav.work">Proiecte</a>
            <a href="${base}/de-ce-noi.html" data-i18n="footer.why">De ce noi</a>
            <a href="${base}/blog/index.html" data-i18n="nav.blog">Blog</a>
            <a href="${base}/despre-noi.html" data-i18n="nav.about">Despre noi</a>
            <a href="${base}/contact.html" data-i18n="nav.contact">Contact</a>
          </nav>
          <a href="mailto:hello@prvprojects.be" class="footer-email">hello@prvprojects.be</a>
        </div>
      </div>
      <div class="footer-social-row">
        <span class="footer-heading" data-i18n="footer.follow">Urmărește-ne</span>
        <div class="footer-social" data-social-root>
          <div class="social-primary">${primaryHtml}</div>
          ${
            socialMore.length
              ? `<div class="social-more-wrap">
                  <div class="social-more-panel social-more-panel--inline glass-inset">
                    ${moreHtml}
                  </div>
                </div>`
              : ""
          }
        </div>
      </div>
      <div class="footer-meta">
        <span class="footer-copy">© <span class="footer-year"></span> PRV Projects · <span data-i18n="footer.craft">Renovări care durează</span></span>
      </div>
    </div>
  `;

  const yearEl = footer.querySelector(".footer-year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // no dropdown behavior; all icons visible inline

  const newsletterForm = footer.querySelector("#footer-newsletter");
  const newsletterMsg = footer.querySelector("#newsletter-msg");

  newsletterForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const input = newsletterForm.querySelector('input[type="email"]');
    const btn = newsletterForm.querySelector("button[type=submit]");
    const email = input?.value?.trim();

    if (!email || !input.checkValidity()) {
      showNewsletterMsg("error");
      input?.focus();
      return;
    }

    btn.disabled = true;
    try {
      if (window.PRV_NEWSLETTER) {
        await window.PRV_NEWSLETTER.subscribe(email);
      } else {
        const subs = JSON.parse(localStorage.getItem("prv-newsletter") || "[]");
        if (!subs.includes(email)) subs.push(email);
        localStorage.setItem("prv-newsletter", JSON.stringify(subs));
      }
      input.value = "";
      showNewsletterMsg("success");
    } catch {
      showNewsletterMsg("error");
    }
    setTimeout(() => {
      btn.disabled = false;
      if (newsletterMsg.classList.contains("is-success")) newsletterMsg.hidden = true;
    }, 5000);
  });

  function showNewsletterMsg(type) {
    const strings = window.PRV_I18N?.strings || {};
    newsletterMsg.hidden = false;
    newsletterMsg.className = `footer-newsletter-msg is-${type}`;
    newsletterMsg.textContent =
      type === "success"
        ? strings["footer.newsletter.success"] || "Mulțumim! Ești abonat."
        : strings["footer.newsletter.error"] || "Introdu un email valid.";
  }

  window.dispatchEvent(new CustomEvent("prv:footer-ready"));
})();
