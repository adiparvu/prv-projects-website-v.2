/** PRV Shop — montare limbă / temă în zonele corecte (nu în header glass) */

import { remountThemePickerForShop } from "../prv-theme-picker.js";

/** Limba: bara sub header (dreapta), nu în shop-header */
export function remountLangPickerForShop() {
  const slot = document.getElementById("shop-lang-slot");
  if (!slot || !window.PRV_I18N?.rebuildLangPicker) return;

  let picker = document.getElementById("lang-picker");
  if (picker && picker.parentElement !== slot) {
    slot.appendChild(picker);
  }

  if (!picker) {
    picker = document.createElement("div");
    picker.id = "lang-picker";
    picker.className = "lang-picker-host lang-picker-host--minimal shop-lang-subnav";
    slot.appendChild(picker);
  }

  picker.classList.add("lang-picker-host--minimal", "shop-lang-subnav");
  window.PRV_I18N.rebuildLangPicker();
}

export function remountShopPickers() {
  remountLangPickerForShop();
  remountThemePickerForShop();
}
