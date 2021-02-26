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

  calculate() {
    super.calculate();
  }

  async query(itineraries) {
    Promise.all([
      fetch('https://farecollection.travel-dealz.de/api/calculate/tierpoints', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(itineraries.map( itinerary => { return { segments: [itinerary] } } )),
      }),
      fetch('https://www.wheretocredit.com/api/2.0/calculate', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(itineraries.map( itinerary => { return { segments: [itinerary] } } )),
      }),
    ])
    .then(responses => Promise.all(responses.map(response => response.json())))
    .then(responses => this.display(responses[0], responses[1]))
    .catch(error => {
      this.loading_end();
      this.el_error.innerHTML = `Travel Dealz Tier Points Calculator ${error.toString()}`;
      this.el_error.classList.remove('hidden');
    });
  }

  display( {value: data, airlines, airports}, { value: wtc_data } ) {

    super.display( data );
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

    let totals = data.reduce((totals, itinerary) => {
        itinerary.value.totals.forEach(item => {
          totals[item.id] = totals[item.id] ? totals[item.id] + item.qm[0] : item.qm[0];
        })
        return totals;
      }, {} );

    const status_key = this.el_status.value;
    let totals_rdm = wtc_data.reduce((totals, itinerary) => {
        itinerary.value.totals.forEach(item => {
          totals[item.id] = totals[item.id] ? totals[item.id] + item.rdm[status_key] : item.rdm[status_key];
        })
        return totals;
      }, {} );

    this.$segments.forEach( (segment, index) => {

    const earning = data[index].value.totals.find( item => item.id === this.$program );
    const earning_rdm = wtc_data[index].value.totals.find( item => item.id === this.$program );

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
        <td class="text-right">${ false === wtc_data[index].success ? wtc_data[index].errorMessage : `${earning_rdm ? earning_rdm.rdm[status_key]?.toLocaleString() : 0}` }</td>
        <td class="text-right">${ false === data[index].success ? data[index].errorMessage : `${earning ? earning.qm[0]?.toLocaleString() : 0}` }</td>
        `, translations[this.$locale] ? translations[this.$locale] : []);
        this.el_list.appendChild(el);
    } );
    let el_foot = document.createElement('tfoot');

    el_foot.innerHTML = translate(/*html*/`
      <tr>
        <th class="text-right" colspan="3">__(Total)</th>
        <th class="text-right">${totals_rdm[this.$program]?.toLocaleString()}</th>
        <th class="text-right">${totals[this.$program]?.toLocaleString()}</th>
      </tr>
    `, translations[this.$locale] ? translations[this.$locale] : []);
    this.el_list.appendChild(el_foot);

  }

}