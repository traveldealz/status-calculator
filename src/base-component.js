import template from "./templates/base";
import translate from "./helper/translate";
import translations from "./translations";

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

    this.renderTemplate();

    this.el_route = this.querySelector('[name="route"]');
    this.el_list = this.querySelector("#list");
    this.el_button = this.querySelector('button[type="submit"]');
    this.el_loading = this.querySelector(".loading");
    this.el_error = this.querySelector(".error");
    this.el_flightmap_container = this.querySelector('[name="flightmap"]');

    this.querySelector("form").addEventListener("submit", (event) => {
      event.preventDefault();
      this.loading_start();
      this.calculate();
    });

    if (this.hasAttribute("route")) {
      this.querySelector('[name="route"]').innerHTML = this.getAttribute(
        "route"
      ).replaceAll(",", "\n");
    }

    if (location.hash) {
      this.loadParameters();
    }
  }

  renderTemplate() {
    this.innerHTML = translate(
      this.$template,
      translations[this.$locale] ? translations[this.$locale] : []
    );
  }

  calculate() {
    let itineraries = this.el_route.value
      .trim()
      .split("\n")
      .map((value) => {
        let parts = value.split(":").map((v) => v.trim());
        let carrier = parts[0];
        let bookingClass = parts[1];
        let route = parts[2].split("-").map((v) => v.trim());
        let ticketer = parts[3];
        let price = parts[4];
        let currency =
          parts[4] && parts[4].match(/[A-Z]{3}|[$€£]/u)
            ? parts[4].match(/[A-Z]{3}|[$€£]/u)[0]
            : this.$currency;
        let fareName = parts[5];

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
            price: index == 1 ? parseInt(price) : 0,
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
      fetch("https://miles.travel-dealz.com/api/calculate/mileage", {
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
    let el = {};
    for (let key of searchParams.keys()) {
      el = this.querySelector(`[name="${key}"]`);
      if (el) {
        "checkbox" === el.type
          ? (el.checked = "true" === searchParams.get(key))
          : (el.value = searchParams.get(key));
      }
    }
  }

  update_hash() {
    let parameters = {};
    [...this.querySelectorAll("[name]")].forEach(
      (el) =>
        (parameters[el.name] = "checkbox" === el.type ? el.checked : el.value)
    );
    location.hash = new URLSearchParams(parameters).toString();
  }
}
