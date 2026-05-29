#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { catalogLocales } from "./shop-catalog-i18n-data.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "../data/shop/i18n");

fs.mkdirSync(outDir, { recursive: true });

for (const [lang, data] of Object.entries(catalogLocales)) {
  const keyCount =
    Object.keys(data.categories || {}).length +
    Object.keys(data.products || {}).length +
    Object.keys(data.reviews || {}).length;
  fs.writeFileSync(path.join(outDir, `${lang}.json`), JSON.stringify(data, null, 2) + "\n");
  console.log("wrote", lang, keyCount, "keys");
}
