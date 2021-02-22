import BaseComponent from './base-component';
import translate from './helper/translate';
import translations from './translations';
import template from './templates/tierpoints-calculator';

export default class extends BaseComponent {
  constructor() {
    super();
    this.$template = template;
    this.$program = 'BA';
  }

  connectedCallback() {
    super.connectedCallback();
    this.$program = this.hasAttribute('program') ? this.getAttribute('program') : 'BA';
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

    let el_thead = document.createElement('thead');
    el_thead.innerHTML = translate(`
      <tr>
        <th class="text-center">__(Route)</th>
        <th class="text-center">__(Airline)</th>
        <th class="text-center">__(Booking Class)</th>
        <th class="text-right">__(Points)</th>
      </tr>
    `, translations[this.$locale] ? translations[this.$locale] : []);
    this.el_list.appendChild(el_thead);

    let totals = data.reduce((totals, itinerary) => {
        itinerary.value.totals.forEach(item => {
          totals[item.id] = totals[item.id] ? totals[item.id] + item.qm[0] : item.qm[0];
        })
        return totals;
      }, {} );

    this.$segments.forEach( (segment, index) => {

      let el = document.createElement('tr');
        el.innerHTML = `
        <td class="text-center"><code>${segment.origin}</code> - <code>${segment.destination}</code></td>
        <td class="text-center"><code>${segment.carrier}</code></td>
        <td class="text-center"><code>${segment.bookingClass}</code></td>
        <td class="text-right">${ false === data[index].success ? data[index].errorMessage : `${data[index].value.totals.find( item => item.id === this.$program ) ? data[index].value.totals.find( item => item.id === this.$program ).qm[0] : 0}` }</td>
        `;
        this.el_list.appendChild(el);
    } );
    let el_foot = document.createElement('tfoot');
    console.log(this.$program);
    el_foot.innerHTML = translate(`
      <tr>
        <th class="text-right" colspan="3">__(Total)</th>
        <th class="text-right">${totals[this.$program].toLocaleString()}</th>
      </tr>
    `, translations[this.$locale] ? translations[this.$locale] : []);
    this.el_list.appendChild(el_foot);

  }

}