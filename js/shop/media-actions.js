/** PRV Shop — overlay actions on product images (share + favorite) */

import { shareIconButton } from "./share.js";
import { favoriteIconButton } from "./favorites.js";

export function productMediaActions(product, opts = {}) {
  return `<div class="shop-media-actions">
    ${favoriteIconButton(product, opts.favorite || {})}
    ${shareIconButton(product, opts.share || {})}
  </div>`;
}
