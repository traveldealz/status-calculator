import BaseComponent from './base-component';
import translate from './helper/translate';
import translations from './translations';
import programs from './programs';
import template from './templates/status-calculator';

export default class extends BaseComponent {
  constructor() {
    super();
    this.$template = template;
    this.$status = 'Star Alliance Gold';
  }

  connectedCallback() {
    super.connectedCallback();
  }

  calculate() {

    this.$status = this.querySelector('[name="status"]').value;

    super.calculate();
  }

  display( data ) {

    super.display( data );

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
                  qualification.milesName? build.milesname = qualification.milesName[this.$locale] : build.milesname = qualification.type;

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

}