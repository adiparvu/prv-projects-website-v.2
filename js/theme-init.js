/**
 * PRV Projects — aplică tema înainte de paint (evită flash)
 * Implicit: light pentru vizitatori noi
 */
(function () {
  const STORAGE_KEY = "prv-theme";
  const preference = localStorage.getItem(STORAGE_KEY) || "light";
  const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const effective =
    preference === "system" ? (systemDark ? "dark" : "light") : preference;

  const root = document.documentElement;
  if (preference === "system") root.removeAttribute("data-theme");
  else root.setAttribute("data-theme", preference);

  root.setAttribute("data-effective-theme", effective);
  root.style.colorScheme = effective;
})();
