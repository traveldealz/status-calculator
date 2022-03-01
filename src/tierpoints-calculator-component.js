import BaseComponent from "./base-component";
import translate from "./helper/translate";
import translations from "./translations";
import template from "./templates/tierpoints-calculator";

export default class extends BaseComponent {
  constructor() {
    super();
    this.$template = template;
    this.$program;
    this.$alliance;
  }

  async getPrograms() {
    let response;
    if (this.$alliance.length > 3) {
      response = await fetch(
        "https://mileage.travel-dealz.eu/api/airline_programs?include=airlines&filter[has_qualification]=true&filter[alliance]=" +
          this.$alliance
      )
        .then((response) => response.json())
        .then((data) =>
          data.reduce((programs, item) => {
            programs[item.code] = item;
            return programs;
          }, {})
        )
        .then((programs) => (this.$programs = programs));
    } else {
      response = await fetch(
        "https://mileage.travel-dealz.eu/api/airline_programs?include=airlines&filter[has_qualification]=true&filter[code]=" +
          this.$alliance
      )
        .then((response) => response.json())
        .then((data) =>
          data.reduce((programs, item) => {
            programs[item.code] = item;
            return programs;
          }, {})
        )
        .then((programs) => (this.$programs = programs));
    }
    return await response;
  }

  async buildOptions() {
    this.progs = await this.getPrograms();
    let progs = this.progs;
    this.el_program = this.querySelector('[name="program"]');
    for (const programm of Object.entries(this.progs)) {
      let el_option = document.createElement("option");
      el_option.value = programm[0];
      el_option.innerHTML = programm[1].name;
      this.el_program.appendChild(el_option);
    }

    var tmpAry = new Array();
    for (var i = 0; i < this.el_program.options.length; i++) {
      tmpAry[i] = new Array();
      tmpAry[i][0] = this.el_program.options[i].text;
      tmpAry[i][1] = this.el_program.options[i].value;
    }
    tmpAry.sort();
    while (this.el_program.options.length > 0) {
      this.el_program.options[0] = null;
    }
    for (var i = 0; i < tmpAry.length; i++) {
      var op = new Option(tmpAry[i][0], tmpAry[i][1]);
      this.el_program.options[i] = op;
    }

    for (const option of this.el_program) {
      if (option.value == this.$program) {
        option.selected = true;
      }
    }

    let el_tier = this.querySelector('[name="status"]');
    for (const programm of Object.entries(progs)) {
      if (this.$program === programm[0]) {
        programm[1].translations.en.tiers.forEach((status, index) => {
          let el_option = document.createElement("option");
          el_option.value = index;
          el_option.innerHTML = status;
          el_tier.appendChild(el_option);
        });
      }
    }
    let change = this;
    this.querySelector('[name="program"]').addEventListener(
      "change",
      function (e) {
        el_tier.options.length = 0;
        for (const programm of Object.entries(progs)) {
          if (e.target.value === programm[0]) {
            programm[1].translations.en.tiers.forEach((status, index) => {
              let el_option = document.createElement("option");
              el_option.value = index;
              el_option.innerHTML = status;
              el_tier.appendChild(el_option);
            });
          }
        }
        change.update_table();
      }
    );

    this.querySelector('[name="status"]').addEventListener(
      "change",
      (event) => {
        this.update_table();
      }
    );

    this.$program = this.querySelector('[name="program"]');
    this.el_status = this.querySelector('[name="status"]');
  }

  update_table() {
    if (this.$value != undefined) {
      this.display(this.$value, this.$totals);
    }
  }

  connectedCallback() {
    super.connectedCallback();

    this.$program = this.hasAttribute("program")
      ? this.getAttribute("program")
      : "BA";
    this.$alliance = this.hasAttribute("alliance")
      ? this.getAttribute("alliance")
      : "";
    this.buildOptions();
  }

  /*
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
        this.$program.value,
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
  }*/

  display({ value: data, airlines, airports }, totals) {
    this.$value = { value: data, airlines, airports };
    console.log(this.$value);

    this.$totals = totals;

    super.display();
    this.$locale !== "en" && this.$locale !== "de" && this.$locale !== "es"
      ? (this.$locale = "en")
      : {};

    this.el_list.innerHTML = "";
    let totalqm = 0;
    let totalrm = 0;
    let el_thead = document.createElement("thead");
    this.rm_label =
      this.progs[this.$program.value].translations[this.$locale].rdm;
    this.qm_label =
      this.progs[this.$program.value].translations[this.$locale].qm;
    console.log(this.rm_label);
    console.log(this.qm_label);
    el_thead.innerHTML = translate(
      /*html*/ `
      <tr>
        <th></th>
        <th class="text-center">__(Route)</th>
        <th class="text-center">__(Booking Class)</th>
        <th class="text-right">${
          this.rm_label ? this.rm_label : "__(Award Miles)"
        }</th>
        <th class="text-right">${
          this.qm_label ? this.qm_label : "__(Status Miles)"
        }</th>
      </tr>
    `,
      translations[this.$locale]
        ? translations[this.$locale]
        : translations["en"]
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
      let earning = data[index].value.totals.find(
        (item) => item.id == this.$program.value
      );
      console.log(earning);

      if (earning == undefined) {
        earning = { id: this.$program.value, qm: [0, 0], rdm: [0, 0] };
      }

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
        <th class="text-right" colspan="3">__(Total)</th>
        <th class="text-right">${totalrm.toLocaleString()}</th>
        <th class="text-right">${totalqm.toLocaleString()}</th>
      </tr>
    `,
      translations[this.$locale]
        ? translations[this.$locale]
        : translations["en"]
    );
    this.el_list.appendChild(el_foot);
  }
}
