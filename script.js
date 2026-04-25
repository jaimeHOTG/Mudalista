/* MudaLista - versión reparada con Tipo de pack */
(function () {
  const WHATSAPP_PHONE = "34600000000";

  const CONTENT = {
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

  function byId(id) {
    return document.getElementById(id);
  }

  function valueOf(id, fallback) {
    const node = byId(id);
    return node ? node.value : fallback;
  }

  function textOf(id, fallback) {
    const node = byId(id);
    return node && node.selectedIndex >= 0 ? node.options[node.selectedIndex].textContent.trim() : fallback;
  }

  function listFor(pack) {
    return document.querySelector('[data-pack-list="' + pack + '"]');
  }

  function getSeason(pack) {
    return valueOf("season-" + pack, "pv");
  }

  function getSize(pack) {
    return valueOf("size-" + pack, "");
  }

  function getStyle(pack) {
    return valueOf("style-" + pack, "basico");
  }

  function getType(pack) {
    return valueOf("type-" + pack, "unisex");
  }

  function baseItems(pack) {
    const season = getSeason(pack);

    if (pack === "guarderia") {
      const age = getSize("guarderia") || "0-6 meses";
      const items = CONTENT.guarderia[season] && CONTENT.guarderia[season][age];
      return (items || CONTENT.guarderia.pv["0-6 meses"]).slice();
    }

    const items = CONTENT[pack] && CONTENT[pack][season];
    return items ? items.slice() : [];
  }

  function applyType(items, pack) {
    const type = getType(pack);
    if(!type) return items;

    return items.map(function (item) {
      let text = item;

      if (type === "nina") {
        text = text
          .replace("2 pantalones ligeros / leggings finos", "2 leggings o pantalones suaves")
          .replace("2 pantalones ligeros / shorts", "2 leggings o pantalones suaves")
          .replace("2 pantalones de algodón grueso / felpa", "2 leggings o pantalones de algodón grueso")
          .replace("2 pantalones más gruesos", "2 leggings o pantalones más gruesos")
          .replace("2 pantalones", "2 leggings o pantalones suaves")
          .replace("4 prendas de ropa interior", "4 braguitas")
          .replace("5 prendas de ropa interior", "5 braguitas");
      }

      if (type === "nino") {
        text = text
          .replace("2 pantalones ligeros / leggings finos", "2 pantalones suaves")
          .replace("2 leggings o pantalones suaves", "2 pantalones suaves")
          .replace("2 leggings o pantalones de algodón grueso", "2 pantalones de algodón grueso / felpa")
          .replace("2 leggings o pantalones más gruesos", "2 pantalones más gruesos")
          .replace("4 prendas de ropa interior", "4 calzoncillos")
          .replace("5 prendas de ropa interior", "5 calzoncillos");
      }

      return text;
    });
  }

  function packItems(pack) {
    return applyType(baseItems(pack), pack);
  }

  function renderContent(pack) {
    const list = listFor(pack);
    if (!list) return;

    list.innerHTML = packItems(pack)
      .map(function (item) {
        return "<li>" + item + "</li>";
      })
      .join("");
  }

  function findImage(pack) {
    return document.querySelector('[data-pack-image="' + pack + '"]') ||
           byId("photo-" + pack) ||
           document.querySelector("#pack-" + pack + " img") ||
           document.querySelector('[id*="' + pack + '"] img');
  }

  function updateImage(pack) {
    const img = findImage(pack);
    if (!img) return;

    const season = getSeason(pack);
    const style = getStyle(pack);

    if (pack === "guarderia" && getSize("guarderia") === "0-6 meses" && season === "pv" && style === "suave") {
      img.src = "assets/guarderia_0-6_tierra.jpg";
      return;
    }

    const src = IMAGE_MAP[pack] && IMAGE_MAP[pack][season] && IMAGE_MAP[pack][season][style];
    if (src) img.src = src;
  }

  function updatePack(pack) {
    renderContent(pack);
    updateImage(pack);
  }

  function updateAll() {
    ["guarderia", "infantil", "completo"].forEach(updatePack);
  }

  window.mudalistaUpdatePack = updatePack;
  window.mudalistaUpdateAll = updateAll;
  window.updateAllPackContents = updateAll;
  window.updateGuarderiaPack = function () { updatePack("guarderia"); };

  function setupSelectorEvents() {
    ["guarderia", "infantil", "completo"].forEach(function (pack) {
      ["size", "season", "style", "type"].forEach(function (field) {
        const node = byId(field + "-" + pack);
        if (node) {
          node.addEventListener("change", function () { updatePack(pack); });
          node.addEventListener("input", function () { updatePack(pack); });
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
    const checkbox = byId("second-name-" + pack);
    const input = byId("second-name-value-" + pack);

    if (checkbox && checkbox.checked) {
      return input && input.value.trim()
        ? "Segundo nombre/apellido en bolsa: " + input.value.trim()
        : "Segundo nombre/apellido en bolsa: pendiente de confirmar";
    }

    return "Sin segundo nombre/apellido en bolsa";
  }

  function setupOrders() {
    document.querySelectorAll(".order-btn").forEach(function (button) {
      button.addEventListener("click", function () {
        const pack = button.dataset.packKey;
        const packName = button.dataset.packName || pack;
        const nameNode = byId(button.dataset.nameId);
        const sizeNode = byId(button.dataset.sizeId);
        const seasonNode = byId(button.dataset.seasonId);
        const styleNode = byId(button.dataset.styleId);

        const name = nameNode && nameNode.value.trim() ? nameNode.value.trim() : "Pendiente de confirmar";
        const selectedSize = sizeNode ? sizeNode.value : "Pendiente de confirmar";
        const selectedSeason = seasonNode ? seasonNode.options[seasonNode.selectedIndex].text : "Pendiente de confirmar";
        const selectedStyle = styleNode ? styleNode.options[styleNode.selectedIndex].text : "Pendiente de confirmar";
        const selectedType = textOf("type-" + pack, "Unisex");
        const extras = getCheckedExtras(pack);
        const extrasText = extras.length ? extras.join(", ") : "Sin extras";

        const message =
`Hola, quiero pedir ${packName}.
Nombre del peque: ${name}
Talla: ${selectedSize}
Temporada: ${selectedSeason}
Tipo de pack: ${selectedType}
Estilo del pack: ${selectedStyle}
Contenido del pack: ${packItems(pack).join(", ")}
Extras: ${extrasText}
Detalle: ${getSecondNameDetail(pack)}
Precio base del pack: ${button.dataset.basePrice}

Quiero confirmar disponibilidad, plazo de preparación y método de pago seguro.`;

        window.open("https://wa.me/" + WHATSAPP_PHONE + "?text=" + encodeURIComponent(message), "_blank");
      });
    });
  }

  function setupMisc() {
    const menuBtn = byId("menuBtn");
    const mobileMenu = byId("mobileMenu");

    if (menuBtn && mobileMenu) {
      menuBtn.addEventListener("click", function () {
        const open = mobileMenu.style.display === "block";
        mobileMenu.style.display = open ? "none" : "block";
        menuBtn.setAttribute("aria-expanded", String(!open));
      });
    }

    document.querySelectorAll("[data-toggle-target]").forEach(function (input) {
      input.addEventListener("change", function () {
        const target = byId(input.dataset.toggleTarget);
        if (target) target.classList.toggle("is-visible", input.checked);
      });
    });

    document.querySelectorAll(".faq-question").forEach(function (button) {
      button.addEventListener("click", function () {
        const answer = button.nextElementSibling;
        if (!answer) return;

        const open = answer.style.maxHeight && answer.style.maxHeight !== "0px";
        document.querySelectorAll(".faq-answer").forEach(function (item) {
          if (item !== answer) item.style.maxHeight = null;
        });
        answer.style.maxHeight = open ? null : answer.scrollHeight + "px";
      });
    });
  }

  function init() {
    setupSelectorEvents();
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


/* === Sistema limpio final de imágenes por estilo === */
(function () {
  const STYLE_IMAGE_RULES = {
    guarderia: [
      {
        size: "0-6 meses",
        season: "pv",
        style: "suave",
        src: "assets/guarderia_0-6_tierra.jpg"
      }
    ]
  };

  function byIdSafe(id) {
    return document.getElementById(id);
  }

  function valueSafe(id, fallback) {
    const node = byIdSafe(id);
    return node ? node.value : fallback;
  }

  function findPackImage(pack) {
    return document.querySelector('[data-pack-image="' + pack + '"]') ||
           document.getElementById("photo-" + pack) ||
           document.querySelector("#pack-" + pack + " img") ||
           document.querySelector('[id*="' + pack + '"] img');
  }

  function applyStyleImage(pack) {
    const img = findPackImage(pack);
    if (!img) return;

    const rules = STYLE_IMAGE_RULES[pack] || [];
    const size = valueSafe("size-" + pack, "");
    const season = valueSafe("season-" + pack, "");
    const style = valueSafe("style-" + pack, "");

    const match = rules.find(function (rule) {
      return (!rule.size || rule.size === size) &&
             (!rule.season || rule.season === season) &&
             (!rule.style || rule.style === style);
    });

    if (match) {
      img.src = match.src;
    }
  }

  function applyAllStyleImages() {
    ["guarderia", "infantil", "completo"].forEach(applyStyleImage);
  }

  document.addEventListener("DOMContentLoaded", function () {
    ["guarderia", "infantil", "completo"].forEach(function (pack) {
      ["size", "season", "style", "type"].forEach(function (field) {
        const node = byIdSafe(field + "-" + pack);
        if (node) {
          node.addEventListener("change", function () {
            setTimeout(function () { applyStyleImage(pack); }, 0);
          });
          node.addEventListener("input", function () {
            setTimeout(function () { applyStyleImage(pack); }, 0);
          });
        }
      });
    });

    setTimeout(applyAllStyleImages, 0);
  });

  window.addEventListener("pageshow", function () {
    setTimeout(applyAllStyleImages, 0);
  });

  window.mudalistaApplyStyleImages = applyAllStyleImages;
})();
