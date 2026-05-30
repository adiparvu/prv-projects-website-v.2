#!/usr/bin/env node
/**
 * Generate js/translations/{code}.json from en master + siteLocales overlays.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";
import { siteLocales } from "./site-i18n-locales.mjs";

const require = createRequire(import.meta.url);
const { legalPacks } = require("./site-i18n-legal-packs.cjs");

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const outDir = path.join(root, "js/translations");

const en = JSON.parse(fs.readFileSync(path.join(outDir, "en.json"), "utf8"));
const roExisting = JSON.parse(fs.readFileSync(path.join(outDir, "ro.json"), "utf8"));
const enKeys = Object.keys(en);

const localeCodes = ["nl", "fr", "de", "pl", "es", "it", "tr", "ar", "ru", "uk"];

function buildLocale(code) {
  const overlay = { ...(siteLocales[code] || {}), ...(legalPacks[code] || {}) };
  const out = { ...en, ...overlay };
  for (const k of enKeys) {
    if (!(k in out)) out[k] = en[k];
  }
  const extra = Object.keys(out).filter((k) => !(k in en));
  if (extra.length) {
    console.warn(`  ${code}: dropping ${extra.length} extra keys`);
    for (const k of extra) delete out[k];
  }
  return out;
}

fs.writeFileSync(path.join(outDir, "en.json"), JSON.stringify(en, null, 2) + "\n");
console.log("wrote en", enKeys.length, "keys (unchanged)");

fs.writeFileSync(path.join(outDir, "ro.json"), JSON.stringify(roExisting, null, 2) + "\n");
console.log("wrote ro", Object.keys(roExisting).length, "keys (from existing)");

for (const code of localeCodes) {
  const strings = buildLocale(code);
  const missing = enKeys.filter((k) => !(k in strings));
  if (missing.length) {
    console.error(`${code}: missing ${missing.length} keys after merge`);
    process.exit(1);
  }
  fs.writeFileSync(path.join(outDir, `${code}.json`), JSON.stringify(strings, null, 2) + "\n");
  const sameAsEn = enKeys.filter((k) => strings[k] === en[k]).length;
  console.log(`wrote ${code}`, enKeys.length, "keys,", sameAsEn, "identical to EN");
}
