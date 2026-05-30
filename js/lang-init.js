/**
 * PRV Projects — aplică limba înainte de paint (evită flash)
 * Limba principală: NL
 */
(function () {
  const STORAGE_LANG = "prv-lang";
  const DEFAULT_LANG = "nl";
  const CODES = ["nl", "en", "ro", "fr", "de", "pl", "es", "it", "tr", "ar", "ru", "uk"];
  const RTL = { ar: true };

  let lang = localStorage.getItem(STORAGE_LANG);
  if (!lang || !CODES.includes(lang)) {
    const browser = (navigator.language || "").toLowerCase();
    lang = CODES.find((c) => browser.startsWith(c)) || DEFAULT_LANG;
  }

  const root = document.documentElement;
  root.lang = lang;
  root.dir = RTL[lang] ? "rtl" : "ltr";
})();
