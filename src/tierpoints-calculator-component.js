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
    this.$points_label = this.hasAttribute('points_label') ? this.getAttribute('points_label') : null;
    this.$awardmiles_label = this.hasAttribute('awardmiles_label') ? this.getAttribute('awardmiles_label') : null;
    this.$status_labels = this.hasAttribute('status_labels') ? this.getAttribute('status_labels').split(',') : ['None','Silver','Gold','Platinum'];

    this.el_status = this.querySelector('[name="status"]');
    this.$status_labels.forEach((status, index) => {
      let el_option = document.createElement('option');
      el_option.value = index;
      el_option.innerHTML = status;
      this.el_status.appendChild(el_option);
    });
  }

  display( {value: data, airlines, airports}, totals ) {

    super.display();
    this.el_list.innerHTML = '';

    let el_thead = document.createElement('thead');
    el_thead.innerHTML = translate(/*html*/`
      <tr>
        <th></th>
        <th class="text-center">__(Route)</th>
        <th class="text-center">__(Bookingclass)</th>
        <th class="text-right">${ this.$awardmiles_label ? this.$awardmiles_label : '__(Award Miles)'}</th>
        <th class="text-right">${ this.$points_label ? this.$points_label : '__(Points)'}</th>
      </tr>
    `, translations[this.$locale] ? translations[this.$locale] : []);
    this.el_list.appendChild(el_thead);

    const status_key = this.el_status.value;

    this.$segments.forEach( (segment, index) => {

    const earning = data[index].value.totals.find( item => item.id === this.$program );

      let el = document.createElement('tr');
        el.innerHTML = translate(/*html*/`
        <td class="align-top text-vertical text-center text-xs text-grey-dark font-light">${data[index].value.distance?.toLocaleString()} __(miles)</td>
        <td class="text-center">
          <div class="grid grid-cols-1 md:grid-cols-2">
            <div>
              <div><code>${segment.origin}</code></div>
              <div class="text-xs text-grey-dark font-light">${airports[segment.origin]?.location}</div>
            </div>
            <div>
              <div><code>${segment.destination}</code></div>
              <div class="text-xs text-grey-dark font-light">${airports[segment.destination]?.location}</div>
            </div>
          </div>
        </td>
        <td class="text-center">
          <div class="grid grid-cols-1 md:grid-cols-2">
            <div>
              <div><code>${segment.carrier}</code></div>
              <div class="text-xs text-grey-dark font-light">${airlines[segment.carrier]?.name}</div>
            </div>
            <div>
              <div><code>${segment.bookingClass}</code></div>
              <div class="text-xs text-grey-dark font-light">${earning.cabinclass} ${earning.fare}</div>
            </div>
          </div>
        </td>
        <td class="text-right">${ false === data[index].success ? data[index].errorMessage : `${earning ? earning.rdm[status_key]?.toLocaleString() : 0}` }</td>
        <td class="text-right">${ false === data[index].success ? data[index].errorMessage : `${earning ? earning.qm[0]?.toLocaleString() : 0}` }</td>
        `, translations[this.$locale] ? translations[this.$locale] : []);
        this.el_list.appendChild(el);
    } );
    let el_foot = document.createElement('tfoot');

    el_foot.innerHTML = translate(/*html*/`
      <tr>
        <th class="text-right" colspan="3">__(Total)</th>
        <th class="text-right">${totals[this.$program].rdm[status_key]?.toLocaleString()}</th>
        <th class="text-right">${totals[this.$program].qm[status_key]?.toLocaleString()}</th>
      </tr>
    `, translations[this.$locale] ? translations[this.$locale] : []);
    this.el_list.appendChild(el_foot);

  }

}