import BaseComponent from "./base-component";
import translate from "./helper/translate";
import translations from "./translations";
import template from "./templates/tierpoints-calculator";

export default class extends BaseComponent {
  constructor() {
    super();
    this.$template = template;
    this.$program = "BA";
  }

  connectedCallback() {
    super.connectedCallback();
    this.$program = this.hasAttribute("program")
      ? this.getAttribute("program")
      : "BA";
    this.$points_label = this.hasAttribute("points_label")
      ? this.getAttribute("points_label")
      : null;
    this.$awardmiles_label = this.hasAttribute("awardmiles_label")
      ? this.getAttribute("awardmiles_label")
      : null;
    this.$status_labels = this.hasAttribute("status_labels")
      ? this.getAttribute("status_labels").split(",")
      : ["None", "Silver", "Gold", "Platinum"];

    this.el_status = this.querySelector('[name="status"]');
    this.$status_labels.forEach((status, index) => {
      let el_option = document.createElement("option");
      el_option.value = index;
      el_option.innerHTML = status;
      this.el_status.appendChild(el_option);
    });
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
          ...(itinerary.ticketer
            ? { ticketingCarrier: itinerary.ticketer }
            : { ticketingCarrier: "null" }),
          ...(itinerary.price
            ? { baseFare: itinerary.price, currency: itinerary.currency }
            : { baseFare: 0 }),
          segments: [itinerary],
        };
      })
    );

    fetch(
      "https://mileage.travel-dealz.eu/api/calculate/mileage?programs=" +
        this.$program,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body,
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

  display({ value: data, airlines, airports }, totals) {
    super.display();
    this.el_list.innerHTML = "";
    let totalqm = 0;
    let totalrm = 0;
    let el_thead = document.createElement("thead");
    el_thead.innerHTML = translate(
      /*html*/ `
      <tr>
        <th></th>
        <th class="text-center">__(Route)</th>
        <th class="text-center">__(Bookingclass)</th>
        <th class="text-right">${
          this.$awardmiles_label ? this.$awardmiles_label : "__(Award Miles)"
        }</th>
        <th class="text-right">${
          this.$points_label ? this.$points_label : "__(Points)"
        }</th>
      </tr>
    `,
      translations[this.$locale] ? translations[this.$locale] : []
    );
    this.el_list.appendChild(el_thead);

    const status_key = this.el_status.value;
    const cabinclass = {
      Y: "Economy",
      W: "Premium Eco",
      C: "Business",
      F: "First",
    };

    this.$segments.forEach((segment, index) => {
      const earning = data[index].value.totals.find(
        (item) => item.id === this.$program
      );

      let rd_status_key = status_key;
      status_key > earning.rdm.length - 1
        ? (rd_status_key = earning.rdm.length - 1)
        : {};

      let qm_status_key = status_key;
      status_key > earning.qm.length - 1
        ? (qm_status_key = earning.qm.length - 1)
        : {};

      earning.rdm ? (totalrm += earning.rdm[rd_status_key]) : {};
      earning.qm ? (totalqm += earning.qm[qm_status_key]) : {};

      let el = document.createElement("tr");
      el.innerHTML = translate(
        /*html*/ `
        <td class="align-top text-vertical text-center text-xs text-grey-dark font-light">${data[
          index
        ].value.distance?.toLocaleString()} __(miles)</td>
        <td class="text-center">
          <div class="grid grid-cols-1 md:grid-cols-2">
            <div>
              <div><code>${segment.origin}</code></div>
              <div class="text-xs text-grey-dark font-light">${
                airports[segment.origin]?.location
              }</div>
            </div>
            <div>
              <div><code>${segment.destination}</code></div>
              <div class="text-xs text-grey-dark font-light">${
                airports[segment.destination]?.location
              }</div>
            </div>
          </div>
        </td>
        <td class="text-center">
          <div class="grid grid-cols-1 md:grid-cols-2">
            <div>
              <div><code>${segment.carrier}</code></div>
              <div class="text-xs text-grey-dark font-light">${
                airlines[segment.carrier]?.name
              }</div>
            </div>
            <div>
              <div><code>${segment.bookingClass}</code></div>
              <div class="text-xs text-grey-dark font-light">${
                airlines[segment.carrier]?.bookingclass
                  ? cabinclass[
                      airlines[segment.carrier]?.bookingclass[
                        segment.bookingClass
                      ]?.cabinclass
                    ]
                  : ""
              } ${
          airlines[segment.carrier]?.bookingclass
            ? airlines[segment.carrier]?.bookingclass.fare
              ? airlines[segment.carrier]?.bookingclass[segment.bookingClass]
                  ?.fare
              : ""
            : ""
        }</div>
            </div>
          </div>
        </td>
        <td class="text-right">${
          false === data[index].success
            ? data[index].errorMessage
            : `${
                earning.rdm ? earning.rdm[rd_status_key]?.toLocaleString() : "-"
              }`
        }</td>
        <td class="text-right">${
          false === data[index].success
            ? data[index].errorMessage
            : `${earning.qm ? earning.qm[qm_status_key]?.toLocaleString() : 0}`
        }</td>
        `,
        translations[this.$locale] ? translations[this.$locale] : []
      );
      this.el_list.appendChild(el);
    });
    let el_foot = document.createElement("tfoot");

    el_foot.innerHTML = translate(
      /*html*/ `
      <tr>
        <th class="text-right" colspan="3">__(Total)</th>
        <th class="text-right">${totalrm.toLocaleString()}</th>
        <th class="text-right">${totalqm.toLocaleString()}</th>
      </tr>
    `,
      translations[this.$locale] ? translations[this.$locale] : []
    );
    this.el_list.appendChild(el_foot);
  }
}
