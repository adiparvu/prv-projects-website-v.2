#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { shopI18n, langOverrides } from "./shop-i18n-data.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "../js/translations/shop");
const codes = ["ro", "en", "nl", "fr", "de", "pl", "es", "it", "tr", "ar", "ru", "uk"];

fs.mkdirSync(outDir, { recursive: true });

for (const code of codes) {
  let strings = shopI18n[code] || { ...shopI18n.en, ...(langOverrides[code] || {}) };
  if (shopI18n[code] && langOverrides[code]) {
    strings = { ...strings, ...langOverrides[code] };
  }
  fs.writeFileSync(path.join(outDir, `${code}.json`), JSON.stringify(strings, null, 2) + "\n");
  console.log("wrote", code, Object.keys(strings).length, "keys");
}
