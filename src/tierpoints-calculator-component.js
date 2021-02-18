import BaseComponent from './base-component';
import translate from './helper/translate';
import translations from './translations';
import template from './templates/tierpoints-calculator';

export default class extends BaseComponent {
  constructor() {
    super();
    this.$template = template;
  }

  connectedCallback() {
    super.connectedCallback();
  }

  calculate() {
    super.calculate();
  }

  query(itineraries) {
    fetch('https://farecollection.travel-dealz.de/api/calculate/tierpoints', {
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
        this.el_error.innerHTML = `Travel Dealz Tier Points Calculator ${error.toString()}`;
        this.el_error.classList.remove('hidden');
      });
  }

  display( data ) {

    super.display( data );
    this.el_list.innerHTML = '';

    this.$segments.forEach( (segment, index) => {
      console.log({ segment, index });

      let el = document.createElement('li');
        el.innerHTML = `
        ${segment.carrier} ${segment.bookingClass} ${segment.origin}-${segment.destination}: ${data[index].value.totals[0].qm[0]} Tier Points
        `;
        this.el_list.appendChild(el);
    } );

    console.log(data);
    console.log(this.$segments);


  }

}