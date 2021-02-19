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

    let el_thead = document.createElement('thead');
    el_thead.innerHTML = `
      <tr>
        <th class="text-center">Route</th>
        <th class="text-center">Airline</th>
        <th class="text-center">Booking Class</th>
        <th class="text-right">Tier Points</th>
      </tr>
    `;
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
        <td class="text-right">${ false === data[index].success ? data[index].errorMessage : `${data[index].value.totals[0] ? data[index].value.totals[0].qm[0] : 0}` }</td>
        `;
        this.el_list.appendChild(el);
    } );
    let el_foot = document.createElement('tfoot');
    el_foot.innerHTML = `
      <tr>
        <th class="text-right" colspan="3">Total</th>
        <th class="text-right">${totals.BA.toLocaleString()}</th>
      </tr>
    `;
    this.el_list.appendChild(el_foot);

  }

}