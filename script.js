const menuBtn = document.getElementById("menuBtn");
const mobileMenu = document.getElementById("mobileMenu");
const faqButtons = document.querySelectorAll(".faq-question");
const orderButtons = document.querySelectorAll(".order-btn");
const styleSelects = document.querySelectorAll(".style-select");
const seasonSelects = document.querySelectorAll(".season-select");
const toggleInputs = document.querySelectorAll("[data-toggle-target]");

const WHATSAPP_PHONE = "34600000000";

const IMAGE_MAP = {
  "guarderia": {
    "pv": {
      "basico": "assets/guarderia_pv_basico.jpg",
      "suave": "assets/guarderia_pv_suave.jpg",
      "ilustrado": "assets/guarderia_pv_ilustrado.jpg"
    },
    "oi": {
      "basico": "assets/guarderia_oi_basico.jpg",
      "suave": "assets/guarderia_oi_suave.jpg",
      "ilustrado": "assets/guarderia_oi_ilustrado.jpg"
    }
  },
  "infantil": {
    "pv": {
      "basico": "assets/infantil_pv_basico.jpg",
      "suave": "assets/infantil_pv_suave.jpg",
      "ilustrado": "assets/infantil_pv_ilustrado.jpg"
    },
    "oi": {
      "basico": "assets/infantil_oi_basico.jpg",
      "suave": "assets/infantil_oi_suave.jpg",
      "ilustrado": "assets/infantil_oi_ilustrado.jpg"
    }
  },
  "completo": {
    "pv": {
      "basico": "assets/completo_pv_basico.jpg",
      "suave": "assets/completo_pv_suave.jpg",
      "ilustrado": "assets/completo_pv_ilustrado.jpg"
    },
    "oi": {
      "basico": "assets/completo_oi_basico.jpg",
      "suave": "assets/completo_oi_suave.jpg",
      "ilustrado": "assets/completo_oi_ilustrado.jpg"
    }
  }
};

if (menuBtn && mobileMenu) {
  menuBtn.addEventListener("click", () => {
    const isOpen = mobileMenu.style.display === "block";
    mobileMenu.style.display = isOpen ? "none" : "block";
    menuBtn.setAttribute("aria-expanded", String(!isOpen));
  });
}

faqButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const answer = button.nextElementSibling;
    const isOpen = answer.style.maxHeight && answer.style.maxHeight !== "0px";

    document.querySelectorAll(".faq-answer").forEach((item) => {
      if (item !== answer) item.style.maxHeight = null;
    });

    answer.style.maxHeight = isOpen ? null : answer.scrollHeight + "px";
  });
});

function updatePackImage(packKey) {
  const seasonEl = document.getElementById(`season-${packKey}`);
  const styleEl = document.getElementById(`style-${packKey}`);
  const photo = document.getElementById(`photo-${packKey}`);

  if (!seasonEl || !styleEl || !photo) return;

  const season = seasonEl.value;
  const packStyle = styleEl.value;

  if (IMAGE_MAP[packKey] && IMAGE_MAP[packKey][season] && IMAGE_MAP[packKey][season][packStyle]) {
    photo.src = IMAGE_MAP[packKey][season][packStyle];
  }
}

styleSelects.forEach((select) => {
  select.addEventListener("change", () => updatePackImage(select.dataset.pack));
});

seasonSelects.forEach((select) => {
  select.addEventListener("change", () => updatePackImage(select.dataset.pack));
});

toggleInputs.forEach((input) => {
  input.addEventListener("change", () => {
    const target = document.getElementById(input.dataset.toggleTarget);
    if (target) target.classList.toggle("is-visible", input.checked);
  });
});

function getCheckedExtras(packKey) {
  const checked = document.querySelectorAll(`input[data-pack="${packKey}"]:checked`);
  return Array.from(checked).map((item) => item.value);
}

function getSecondNameDetail(packKey) {
  const checkbox = document.getElementById(`second-name-${packKey}`);
  const input = document.getElementById(`second-name-value-${packKey}`);

  if (checkbox && checkbox.checked) {
    return input && input.value.trim()
      ? `Segundo nombre/apellido en bolsa: ${input.value.trim()}`
      : "Segundo nombre/apellido en bolsa: pendiente de confirmar";
  }

  return "Sin segundo nombre/apellido en bolsa";
}

orderButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const packName = button.dataset.packName;
    const nameId = button.dataset.nameId;
    const sizeId = button.dataset.sizeId;
    const seasonId = button.dataset.seasonId;
    const styleId = button.dataset.styleId;
    const basePrice = button.dataset.basePrice;
    const packKey = button.dataset.packKey;

    const childName = document.getElementById(nameId).value.trim();
    const size = document.getElementById(sizeId).value;
    const seasonSelect = document.getElementById(seasonId);
    const styleSelect = document.getElementById(styleId);
    const season = seasonSelect.options[seasonSelect.selectedIndex].text;
    const packStyle = styleSelect.options[styleSelect.selectedIndex].text;
    const extras = getCheckedExtras(packKey);
    const secondNameDetail = getSecondNameDetail(packKey);

    const safeName = childName || "Pendiente de confirmar";
    const extrasText = extras.length ? extras.join(", ") : "Sin extras";

    const message =
`Hola, quiero pedir ${packName}.
Nombre del peque: ${safeName}
Talla: ${size}
Temporada: ${season}
Estilo del pack: ${packStyle}
Extras: ${extrasText}
Detalle: ${secondNameDetail}
Precio base del pack: ${basePrice}

Quiero confirmar disponibilidad, plazo de preparación y método de pago seguro.`;

    const url = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  });
});











/* === Selector por pack MudaLista DEFINITIVO === */
document.addEventListener('DOMContentLoaded', function () {
  const seasonData = {"guarderia": {"pv": ["4 bodys de manga corta", "2 pantalones ligeros / leggings finos", "1 sudadera muy ligera o chaqueta fina", "2 pares de calcetines", "1 bolsa personalizada"], "oi": ["4 bodys de manga larga", "2 pantalones más gruesos", "1 sudadera o jersey", "2 pares de calcetines gruesos", "1 bolsa personalizada"]}, "infantil": {"pv": ["3 camisetas", "2 pantalones ligeros / shorts", "1 sudadera ligera", "4 prendas de ropa interior", "3 pares de calcetines", "1 bolsa personalizada"], "oi": ["3 camisetas de manga larga", "2 pantalones de algodón grueso / felpa", "1 sudadera o jersey", "4 prendas de ropa interior", "3 pares de calcetines", "1 bolsa personalizada"]}, "completo": {"pv": ["4 camisetas", "3 pantalones ligeros / shorts", "1 sudadera ligera", "5 prendas de ropa interior", "5 pares de calcetines", "1 bolsa personalizada"], "oi": ["4 camisetas de manga larga", "3 pantalones", "1 sudadera más cálida", "5 prendas de ropa interior", "5 pares de calcetines", "1 bolsa personalizada"]}};

  function renderPack(pack, season) {
    const list = document.querySelector('[data-pack-list="' + pack + '"]');
    if (!list || !seasonData[pack] || !seasonData[pack][season]) return;

    list.innerHTML = seasonData[pack][season]
      .map(function (item) { return '<li>' + item + '</li>'; })
      .join('');
  }

  function syncAllPackSelects() {
    document.querySelectorAll('.season-select[data-pack]').forEach(function (select) {
      const pack = select.getAttribute('data-pack');
      const season = select.value || 'pv';
      renderPack(pack, season);
    });
  }

  document.querySelectorAll('.season-select[data-pack]').forEach(function (select) {
    select.addEventListener('change', function () {
      renderPack(select.getAttribute('data-pack'), select.value);
    });
  });

  syncAllPackSelects();
  window.addEventListener('pageshow', syncAllPackSelects);
});
