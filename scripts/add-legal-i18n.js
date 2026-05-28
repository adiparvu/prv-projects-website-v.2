/**
 * One-off: merge FAQ + privacy i18n into all locale files
 */
const fs = require("fs");
const path = require("path");

const packs = {
  ro: {
    "footer.faq": "FAQ",
    "footer.privacy": "Confidențialitate",
    "faq.title": "Întrebări frecvente",
    "faq.sub": "Răspunsuri despre cost, termene, garanții și cum lucrăm în Belgia.",
    "faq.q1": "Cât costă o renovare completă?",
    "faq.a1":
      "Depinde de suprafață, stare, materiale și oraș. Ca orientare, în Belgia renovările complete de calitate premium pornesc adesea de la 800–1.400 €/m². Primești un deviz detaliat pe categorii înainte de semnarea contractului.",
    "faq.q2": "Cât durează un proiect tipic?",
    "faq.a2":
      "Un apartament de 60–90 m²: aproximativ 8–14 săptămâni. Case mai mari sau finisaje speciale pot ajunge la 4–6 luni. Termenul agreat este trecut în contract.",
    "faq.q3": "Lucrați doar în Bruxelles?",
    "faq.a3":
      "Nu. Acoperim Belgia — Bruxelles, Antwerpen, Gent, Brugge, Leuven, Liège, Namur, Charleroi, Mechelen, Hasselt, Mons și împrejurimi.",
    "faq.q4": "Oferta este gratuită?",
    "faq.a4":
      "Da. Vizionarea și estimarea orientativă sunt gratuite, fără obligații. Devizul detaliat urmează după măsurători și plan clar.",
    "faq.q5": "Ce garanții oferiți?",
    "faq.a5":
      "Garanție decennală pentru lucrări structurale conform legislației belgiene, plus 2 ani pe finisaje. Documentația este predată la recepție.",
    "faq.q6": "Bugetul poate rămâne fix?",
    "faq.a6":
      "Da — după aprobarea planurilor lucrăm cu deviz pe categorii și preț fix. Orice modificare este estimată și aprobată înainte de execuție.",
    "faq.q7": "Cine supervizează șantierul?",
    "faq.a7":
      "Un șef de șantier dedicat — un singur responsabil. Primești raport zilnic cu poze, de obicei pe WhatsApp sau email.",
    "faq.q8": "Cum începem colaborarea?",
    "faq.a8":
      "Trimite plan, schiță sau poze prin formularul de contact sau la hello@prvprojects.be. Răspundem în 24h cu pașii următori.",
    "faq.cta": "Nu găsești răspunsul?",
    "privacy.title": "Politica de confidențialitate",
    "privacy.updated": "Ultima actualizare: mai 2026",
    "privacy.intro":
      "PRV Projects respectă Regulamentul (UE) 2016/679 (GDPR) și legislația belgiană privind protecția datelor cu caracter personal.",
    "privacy.s1.title": "1. Operator de date",
    "privacy.s1.body":
      "Operator: PRV Projects — renovări interioare în Belgia. Pentru orice solicitare privind datele personale: hello@prvprojects.be.",
    "privacy.s2.title": "2. Ce date colectăm",
    "privacy.s2.body":
      "Date din formulare (nume, email, telefon, oraș, detalii proiect); email la abonarea newsletter; date tehnice (IP, browser, pagini vizitate) prin cookies esențiale sau, cu consimțământul tău, prin analytics.",
    "privacy.s3.title": "3. Scopuri și temei legal",
    "privacy.s3.body":
      "Răspuns la cereri de ofertă, încheierea și executarea contractului, comunicări comerciale cu acordul tău, securitatea site-ului și îmbunătățirea experienței (analytics doar cu consimțământ). Temeiuri: măsuri precontractuale, contract, interes legitim, consimțământ unde este necesar.",
    "privacy.s4.title": "4. Cookies",
    "privacy.s4.body":
      "Cookies esențiale: funcționarea site-ului, limba și tema. Analytics (ex. Google Analytics): doar dacă alegi „Accept toate” în banner. Poți retrage consimțământul din setările browserului sau refuzând la prima vizită.",
    "privacy.s5.title": "5. Destinatari",
    "privacy.s5.body":
      "Furnizori de hosting, formulare (ex. FormSubmit), email și, dacă este cazul, servicii contabile sau juridice. Nu vindem datele tale. Transferurile în afara SEE se fac doar cu garanții adecvate, dacă este necesar.",
    "privacy.s6.title": "6. Durata păstrării",
    "privacy.s6.body":
      "Cereri fără contract: până la 24 de luni. Date contractuale: durata colaborării plus termenele legale de arhivare. Newsletter: până la dezabonare.",
    "privacy.s7.title": "7. Drepturile tale",
    "privacy.s7.body":
      "Acces, rectificare, ștergere, restricționare, portabilitate, opoziție, retragerea consimțământului și plângere la Autoritatea de protecție a datelor (APD/GBA) din Belgia. Contact: hello@prvprojects.be — răspundem în maximum 30 de zile.",
    "privacy.s8.title": "8. Modificări",
    "privacy.s8.body":
      "Putem actualiza această politică. Versiunea aplicabilă este cea publicată pe această pagină, cu data indicată mai sus.",
    "privacy.linkFaq": "Întrebări frecvente (FAQ)",
  },
  en: {
    "footer.faq": "FAQ",
    "footer.privacy": "Privacy",
    "faq.title": "Frequently asked questions",
    "faq.sub": "Answers on cost, timelines, warranties and how we work in Belgium.",
    "faq.q1": "How much does a full renovation cost?",
    "faq.a1":
      "It depends on size, condition, materials and location. As a guide, premium full renovations in Belgium often start around €800–1,400/m². You receive a detailed quote by category before signing.",
    "faq.q2": "How long does a typical project take?",
    "faq.a2":
      "A 60–90 m² apartment: roughly 8–14 weeks. Larger homes or special finishes can take 4–6 months. The agreed deadline is written into the contract.",
    "faq.q3": "Do you only work in Brussels?",
    "faq.a3":
      "No. We cover Belgium — Brussels, Antwerp, Ghent, Bruges, Leuven, Liège, Namur, Charleroi, Mechelen, Hasselt, Mons and surrounding areas.",
    "faq.q4": "Is the quote free?",
    "faq.a4":
      "Yes. The site visit and ballpark estimate are free with no obligation. A detailed quote follows measurements and a clear plan.",
    "faq.q5": "What warranties do you offer?",
    "faq.a5":
      "Ten-year warranty on structural work under Belgian law, plus 2 years on finishes. Documentation is handed over at completion.",
    "faq.q6": "Can the budget stay fixed?",
    "faq.a6":
      "Yes — once plans are approved we work with a categorized quote and fixed price. Any change is estimated and approved before work proceeds.",
    "faq.q7": "Who supervises the site?",
    "faq.a7":
      "A dedicated site manager — one point of contact. You get a daily update with photos, usually via WhatsApp or email.",
    "faq.q8": "How do we get started?",
    "faq.a8":
      "Send plans, sketches or photos via the contact form or hello@prvprojects.be. We reply within 24 hours with next steps.",
    "faq.cta": "Can't find your answer?",
    "privacy.title": "Privacy policy",
    "privacy.updated": "Last updated: May 2026",
    "privacy.intro":
      "PRV Projects complies with Regulation (EU) 2016/679 (GDPR) and Belgian data protection law.",
    "privacy.s1.title": "1. Data controller",
    "privacy.s1.body":
      "Controller: PRV Projects — premium interior renovations in Belgium. Privacy requests: hello@prvprojects.be.",
    "privacy.s2.title": "2. Data we collect",
    "privacy.s2.body":
      "Form data (name, email, phone, city, project details); newsletter email; technical data (IP, browser, pages viewed) via essential cookies or, with your consent, analytics.",
    "privacy.s3.title": "3. Purposes and legal basis",
    "privacy.s3.body":
      "Responding to quote requests, performing contracts, marketing with your consent, site security and experience improvement (analytics only with consent). Bases: pre-contract steps, contract, legitimate interest, consent where required.",
    "privacy.s4.title": "4. Cookies",
    "privacy.s4.body":
      "Essential cookies: site operation, language and theme. Analytics (e.g. Google Analytics): only if you choose “Accept all” in the banner. You can withdraw consent via browser settings or on first visit.",
    "privacy.s5.title": "5. Recipients",
    "privacy.s5.body":
      "Hosting, form providers (e.g. FormSubmit), email services and, where needed, accounting or legal advisers. We do not sell your data. Transfers outside the EEA use appropriate safeguards if required.",
    "privacy.s6.title": "6. Retention",
    "privacy.s6.body":
      "Quotes without contract: up to 24 months. Contract data: duration of the project plus legal archiving periods. Newsletter: until you unsubscribe.",
    "privacy.s7.title": "7. Your rights",
    "privacy.s7.body":
      "Access, rectification, erasure, restriction, portability, objection, withdrawal of consent and complaint to the Belgian Data Protection Authority (APD/GBA). Contact hello@prvprojects.be — we respond within 30 days.",
    "privacy.s8.title": "8. Changes",
    "privacy.s8.body":
      "We may update this policy. The current version is the one published on this page with the date above.",
    "privacy.linkFaq": "Frequently asked questions (FAQ)",
  },
  nl: {
    "footer.faq": "FAQ",
    "footer.privacy": "Privacy",
    "faq.title": "Veelgestelde vragen",
    "faq.sub": "Antwoorden over kosten, termijnen, garanties en hoe we werken in België.",
    "faq.q1": "Wat kost een volledige renovatie?",
    "faq.a1":
      "Dat hangt af van oppervlakte, staat, materialen en locatie. Richtprijs: premium renovaties in België vaak vanaf €800–1.400/m². Gedetailleerde offerte vóór ondertekening.",
    "faq.q2": "Hoe lang duurt een typisch project?",
    "faq.a2": "Appartement 60–90 m²: ongeveer 8–14 weken. Grotere woningen: 4–6 maanden. Deadline staat in het contract.",
    "faq.q3": "Werken jullie alleen in Brussel?",
    "faq.a3": "Nee. Heel België — Brussel, Antwerpen, Gent, Brugge, Leuven, Luik, Namen, Charleroi, Mechelen, Hasselt, Bergen en omgeving.",
    "faq.q4": "Is de offerte gratis?",
    "faq.a4": "Ja. Bezoek en richtprijs zijn gratis en vrijblijvend. Gedetailleerde offerte na opmeting.",
    "faq.q5": "Welke garanties bieden jullie?",
    "faq.a5": "Tien jaar op structureel werk (Belgische wet), plus 2 jaar op afwerking. Documentatie bij oplevering.",
    "faq.q6": "Kan het budget vast blijven?",
    "faq.a6": "Ja — na goedkeuring van plannen vaste prijs per categorie. Wijzigingen alleen na goedkeuring.",
    "faq.q7": "Wie volgt de werf op?",
    "faq.a7": "Een vaste werfleider. Dagelijkse update met foto's via WhatsApp of e-mail.",
    "faq.q8": "Hoe starten we?",
    "faq.a8": "Stuur plannen of foto's via het contactformulier of hello@prvprojects.be. Antwoord binnen 24 uur.",
    "faq.cta": "Geen antwoord gevonden?",
    "privacy.title": "Privacybeleid",
    "privacy.updated": "Laatst bijgewerkt: mei 2026",
    "privacy.intro": "PRV Projects respecteert de GDPR en de Belgische privacywetgeving.",
    "privacy.s1.title": "1. Verwerkingsverantwoordelijke",
    "privacy.s1.body": "PRV Projects — renovaties in België. Privacy: hello@prvprojects.be.",
    "privacy.s2.title": "2. Welke gegevens",
    "privacy.s2.body": "Formuliergegevens, nieuwsbrief-e-mail, technische gegevens via cookies (analytics alleen met toestemming).",
    "privacy.s3.title": "3. Doeleinden",
    "privacy.s3.body": "Offertes, contractuitvoering, marketing met toestemming, siteverbetering. Rechtsgronden: contract, toestemming, gerechtvaardigd belang.",
    "privacy.s4.title": "4. Cookies",
    "privacy.s4.body": "Essentieel voor de site. Analytics alleen bij „Alles accepteren”.",
    "privacy.s5.title": "5. Ontvangers",
    "privacy.s5.body": "Hosting, formulieren, e-mail. Geen verkoop van gegevens.",
    "privacy.s6.title": "6. Bewaring",
    "privacy.s6.body": "Offertes: tot 24 maanden. Contract: wettelijke termijnen. Nieuwsbrief: tot uitschrijving.",
    "privacy.s7.title": "7. Uw rechten",
    "privacy.s7.body": "Inzage, rectificatie, wissing, bezwaar, klacht bij GBA/APD. hello@prvprojects.be — binnen 30 dagen.",
    "privacy.s8.title": "8. Wijzigingen",
    "privacy.s8.body": "Dit beleid kan worden bijgewerkt. De actuele versie staat op deze pagina.",
    "privacy.linkFaq": "Veelgestelde vragen (FAQ)",
  },
  fr: {
    "footer.faq": "FAQ",
    "footer.privacy": "Confidentialité",
    "faq.title": "Questions fréquentes",
    "faq.sub": "Coûts, délais, garanties et notre façon de travailler en Belgique.",
    "faq.q1": "Combien coûte une rénovation complète ?",
    "faq.a1": "Selon surface, état et matériaux. En Belgique, souvent à partir de 800–1 400 €/m² en qualité premium. Devis détaillé avant signature.",
    "faq.q2": "Quelle est la durée d'un projet ?",
    "faq.a2": "Appartement 60–90 m² : environ 8–14 semaines. Maisons plus grandes : 4–6 mois. Délai fixé au contrat.",
    "faq.q3": "Travaillez-vous uniquement à Bruxelles ?",
    "faq.a3": "Non. Toute la Belgique — Bruxelles, Anvers, Gand, Bruges, Louvain, Liège, Namur, Charleroi, Malines, Hasselt, Mons et environs.",
    "faq.q4": "Le devis est-il gratuit ?",
    "faq.a4": "Oui. Visite et estimation gratuites, sans engagement.",
    "faq.q5": "Quelles garanties ?",
    "faq.a5": "Garantie décennale (structure) + 2 ans sur finitions, conformément au droit belge.",
    "faq.q6": "Budget fixe possible ?",
    "faq.a6": "Oui, après validation des plans. Toute modification est chiffrée et approuvée avant travaux.",
    "faq.q7": "Qui supervise le chantier ?",
    "faq.a7": "Un chef de chantier dédié. Rapport quotidien avec photos.",
    "faq.q8": "Comment commencer ?",
    "faq.a8": "Envoyez plans ou photos via le formulaire ou hello@prvprojects.be. Réponse sous 24 h.",
    "faq.cta": "Pas trouvé votre réponse ?",
    "privacy.title": "Politique de confidentialité",
    "privacy.updated": "Dernière mise à jour : mai 2026",
    "privacy.intro": "PRV Projects respecte le RGPD et la loi belge sur la protection des données.",
    "privacy.s1.title": "1. Responsable du traitement",
    "privacy.s1.body": "PRV Projects — rénovations en Belgique. Contact : hello@prvprojects.be.",
    "privacy.s2.title": "2. Données collectées",
    "privacy.s2.body": "Formulaires, newsletter, cookies essentiels ou analytics (avec consentement).",
    "privacy.s3.title": "3. Finalités",
    "privacy.s3.body": "Devis, contrat, communication marketing (avec accord), amélioration du site.",
    "privacy.s4.title": "4. Cookies",
    "privacy.s4.body": "Essentiels pour le site. Analytics si vous cliquez « Tout accepter ».",
    "privacy.s5.title": "5. Destinataires",
    "privacy.s5.body": "Hébergement, formulaires, e-mail. Pas de vente de données.",
    "privacy.s6.title": "6. Conservation",
    "privacy.s6.body": "Devis : 24 mois max. Contrat : durée légale. Newsletter : jusqu'à désinscription.",
    "privacy.s7.title": "7. Vos droits",
    "privacy.s7.body": "Accès, rectification, effacement, opposition, plainte à l'APD. hello@prvprojects.be — 30 jours.",
    "privacy.s8.title": "8. Modifications",
    "privacy.s8.body": "Politique mise à jour sur cette page.",
    "privacy.linkFaq": "Questions fréquentes (FAQ)",
  },
};

const extend = {
  de: {
    "footer.faq": "FAQ",
    "footer.privacy": "Datenschutz",
    "faq.title": "Häufige Fragen",
    "faq.sub": "Kosten, Termine, Garantien und unsere Arbeitsweise in Belgien.",
    "faq.q1": "Was kostet eine Komplettrenovierung?",
    "faq.a1": "Abhängig von Fläche, Zustand und Material. Richtwert in Belgien oft ab 800–1.400 €/m². Detailliertes Angebot vor Vertrag.",
    "faq.q2": "Wie lange dauert ein Projekt?",
    "faq.a2": "Wohnung 60–90 m²: ca. 8–14 Wochen. Größere Häuser: 4–6 Monate. Frist im Vertrag.",
    "faq.q3": "Nur in Brüssel?",
    "faq.a3": "Nein — ganz Belgien: Brüssel, Antwerpen, Gent, Brügge, Löwen, Lüttich, Namur, Charleroi, Mechelen, Hasselt, Mons.",
    "faq.q4": "Ist das Angebot kostenlos?",
    "faq.a4": "Ja. Besichtigung und Schätzung unverbindlich.",
    "faq.q5": "Welche Garantien?",
    "faq.a5": "Zehn Jahre strukturell (belgisches Recht), 2 Jahre auf Ausführung.",
    "faq.q6": "Festes Budget?",
    "faq.a6": "Ja nach Planfreigabe. Änderungen nur nach Freigabe.",
    "faq.q7": "Wer leitet die Baustelle?",
    "faq.a7": "Fester Bauleiter. Täglicher Fotobericht.",
    "faq.q8": "Wie starten wir?",
    "faq.a8": "Pläne oder Fotos an hello@prvprojects.be — Antwort in 24 h.",
    "faq.cta": "Keine Antwort gefunden?",
    "privacy.title": "Datenschutzerklärung",
    "privacy.updated": "Stand: Mai 2026",
    "privacy.intro": "PRV Projects hält GDPR und belgisches Datenschutzrecht ein.",
    "privacy.s1.title": "1. Verantwortlicher",
    "privacy.s1.body": "PRV Projects, Belgien. hello@prvprojects.be",
    "privacy.s2.title": "2. Erhobene Daten",
    "privacy.s2.body": "Formulardaten, Newsletter, technische Cookies (Analytics nur mit Einwilligung).",
    "privacy.s3.title": "3. Zwecke",
    "privacy.s3.body": "Angebote, Vertrag, Marketing mit Einwilligung, Website.",
    "privacy.s4.title": "4. Cookies",
    "privacy.s4.body": "Essenziell für den Betrieb. Analytics nur bei „Alle akzeptieren“.",
    "privacy.s5.title": "5. Empfänger",
    "privacy.s5.body": "Hosting, Formulare, E-Mail. Kein Verkauf von Daten.",
    "privacy.s6.title": "6. Speicherung",
    "privacy.s6.body": "Angebote bis 24 Monate. Vertrag: gesetzliche Fristen.",
    "privacy.s7.title": "7. Ihre Rechte",
    "privacy.s7.body": "Auskunft, Löschung, Widerspruch, Beschwerde bei APD. hello@prvprojects.be",
    "privacy.s8.title": "8. Änderungen",
    "privacy.s8.body": "Aktuelle Fassung auf dieser Seite.",
    "privacy.linkFaq": "FAQ",
  },
};

Object.assign(packs, extend);

// pl, es, it, tr, ar, ru, uk - assign from en base then override titles
const codes = ["pl", "es", "it", "tr", "ar", "ru", "uk"];
const titles = {
  pl: { faq: "Najczęstsze pytania", privacy: "Polityka prywatności", footerP: "Prywatność" },
  es: { faq: "Preguntas frecuentes", privacy: "Política de privacidad", footerP: "Privacidad" },
  it: { faq: "Domande frequenti", privacy: "Informativa sulla privacy", footerP: "Privacy" },
  tr: { faq: "Sık sorulan sorular", privacy: "Gizlilik politikası", footerP: "Gizlilik" },
  ar: { faq: "الأسئلة الشائعة", privacy: "سياسة الخصوصية", footerP: "الخصوصية" },
  ru: { faq: "Частые вопросы", privacy: "Политика конфиденциальности", footerP: "Конфиденциальность" },
  uk: { faq: "Поширені запитання", privacy: "Політика конфіденційності", footerP: "Конфіденційність" },
};

for (const code of codes) {
  packs[code] = { ...packs.en };
  packs[code]["faq.title"] = titles[code].faq;
  packs[code]["privacy.title"] = titles[code].privacy;
  packs[code]["footer.privacy"] = titles[code].footerP;
  packs[code]["footer.faq"] = "FAQ";
}

const dir = path.join(__dirname, "../js/translations");
for (const [code, patch] of Object.entries(packs)) {
  const file = path.join(dir, `${code}.json`);
  const data = JSON.parse(fs.readFileSync(file, "utf8"));
  Object.assign(data, patch);
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + "\n");
  console.log("merged", code);
}
