import BaseComponent from "./base-component";
import translate from "./helper/translate";
import translations from "./translations";

export default class extends BaseComponent {
  constructor() {
    super();
    this.$template = /*html*/ `
      <style>
      button[disabled] {
        background-color: gray;
      }
      
      </style>
      <form>
        <label for="route">__(Routings)</label>
        <autocomplete-airports>
          <textarea id="route" name="route" class="w-full my-1" rows="2">HAM-FRA-EZE</textarea>
        </autocomplete-airports>
        <small></small>
        
        <p><small>__(See instructions on) <a href="__(https://travel-dealz.eu/tools/distance-calculator)" target="_blank">__(distance calculator)</a> </small> </p>
        <div class="my-3">
          <button class="mr-3 px-3 py-1 bg-brand hover:bg-gray-darker text-white" type="submit">__(Calculate)</button>
        </div>
      </form>
      <div class="loading hidden">__(Loading & calculating...)</div>
      <div class="error hidden"></div>
      <table id="list" name="list"></table>
      <p><small>__(Data provided by Travel-Dealz.eu)</small></p>
    `;
  }

  connectedCallback() {
    super.connectedCallback();
  }

  renderTemplate() {
    this.innerHTML = translate(
      this.$template,
      translations[this.$locale]
        ? translations[this.$locale]
        : translations["en"]
    );
  }

  calculate() {
    let itineraries = this.el_route.value
      .trim()
      .replace("\n", ",")
      .split(",")
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

    this.update_hash();
    this.query(this.$segments);
  }

  async query(segments) {
    let body = JSON.stringify();

    const filter_route = segments
      .map((segment) => segment.origin + "-" + segment.destination)
      .toString();

    fetch(
      "https://data.travel-dealz.eu/api/routes?locale=" +
        this.$locale +
        "&filter[route]=" +
        filter_route +
        "&fields[routes]=route,miles,from,to&include=from_airport,to_airport&fields[from_airport]=iatacode,name,location&fields[to_airport]=iatacode,name,location"
    )
      .then((response) => response.json())
      .then((routes) =>
        routes.reduce((obj, route) => {
          obj[route.route] = route;
          return obj;
        }, {})
      )
      .then((routes) => this.display(routes))
      .catch((error) => {
        this.loading_end();
        this.el_error.innerHTML = `${error.toString()}`;
        this.el_error.classList.remove("hidden");
      });
  }

  display(routes) {
    super.display();
    this.el_list.innerHTML = "";

    let el_thead = document.createElement("thead");
    el_thead.innerHTML = translate(
      /*html*/ `
      <tr>
        <th class="text-center">__(From)</th>
        <th class="text-center">__(To)</th>
        <th class="text-right">__(Miles)</th>
        <th class="text-right">__(Kilometer)</th>
      </tr>
    `,
      translations[this.$locale]
        ? translations[this.$locale]
        : translations["en"]
    );
    this.el_list.appendChild(el_thead);

    let total = 0;

    this.$segments.forEach((segment, index) => {
      let el = document.createElement("tr");
      let route = routes[segment.origin + "-" + segment.destination] ?? null;
      total += route.miles ?? 0;
      el.innerHTML = translate(
        /*html*/ `
        <td class="text-center">
          <div><code>${segment.origin}</code></div>
          <div class="text-xs text-grey-dark font-light">${
            route.from_airport ? route.from_airport.location : ""
          }</div>
        </td>
        <td class="text-center">
          <div><code>${segment.destination}</code></div>
          <div class="text-xs text-grey-dark font-light">${
            route.to_airport ? route.to_airport.location : ""
          }</div>
        </td>
        <td class="text-right">
          ${
            route.miles
              ? route.miles.toLocaleString(undefined, {
                  style: "unit",
                  unit: "mile",
                  maximumFractionDigits: 0,
                })
              : "-"
          }
        </td>
        <td class="text-right">
          ${
            route.miles
              ? (route.miles * 1.60934).toLocaleString(undefined, {
                  style: "unit",
                  unit: "kilometer",
                  maximumFractionDigits: 0,
                })
              : "-"
          }
        </td>
        `,
        translations[this.$locale] ? translations[this.$locale] : []
      );
      this.el_list.appendChild(el);
    });
    let el_foot = document.createElement("tfoot");
    el_foot.innerHTML = translate(
      /*html*/ `
      <tr>
        <th class="text-right" colspan="2">__(Total)</th>
        <th class="text-right">
          ${total.toLocaleString(undefined, {
            style: "unit",
            unit: "mile",
            maximumFractionDigits: 0,
          })}
        </th>
        <th class="text-right">
          ${(total * 1.60934).toLocaleString(undefined, {
            style: "unit",
            unit: "kilometer",
            maximumFractionDigits: 0,
          })}
        </th>
      </tr>
      <tr class="text-sm">
        <th class="text-right" colspan="2">__(Return)</th>
        <th class="text-right">${(total * 2).toLocaleString(undefined, {
          style: "unit",
          unit: "mile",
          maximumFractionDigits: 0,
        })}</th>
        <th class="text-right">${(total * 2 * 1.60934).toLocaleString(
          undefined,
          {
            style: "unit",
            unit: "kilometer",
            maximumFractionDigits: 0,
          }
        )}</th>
      </tr>
    `,
      translations[this.$locale] ? translations[this.$locale] : []
    );
    this.el_list.appendChild(el_foot);
  }
}
