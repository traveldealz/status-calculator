import template from './templates/base';
import translate from './helper/translate';
import translations from './translations';

export default class extends HTMLElement {
  constructor() {
    super();
    this.$template = template;
    this.$segments = [];
  }

  connectedCallback() {

    this.$locale = this.hasAttribute('locale') ? this.getAttribute('locale') : navigator.language ? navigator.language : 'en';
    this.$locale = this.$locale.split('-')[0];

    this.innerHTML = translate(this.$template, translations[this.$locale] ? translations[this.$locale] : []);

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

    if ( this.hasAttribute('route') ) {
      this.querySelector('[name="route"]').innerHTML = this.getAttribute('route').replaceAll(',', '\n');
    }

    if ( location.hash ) {
			this.loadParameters();
		}

  }

  calculate() {

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
		[...this.querySelectorAll('[name]')].forEach(el => parameters[el.name] = 'checkbox' === el.type ? el.checked : el.value);
		location.hash = (new URLSearchParams(parameters)).toString();
	}

}