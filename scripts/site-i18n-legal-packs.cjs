/** Shared FAQ + privacy translation packs for site i18n generation */
const fs = require("fs");
const path = require("path");

function readPacksFromAddLegal() {
  const src = fs.readFileSync(path.join(__dirname, "add-legal-i18n.js"), "utf8");
  const start = src.indexOf("const packs = {");
  const end = src.indexOf("const extend = {");
  const extendStart = end;
  const extendEnd = src.indexOf("Object.assign(packs, extend);");
  const fn = new Function(
    src.slice(start, extendEnd) +
      "Object.assign(packs, extend); return packs;"
  );
  return fn();
}

function readPacksFromNative() {
  const src = fs.readFileSync(path.join(__dirname, "legal-i18n-native.js"), "utf8");
  const start = src.indexOf("const packs = {");
  const end = src.indexOf("const dir = path.join");
  const fn = new Function(src.slice(start, end) + "return packs;");
  return fn();
}

const addLegal = readPacksFromAddLegal();
const native = readPacksFromNative();

const legalPacks = {
  nl: addLegal.nl,
  fr: addLegal.fr,
  de: addLegal.de,
  pl: native.pl,
  es: native.es,
  it: native.it,
  tr: native.tr,
  ar: native.ar,
  ru: native.ru,
  uk: native.uk,
};

module.exports = { legalPacks };
