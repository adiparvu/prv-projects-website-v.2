/**
 * PRV — limbă (stânga) + temă (dreapta) în rândul footer social / contact
 */

import { buildThemePicker, applyTheme } from "./prv-theme-picker.js";

const STORAGE_THEME = "prv-theme";

function purgeChromePickers() {
  document
    .querySelectorAll(
      ".nav-actions #lang-picker, .nav-actions .lang-picker-host, .nav-actions #theme-picker, .nav-actions .theme-picker-host"
    )
    .forEach((el) => {
      el.remove();
    });

  document.querySelector(".shop-bottom-dock")?.remove();

  document.querySelectorAll(".shop-header, .shop-header-wrap, .shop-subnav").forEach((zone) => {
    zone.querySelectorAll(".lang-picker-host, .theme-picker-host, #lang-picker, #theme-picker").forEach((el) => {
      el.remove();
    });
  });
}

function mountFooterLang() {
  const slot = document.getElementById("footer-lang-slot");
  if (!slot || !window.PRV_I18N?.rebuildLangPicker) return;

  let picker = document.getElementById("lang-picker");
  if (picker?.dataset.built === "1" && picker.parentElement === slot) return;

  if (picker && picker.parentElement !== slot) {
    slot.appendChild(picker);
  }

  if (!picker) {
    picker = document.createElement("div");
    picker.id = "lang-picker";
    slot.appendChild(picker);
  }

  picker.className = "lang-picker-host lang-picker-host--minimal footer-lang-picker";
  picker.innerHTML = "";
  window.PRV_I18N.rebuildLangPicker();
  picker.dataset.built = "1";
}

function mountFooterTheme() {
  const slot = document.getElementById("footer-theme-slot");
  if (!slot) return;

  let host = slot.querySelector("#theme-picker");
  if (host?.dataset.built === "1") return;

  if (!host) {
    host = document.createElement("div");
    host.id = "theme-picker";
    host.className = "theme-picker-host theme-picker-host--minimal footer-theme-picker";
    slot.appendChild(host);
  } else if (host.parentElement !== slot) {
    slot.appendChild(host);
  }

  buildThemePicker();
}

/** Montează / mută pickerele în footer (apelat la prv:footer-ready) */
export function mountFooterPickers() {
  purgeChromePickers();
  mountFooterLang();
  mountFooterTheme();
}

document.addEventListener("prv:footer-ready", mountFooterPickers);

function bootFooterPickers() {
  if (document.getElementById("footer-lang-slot")) mountFooterPickers();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bootFooterPickers);
} else {
  bootFooterPickers();
}

export function initThemeFromStorage() {
  const saved = localStorage.getItem(STORAGE_THEME) || "light";
  applyTheme(saved, { animate: false });
}
