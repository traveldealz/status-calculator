import programs from './programs';

const template = document.createElement("template");
template.innerHTML = /*html*/`
  <style>
  li {
    margin-bottom: 1rem;
  }
  </style>
  <form>
    <textarea name="route">LH:A:FRA-HKG</textarea><br />
    <select name="status">
      <option>Star Alliance Silver</option>
      <option selected>Star Alliance Gold</option>
    </select>
    <button type="submit">Calculate</button>
  </form>
  <ol id="list" data-columns="3"></ol>
  <p><small>Data provided by <a href="https://www.wheretocredit.com">wheretocredit.com</a></small></p>
`;

// const needed = {
//   A3: 72000,
//   UA: 50000,
//   OZ: 40000,
//   TK: 40000,
//   SK: 45000,
//   LHM: 100000,
//   SQ: 50000,
//   ET: 50000,
//   CA: 80000,
//   MS: 60000,
//   TG: 50000,
//   NZ: 900,
//   CM: 45000,
//   AC: 50000,
//   NH: 50000,
//   AV: 40000,
//   BR: 50000,
//   SA: 60000,
//   TP: 70000,
//   AI: 50000,
// };

class StatusCalculator extends HTMLElement {
  constructor() {
    super();
    this.count = 0;
    this.attachShadow({ mode: "open" });
    this.$status = 'Star Alliance Gold';
    this.$segments = [];
  }

  connectedCallback() {
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.el_route = this.shadowRoot.querySelector('[name="route"]');
    this.el_list = this.shadowRoot.querySelector('#list');
    this.shadowRoot.querySelector('form').addEventListener('submit', (event) => {
      event.preventDefault();
      this.calculate();
    });
  }

  calculate() {

    this.$status = this.shadowRoot.querySelector('[name="status"]').value;

    let itineraries = this.el_route.value
      .trim()
      .split('\n')
      .map(value => {
        let parts = value.split(':').map(v => v.trim());
        let carrier = parts[0];
        let bookingClass = parts[1];
        let route = parts[2].split('-').map(v => v.trim());

        return route.reduce((accumulator, airport, index, route) => {
          if(0 === index || ! accumulator) {
            return accumulator;
          }
          accumulator.push({
            carrier,
            bookingClass,
            origin: route[index-1],
            destination: airport,
          });
          return accumulator;
        }, []);

      })
      .flat();
    this.$segments = itineraries.flat();
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
      .catch(error => alert(`Where to Credit ${error.toString()}`));
  }

  display( data ) {

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
                    break;
                  case 'segments':
                    build.secNeeded = qualification.secNumber;
                    build.secCollected = this.$segments.length;
                    build.secProgress = build.secCollected / build.secNeeded;
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
        el.innerHTML = `
        <strong>${item.program.name}: ${item.status.name}</strong><br />
        <small>${item.progress.toLocaleString(undefined, {style: 'percent', minimumFractionDigits: 0})} = ${item.collected.toLocaleString()} of ${item.needed.toLocaleString()} ${item.qualification.type}</small><br />
        <progress value="${item.progress}">${item.progress.toLocaleString(undefined, {style: 'percent', minimumFractionDigits: 0})}</progress>
        ${'undefined' === typeof item.secProgress ? '' : `
          <br /><small>${item.secProgress.toLocaleString(undefined, {style: 'percent', minimumFractionDigits: 0})} = ${item.secCollected.toLocaleString()} of ${item.secNeeded.toLocaleString()} ${item.qualification.secType}</small><br />
          <progress value="${item.secProgress}">${item.secProgress.toLocaleString(undefined, {style: 'percent', minimumFractionDigits: 0})}</progress>
          `}
        ${ item.qualification.note?.en ? `<br /><small>${item.qualification.note.en}</small>`: '' }
        ${ item.status.note?.en ? `<br /><small>${item.status.note.en}</small>`: '' }
        ${ item.program.note?.en ? `<br /><small>${item.program.note.en}</small>`: '' }
        <br /><small>Qualification period: ${item.qualification.qualificationPeriod} month (${item.program.qualificationPeriodType})</small>
        <br /><small>Validity: at least ${item.qualification.validity} months</small>
        `;
        this.el_list.appendChild(el);
      });

  }


}

customElements.define("status-calculator", StatusCalculator);
