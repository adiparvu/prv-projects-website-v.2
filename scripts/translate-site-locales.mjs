#!/usr/bin/env node
/**
 * Generate full site locale JSON files by translating en.json (batch API).
 * Preserves placeholders {n}, brand names, emails, city names where possible.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const en = JSON.parse(fs.readFileSync(path.join(root, "js/translations/en.json"), "utf8"));
const keys = Object.keys(en);

const LANGS = {
  nl: "nl",
  fr: "fr",
  de: "de",
  pl: "pl",
  es: "es",
  it: "it",
  tr: "tr",
  ar: "ar",
  ru: "ru",
  uk: "uk",
};

const KEEP_LITERAL = [
  "PRV Projects",
  "PRV",
  "hello@prvprojects.be",
  "WhatsApp",
  "FormSubmit",
  "Google Analytics",
  "GDPR",
  "DALI",
  "IT",
  "FAQ",
  "Shop",
  "Blog",
  "NEWSLETTER",
  "Scroll",
  "Maria D.",
  "Thomas V.",
  "Andrei & Ioana",
  "Adrian P.",
  "Mihai R.",
  "Andreea M.",
  "Bianca T.",
  "Ixelles",
  "Uccle",
  "Saint-Gilles",
  "Sint-Gillis",
  "APD/GBA",
  "APD",
  "GBA",
  "EEA",
  "SEE",
  "EOG",
  "€",
  "m²",
];

function protectTerms(text) {
  const tokens = [];
  let out = text;
  KEEP_LITERAL.forEach((term, i) => {
    const ph = `\uE000${i}\uE001`;
    if (out.includes(term)) {
      tokens.push({ ph, term });
      out = out.split(term).join(ph);
    }
  });
  return { out, tokens };
}

function restoreTerms(text, tokens) {
  let out = text;
  for (const { ph, term } of tokens) out = out.split(ph).join(term);
  return out;
}

async function translateBatch(texts, target) {
  if (!texts.length) return [];
  const joined = texts.map((t) => t.replace(/\n/g, " \\n ")).join("\n\u241E\n");
  const { out, tokens } = protectTerms(joined);
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${target}&dt=t&q=${encodeURIComponent(out)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`translate ${target} ${res.status}`);
  const data = await res.json();
  const translated = data[0].map((x) => x[0]).join("");
  const parts = restoreTerms(translated, tokens)
    .split("\u241E")
    .map((s) => s.replace(/ \\n /g, "\n").trim());
  if (parts.length !== texts.length) {
    // fallback single
    const results = [];
    for (const t of texts) {
      await new Promise((r) => setTimeout(r, 120));
      const u = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${target}&dt=t&q=${encodeURIComponent(protectTerms(t).out)}`;
      const rr = await fetch(u);
      const dd = await rr.json();
      results.push(restoreTerms(dd[0].map((x) => x[0]).join(""), protectTerms(t).tokens));
    }
    return results;
  }
  return parts;
}

async function buildLocale(code, tl) {
  const out = {};
  const batchSize = 40;
  const entries = keys.map((k) => [k, en[k]]);
  for (let i = 0; i < entries.length; i += batchSize) {
    const slice = entries.slice(i, i + batchSize);
    const vals = slice.map(([, v]) => v || "");
    const translated = await translateBatch(vals, tl);
    slice.forEach(([k], j) => {
      out[k] = translated[j] ?? en[k];
    });
    process.stdout.write(`  ${code}: ${Math.min(i + batchSize, entries.length)}/${entries.length}\r`);
    await new Promise((r) => setTimeout(r, 300));
  }
  console.log(`  ${code}: done ${Object.keys(out).length} keys`);
  // Force nav.shop and key brand labels
  out["nav.shop"] = "Shop";
  if (code === "nl") {
    Object.assign(out, JSON.parse(fs.readFileSync(path.join(__dirname, "locales/nl-manual.json"), "utf8")));
  }
  return out;
}

const outDir = path.join(__dirname, "locale-data");
fs.mkdirSync(outDir, { recursive: true });

// Write NL from manual file first
const nlManual = path.join(__dirname, "locales/nl-manual.json");
if (!fs.existsSync(nlManual)) {
  console.log("Extracting NL from all-translations.mjs...");
  const { nl } = await import("./locales/all-translations.mjs");
  fs.writeFileSync(nlManual, JSON.stringify(nl, null, 2) + "\n");
  fs.writeFileSync(path.join(outDir, "nl.json"), JSON.stringify(nl, null, 2) + "\n");
  console.log("wrote nl.json from manual translations");
}

for (const [code, tl] of Object.entries(LANGS)) {
  if (code === "nl") continue;
  const file = path.join(outDir, `${code}.json`);
  if (fs.existsSync(file)) {
    console.log(`skip ${code} (exists)`);
    continue;
  }
  console.log(`Translating ${code}...`);
  const data = await buildLocale(code, tl);
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + "\n");
}

console.log("All locale-data JSON files ready.");
