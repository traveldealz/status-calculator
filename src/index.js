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
  button[disabled] {
    background-color: gray;
  }
  </style>
  <form>
    <label for="route">__(Routings)</label>
    <textarea name="route" class="w-full my-1" rows="8">LH:A:FRA-HKG-MUC</textarea>
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
  <div class="loading hidden">__(Loading & calculating...)</div>
  <div class="error hidden"></div>
  <ol id="list"></ol>
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
    this.el_button = this.querySelector('button[type="submit"]');
    this.el_loading = this.querySelector('.loading');
    this.el_error = this.querySelector('.error');

    this.querySelector('form').addEventListener('submit', (event) => {
      event.preventDefault();
      this.loading_start();
      this.calculate();
    });

    if ( location.hash ) {
			this.loadParameters();
		}

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
        let ticketer = parts[3];
        let price = parseInt(parts[4]/(parts[2].split('-').length - 1));

        return route.reduce((accumulator, airport, index, route) => {
          if(0 === index || ! accumulator) {
            return accumulator;
          }
          accumulator.push({
            carrier,
            bookingClass,
            origin: route[index-1],
            destination: airport,
            ticketer,
            price,
          });
          return accumulator;
        }, []);

      })
      .flat();
    this.$segments = itineraries.flat();
    this.update_hash();
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
      .catch(error => {
        this.loading_end();
        this.el_error.innerHTML = `Where to Credit ${error.toString()}`;
        this.el_error.classList.remove('hidden');
      });
  }

  display( data ) {

    this.loading_end();

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
                  qualification.milesName? build.milesname = qualification.milesName[this.$locale] : build.milesname = qualification.type;
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
                    build.secNote = qualification.secNote;
                    break;
                  case 'segments':
                    build.secNeeded = qualification.secNumber;
                    build.secCollected = this.$segments.length;
                    build.secProgress = build.secCollected / build.secNeeded;
                    build.secNote = qualification.secNote;
                    qualification.secmilesName? build.secmilesname = qualification.secmilesName[this.$locale] : build.secmilesname = qualification.type;

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
        <div class="grid grid-cols-2 gap-x-4 gab-y-8 my-3" style="row-gap: 1rem; column-gap: 2rem;">
          ${ item.program.note ? `
          <div class="col-span-2 text-sm">
            ${ item.program.note && item.program.note[this.$locale] ? `<div>${item.program.note[this.$locale]}</div>`: '' }
          </div>
          ` : '' }
          <div class="${'undefined' === typeof item.secProgress ? 'col-span-2 ' : ''}flex flex-col justify-end">
            <div class="text-sm">${item.progress.toLocaleString(undefined, {style: 'percent', minimumFractionDigits: 0})} = ${item.collected.toLocaleString()} __(of) ${item.needed.toLocaleString()} __(${item.milesname})</div>
            <progress class="w-full" value="${item.progress}">${item.progress.toLocaleString(undefined, {style: 'percent', minimumFractionDigits: 0})}</progress>
          </div>
          ${'undefined' === typeof item.secProgress ? '' : `
          <div class="flex flex-col justify-end">
            <div class="text-sm">${item.secProgress.toLocaleString(undefined, {style: 'percent', minimumFractionDigits: 0})} = ${item.secCollected.toLocaleString()} __(of) ${item.secNeeded.toLocaleString()} __(${item.secmilesname})</div>
            <progress class="w-full" value="${item.secProgress}">${item.secProgress.toLocaleString(undefined, {style: 'percent', minimumFractionDigits: 0})}</progress>
           </div>
          `}
          ${ item.qualification.note || item.qualification.secNote ? `
          <div class="text-sm${'undefined' === typeof item.qualification.secNote ? ' col-span-2 ' : ''}">
            ${ item.qualification.note && item.qualification.note[this.$locale] ? `<div>${item.qualification.note[this.$locale]}</div>`: '' }
          </div>
          ${'undefined' !== typeof item.secProgress && item.qualification.secNote ? `
          <div class="text-sm">
            ${ item.qualification.secNote && item.qualification.secNote[this.$locale] ? item.qualification.secNote[this.$locale] : '' }
          </div>
          ` : '' }
          ` : '' }
          ${ item.status.note ? `
          <div class="col-span-2 text-sm">
            ${ item.status.note && item.status.note[this.$locale] ? `<div>${item.status.note[this.$locale]}</div>`: '' }
          </div>
          ` : '' }
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

  loading_start() {
    this.el_button.disabled = true;
    this.el_list.innerHTML = '';
    this.el_loading.classList.remove('hidden');
    this.el_error.classList.add('hidden');
    this.el_error.innerHTML = '';
  }

  loading_end() {
    this.el_button.disabled = false;
    this.el_loading.classList.add('hidden');
  }

  loadParameters() {
		let searchParams = new URLSearchParams(location.hash.replace('#',''));
		let el = {};
		for(let key of searchParams.keys()) {
			el = this.querySelector(`[name="${key}"]`);
			if (el) {
				'checkbox' === el.type ? el.checked = 'true' === searchParams.get(key) : el.value = searchParams.get(key);
			}
		}
	}

  update_hash() {
		let parameters = {};
		//parameters.routes = this.querySelector('[name="routes"]').value;
		[...this.querySelectorAll('[name]')].forEach(el => parameters[el.name] = 'checkbox' === el.type ? el.checked : el.value);
		location.hash = (new URLSearchParams(parameters)).toString();
	}

}

customElements.define("status-calculator", StatusCalculator);
