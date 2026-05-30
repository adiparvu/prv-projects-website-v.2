/** Full site UI strings — nl, fr, de, pl, es, it, tr, ar, ru, uk */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const { legalPacks } = require("./site-i18n-legal-packs.cjs");

const dataDir = path.join(__dirname, "locale-data");
const codes = ["nl", "fr", "de", "pl", "es", "it", "tr", "ar", "ru", "uk"];
const overrides = JSON.parse(
  fs.readFileSync(path.join(dataDir, "overrides.json"), "utf8")
);

function load(code) {
  const file = path.join(dataDir, `${code}.json`);
  const data = JSON.parse(fs.readFileSync(file, "utf8"));
  const legalKeys = new Set(Object.keys(legalPacks[code] || {}));
  for (const k of legalKeys) delete data[k];
  Object.assign(data, overrides[code] || {});
  return data;
}

export const siteLocales = Object.fromEntries(codes.map((c) => [c, load(c)]));
