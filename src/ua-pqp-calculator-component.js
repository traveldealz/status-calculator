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

   

    this.$segments.forEach( (segment, index) => {
      console.log('DATA');
      console.log([data[index]]);
      let el = document.createElement('li');
        totalpqps += calculateMiles([segment], [data[index]]);
        el.innerHTML = `
        ${segment.carrier} ${segment.bookingClass} ${segment.origin}-${segment.destination}: ${calculateMiles([segment], [data[index]])} PQPs
        `;
        this.el_list.appendChild(el);
    } );
    let el = document.createElement('li');
    el.innerHTML = `Total: ${totalpqps} PQPs`;
    this.el_list.appendChild(el);
    console.log(data);
    console.log(this.$segments);


  }

}