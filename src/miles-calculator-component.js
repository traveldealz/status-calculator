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
    /*this.innerHTML
      ? (this.template = this.innerHTML)
      : */ this.innerHTML = translate(
      this.$template,
      translations[this.$locale]
        ? translations[this.$locale]
        : translations["en"]
    );
  }

  calculate() {
    this.$programs = [];
    fetch("https://wheretocredit.com/api/airline_programs")
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
    this.$locale !== "en" && this.$locale !== "de" && this.$locale !== "es"
      ? (this.$locale = "en")
      : {};

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
        build.statusmiles =
          totals[id].qm && totals[id].qm[0] > 1 ? totals[id].qm[0] : 0;
        if (build.statusmiles == build.collected) {
          build.rdmname = "miles";
        }

        return build;
      })
      .flat()
      .filter((build) => 1 < build.collected || 1 < build.statusmiles)
      .flat()
      .sort((a, b) => b.collected - a.collected)
      .forEach((item) => {
        let el = document.createElement("li");
        let text = `
        ${
          item.collected > 0
            ? item.collected.toLocaleString() + " "
            : "__(Spending-based)" + " "
        }__(${item.rdmname})  
        ${
          item.statusmiles != item.collected && item.statusmiles > 1
            ? " + " + item.statusmiles.toLocaleString() + " " + item.qmname
            : ""
        } __(on) ${item.programname} </div>
        `;

        el.innerHTML = translate(
          text,
          translations[this.$locale]
            ? translations[this.$locale]
            : translations["en"]
        );
        this.el_list.appendChild(el);
      });
  }
}
