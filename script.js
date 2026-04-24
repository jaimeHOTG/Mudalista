/* MudaLista selector engine - final integrado */
(function () {
  const WHATSAPP_PHONE = "34600000000";

  const PACKS = {
    guarderia: {
      pv: {
        "0-6 meses": [
          "5 bodys de manga corta",
          "2 pantalones ligeros / leggings finos",
          "1 sudadera muy ligera o chaqueta fina",
          "2 pares de calcetines",
          "1 bolsa personalizada"
        ],
        "6-12 meses": [
          "4 bodys de manga corta",
          "1 camiseta",
          "2 pantalones ligeros / leggings finos",
          "1 sudadera muy ligera o chaqueta fina",
          "2 pares de calcetines",
          "1 bolsa personalizada"
        ],
        "12-18 meses": [
          "2 bodys de manga corta",
          "2 camisetas",
          "2 pantalones ligeros / leggings finos",
          "1 sudadera muy ligera o chaqueta fina",
          "2 pares de calcetines",
          "1 bolsa personalizada"
        ],
        "18-24 meses": [
          "2 bodys de manga corta",
          "2 camisetas",
          "2 pantalones ligeros / leggings finos",
          "1 sudadera muy ligera o chaqueta fina",
          "2 pares de calcetines",
          "1 bolsa personalizada"
        ]
      },
      oi: {
        "0-6 meses": [
          "5 bodys de manga larga",
          "2 pantalones más gruesos",
          "1 sudadera o jersey",
          "2 pares de calcetines gruesos",
          "1 bolsa personalizada"
        ],
        "6-12 meses": [
          "4 bodys de manga larga",
          "1 camiseta de manga larga",
          "2 pantalones más gruesos",
          "1 sudadera o jersey",
          "2 pares de calcetines gruesos",
          "1 bolsa personalizada"
        ],
        "12-18 meses": [
          "2 bodys de manga larga",
          "2 camisetas de manga larga",
          "2 pantalones más gruesos",
          "1 sudadera o jersey",
          "2 pares de calcetines gruesos",
          "1 bolsa personalizada"
        ],
        "18-24 meses": [
          "2 bodys de manga larga",
          "2 camisetas de manga larga",
          "2 pantalones más gruesos",
          "1 sudadera o jersey",
          "2 pares de calcetines gruesos",
          "1 bolsa personalizada"
        ]
      }
    },

    infantil: {
      pv: [
        "3 camisetas",
        "2 pantalones ligeros / shorts",
        "1 sudadera ligera",
        "4 prendas de ropa interior",
        "3 pares de calcetines",
        "1 bolsa personalizada"
      ],
      oi: [
        "3 camisetas de manga larga",
        "2 pantalones de algodón grueso / felpa",
        "1 sudadera o jersey",
        "4 prendas de ropa interior",
        "3 pares de calcetines",
        "1 bolsa personalizada"
      ]
    },

    completo: {
      pv: [
        "4 camisetas",
        "2 pantalones ligeros / shorts",
        "1 sudadera ligera",
        "5 prendas de ropa interior",
        "5 pares de calcetines",
        "1 bolsa personalizada"
      ],
      oi: [
        "4 camisetas de manga larga",
        "2 pantalones",
        "1 sudadera más cálida",
        "5 prendas de ropa interior",
        "5 pares de calcetines",
        "1 bolsa personalizada"
      ]
    }
  };

  const IMAGE_MAP = {
    guarderia: {
      pv: { basico: "assets/guarderia_pv_basico.jpg", suave: "assets/guarderia_pv_suave.jpg", ilustrado: "assets/guarderia_pv_ilustrado.jpg" },
      oi: { basico: "assets/guarderia_oi_basico.jpg", suave: "assets/guarderia_oi_suave.jpg", ilustrado: "assets/guarderia_oi_ilustrado.jpg" }
    },
    infantil: {
      pv: { basico: "assets/infantil_pv_basico.jpg", suave: "assets/infantil_pv_suave.jpg", ilustrado: "assets/infantil_pv_ilustrado.jpg" },
      oi: { basico: "assets/infantil_oi_basico.jpg", suave: "assets/infantil_oi_suave.jpg", ilustrado: "assets/infantil_oi_ilustrado.jpg" }
    },
    completo: {
      pv: { basico: "assets/completo_pv_basico.jpg", suave: "assets/completo_pv_suave.jpg", ilustrado: "assets/completo_pv_ilustrado.jpg" },
      oi: { basico: "assets/completo_oi_basico.jpg", suave: "assets/completo_oi_suave.jpg", ilustrado: "assets/completo_oi_ilustrado.jpg" }
    }
  };

  function el(id) {
    return document.getElementById(id);
  }

  function listEl(pack) {
    return document.querySelector('[data-pack-list="' + pack + '"]');
  }

  function getSeason(pack) {
    const node = el("season-" + pack);
    return node ? node.value : "pv";
  }

  function getSize(pack) {
    const node = el("size-" + pack);
    return node ? node.value : "";
  }

  function getStyle(pack) {
    const node = el("style-" + pack);
    return node ? node.value : "basico";
  }

  function packItems(pack) {
    const season = getSeason(pack);

    if (pack === "guarderia") {
      const age = getSize("guarderia") || "0-6 meses";
      return (PACKS.guarderia[season] && PACKS.guarderia[season][age]) || PACKS.guarderia.pv["0-6 meses"];
    }

    return (PACKS[pack] && PACKS[pack][season]) || [];
  }

  function renderPack(pack) {
    const list = listEl(pack);
    if (list) {
      list.innerHTML = packItems(pack).map(function (item) {
        return "<li>" + item + "</li>";
      }).join("");
    }

    const img = document.querySelector('[data-pack-image="' + pack + '"]') || el("photo-" + pack);
    const src = IMAGE_MAP[pack] && IMAGE_MAP[pack][getSeason(pack)] && IMAGE_MAP[pack][getSeason(pack)][getStyle(pack)];
    if (img && src) img.src = src;
  }

  function updatePack(pack) {
    renderPack(pack);
  }

  function updateAll() {
    ["guarderia", "infantil", "completo"].forEach(updatePack);
  }

  window.mudalistaUpdatePack = updatePack;
  window.mudalistaUpdateAll = updateAll;
  window.updateAllPackContents = updateAll;
  window.updateGuarderiaPack = function () { updatePack("guarderia"); };

  function setupSelectors() {
    ["guarderia", "infantil", "completo"].forEach(function (pack) {
      ["size", "season", "style"].forEach(function (field) {
        const node = el(field + "-" + pack);
        if (node) {
          node.onchange = function () { updatePack(pack); };
          node.oninput = function () { updatePack(pack); };
        }
      });
    });
  }

  function getCheckedExtras(pack) {
    return Array.from(document.querySelectorAll('input[data-pack="' + pack + '"]:checked')).map(function (node) {
      return node.value;
    });
  }

  function getSecondNameDetail(pack) {
    const checkbox = el("second-name-" + pack);
    const input = el("second-name-value-" + pack);

    if (checkbox && checkbox.checked) {
      return input && input.value.trim()
        ? "Segundo nombre/apellido en bolsa: " + input.value.trim()
        : "Segundo nombre/apellido en bolsa: pendiente de confirmar";
    }

    return "Sin segundo nombre/apellido en bolsa";
  }

  function setupOrders() {
    document.querySelectorAll(".order-btn").forEach(function (button) {
      button.onclick = function () {
        const pack = button.dataset.packKey;
        const packName = button.dataset.packName || pack;
        const nameNode = el(button.dataset.nameId);
        const sizeNode = el(button.dataset.sizeId);
        const seasonNode = el(button.dataset.seasonId);
        const styleNode = el(button.dataset.styleId);

        const name = nameNode && nameNode.value.trim() ? nameNode.value.trim() : "Pendiente de confirmar";
        const selectedSize = sizeNode ? sizeNode.value : "Pendiente de confirmar";
        const selectedSeason = seasonNode ? seasonNode.options[seasonNode.selectedIndex].text : "Pendiente de confirmar";
        const selectedStyle = styleNode ? styleNode.options[styleNode.selectedIndex].text : "Pendiente de confirmar";
        const content = packItems(pack).join(", ");
        const extras = getCheckedExtras(pack);
        const extrasText = extras.length ? extras.join(", ") : "Sin extras";

        const message =
`Hola, quiero pedir ${packName}.
Nombre del peque: ${name}
Talla: ${selectedSize}
Temporada: ${selectedSeason}
Estilo del pack: ${selectedStyle}
Contenido del pack: ${content}
Extras: ${extrasText}
Detalle: ${getSecondNameDetail(pack)}
Precio base del pack: ${button.dataset.basePrice}

Quiero confirmar disponibilidad, plazo de preparación y método de pago seguro.`;

        window.open("https://wa.me/" + WHATSAPP_PHONE + "?text=" + encodeURIComponent(message), "_blank");
      };
    });
  }

  function setupMisc() {
    const menuBtn = el("menuBtn");
    const mobileMenu = el("mobileMenu");

    if (menuBtn && mobileMenu) {
      menuBtn.onclick = function () {
        const open = mobileMenu.style.display === "block";
        mobileMenu.style.display = open ? "none" : "block";
        menuBtn.setAttribute("aria-expanded", String(!open));
      };
    }

    document.querySelectorAll("[data-toggle-target]").forEach(function (input) {
      input.onchange = function () {
        const target = el(input.dataset.toggleTarget);
        if (target) target.classList.toggle("is-visible", input.checked);
      };
    });

    document.querySelectorAll(".faq-question").forEach(function (button) {
      button.onclick = function () {
        const answer = button.nextElementSibling;
        if (!answer) return;
        const open = answer.style.maxHeight && answer.style.maxHeight !== "0px";
        document.querySelectorAll(".faq-answer").forEach(function (item) {
          if (item !== answer) item.style.maxHeight = null;
        });
        answer.style.maxHeight = open ? null : answer.scrollHeight + "px";
      };
    });
  }

  function init() {
    setupSelectors();
    setupOrders();
    setupMisc();
    updateAll();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  window.addEventListener("pageshow", updateAll);
})();
