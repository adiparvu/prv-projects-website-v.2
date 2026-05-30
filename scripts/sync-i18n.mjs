#!/usr/bin/env node
/**
 * PRV — sync i18n keys across all 12 languages (site + shop)
 * Usage: node scripts/sync-i18n.mjs [--write] [--strict]
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const CODES = ["nl", "en", "ro", "fr", "de", "pl", "es", "it", "tr", "ar", "ru", "uk"];
const WRITE = process.argv.includes("--write");
const STRICT = process.argv.includes("--strict");

function readJson(rel) {
  return JSON.parse(fs.readFileSync(path.join(root, rel), "utf8"));
}

function writeJson(rel, data) {
  fs.writeFileSync(path.join(root, rel), JSON.stringify(data, null, 2) + "\n");
}

function syncBundle({ refPath, outDir, label }) {
  const ref = readJson(refPath);
  const refKeys = Object.keys(ref).sort();
  let issues = 0;

  console.log(`\n=== ${label} (${refKeys.length} keys) ===`);

  for (const code of CODES) {
    const file = path.join(outDir, `${code}.json`);
    const rel = path.relative(root, file);
    let data = {};
    if (fs.existsSync(file)) data = JSON.parse(fs.readFileSync(file, "utf8"));

    const missing = refKeys.filter((k) => !(k in data));
    const extra = Object.keys(data).filter((k) => !(k in ref));
    const sameAsEn = code !== "en" && code !== "ro" ? refKeys.filter((k) => data[k] === ref[k]).length : 0;

    if (missing.length || extra.length) {
      console.log(`  ${code}: missing=${missing.length} extra=${extra.length}`);
      if (missing.length) console.log(`    missing: ${missing.slice(0, 8).join(", ")}${missing.length > 8 ? "…" : ""}`);
      issues += missing.length + extra.length;
    } else if (sameAsEn > 50) {
      console.log(`  ${code}: OK keys, ${sameAsEn} identical to EN (needs translation)`);
    } else {
      console.log(`  ${code}: OK`);
    }

    if (WRITE && (missing.length || extra.length)) {
      const next = {};
      for (const k of refKeys) next[k] = k in data ? data[k] : ref[k];
      writeJson(rel, next);
      console.log(`    → wrote ${rel}`);
    }
  }

  return issues;
}

const siteIssues = syncBundle({
  refPath: "js/translations/en.json",
  outDir: path.join(root, "js/translations"),
  label: "Site",
});

const shopIssues = syncBundle({
  refPath: "js/translations/shop/en.json",
  outDir: path.join(root, "js/translations/shop"),
  label: "Shop",
});

const total = siteIssues + shopIssues;
if (STRICT && total > 0) {
  console.error(`\n❌ ${total} key parity issue(s). Run with --write to fix missing keys.`);
  process.exit(1);
}

if (!WRITE && total > 0) {
  console.log("\nTip: node scripts/sync-i18n.mjs --write");
} else {
  console.log("\n✓ Key parity OK");
}
