import programs from './programs';
import translate from './helper/translate';
import trans_de from './languages/de.json';
import trans_es from './languages/es.json';

const translations = {
	en: [],
	de: trans_de,
	es: trans_es,
};

const template = /*html*/`
  <style>
  li {
    margin-bottom: 1rem;
  }
  </style>
  <form>
    <label for="route">__(Routings)</label>
    <textarea name="route" class="w-full my-1">LH:A:FRA-HKG-MUC</textarea>
    <small></small>
    <div class="my-3">
      <button class="mr-3 px-3 py-1 bg-brand hover:bg-gray-darker text-white" type="submit">__(Calculate)</button>
      <label for="status">__(Status)</label>
      <select name="status">
        <option>Star Alliance Silver</option>
        <option selected>Star Alliance Gold</option>
      </select>
    </div>
  </form>
  <ol id="list" data-columns="3"></ol>
  <p><small>__(Data provided by) <a href="https://www.wheretocredit.com" target="_blank">wheretocredit.com</a></small></p>
`;

class StatusCalculator extends HTMLElement {
  constructor() {
    super();
    this.count = 0;
    this.$status = 'Star Alliance Gold';
    this.$segments = [];
  }

  connectedCallback() {

    this.$locale = this.hasAttribute('locale') ? this.getAttribute('locale') : navigator.language ? navigator.language : 'en';
    this.$locale = this.$locale.split('-')[0];

    this.innerHTML = translate(template, translations[this.$locale] ? translations[this.$locale] : []);

    this.el_route = this.querySelector('[name="route"]');
    this.el_list = this.querySelector('#list');
    this.querySelector('form').addEventListener('submit', (event) => {
      event.preventDefault();
      this.calculate();
    });
  }

  calculate() {

    this.$status = this.querySelector('[name="status"]').value;

    let itineraries = this.el_route.value
      .trim()
      .split('\n')
      .map(value => {
        let parts = value.split(':').map(v => v.trim());
        let carrier = parts[0];
        let bookingClass = parts[1];
        let route = parts[2].split('-').map(v => v.trim());

        return route.reduce((accumulator, airport, index, route) => {
          if(0 === index || ! accumulator) {
            return accumulator;
          }
          accumulator.push({
            carrier,
            bookingClass,
            origin: route[index-1],
            destination: airport,
          });
          return accumulator;
        }, []);

      })
      .flat();
    this.$segments = itineraries.flat();
    this.query(itineraries);
  }

  query(itineraries) {
    fetch('https://www.wheretocredit.com/api/2.0/calculate', {
      method: 'POST',
      headers: {
      'Content-Type': 'application/json'
      },
      body: JSON.stringify(itineraries.map( itinerary => { return { segments: [itinerary] } } )),
    })
      .then(response => response.json())
      .then(data => this.display(data.value))
      .catch(error => alert(`Where to Credit ${error.toString()}`));
  }

  display( data ) {

    let totals = data.reduce((totals, itinerary) => {
        itinerary.value.totals.forEach(item => {
          totals[item.id] = totals[item.id] ? totals[item.id] + item.rdm[0] : item.rdm[0];
        })
        return totals;
      }, {} );

    this.el_list.innerHTML = '';

    Object.keys(totals)
      .map(id => {
        const program = programs[id];
        if (!program) {
          return [];
        }

        return program.status
          .filter(status => this.$status === status.allianceStatus)
          .map(status => {
            return status.qualification.map(qualification => {

              let build = {
                program,
                status,
                qualification,
              };

              switch(qualification.type) {
                case 'miles': 
                  build.needed = qualification.number;
                  build.collected = totals[id];
                  build.progress = build.collected / build.needed;
                  break;
                case 'segments':
                  build.needed = qualification.number;
                  build.collected = this.$segments.length;
                  build.progress = build.collected / build.needed;
              }

              if(qualification.calculate) {
                build.collected = qualification.calculate(this.$segments, data);
                build.progress = build.collected / build.needed;
              }

              if(qualification.secType) {

                switch(qualification.secType) {
                  case 'miles': 
                    build.secNeeded = qualification.secNumber;
                    build.secCollected = totals[id];
                    build.secProgress = build.secCollected / build.secNeeded;
                    break;
                  case 'segments':
                    build.secNeeded = qualification.secNumber;
                    build.secCollected = this.$segments.length;
                    build.secProgress = build.secCollected / build.secNeeded;
                }

                if(qualification.secCalculate) {
                  build.secCollected = qualification.secCalculate(this.$segments, data);
                  build.secProgress = build.secCollected / build.secNeeded;
                }

              }

              return build;
            }) 
          })
          .flat()
          .filter(status => undefined !== typeof status.progress);
      })
      .flat()
      .sort((a,b) => b.progress-a.progress )
      .forEach(item => {
        let el = document.createElement('li');
        let text = `
        <h3>${item.program.name}: ${item.status.name}</h3>
        <div class="grid grid-cols-2 gap-4 my-3" style="gap: .75rem;">
          <div class="${'undefined' === typeof item.secProgress ? 'col-span-2' : ''}">
            <div class="text-sm">${item.progress.toLocaleString(undefined, {style: 'percent', minimumFractionDigits: 0})} = ${item.collected.toLocaleString()} __(of) ${item.needed.toLocaleString()} __(${item.qualification.type})</div>
            <progress class="w-full" value="${item.progress}">${item.progress.toLocaleString(undefined, {style: 'percent', minimumFractionDigits: 0})}</progress>
          </div>
        ${'undefined' === typeof item.secProgress ? '' : `
          <div>
            <div class="text-sm">${item.secProgress.toLocaleString(undefined, {style: 'percent', minimumFractionDigits: 0})} = ${item.secCollected.toLocaleString()} __(of) ${item.secNeeded.toLocaleString()} __(${item.qualification.secType})</div>
            <progress class="w-full" value="${item.secProgress}">${item.secProgress.toLocaleString(undefined, {style: 'percent', minimumFractionDigits: 0})}</progress>
          </div>
          `}
          <div class="col-span-2 text-sm">
            ${ item.qualification.note && item.qualification.note[this.$locale] ? `<div>${item.qualification.note[this.$locale]}</div>`: '' }
            ${ item.status.note && item.status.note[this.$locale] ? `<div>${item.status.note[this.$locale]}</div>`: '' }
            ${ item.program.note && item.program.note[this.$locale] ? `<div>${item.program.note[this.$locale]}</div>`: '' }
          </div>
          <div class="text-center">
            <div class="text-sm">__(Qualification period)</div>
            <div>${item.qualification.qualificationPeriod} __(months)</div>
            <div class="text-sm">__(${item.program.qualificationPeriodType})</div>
          </div>
          <div class="text-center">
            <div class="text-sm">__(Validity)</div>
            <div>__(at least) ${item.qualification.validity} __(months)</div>
          </div>
        </div>
        `;

        el.innerHTML = translate(text, translations[this.$locale] ? translations[this.$locale] : []);;
        this.el_list.appendChild(el);
      });

  }


}

customElements.define("status-calculator", StatusCalculator);
