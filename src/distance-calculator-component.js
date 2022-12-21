import BaseComponent from "./base-component";
import translate from "./helper/translate";
import translations from "./translations";
import template from "./templates/distance-calculator";

export default class extends BaseComponent {
  constructor() {
    super();
    this.$template = template;
  }

  update_table() {
    if (this.$value != undefined) {
      this.display(this.$value, this.$totals);
    }
  }

  calculate() {
    let itineraries = this.el_route.value
      .trim()
      .split("\n")
      .map((value) => {
        let route = value.split("-").map((v) => v.trim());

        return route.reduce((accumulator, airport, index, route) => {
          if (0 === index || !accumulator) {
            return accumulator;
          }
          accumulator.push({
            origin: route[index - 1],
            destination: airport,
          });
          return accumulator;
        }, []);
      })
      .flat();
    this.$segments = itineraries.flat();
    console.log(this.$segments);
    this.update_hash();
    this.query(itineraries);
  }

  connectedCallback() {
    this.$locale = this.hasAttribute("locale")
      ? this.getAttribute("locale")
      : navigator.language
      ? navigator.language
      : "en";
    this.$locale = this.$locale.split("-")[0];
    this.$locale = translations[this.$locale] ? this.$locale : "en";

    this.renderTemplate();

    this.el_route = this.querySelector('[name="route"]');
    this.el_list = this.querySelector("#list");
    this.el_button = this.querySelector('button[type="submit"]');
    this.el_loading = this.querySelector(".loading");
    this.el_error = this.querySelector(".error");

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

  async query(itineraries) {
    //for (var i = 0; i < itineraries.length; i++) {
    //  if (i > 0) {
    //console.log(itineraries[i]);
    //    itineraries[i].price = 0;
    //  }
    //}
    let body = JSON.stringify(
      itineraries.map((itinerary) => {
        return {
          segments: [itinerary],
        };
      })
    );
    let routes = [];
    this.$segments.forEach((element) =>
      routes.push(element.origin + "-" + element.destination)
    );

    fetch(
      "https://mileage.travel-dealz.eu/api/routes?filter[route]=" +
        routes.flat() +
        "&fields[routes]=route,miles",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((response) => this.calculate_totals(response));
    // .catch(error => {
    //   this.loading_end();
    //   this.el_error.innerHTML = `Error: ${error.toString()}`;
    //   this.el_error.classList.remove('hidden');
    // });
  }

  calculate_totals(response) {
    this.display(response);
  }

  display(response) {
    super.display();

    this.$locale !== "en" && this.$locale !== "de" && this.$locale !== "es"
      ? (this.$locale = "en")
      : {};

    this.el_list.innerHTML = "";
    let totalmiles = 0;
    let el_thead = document.createElement("thead");
    el_thead.innerHTML = translate(
      /*html*/ `
      <tr>
        <th></th>
        <th class="text-right">__(Route)</th>
        <th class="text-right">__(Miles)</th>
        <th class="text-right">__(Kilometres)</th>
      </tr>
    `,
      translations[this.$locale]
        ? translations[this.$locale]
        : translations["en"]
    );
    this.el_list.appendChild(el_thead);

    response.forEach((route) => {
      totalmiles += route.miles;
      let el = document.createElement("tr");
      el.innerHTML = translate(
        /*html*/ `
        <td class="text-right">
              <div><code>${route.route}</code></div>  
        </td>        
        <td class="text-right">${`${route.miles.toLocaleString()}`}</td>
        <td class="text-right">${`${parseInt(
          route.miles * 1.6
        ).toLocaleString()}`}</td>
        `,
        translations[this.$locale]
          ? translations[this.$locale]
          : translations["en"]
      );
      this.el_list.appendChild(el);
    });
    let el_foot = document.createElement("tfoot");

    el_foot.innerHTML = translate(
      /*html*/ `
      <tr>
        <th class="text-right" colspan="2">__(Total)</th>
        <th class="text-right">${totalmiles.toLocaleString()}</th>
        <th class="text-right">${parseInt(
          totalmiles * 1.6
        ).toLocaleString()}</th>
      </tr>
    `,
      translations[this.$locale]
        ? translations[this.$locale]
        : translations["en"]
    );
    this.el_list.appendChild(el_foot);
  }
}
