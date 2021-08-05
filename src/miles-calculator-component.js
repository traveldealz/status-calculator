import BaseComponent from "./base-component";
import translate from "./helper/translate";
import translations from "./translations";
import template from "./templates/miles-calculator";

export default class extends BaseComponent {
  constructor() {
    super();
    this.$template = template;
  }

  connectedCallback() {
    super.connectedCallback();
  }

  renderTemplate() {
    this.innerHTML
      ? (this.template = innerHTML)
      : (this.innerHTML = translate(
          this.$template,
          translations[this.$locale] ? translations[this.$locale] : []
        ));
  }

  calculate() {
    this.$programs = [];
    fetch("https://mileage.travel-dealz.eu/api/airline_programs")
      .then((response) => response.json())
      .then((data) =>
        data.reduce((programs, item) => {
          programs[item.code] = item;
          return programs;
        }, {})
      )
      .then((programs) => (this.$programs = programs));
    super.calculate();
  }

  display({ value: data, programs, airports }, totals) {
    super.display();

    this.el_list.innerHTML = "";

    Object.keys(totals)
      .map((id) => {
        const program = this.$programs[id];
        if (!program) {
          return [];
        }
        let build = { program };
        if (program.translations) {
          build.rdmname = program.translations[this.$locale].rdm;
          program.translations[this.$locale].qm_short
            ? (build.qmname = program.translations[this.$locale].qm_short)
            : (build.qmname = program.translations[this.$locale].qm);
          program.translations[this.$locale].name
            ? (build.programname = program.translations[this.$locale].name)
            : (build.programname = program.name);
        } else {
          build.rdmname = "Award Miles";
          build.qmname = "Status Miles";
          build.programname = program.name;
        }
        build.collected = totals[id].rdm[0];
        build.statusmiles = totals[id].qm[0] > 1 ? totals[id].qm[0] : 0;
        if (
          program.translations.en.rdm == "Award Miles" &&
          program.translations.en.qm == "Tier Miles" &&
          build.statusmiles == build.collected
        ) {
          build.rdmname = "miles";
        }

        return build;
      })
      .flat()
      .filter((build) => 1 < build.collected)
      .flat()
      .sort((a, b) => b.collected - a.collected)
      .forEach((item) => {
        let el = document.createElement("li");
        let text = `
        ${item.collected.toLocaleString()} __(${item.rdmname}) 
        ${
          item.statusmiles != item.collected && item.statusmiles > 1
            ? " + " + item.statusmiles.toLocaleString() + " " + item.qmname
            : ""
        } __(on) ${item.programname} </div>
        `;

        el.innerHTML = translate(
          text,
          translations[this.$locale] ? translations[this.$locale] : []
        );
        this.el_list.appendChild(el);
      });
  }
}
