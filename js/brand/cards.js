/* PRV brand cards (vanilla) */

function svgInline(path) {
  return fetch(path).then((r) => r.text());
}

async function renderLogo(el, variant = "full") {
  const file = variant === "mark" ? "/src/brand/assets/prv-mark.svg" : "/src/brand/assets/prv-logo.svg";
  const svg = await svgInline(file);
  el.innerHTML = svg;
  const root = el.querySelector("svg");
  if (root) {
    root.style.display = "block";
    root.style.height = el.dataset.h || "26px";
    root.style.width = "auto";
  }
}

async function renderQR(canvas, value, size = 46) {
  if (!window.QRCode) throw new Error("QRCode lib missing");
  canvas.width = size;
  canvas.height = size;
  await window.QRCode.toCanvas(canvas, value, { width: size, margin: 0 });
}

export async function mountEmployeeCard(root, { side = "front", tone = "matte", employee }) {
  root.className = `prv-card prv-card--${tone}`;
  root.innerHTML = `
    <div class="prv-card__logo" style="position:absolute;top:20px;left:20px" data-logo data-h="${side === "back" ? "18px" : "26px"}"></div>
    ${side === "back" ? `<div class="prv-qrbox"><canvas data-qr></canvas></div>` : ""}
    ${
      side === "front"
        ? `<div class="prv-card__who"><div class="prv-card__name"></div><div class="prv-card__role">Angajat</div></div>`
        : `<div class="prv-card__fields">
            <div class="prv-field"><div class="prv-field__l">ID angajat</div><div class="prv-field__v" data-id></div></div>
            <div class="prv-field"><div class="prv-field__l">Funcția</div><div class="prv-field__v" data-role style="font-family:var(--prv-font)"></div></div>
          </div>`
    }
  `;

  const logoEl = root.querySelector("[data-logo]");
  await renderLogo(logoEl, side === "back" ? "mark" : "full");

  if (side === "front") {
    root.querySelector(".prv-card__name").textContent = employee.name;
  } else {
    root.querySelector("[data-id]").textContent = employee.id;
    root.querySelector("[data-role]").textContent = employee.role;
    await renderQR(root.querySelector("[data-qr]"), employee.qrPayload, 46);
  }
}

export async function mountLoyaltyCard(root, { tone = "matte", member }) {
  // IMPORTANT: no discount displayed, no discount field exists.
  root.className = `prv-card prv-card--${tone}`;
  root.innerHTML = `
    <div class="prv-card__logo" style="position:absolute;top:20px;left:20px" data-logo data-h="26px"></div>
    <div class="prv-qrbox"><canvas data-qr></canvas></div>
    <div class="prv-card__who"><div class="prv-card__name"></div><div class="prv-card__role">Membru</div></div>
    <div class="prv-card__corner"></div>
  `;
  await renderLogo(root.querySelector("[data-logo]"), "full");
  root.querySelector(".prv-card__name").textContent = member.name;
  root.querySelector(".prv-card__corner").textContent = member.cardNumberMasked;
  await renderQR(root.querySelector("[data-qr]"), member.qrPayload, 46);
}

export async function mountBusinessCard(root, { side = "front", tone = "matte", data }) {
  root.className = `prv-card prv-biz prv-card--${tone}`;
  if (side === "front") {
    root.innerHTML = `
      <div class="prv-card__logo" style="position:absolute;top:20px;left:20px" data-logo data-h="26px"></div>
      <div class="prv-card__fields" style="bottom:22px">
        <div class="prv-field"><div class="prv-field__l">Nume</div><div class="prv-field__v" data-name style="font-family:var(--prv-font)"></div></div>
        <div class="prv-field"><div class="prv-field__l">Funcția</div><div class="prv-field__v" data-role style="font-family:var(--prv-font)"></div></div>
        <div class="prv-field"><div class="prv-field__l">Contact</div><div class="prv-field__v" data-contact></div></div>
      </div>
    `;
    await renderLogo(root.querySelector("[data-logo]"), "full");
    root.querySelector("[data-name]").textContent = data.name;
    root.querySelector("[data-role]").textContent = data.role;
    root.querySelector("[data-contact]").textContent = `${data.phone} · ${data.email}`;
    return;
  }

  root.innerHTML = `
    <div class="prv-card__logo" style="position:absolute;top:18px;left:18px" data-logo data-h="18px"></div>
    <div class="prv-card__fields" style="bottom:22px">
      <div class="prv-field"><div class="prv-field__l">Brand</div><div class="prv-field__v" style="font-family:var(--prv-font)">${data.legalName}</div></div>
      <div class="prv-field"><div class="prv-field__l">Tagline</div><div class="prv-field__v" style="font-family:var(--prv-font)">${data.tagline}</div></div>
      <div class="prv-field"><div class="prv-field__l">Adresă</div><div class="prv-field__v" style="font-family:var(--prv-font)">${data.address}</div></div>
      <div class="prv-field"><div class="prv-field__l">Site</div><div class="prv-field__v">${data.site}</div></div>
    </div>
  `;
  await renderLogo(root.querySelector("[data-logo]"), "mark");
}

