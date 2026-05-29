/** PRV Shop — limbă + temă doar în bara fixă de jos (nu header / subnav) */

import { remountThemePickerForShop } from "../prv-theme-picker.js";

/** Elimină pickere rămase în header sau subnav */
export function purgeShopPickersFromChrome() {
  document.querySelectorAll(".shop-header, .shop-header-wrap, .shop-subnav").forEach((zone) => {
    zone.querySelectorAll(".lang-picker-host, .theme-picker-host, #lang-picker, #theme-picker").forEach((el) => {
      el.remove();
    });
  });

  document.querySelectorAll("#lang-picker, #theme-picker").forEach((el) => {
    if (!el.closest(".shop-bottom-dock")) {
      el.removeAttribute("id");
      el.innerHTML = "";
    }
  });
}

/** Limba: colț dreapta jos (bara fixă) */
export function remountLangPickerForShop() {
  purgeShopPickersFromChrome();

  const slot = document.getElementById("shop-lang-slot");
  if (!slot || !window.PRV_I18N?.rebuildLangPicker) return;

  let picker = slot.querySelector("#lang-picker") || document.getElementById("lang-picker");
  if (picker && picker.parentElement !== slot) {
    slot.appendChild(picker);
  }

  if (!picker) {
    picker = document.createElement("div");
    picker.id = "lang-picker";
    slot.appendChild(picker);
  }

  picker.className = "lang-picker-host lang-picker-host--minimal shop-lang-dock";
  window.PRV_I18N.rebuildLangPicker();
}

export function remountShopPickers() {
  remountLangPickerForShop();
  remountThemePickerForShop();
}
