/* MudaLista - versión reparada con Tipo de pack */
(function () {
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

  // Enlaces reales de pago. Sustituye estos valores por tus Payment Links de Stripe
  // y por el enlace/instrucción de Bizum de tu banco cuando lo tengas activo.
  const PAYMENT_LINKS = {
    guarderia: "",
    infantil: "",
    completo: ""
  };

  const BIZUM_LINKS = {
    guarderia: "",
    infantil: "",
    completo: ""
  };


  // Control sencillo de stock por combinación.
  // Por defecto todo aparece disponible. Para bloquear una combinación, añade:
  // "infantil|3-4 años|pv|nino": false
  const STOCK = {
    // Ejemplo desactivado: "infantil|3-4 años|pv|nino": false
  };

  function stockKey(pack) {
    return [pack, getSize(pack), getSeason(pack), getType(pack)].join("|");
  }

  function hasEnoughSelectionForStock(pack) {
    return Boolean(getSize(pack) && getSeason(pack) && getType(pack));
  }

  function isAvailable(pack) {
    if (!hasEnoughSelectionForStock(pack)) return true;
    const key = stockKey(pack);
    return STOCK[key] !== false;
  }

  function updateAvailability(pack) {
    const button = document.querySelector('.order-btn[data-pack-key="' + pack + '"]');
    if (!button) return;

    const available = isAvailable(pack);
    button.disabled = hasEnoughSelectionForStock(pack) && !available;
    button.classList.toggle("is-disabled", hasEnoughSelectionForStock(pack) && !available);
  }

  const IMAGE_MAP = {
    guarderia: {
      pv: { basico: "assets/guarderia_pv_basico.webp", suave: "assets/guarderia_pv_suave.webp", ilustrado: "assets/guarderia_pv_ilustrado.webp" },
      oi: { basico: "assets/guarderia_oi_basico.webp", suave: "assets/guarderia_oi_suave.webp", ilustrado: "assets/guarderia_oi_ilustrado.webp" }
    },
    infantil: {
      pv: { basico: "assets/infantil_pv_basico.webp", suave: "assets/infantil_pv_suave.webp", ilustrado: "assets/infantil_pv_ilustrado.webp" },
      oi: { basico: "assets/infantil_oi_basico.webp", suave: "assets/infantil_oi_suave.webp", ilustrado: "assets/infantil_oi_ilustrado.webp" }
    },
    completo: {
      pv: { basico: "assets/completo_pv_basico.webp", suave: "assets/completo_pv_suave.webp", ilustrado: "assets/completo_pv_ilustrado.webp" },
      oi: { basico: "assets/completo_oi_basico.webp", suave: "assets/completo_oi_suave.webp", ilustrado: "assets/completo_oi_ilustrado.webp" }
    }
  };

  function byId(id) {
    return document.getElementById(id);
  }

  function escapeHTML(value) {
    return String(value || "").replace(/[&<>'"]/g, function (char) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", "\"": "&quot;" }[char];
    });
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
      img.src = "assets/guarderia_0-6_tierra.webp";
      return;
    }

    const src = IMAGE_MAP[pack] && IMAGE_MAP[pack][season] && IMAGE_MAP[pack][season][style];
    if (src) img.src = src;
  }

  function updatePack(pack) {
    renderContent(pack);
    updateImage(pack);
    updateAvailability(pack);
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

  function selectedOrderDetails(button) {
    const pack = button.dataset.packKey;
    const packName = button.dataset.packName || pack;
    const nameNode = byId(button.dataset.nameId);
    const sizeNode = byId(button.dataset.sizeId);
    const seasonNode = byId(button.dataset.seasonId);
    const styleNode = byId(button.dataset.styleId);
    const typeNode = byId("type-" + pack);

    return {
      pack: pack,
      packName: packName,
      price: button.dataset.basePrice || "",
      name: nameNode ? nameNode.value.trim() : "",
      size: sizeNode ? textOf(button.dataset.sizeId, "") : "",
      season: seasonNode ? textOf(button.dataset.seasonId, "") : "",
      style: styleNode ? textOf(button.dataset.styleId, "") : "",
      type: typeNode ? textOf("type-" + pack, "") : "",
      items: packItems(pack),
      extras: getCheckedExtras(pack),
      secondName: getSecondNameDetail(pack)
    };
  }

  function openPaymentModal(details) {
    const existing = byId("payment-modal");
    if (existing) existing.remove();

    const stripeUrl = PAYMENT_LINKS[details.pack] || "";
    const bizumUrl = BIZUM_LINKS[details.pack] || "";
    const extras = details.extras.length ? details.extras.join(", ") : "Sin extras";

    const modal = document.createElement("div");
    modal.id = "payment-modal";
    modal.className = "payment-modal";
    modal.innerHTML = '' +
      '<div class="payment-modal-card" role="dialog" aria-modal="true" aria-labelledby="payment-modal-title">' +
        '<button class="payment-modal-close" type="button" aria-label="Cerrar">×</button>' +
        '<span class="section-tag">Pago seguro</span>' +
        '<h3 id="payment-modal-title">Finaliza tu pedido</h3>' +
        '<div class="payment-modal-summary">' +
          '<strong>' + escapeHTML(details.packName) + ' · ' + escapeHTML(details.price) + '</strong>' +
          '<span><b>Nombre:</b> ' + escapeHTML(details.name) + '</span>' +
          '<span><b>Talla:</b> ' + escapeHTML(details.size) + '</span>' +
          '<span><b>Temporada:</b> ' + escapeHTML(details.season) + '</span>' +
          '<span><b>Tipo:</b> ' + escapeHTML(details.type) + '</span>' +
          '<span><b>Estilo:</b> ' + escapeHTML(details.style) + '</span>' +
          '<span><b>Extras:</b> ' + escapeHTML(extras) + '</span>' +
        '</div>' +
        '<div class="payment-modal-actions">' +
          '<a class="btn btn-primary" data-payment="card" href="' + (stripeUrl || '#') + '" target="_blank" rel="noopener">Pagar con tarjeta</a>' +
          '<a class="btn btn-secondary" data-payment="bizum" href="' + (bizumUrl || '#') + '" target="_blank" rel="noopener">Pagar con Bizum</a>' +
        '</div>' +
        '<p class="payment-modal-note">Pago 100% seguro · Tarjeta o Bizum</p>' +
      '</div>';

    document.body.appendChild(modal);

    modal.querySelector(".payment-modal-close").addEventListener("click", function () { modal.remove(); });
    modal.addEventListener("click", function (event) {
      if (event.target === modal) modal.remove();
    });

    const card = modal.querySelector('[data-payment="card"]');
    const bizum = modal.querySelector('[data-payment="bizum"]');

    if (!stripeUrl) {
      card.addEventListener("click", function (event) {
        event.preventDefault();
        alert("Para activar el pago real con tarjeta, añade tu Payment Link de Stripe en PAYMENT_LINKS dentro de script.js.");
      });
    }

    if (!bizumUrl) {
      bizum.addEventListener("click", function (event) {
        event.preventDefault();
        alert("Para activar Bizum, añade el enlace o instrucción de pago Bizum en BIZUM_LINKS dentro de script.js.");
      });
    }
  }

  function focusPackConfig(pack) {
    const card = byId("pack-" + pack);
    if (!card) return;
    card.scrollIntoView({ behavior: "smooth", block: "start" });
    card.classList.add("pack-focus");
    window.setTimeout(function () { card.classList.remove("pack-focus"); }, 1400);
    const input = byId("name-" + pack);
    if (input) window.setTimeout(function () { input.focus(); }, 500);
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

        const typeNode = byId("type-" + pack);
        const missing = [];

        if (!nameNode || !nameNode.value.trim()) missing.push("el nombre del peque");
        if (!sizeNode || !sizeNode.value) missing.push("la talla");
        if (!seasonNode || !seasonNode.value) missing.push("la temporada");
        if (!styleNode || !styleNode.value) missing.push("el estilo");
        if (!typeNode || !typeNode.value) missing.push("el tipo de pack");

        if (!isAvailable(pack)) {
          alert("Ahora mismo no hay stock para esa combinación. Cambia talla, temporada o tipo de pack.");
          updateAvailability(pack);
          return;
        }

        if (missing.length) {
          alert("Antes de pagar, completa: " + missing.join(", ") + ".");
          const firstMissing = !nameNode || !nameNode.value.trim() ? nameNode : (!sizeNode || !sizeNode.value ? sizeNode : (!seasonNode || !seasonNode.value ? seasonNode : (!styleNode || !styleNode.value ? styleNode : typeNode)));
          if (firstMissing && firstMissing.focus) firstMissing.focus();
          return;
        }

        openPaymentModal(selectedOrderDetails(button));
      });
    });
  }

  function setupMisc() {
    document.querySelectorAll("[data-open-pack]").forEach(function (link) {
      link.addEventListener("click", function (event) {
        event.preventDefault();
        focusPackConfig(link.dataset.openPack);
      });
    });

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
        src: "assets/guarderia_0-6_tierra.webp"
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
