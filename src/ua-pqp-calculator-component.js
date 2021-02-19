import BaseComponent from './base-component';
import translate from './helper/translate';
import translations from './translations';
import template from './templates/ua-pqp-calculator';
import {calculateMiles} from './programs/UA';

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

 

  display( data ) {
    let totalpqps = 0;
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



    this.$segments.forEach( (segment, index) => {
      console.log('DATA');
      console.log([data[index]]);
      let el = document.createElement('tr');
        totalpqps += calculateMiles([segment], [data[index]]);
        el.innerHTML = `
        <td class="text-center"><code>${segment.origin}</code> - <code>${segment.destination}</code></td>
        <td class="text-center"><code>${segment.carrier}</code></td>
        <td class="text-center"><code>${segment.bookingClass}</code></td>
        <td class="text-right">${ false === data[index].success ? data[index].errorMessage : `${data[index].value.totals[0] ? calculateMiles([segment], [data[index]]) : 0}` }</td>
                `;
        this.el_list.appendChild(el);
    } );
    let el_foot = document.createElement('tfoot');
    el_foot.innerHTML = `
      <tr>
        <th class="text-right" colspan="3">Total</th>
        <th class="text-right">${totalpqps}</th>
      </tr>
    `;
    this.el_list.appendChild(el_foot);


  }

}