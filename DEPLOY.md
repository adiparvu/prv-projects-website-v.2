# Deploy permanent — PRV Projects (#1)

## Varianta A: GitHub Pages (recomandat)

1. **https://github.com/adiparvu/prv-projects-website-v.2/settings/pages**
2. Source: **Deploy from a branch**
3. Branch: **`gh-pages`** · Folder: **`/ (root)`**
4. Save

**URL live:** https://adiparvu.github.io/prv-projects-website-v.2/

Deploy automat la fiecare `git push` pe `main` (workflow GitHub Actions).

---

## Varianta B: Netlify (2 minute)

1. **https://app.netlify.com/drop**
2. Trage folderul proiectului (sau conectează repo GitHub)
3. Primești `https://nume.netlify.app`

Newsletter Netlify Forms: formularul din footer are `data-netlify="true"` — funcționează automat pe Netlify.

---

## Configurare (#2 Newsletter + #9 Analytics)

Editează **`js/site-config.js`**:

```javascript
window.PRV_CONFIG = {
  gaMeasurementId: "G-XXXXXXXXXX",  // Google Analytics 4
  newsletter: {
    provider: "formspree",          // sau "mailchimp" | "netlify" | "local"
    formspreeId: "abcdefgh",        // de la formspree.io/f/abcdefgh
  },
  siteUrl: "https://site-ul-tau.netlify.app",
};
```

### Formspree (newsletter gratuit)
1. https://formspree.io → New form
2. Copiază ID-ul din URL `https://formspree.io/f/ID`
3. Pune în `formspreeId`

### Mailchimp
1. Audience → Signup forms → Embedded forms
2. Copiază `action="..."` URL în `mailchimpAction`
3. `provider: "mailchimp"`

### Google Analytics
1. https://analytics.google.com → Admin → Data Streams → Measurement ID
2. Pune `G-XXXXXXXX` în `gaMeasurementId`
3. Analytics se încarcă **doar după** accept cookies (#6)

---

## Fișiere importante

| Fișier | Rol |
|--------|-----|
| `js/site-config.js` | GA + newsletter |
| `js/cookies.js` | Banner GDPR |
| `js/analytics.js` | GA cu consimțământ |
| `blog/` | Articole blog |
