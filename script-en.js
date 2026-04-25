/* MudaLista - repaired version with pack type */
(function () {
  const CONTENT = {
    guarderia: {
      pv: {
        "0–6 months": [
          "5 short-sleeve bodysuits",
          "2 light trousers / thin leggings",
          "1 very light sweatshirt or thin jacket",
          "2 pairs of socks",
          "1 personalised bag"
        ],
        "6–12 months": [
          "4 short-sleeve bodysuits",
          "1 T-shirt",
          "2 light trousers / thin leggings",
          "1 very light sweatshirt or thin jacket",
          "2 pairs of socks",
          "1 personalised bag"
        ],
        "12–18 months": [
          "2 short-sleeve bodysuits",
          "2 T-shirts",
          "2 light trousers / thin leggings",
          "1 very light sweatshirt or thin jacket",
          "2 pairs of socks",
          "1 personalised bag"
        ],
        "18–24 months": [
          "2 short-sleeve bodysuits",
          "2 T-shirts",
          "2 light trousers / thin leggings",
          "1 very light sweatshirt or thin jacket",
          "2 pairs of socks",
          "1 personalised bag"
        ]
      },
      oi: {
        "0–6 months": [
          "5 long-sleeve bodysuits",
          "2 warmer trousers",
          "1 sweatshirt or jumper",
          "2 pairs of warm socks",
          "1 personalised bag"
        ],
        "6–12 months": [
          "4 long-sleeve bodysuits",
          "1 long-sleeve T-shirt",
          "2 warmer trousers",
          "1 sweatshirt or jumper",
          "2 pairs of warm socks",
          "1 personalised bag"
        ],
        "12–18 months": [
          "2 long-sleeve bodysuits",
          "2 long-sleeve T-shirts",
          "2 warmer trousers",
          "1 sweatshirt or jumper",
          "2 pairs of warm socks",
          "1 personalised bag"
        ],
        "18–24 months": [
          "2 long-sleeve bodysuits",
          "2 long-sleeve T-shirts",
          "2 warmer trousers",
          "1 sweatshirt or jumper",
          "2 pairs of warm socks",
          "1 personalised bag"
        ]
      }
    },
    infantil: {
      pv: [
        "3 T-shirts",
        "2 light trousers / shorts",
        "1 light sweatshirt",
        "4 underwear items",
        "3 pairs of socks",
        "1 personalised bag"
      ],
      oi: [
        "3 long-sleeve T-shirts",
        "2 thick cotton / fleece trousers",
        "1 sweatshirt or jumper",
        "4 underwear items",
        "3 pairs of socks",
        "1 personalised bag"
      ]
    },
    completo: {
      pv: [
        "4 T-shirts",
        "2 light trousers / shorts",
        "1 light sweatshirt",
        "5 underwear items",
        "5 pairs of socks",
        "1 personalised bag"
      ],
      oi: [
        "4 long-sleeve T-shirts",
        "2 trousers",
        "1 warmer sweatshirt",
        "5 underwear items",
        "5 pairs of socks",
        "1 personalised bag"
      ]
    }
  };

  // Real payment links. Replace these values with your Stripe Payment Links
  // and with your bank Bizum link/instructions when active.
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


  // Simple stock control by combination.
  // By default everything is available. To block a combination, add:
  // "infantil|3–4 years|pv|nino": false
  const STOCK = {
    // Disabled example: "infantil|3–4 years|pv|nino": false
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

  function parseEuro(value) {
    const normalized = String(value || "0").replace("€", "").replace(/\s/g, "").replace(".", "").replace(",", ".");
    const amount = parseFloat(normalized);
    return Number.isFinite(amount) ? amount : 0;
  }

  function formatEuro(value) {
    return value.toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €";
  }

  function extraAmountFromLabel(value) {
    const match = String(value || "").match(/\+(\d+(?:[,.]\d+)?)\s*€/);
    return match ? parseEuro(match[1] + " €") : 0;
  }

  function totalPriceForPack(pack) {
    const button = document.querySelector(".order-btn[data-pack-key=\"" + pack + "\"]");
    if (!button) return "";
    const base = parseEuro(button.dataset.basePrice || "0");
    const extrasTotal = getCheckedExtras(pack).reduce(function (sum, label) { return sum + extraAmountFromLabel(label); }, 0);
    return formatEuro(base + extrasTotal);
  }

  function updateDisplayedPrice(pack) {
    const card = byId("pack-" + pack);
    if (!card) return;
    const priceNode = card.querySelector(".price");
    if (priceNode) priceNode.textContent = totalPriceForPack(pack);
  }

  function setSecondNameState(pack, enabled) {
    const checkbox = byId("second-name-" + pack);
    const field = byId("second-name-field-" + pack);
    if (checkbox) checkbox.checked = Boolean(enabled);
    if (field) field.classList.toggle("is-visible", Boolean(enabled));
    updateDisplayedPrice(pack);
  }

  function syncSecondNameFromMainName(pack, options) {
    const main = byId("name-" + pack);
    const extra = byId("second-name-value-" + pack);
    if (!main) return;

    const raw = main.value.replace(/\s+/g, " ").trimStart();
    if (main.value !== raw) main.value = raw;

    const parts = raw.trim().split(" ").filter(Boolean);
    const hasExtraWords = parts.length > 1;

    if (hasExtraWords) {
      const extraText = parts.slice(1).join(" ");
      if (extra) {
        extra.value = extraText;
        extra.dataset.autoFromMain = "true";
      }
      setSecondNameState(pack, true);

      // We do not trim while typing, so spaces can be entered normally.
      // On blur, we separate the first name from the second name/surname.
      if (options && options.commit) main.value = parts[0];
      return;
    }

    if (options && options.commit) main.value = raw.trim();

    // If the extra was automatically generated from this field and the user
    // deletes the second name/surname, it is also removed from extras and stops adding to the total.
    if (extra && extra.dataset.autoFromMain === "true") {
      extra.value = "";
      delete extra.dataset.autoFromMain;
      setSecondNameState(pack, false);
    } else {
      updateDisplayedPrice(pack);
    }
  }

  function normalizeChildName(pack) {
    syncSecondNameFromMainName(pack, { commit: true });
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
      const age = getSize("guarderia") || "0–6 months";
      const items = CONTENT.guarderia[season] && CONTENT.guarderia[season][age];
      return (items || CONTENT.guarderia.pv["0–6 months"]).slice();
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
          .replace("2 light trousers / thin leggings", "2 leggings or soft trousers")
          .replace("2 light trousers / shorts", "2 leggings or soft trousers")
          .replace("2 thick cotton / fleece trousers", "2 leggings or thick cotton trousers")
          .replace("2 warmer trousers", "2 leggings or warmer trousers")
          .replace("2 trousers", "2 leggings or soft trousers")
          .replace("4 underwear items", "4 girls’ briefs")
          .replace("5 underwear items", "5 girls’ briefs");
      }

      if (type === "nino") {
        text = text
          .replace("2 light trousers / thin leggings", "2 trousers suaves")
          .replace("2 leggings or soft trousers", "2 trousers suaves")
          .replace("2 leggings or thick cotton trousers", "2 thick cotton / fleece trousers")
          .replace("2 leggings or warmer trousers", "2 warmer trousers")
          .replace("4 underwear items", "4 boys’ briefs")
          .replace("5 underwear items", "5 boys’ briefs");
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

    if (pack === "guarderia" && getSize("guarderia") === "0–6 months" && season === "pv" && style === "suave") {
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
    updateDisplayedPrice(pack);
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

      const nameNode = byId("name-" + pack);
      if (nameNode) {
        nameNode.addEventListener("input", function () { syncSecondNameFromMainName(pack, { commit: false }); });
        nameNode.addEventListener("blur", function () { normalizeChildName(pack); });
      }

      const secondNameInput = byId("second-name-value-" + pack);
      if (secondNameInput) {
        secondNameInput.addEventListener("input", function () {
          if (secondNameInput.value.trim()) {
            delete secondNameInput.dataset.autoFromMain;
            setSecondNameState(pack, true);
          } else {
            delete secondNameInput.dataset.autoFromMain;
            setSecondNameState(pack, false);
          }
        });
      }

      document.querySelectorAll('input[data-pack="' + pack + '"]').forEach(function (extra) {
        extra.addEventListener("change", function () {
          const targetId = extra.dataset.toggleTarget;
          if (targetId && !extra.checked) {
            const target = byId(targetId);
            const targetInput = target ? target.querySelector("input") : null;
            if (targetInput) {
              targetInput.value = "";
              delete targetInput.dataset.autoFromMain;
            }
          }
          updateDisplayedPrice(pack);
        });
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

    if (checkbox && checkbox.checked && input && input.value.trim()) {
      return input.value.trim();
    }

    return "";
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
      price: totalPriceForPack(pack) || button.dataset.basePrice || "",
      name: nameNode ? nameNode.value.trim() : "",
      bagName: [nameNode ? nameNode.value.trim() : "", getSecondNameDetail(pack)].filter(Boolean).join(" "),
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
    const extras = details.extras.length ? details.extras.join(", ") : "No extras";

    const modal = document.createElement("div");
    modal.id = "payment-modal";
    modal.className = "payment-modal";
    modal.innerHTML = '' +
      '<div class="payment-modal-card" role="dialog" aria-modal="true" aria-labelledby="payment-modal-title">' +
        '<button class="payment-modal-close" type="button" aria-label="Close">×</button>' +
        '<span class="section-tag">Secure payment</span>' +
        '<h3 id="payment-modal-title">Complete your order</h3>' +
        '<div class="payment-modal-summary">' +
          '<strong>' + escapeHTML(details.packName) + ' · ' + escapeHTML(details.price) + '</strong>' +
          '<span><b>Included name:</b> ' + escapeHTML(details.name) + '</span>' +
          '<span><b>Bag:</b> ' + escapeHTML(details.bagName || details.name) + '</span>' +
          '<span><b>Size:</b> ' + escapeHTML(details.size) + '</span>' +
          '<span><b>Season:</b> ' + escapeHTML(details.season) + '</span>' +
          '<span><b>Type:</b> ' + escapeHTML(details.type) + '</span>' +
          '<span><b>Style:</b> ' + escapeHTML(details.style) + '</span>' +
          '<span><b>Extras:</b> ' + escapeHTML(extras) + '</span>' +
        '</div>' +
        '<div class="payment-modal-actions">' +
          '<a class="btn btn-primary" data-payment="card" href="' + (stripeUrl || '#') + '" target="_blank" rel="noopener">Pay by card</a>' +
          '<a class="btn btn-secondary" data-payment="bizum" href="' + (bizumUrl || '#') + '" target="_blank" rel="noopener">Pay by Bizum</a>' +
        '</div>' +
        '<p class="payment-modal-note">100% secure payment · Card or Bizum</p>' +
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
        alert("To activate real card payments, add your Stripe Payment Link in PAYMENT_LINKS inside script.js.");
      });
    }

    if (!bizumUrl) {
      bizum.addEventListener("click", function (event) {
        event.preventDefault();
        alert("To activate Bizum, add your Bizum payment link or instruction in BIZUM_LINKS inside script.js.");
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

        if (!nameNode || !nameNode.value.trim()) missing.push("the child’s name");
        if (!sizeNode || !sizeNode.value) missing.push("the size");
        if (!seasonNode || !seasonNode.value) missing.push("the season");
        if (!styleNode || !styleNode.value) missing.push("the style");
        if (!typeNode || !typeNode.value) missing.push("the pack type");
        const secondNameCheckbox = byId("second-name-" + pack);
        const secondNameInput = byId("second-name-value-" + pack);
        if (secondNameCheckbox && secondNameCheckbox.checked && (!secondNameInput || !secondNameInput.value.trim())) missing.push("the second name or surname");

        if (!isAvailable(pack)) {
          alert("This combination is currently out of stock. Please change size, season or pack type.");
          updateAvailability(pack);
          return;
        }

        if (missing.length) {
          alert("Before paying, complete: " + missing.join(", ") + ".");
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


/* === Final clean image system by style === */
(function () {
  const STYLE_IMAGE_RULES = {
    guarderia: [
      {
        size: "0–6 months",
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
