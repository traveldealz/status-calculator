import template from "./templates/base.js";
import translate from "./helper/translate.js";
import translations from "./translations.js";

const SYMBOL_TO_CURRENCY = {
  $: "USD",
  "€": "EUR",
  "£": "GBP",
};

const normalizeCurrency = (value) => {
  if (!value) {
    return "";
  }
  return SYMBOL_TO_CURRENCY[value] || value.toUpperCase();
};

export default class extends HTMLElement {
  constructor() {
    super();
    this.$template = template;
    this.$segments = [];
  }

  connectedCallback() {
    this.$locale = this.hasAttribute("locale")
      ? this.getAttribute("locale")
      : navigator.language
      ? navigator.language
      : "en";
    this.$locale = this.$locale.split("-")[0];
    this.$locale = translations[this.$locale] ? this.$locale : "en";

    this.$currency = this.hasAttribute("currency")
      ? this.getAttribute("currency")
      : "EUR";

    this.$translations = translations[this.$locale]
      ? translations[this.$locale]
      : [];

    this.renderTemplate();

    this.el_route = this.querySelector('[name="route"]');
    this.el_route_builder = this.querySelector("route-builder");
    this.el_route_textarea = this.querySelector("#route-textarea");
    this.el_route_toggle = this.querySelector("#toggle-expert-mode");
    this.el_list = this.querySelector("#list");
    this.el_button = this.querySelector('button[type="submit"]');
    this.el_loading = this.querySelector(".loading");
    this.el_error = this.querySelector(".error");
    this.el_flightmap_container = this.querySelector('[name="flightmap"]');

    if (this.el_route_builder?.setTranslations) {
      this.el_route_builder.setTranslations(this.$translations);
    }

    this.querySelector("form").addEventListener("submit", (event) => {
      event.preventDefault();
      this.syncRouteValue();
      this.loading_start();
      this.calculate();
    });

    if (this.hasAttribute("route")) {
      const defaultRoute = this.getAttribute("route").replaceAll(",", "\n");
      if (this.el_route_builder) {
        this.el_route_builder.setAttribute("value", defaultRoute);
      }
      if (this.el_route_textarea) {
        this.el_route_textarea.value = defaultRoute;
      }
    }

    if (this.el_route_builder) {
      this.el_route_builder.addEventListener("route-builder-change", () => {
        if (!this.el_route_toggle?.checked) {
          this.syncRouteValue();
        }
      });
    }

    if (this.el_route_toggle) {
      this.el_route_toggle.addEventListener("change", () => {
        this.toggleRouteMode();
      });
    }

    if (this.el_route_textarea) {
      this.el_route_textarea.addEventListener("input", () => {
        if (this.el_route_toggle?.checked) {
          this.syncRouteValue();
        }
      });
    }

    if (location.hash) {
      this.loadParameters();
    }
  }

  renderTemplate() {
    this.innerHTML = translate(
      this.$template,
      this.$translations
    );
  }

  calculate() {
    const sourceValue = this.el_route_toggle?.checked
      ? this.el_route_textarea?.value
      : this.el_route_builder?.value || this.el_route?.value || "";
    let itineraries = sourceValue
      .trim()
      .split("\n")
      .map((value) => {
        let parts = value.split(":").map((v) => v.trim());
        let carrier = parts[0];
        let bookingClass = parts[1];
        let route = parts[2].split("-").map((v) => v.trim());
        let ticketer = parts[3] ? parts[3].trim() : carrier;
        let price = parts[4];
        const explicitCurrency =
          parts[5] && /^[A-Z]{3}$/i.test(parts[5])
            ? normalizeCurrency(parts[5])
            : "";
        let fareName = explicitCurrency ? parts[6] : parts[5];
        let currency =
          explicitCurrency ||
          (parts[4] && parts[4].match(/[A-Z]{3}|[$€£]/u)
            ? normalizeCurrency(parts[4].match(/[A-Z]{3}|[$€£]/u)[0])
            : this.$currency);

        const legCount = route.length > 1 ? route.length - 1 : 0;
        const priceValue = parseFloat(price);
        const hasPrice =
          price !== undefined &&
          price !== null &&
          price !== "" &&
          !Number.isNaN(priceValue);
        const perSegmentPrice =
          hasPrice && legCount > 0
            ? Math.floor(priceValue / legCount)
            : undefined;

        return route.reduce((accumulator, airport, index, route) => {
          if (0 === index || !accumulator) {
            return accumulator;
          }
          accumulator.push({
            carrier,
            bookingClass,
            origin: route[index - 1],
            destination: airport,
            ticketer,
            price: hasPrice ? perSegmentPrice : undefined,
            currency,
            fareName,
          });
          return accumulator;
        }, []);
      })
      .flat();
    this.$segments = itineraries.flat();
    this.update_hash();
    this.query(itineraries);

    for (elem in this.$segments.carrier) {
      if (elem.carrier == "AY") {
        var warningSpan = document.createElement("span");
        warningSpan.className = "redTextClass";
        warningSpan.innerHTML =
          "Leider können wir die Finnair-Plus-Punkte für Finnair-Flüge nicht berechnen";
        this.parentNode.insertBefore(warningSpan, this);
        //alert('Leider können wir die Finnair-Plus-Punkte für Finnair-Flüge nicht berechnen' );
      }
    }
  }

  async query(itineraries) {
    let body = JSON.stringify(
      itineraries.map((itinerary) => {
        return {
          ...(itinerary.ticketer
            ? { ticketingCarrier: itinerary.ticketer }
            : {}),
          ...(itinerary.price || itinerary.price === 0
            ? { baseFare: itinerary.price, currency: itinerary.currency }
            : {}),
          ...(itinerary.fareName ? { fareName: itinerary.fareName } : {}),
          segments: [itinerary],
        };
      })
    );

    Promise.all([
      fetch("https://wheretocredit.com/api/calculate/mileage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body,
      }),
    ])
      .then((responses) =>
        Promise.all(responses.map((response) => response.json()))
      )
      .then((responses) => this.calculate_totals(responses[0]))
      .catch((error) => {
        this.loading_end();
        this.el_error.innerHTML = `${error.toString()}`;
        this.el_error.classList.remove("hidden");
      });
  }

  calculate_totals(response) {
    let totals = response.value.reduce((totals, itinerary) => {
      itinerary.value.totals.forEach((item) => {
        item.rdm
          ? (totals[item.id] = totals[item.id]
              ? {
                  rdm: totals[item.id].rdm
                    ? totals[item.id].rdm.map((m, i) => m + item.rdm[i])
                    : item.rdm,
                  qm: totals[item.id].qm
                    ? totals[item.id].qm.map((m, i) => m + item.qm[i])
                    : item.qm ?? 0,
                  qd: totals[item.id].qd + item.qd,
                }
              : {
                  rdm: item.rdm,
                  qm: item.qm,
                  qd: item.qd,
                })
          : {};
      });

      return totals;
    }, {});

    this.display(response, totals);
  }

  display(data, totals) {
    this.loading_end();
  }

  loading_start() {
    this.el_button.disabled = true;
    this.el_list.innerHTML = "";
    this.el_loading.classList.remove("hidden");
    this.el_error.classList.add("hidden");
    this.el_error.innerHTML = "";
  }

  loading_end() {
    this.el_button.disabled = false;
    this.el_loading.classList.add("hidden");
  }

  loadParameters() {
    let searchParams = new URLSearchParams(location.hash.replace("#", ""));
    let routeValue = "";
    let el = {};
    for (let key of searchParams.keys()) {
      const value = searchParams.get(key);
      el = this.querySelector(`[name="${key}"]`);
      if (el) {
        "checkbox" === el.type
          ? (el.checked = "true" === value)
          : (el.value = value);
      }

      if ("route" === key) {
        routeValue = value?.replaceAll(",", "\n") ?? "";
      }
    }

    // Mirror the route hash parameter into the visible inputs so the user sees the pre-filled segments.
    if (routeValue) {
      if (this.el_route_builder) {
        this.el_route_builder.value = routeValue;
      }
      if (this.el_route_textarea) {
        this.el_route_textarea.value = routeValue;
      }
      this.syncRouteValue();
    }
  }

  update_hash() {
    const routeValue = this.el_route?.value
      ? this.el_route.value.replaceAll("\n", ",")
      : "";

    const params = new URLSearchParams();
    if (routeValue) {
      params.set("route", routeValue);
    }

    location.hash = params.toString();
  }

  toggleRouteMode() {
    const expertMode = this.el_route_toggle?.checked;
    const builderSection = this.querySelector(".route-mode--builder");
    const expertSection = this.querySelector(".route-mode--expert");

    if (builderSection && expertSection) {
      builderSection.classList.toggle("hidden", expertMode);
      expertSection.classList.toggle("hidden", !expertMode);
    }

    if (expertMode && this.el_route_builder && this.el_route_textarea) {
      this.el_route_textarea.value =
        this.el_route_builder.value || this.el_route?.value || "";
    } else if (!expertMode && this.el_route_builder && this.el_route_textarea) {
      this.el_route_builder.value = this.el_route_textarea.value;
    }
  }

  syncRouteValue() {
    const expertMode = this.el_route_toggle?.checked;
    const routeValue = expertMode
      ? this.el_route_textarea?.value
      : this.el_route_builder?.value;

    if (this.el_route && typeof routeValue === "string") {
      this.el_route.value = routeValue;
    }
  }
}
