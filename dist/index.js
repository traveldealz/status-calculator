var template = /*html*/
`
  <form>
    <label for="route">__(Routings)</label>
    <textarea name="route" class="w-full my-1" rows="8">LH:A:FRA-HKG-MUC</textarea>
    <small></small>
    <div class="my-3">
      <button class="mr-3 px-3 py-1 bg-brand hover:bg-gray-darker text-white" type="submit">__(Calculate)</button>
    </div>
  </form>
  <div class="loading hidden">__(Loading & calculating...)</div>
  <div class="error hidden"></div>
  <ol id="list"></ol>
  <p><small>__(Data provided by) <a href="https://www.wheretocredit.com" target="_blank">wheretocredit.com</a></small></p>
`;

function translate (text, trans = []) {
  return text.replace(/__\((.+?)\)/g, (match, group) => {
    return trans[group] ? trans[group] : group;
  });
}

var trans_de = {
  "Routings": "Strecken",
  "Calculate": "Berechnen",
  "Data provided by": "Daten bereitgestellt von",
  "Award Miles Data provided by": "Prämienmeilen-Daten bereitgestellt von",
  "Points Data provided by Travel-Dealz.eu": "Punkte-Daten bereitgestellt von Travel-Dealz.de",
  "miles": "Meilen",
  "segment": "Segment",
  "segments": "Segmente",
  "month": "Monat",
  "months": "Monate",
  "Validity": "Gültigkeit",
  "Qualification period": "Qualifikationszeitraum",
  "Calendar year": "Kalenderjahr",
  "Membership months": "Mitgliedsmonate",
  "Membership year": "Mitgliedsjahr",
  "Consecutive months": "aufeinanderfolgende Monate",
  "at least": "mind.",
  "of": "von",
  "Loading & calculating...": "Laden & berechnen...",
  "Route": "Strecke",
  "Airline": "Fluggesellschaft",
  "Booking Class": "Buchungsklasse",
  "Points": "Punkte",
  "Total": "Gesamt",
  "Distance": "Entfernung",
  "miles": "Meilen",
  "From": "Von",
  "To": "Nach",
  "Award Miles": "Prämienmeilen"
};

var trans_es = {};

var translations = {
  en: [],
  de: trans_de,
  es: trans_es
};

class BaseComponent extends HTMLElement {
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
    this.querySelector('form').addEventListener('submit', event => {
      event.preventDefault();
      this.loading_start();
      this.calculate();
    });

    if (this.hasAttribute('route')) {
      this.querySelector('[name="route"]').innerHTML = this.getAttribute('route').replaceAll(',', '\n');
    }

    if (location.hash) {
      this.loadParameters();
    }
  }

  calculate() {
    let itineraries = this.el_route.value.trim().split('\n').map(value => {
      let parts = value.split(':').map(v => v.trim());
      let carrier = parts[0];
      let bookingClass = parts[1];
      let route = parts[2].split('-').map(v => v.trim());
      let ticketer = parts[3];
      let price = parseInt(parts[4] / (parts[2].split('-').length - 1));
      return route.reduce((accumulator, airport, index, route) => {
        if (0 === index || !accumulator) {
          return accumulator;
        }

        accumulator.push({
          carrier,
          bookingClass,
          origin: route[index - 1],
          destination: airport,
          ticketer,
          price
        });
        return accumulator;
      }, []);
    }).flat();
    this.$segments = itineraries.flat();
    this.update_hash();
    this.query(itineraries);
    console.log("SEGEMTNE");
    console.log(this.$segments);

    for (elem in this.$segments.carrier) {
      console.log("Elem");
      console.log(elem);

      if (elem.carrier == "AY") {
        var warningSpan = document.createElement("span");
        warningSpan.className = "redTextClass";
        warningSpan.innerHTML = "Leider können wir die Finnair-Plus-Punkte für Finnair-Flüge nicht berechnen";
        this.parentNode.insertBefore(warningSpan, this); //alert('Leider können wir die Finnair-Plus-Punkte für Finnair-Flüge nicht berechnen' );
      }
    }
  }

  async query(itineraries) {
    let body = JSON.stringify(itineraries.map(itinerary => {
      return { ...(itinerary.price ? {
          ticketingCarrier: itinerary.ticketer
        } : {
          ticketingCarrier: "null"
        }),
        ...(itinerary.price ? {
          baseFare: itinerary.price
        } : {
          baseFare: 0
        }),
        segments: [itinerary]
      };
    }));
    Promise.all([fetch('https://farecollection.travel-dealz.de/api/calculate/tierpoints', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body
    }), fetch('https://www.wheretocredit.com/api/2.0/calculate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body
    })]).then(responses => Promise.all(responses.map(response => response.json()))).then(responses => this.merge_responses(responses[0], responses[1])).then(response => this.calculate_totals(response)).catch(error => {
      this.loading_end();
      this.el_error.innerHTML = `Error: ${error.toString()}`;
      this.el_error.classList.remove('hidden');
    });
  }

  merge_responses(td_data, wtc_data) {
    let response = { ...wtc_data,
      ...td_data
    };

    if (false === wtc_data.success && true === response.success) {
      response.success = wtc_data.success;
      response.errorMessage = wtc_data.errorMessage;
    }

    response.value = response.value.map((segment, segmentIndex) => {
      segment = { ...segment,
        value: { ...(wtc_data.value[segmentIndex].value ? wtc_data.value[segmentIndex].value : {}),
          ...segment.value
        }
      };

      if (false === wtc_data.value[segmentIndex].success && true === segment.success) {
        segment.success = wtc_data.value[segmentIndex].success;
        segment.errorMessage = wtc_data.value[segmentIndex].errorMessage;
      }

      let ids = [...new Set([...segment.value.totals.map(program => program.id), ...(wtc_data.value[segmentIndex].value ? wtc_data.value[segmentIndex].value.totals.map(program => program.id) : [])])];
      let totals = ids.map(program => {
        let wtc_total = wtc_data.value[segmentIndex].value?.totals?.find(item => program === item.id) ? wtc_data.value[segmentIndex].value.totals.find(item => program === item.id) : {};
        return { ...wtc_total,
          qm: wtc_total.rdm ? wtc_total.rdm : [0, 0, 0, 0],
          qd: 0,
          ...segment.value.totals.find(item => program === item.id)
        };
      });
      segment.value.totals = totals;
      return segment;
    });

    if (false === response.success) {
      throw response.errorMessage;
    }

    response.value.forEach(item => {
      if (false === item.success) {
        throw item.errorMessage;
      }
    });
    console.log(response);
    return response;
  }

  calculate_totals(response) {
    let totals = response.value.reduce((totals, itinerary) => {
      itinerary.value.totals.forEach(item => {
        totals[item.id] = totals[item.id] ? {
          rdm: totals[item.id].rdm ? totals[item.id].rdm.map((m, i) => m + item.rdm[i]) : item.rdm,
          qm: totals[item.id].qm.map((m, i) => m + item.qm[i]),
          qd: totals[item.id].qd + item.qd
        } : {
          rdm: item.rdm,
          qm: item.qm,
          qd: item.qd
        };
      });
      return totals;
    }, {});
    this.display(response, totals);
  }

  display(data, totals) {
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
    let searchParams = new URLSearchParams(location.hash.replace('#', ''));
    let el = {};

    for (let key of searchParams.keys()) {
      el = this.querySelector(`[name="${key}"]`);

      if (el) {
        'checkbox' === el.type ? el.checked = 'true' === searchParams.get(key) : el.value = searchParams.get(key);
      }
    }
  }

  update_hash() {
    let parameters = {};
    [...this.querySelectorAll('[name]')].forEach(el => parameters[el.name] = 'checkbox' === el.type ? el.checked : el.value);
    location.hash = new URLSearchParams(parameters).toString();
  }

}

function calculateSegments(segments) {
  return segments.filter(segment => ['A3', 'OA'].includes(segment.carrier)).length;
}

var A3 = {
  name: 'Aegean Miles+Bonus',
  alliance: 'Star Alliance',
  qualificationPeriodType: 'Consecutive months',
  status: [{
    name: 'Silver',
    allianceStatus: 'Star Alliance Silver',
    qualification: [{
      type: 'miles',
      number: 24000,
      qualificationPeriod: 12,
      validity: 12
    }, {
      type: 'miles',
      number: 12000,
      secType: 'segments',
      secmilesName: {
        en: 'Segments with Aegean or Olympic Air',
        de: 'Segmenten mit Aegean oder Olympic Air'
      },
      secNumber: 2,
      secCalculate: calculateSegments,
      qualificationPeriod: 12,
      validity: 12,
      secNote: {
        en: '',
        de: '',
        es: ''
      }
    }],
    note: {
      en: '',
      de: '',
      es: ''
    }
  }, {
    name: 'Gold',
    allianceStatus: 'Star Alliance Gold',
    qualification: [{
      type: 'miles',
      number: 72000,
      qualificationPeriod: 12,
      validity: 12,
      note: {
        en: 'Qualification period of 12 months starts after reaching Silver status to collect further 48.000 miles.',
        de: 'Qualifikationszeitraum von 12 Monaten beginnt nach Erreichen des Silver Status, um weitere 48.000 Meilen zu sammeln.',
        es: ''
      }
    }, {
      type: 'miles',
      number: 36000,
      secType: 'segments',
      secNumber: 6,
      secCalculate: calculateSegments,
      note: {
        en: 'Qualification period of 12 months starts after reaching Silver status to collect further 24.000 miles (total 36.000) and 4 (total 6) segments with Aegean or Olympic Air.',
        de: 'Qualifikationszeitraum von 12 Monaten beginnt nach Erreichen des Silver Status, um weitere 24.000 Meilen (insgesamt 36.000) und 4 (insgesamt 6) Segmente mit Aegean oder Olympic Air zu sammeln.',
        es: ''
      },
      secmilesName: {
        en: 'Segments with Aegean or Olympic Air',
        de: 'Segmenten mit Aegean oder Olympic Air'
      },
      qualificationPeriod: 12,
      validity: 12
    }]
  }],
  note: {
    en: '',
    de: '',
    es: ''
  }
};

function countSegments(segments, data) {
  return data.reduce((acc, itinerary) => {
    let mileage = itinerary.value?.totals?.find(item => 'ET' === item.id);

    if (!mileage) {
      return acc;
    }

    return 0 < mileage.rdm[0] ? acc + 1 : acc;
  }, 0);
}

var ET = {
  name: 'Ethiopian ShebaMiles',
  alliance: 'Star Alliance',
  qualificationPeriodType: 'Calendar year',
  status: [{
    name: 'Silver',
    allianceStatus: 'Star Alliance Silver',
    qualification: [{
      type: 'miles',
      number: 25000,
      qualificationPeriod: 12,
      validity: 12
    }, {
      type: 'segments',
      number: 20,
      qualificationPeriod: 12,
      validity: 12,
      calculate: countSegments,
      note: {
        en: 'Only segments with mileage credit count.',
        de: 'Nur Segmente mit Meilengutschrift zählen.',
        es: ''
      }
    }],
    note: {
      en: '',
      de: '',
      es: ''
    }
  }, {
    name: 'Gold',
    allianceStatus: 'Star Alliance Gold',
    qualification: [{
      type: 'miles',
      number: 50000,
      qualificationPeriod: 12,
      validity: 12
    }, {
      type: 'segments',
      number: 40,
      qualificationPeriod: 12,
      validity: 12,
      calculate: countSegments,
      note: {
        en: 'Only segments with mileage credit count.',
        de: 'Nur Segmente mit Meilengutschrift zählen.',
        es: ''
      }
    }],
    note: {
      en: '',
      de: '',
      es: ''
    }
  }, {
    name: 'Platinum',
    allianceStatus: 'Star Alliance Gold',
    qualification: [{
      type: 'miles',
      number: 100000,
      qualificationPeriod: 12,
      validity: 12
    }, {
      type: 'segments',
      number: 80,
      qualificationPeriod: 12,
      validity: 12,
      calculate: countSegments,
      note: {
        en: 'Only segments with mileage credit count.',
        de: 'Nur Segmente mit Meilengutschrift zählen.',
        es: ''
      }
    }],
    note: {
      en: '',
      de: '',
      es: ''
    }
  }],
  note: {
    en: '',
    de: '',
    es: ''
  }
};

function calculateSegements(segments) {
  return segments.filter(segment => ['EN', 'OS', 'SN', 'OU', 'EW', 'LO', 'LH', 'LG', 'LX'].includes(segment.carrier)).length;
}

function calculateExecutivebonus(segments, data) {
  // If >35000 miles, take Executive Bonus
  console.log(data);
  return data.reduce((miles, itinerary) => {
    let item = itinerary.value.totals.find(item => 'LHM' === item.id);

    if (!item) {
      return miles;
    }

    return 35000 < miles ? miles + item.qm[1] : miles + item.qm[0];
  }, 0);
}

function calc2021(segments, data) {
  return data.reduce((acc, itinerary) => {
    let mileage = itinerary.value?.totals?.find(item => 'LHM' === item.id);

    if (!mileage) {
      return [acc[0], acc[1] + 1];
    }

    if (['EN', 'OS', 'SN', 'OU', 'EW', 'LO', 'LH', 'LG', 'LX', 'WK'].includes(segments[acc[1]].carrier)) {
      return acc[0] > 35000 ? [acc[0] + mileage.qm[1] * 2, acc[1] + 1] : [acc[0] + mileage.qm[0] * 2, acc[1] + 1];
    } else {
      return acc[0] > 35000 ? [acc[0] + mileage.qm[1], acc[1] + 1] : [acc[0] + mileage.qm[0], acc[1] + 1];
    }
  }, [0, 0])[0];
}

var LHM = {
  name: 'Miles & More',
  alliance: 'Star Alliance',
  qualificationPeriodType: 'Calendar year',
  status: [{
    name: 'Frequent Traveller',
    allianceStatus: 'Star Alliance Silver',
    qualification: [{
      type: 'miles',
      number: 35000,
      qualificationPeriod: 12,
      calculate: calculateExecutivebonus,
      validity: 24,
      milesName: {
        en: 'status miles',
        de: 'Statusmeilen'
      }
    }, {
      type: 'segments',
      number: 30,
      qualificationPeriod: 12,
      validity: 24,
      calculate: calculateSegements,
      note: {
        en: 'Only segments on Miles & More Member airline partners counts.',
        de: 'Nur Segmente durchgeführt von Miles & More Partnerairlines zahlen.',
        es: ''
      }
    }]
  }, {
    name: 'Senator',
    allianceStatus: 'Star Alliance Gold',
    qualification: [{
      type: 'miles',
      number: 100000,
      qualificationPeriod: 12,
      validity: 24,
      milesName: {
        en: 'status miles',
        de: 'Statusmeilen'
      },
      calculate: calculateExecutivebonus,
      note: {
        en: '',
        de: '',
        es: ''
      }
    }]
  }, {
    name: 'Frequent Traveller 2021',
    allianceStatus: 'Star Alliance Silver',
    qualification: [{
      type: 'miles',
      number: 35000,
      qualificationPeriod: 12,
      validity: 24,
      milesName: {
        en: 'status miles',
        de: 'Statusmeilen'
      },
      calculate: calc2021,
      note: {
        en: 'In 2021 you will get double status miles on Lufthansa-Group flights',
        de: 'Im Jahr 2021 gibt es ausnahmsweise doppelte Statusmeilen auf Flügen der Lufthansa-Group',
        es: ''
      }
    }]
  }, {
    name: 'Senator 2021',
    allianceStatus: 'Star Alliance Gold',
    qualification: [{
      type: 'miles',
      number: 100000,
      qualificationPeriod: 12,
      validity: 24,
      milesName: {
        en: 'status miles',
        de: 'Statusmeilen'
      },
      calculate: calc2021,
      note: {
        en: 'In 2021 you will get double status miles on Lufthansa-Group flights',
        de: 'Im Jahr 2021 gibt es ausnahmsweise doppelte Statusmeilen auf Flügen der Lufthansa-Group',
        es: ''
      }
    }]
  } // {
  //   name: 'HON Circle Member',
  //   allianceStatus: 'Star Alliance Silver',
  //   qualification: [
  //     {
  //       type: 'miles',
  //       number: 600000,
  //       qualificationPeriod: 24,
  //       validity: 24,
  //       calculate: segments => segments.filter(segment => ['SK', 'WF'].includes(segment.carrier)).length,
  //       note: {
  //         en: 'Only HON Circle Miles in Business- & First Class on Miles&More Member Airlines counts',
  //         de: '',
  //         es: '',
  //       },
  //     },
  //   ],
  // }
  ],
  note: {
    en: '',
    de: '',
    es: ''
  }
};

var MS = {
  name: 'Egyptair Plus',
  alliance: 'Star Alliance',
  qualificationPeriodType: 'Consecutive months',
  status: [{
    name: 'Silver',
    allianceStatus: 'Star Alliance Silver',
    qualification: [{
      type: 'miles',
      number: 30000,
      qualificationPeriod: 0,
      validity: 24
    }],
    note: {
      en: 'There is no time limit to collect 30.000 miles.',
      de: 'Es gibt kein Zeitlimit um die 30.000 Meilen zu sammeln.',
      es: ''
    }
  }, {
    name: 'Gold',
    allianceStatus: 'Star Alliance Gold',
    qualification: [{
      type: 'miles',
      number: 60000,
      qualificationPeriod: 24,
      validity: 24
    }],
    note: {
      en: 'You have 2 years after reaching Silver (at 30.000 miles) to collect further 30.000 miles.',
      de: 'Ab erreichen des Silver Status (bei 30.000 Meilen) hat man weitere 2 Jahre Zeit um weitere 30.000 Meilen zu sammeln.',
      es: ''
    }
  }, {
    name: 'Elite',
    allianceStatus: 'Star Alliance Gold',
    qualification: [{
      type: 'miles',
      number: 360000,
      qualificationPeriod: 24,
      validity: 24
    }],
    note: {
      en: 'Qualification period of 2 years starts after reaching Gold status to collect further 300.000 miles',
      de: 'Qualifikationszeitraum von 2 Jahren startet ab erreichen des Gold Status, um weitere 300.000 Meilen zu sammeln.',
      es: ''
    }
  }],
  note: {
    en: '',
    de: '',
    es: ''
  }
};

function countSegments$1(segments) {
  return segments.filter(segment => ['OZ'].includes(segment.carrier)).length;
}

var OZ = {
  name: 'Asiana Club',
  alliance: 'Star Alliance',
  qualificationPeriodType: 'Membership months',
  status: [{
    name: 'Gold',
    allianceStatus: 'Star Alliance Silver',
    qualification: [{
      type: 'miles',
      number: 20000,
      qualificationPeriod: 24,
      validity: 24
    }, {
      type: 'segments',
      number: 30,
      calculate: countSegments$1,
      qualificationPeriod: 24,
      validity: 24,
      note: {
        en: 'Only segments with Asiana count.',
        de: 'Nur Segmente mit Asiana zählen.',
        es: ''
      }
    }],
    note: {
      en: '',
      de: '',
      es: ''
    }
  }, {
    name: 'Diamond',
    allianceStatus: 'Star Alliance Gold',
    qualification: [{
      type: 'miles',
      number: 40000,
      qualificationPeriod: 24,
      validity: 24
    }, {
      type: 'segments',
      number: 50,
      calculate: countSegments$1,
      qualificationPeriod: 24,
      validity: 24,
      note: {
        en: 'Only segments with Asiana count.',
        de: 'Nur Segmente mit Asiana zählen.',
        es: ''
      }
    }],
    note: {
      en: '',
      de: '',
      es: ''
    }
  }, {
    name: 'Diamond Plus',
    allianceStatus: 'Star Alliance Gold',
    qualification: [{
      type: 'miles',
      number: 100000,
      qualificationPeriod: 24,
      validity: 24
    }, {
      type: 'segments',
      number: 100,
      calculate: countSegments$1,
      qualificationPeriod: 24,
      validity: 24,
      note: {
        en: 'Only segments with Asiana count.',
        de: 'Nur Segmente mit Asiana zählen.',
        es: ''
      }
    }],
    note: {
      en: '',
      de: '',
      es: ''
    }
  } // {
  //   name: 'Platinum',
  //   allianceStatus: 'Star Alliance Gold',
  //   qualification: [
  //     {
  //       type: 'miles',
  //       number: 1000000,
  //       qualificationPeriod: 0,
  //       validity: 0,
  //       note: {
  //         en: 'Miles accumulated from joining Asiana Club.',
  //         de: 'Gesammelte Meilen ab dem Beitritt zum Asiana Club.',
  //         es: '',
  //       },
  //     },
  //     {
  //       type: 'segments',
  //       number: 1000,
  //       calculate: countSegments,
  //       qualificationPeriod: 24,
  //       validity: 24,
  //       note: {
  //         en: 'Segments with Asiana accumulated from joining Asiana Club.',
  //         de: 'Gesammelte Segmente durchgeführt von Asiana ab dem Beitritt zum Asiana Club.',
  //         es: '',
  //       },
  //     },
  //   ],
  //   note: {
  //     en: 'Lifetime Status',
  //     de: 'Lebenslanger Status',
  //     es: '',
  //   },
  // }
  ],
  note: {
    en: '',
    de: '',
    es: ''
  }
};

function calculateSegments$1(segments) {
  return segments.filter(segment => ['SK', 'WF'].includes(segment.carrier)).length;
}

var SK = {
  name: 'SAS EuroBonus',
  alliance: 'Star Alliance',
  qualificationPeriodType: 'Membership year',
  status: [{
    name: 'Silver',
    allianceStatus: 'Star Alliance Silver',
    qualification: [{
      type: 'miles',
      number: 20000,
      qualificationPeriod: 12,
      validity: 12,
      milesName: {
        en: 'basic points',
        de: 'Basispunkten'
      }
    }, {
      type: 'segments',
      number: 10,
      qualificationPeriod: 12,
      validity: 12,
      calculate: calculateSegments$1,
      note: {
        en: 'Only segments with SAS or Widerøe counts.',
        de: 'Nur Segmente mit SAS oder Widerøe zählen.',
        es: ''
      }
    }],
    note: {
      en: '',
      de: '',
      es: ''
    }
  }, {
    name: 'Gold',
    allianceStatus: 'Star Alliance Gold',
    qualification: [{
      type: 'miles',
      number: 45000,
      qualificationPeriod: 12,
      validity: 12,
      milesName: {
        en: 'basic points',
        de: 'Basispunkten'
      }
    }, {
      type: 'segments',
      number: 45,
      qualificationPeriod: 12,
      validity: 12,
      calculate: calculateSegments$1,
      note: {
        en: 'Only segments with SAS or Widerøe counts.',
        de: 'Nur Segmente mit SAS oder Widerøe zählen.',
        es: ''
      }
    }],
    note: {
      en: '',
      de: '',
      es: ''
    }
  }, {
    name: 'Diamond',
    allianceStatus: 'Star Alliance Gold',
    qualification: [{
      type: 'miles',
      number: 90000,
      qualificationPeriod: 12,
      milesName: {
        en: 'basic points',
        de: 'Basispunkten'
      },
      validity: 12
    }, {
      type: 'segments',
      number: 90,
      qualificationPeriod: 12,
      validity: 12,
      calculate: calculateSegments$1,
      note: {
        en: 'Only segments with SAS or Widerøe counts.',
        de: 'Nur Segmente mit SAS oder Widerøe zählen.',
        es: ''
      }
    }],
    note: {
      en: '',
      de: '',
      es: ''
    }
  }],
  note: {
    en: '',
    de: '',
    es: ''
  }
};

var TK = {
  name: 'Turkish Airlines Miles&Smiles',
  alliance: 'Star Alliance',
  qualificationPeriodType: 'Consecutive months',
  status: [{
    name: 'Classic Plus',
    allianceStatus: 'Star Alliance Silver',
    qualification: [{
      type: 'miles',
      number: 25000,
      qualificationPeriod: 12,
      validity: 24
    }],
    note: {
      en: '',
      de: '',
      es: ''
    }
  }, {
    name: 'Elite',
    allianceStatus: 'Star Alliance Gold',
    qualification: [{
      type: 'miles',
      number: 40000,
      qualificationPeriod: 12,
      validity: 24
    }],
    note: {
      en: '',
      de: '',
      es: ''
    }
  }, {
    name: 'Elite Plus',
    allianceStatus: 'Star Alliance Gold',
    qualification: [{
      type: 'miles',
      number: 80000,
      qualificationPeriod: 12,
      validity: 24
    }],
    note: {
      en: '',
      de: '',
      es: ''
    }
  }],
  note: {
    en: '',
    de: '',
    es: ''
  }
};

function countSegments$2(segments, data) {
  return data.reduce((acc, itinerary) => {
    let mileage = itinerary.value?.totals?.find(item => 'CA' === item.id);

    if (!mileage) {
      return acc;
    }

    return 0 < mileage.rdm[0] ? acc + 1 : acc;
  }, 0);
}

var CA = {
  name: 'Air China PhoenixMiles',
  alliance: 'Star Alliance',
  qualificationPeriodType: 'Consecutive months',
  status: [{
    name: 'Silver Card',
    allianceStatus: 'Star Alliance Silver',
    qualification: [{
      type: 'miles',
      number: 40000,
      qualificationPeriod: 12,
      validity: 24
    }, {
      type: 'segments',
      number: 25,
      qualificationPeriod: 12,
      validity: 24,
      calculate: countSegments$2,
      note: {
        en: 'Only segments with mileage credit count.',
        de: 'Nur Segmente mit Meilengutschrift zählen.',
        es: ''
      }
    }]
  }, {
    name: 'Gold Card',
    allianceStatus: 'Star Alliance Gold',
    qualification: [{
      type: 'miles',
      number: 80000,
      qualificationPeriod: 12,
      validity: 24
    }, {
      type: 'segments',
      number: 40,
      qualificationPeriod: 12,
      validity: 24,
      calculate: countSegments$2,
      note: {
        en: 'Only segments with mileage credit count.',
        de: 'Nur Segmente mit Meilengutschrift zählen.',
        es: ''
      }
    }]
  }, {
    name: 'Platinum Card',
    allianceStatus: 'Star Alliance Gold',
    qualification: [{
      type: 'miles',
      number: 160000,
      qualificationPeriod: 12,
      validity: 24
    }, {
      type: 'segments',
      number: 90,
      qualificationPeriod: 12,
      validity: 24,
      calculate: countSegments$2,
      note: {
        en: 'Only segments with mileage credit count.',
        de: 'Nur Segmente mit Meilengutschrift zählen.',
        es: ''
      }
    }]
  }],
  note: {
    en: '',
    de: '',
    es: ''
  }
};

function calculateExecutivebonus$1(segments, data) {
  // If >25000 miles, take Executive Bonus
  console.log(data);
  return data.reduce((miles, itinerary) => {
    let item = itinerary.value.totals.find(item => 'SQ' === item.id);

    if (!item) {
      return miles;
    }

    return 25000 < miles ? miles + item.rdm[1] : miles + item.rdm[0];
  }, 0);
}

var SQ = {
  name: 'Singapore Airlines KrisFlyer',
  alliance: 'Star Alliance',
  qualificationPeriodType: 'Consecutive months',
  status: [{
    name: 'Elite Silver',
    allianceStatus: 'Star Alliance Silver',
    qualification: [{
      type: 'miles',
      number: 25000,
      qualificationPeriod: 12,
      validity: 12
    }],
    note: {
      en: '',
      de: '',
      es: ''
    }
  }, {
    name: 'Elite Gold',
    allianceStatus: 'Star Alliance Gold',
    qualification: [{
      type: 'miles',
      number: 50000,
      qualificationPeriod: 12,
      validity: 12,
      calculate: calculateExecutivebonus$1
    }],
    note: {
      en: 'After reaching the Silver status you get 25 percentage points Executive Bonus.',
      de: '',
      es: ''
    }
  }],
  note: {
    en: '',
    de: '',
    es: ''
  }
};

function calculateSegments$2(segments) {
  return segments.filter(segment => ['TG'].includes(segment.carrier)).filter(segment => !['G', 'V', 'W'].includes(segment.bookingClass)).length;
}

var TG = {
  name: 'Thai Royal Orchid Plus',
  alliance: 'Star Alliance',
  qualificationPeriodType: 'Consecutive months',
  status: [{
    name: 'Silver',
    allianceStatus: 'Star Alliance Silver',
    qualification: [{
      type: 'miles',
      number: 10000,
      qualificationPeriod: 12,
      validity: 24
    }, {
      type: 'miles',
      number: 15000,
      qualificationPeriod: 24,
      validity: 24
    }],
    note: {
      en: '',
      de: '',
      es: ''
    }
  }, {
    name: 'Gold',
    allianceStatus: 'Star Alliance Gold',
    qualification: [{
      type: 'miles',
      number: 50000,
      qualificationPeriod: 12,
      validity: 24,
      note: {
        en: '',
        de: '',
        es: ''
      }
    }, {
      type: 'miles',
      number: 80000,
      qualificationPeriod: 24,
      validity: 24,
      note: {
        en: '',
        de: '',
        es: ''
      }
    }, {
      type: 'segments',
      number: 40,
      qualificationPeriod: 12,
      validity: 24,
      calculate: calculateSegments$2,
      note: {
        en: '40 international segments on THAI',
        de: '40 internationale Segmente mit THAI',
        es: ''
      }
    }],
    note: {
      en: '',
      de: '',
      es: ''
    }
  }],
  note: {
    en: '',
    de: '',
    es: ''
  }
};

function calculateSegments$3(segments) {
  return segments.filter(segment => ['CM'].includes(segment.carrier)).length;
}

var CM = {
  name: 'Copa Airlines ConnectMiles',
  alliance: 'Star Alliance',
  qualificationPeriodType: 'Calendar year',
  status: [{
    name: 'Silver',
    allianceStatus: 'Star Alliance Silver',
    qualification: [{
      qualificationPeriod: 12,
      type: 'miles',
      number: 25000,
      secType: 'segments',
      secNumber: 4,
      secCalculate: calculateSegments$3,
      secmilesName: {
        en: 'Segments with Copa Airlines',
        de: 'Segmenten mit Copa Airlines'
      },
      validity: 12
    }],
    note: {
      en: '',
      de: '',
      es: ''
    }
  }, {
    name: 'Gold',
    allianceStatus: 'Star Alliance Gold',
    qualification: [{
      type: 'miles',
      number: 45000,
      secType: 'segments',
      secNumber: 4,
      secCalculate: calculateSegments$3,
      qualificationPeriod: 12,
      validity: 12,
      secmilesName: {
        en: 'Segments with Copa Airlines',
        de: 'Segmenten mit Copa Airlines'
      }
    }],
    note: {
      en: '',
      de: '',
      es: ''
    }
  }, {
    name: 'Platinum',
    allianceStatus: 'Star Alliance Gold',
    qualification: [{
      type: 'miles',
      number: 75000,
      secType: 'segments',
      secNumber: 4,
      secCalculate: calculateSegments$3,
      qualificationPeriod: 12,
      secmilesName: {
        en: 'Segments with Copa Airlines',
        de: 'Segmenten mit Copa Airlines'
      },
      validity: 12
    }],
    note: {
      en: '',
      de: '',
      es: ''
    }
  }, {
    name: 'Presidential',
    allianceStatus: 'Star Alliance Gold',
    qualification: [{
      type: 'miles',
      number: 95000,
      secType: 'segments',
      secNumber: 4,
      secCalculate: calculateSegments$3,
      qualificationPeriod: 12,
      secmilesName: {
        en: 'Segments with Copa Airlines',
        de: 'Segmenten mit Copa Airlines'
      },
      validity: 12
    }],
    note: {
      en: '',
      de: '',
      es: ''
    }
  }],
  note: {
    en: '',
    de: '',
    es: ''
  }
};

function countSegments$3(segments, data) {
  return data.reduce((acc, itinerary) => {
    let mileage = itinerary.value?.totals?.find(item => 'AC' === item.id);

    if (!mileage) {
      return acc;
    }

    return 0 < mileage.rdm[0] ? acc + 1 : acc;
  }, 0);
}

var AC = {
  name: 'Air Canada Aeroplan',
  alliance: 'Star Alliance',
  qualificationPeriodType: 'Calendar year',
  status: [{
    name: '25K',
    allianceStatus: 'Star Alliance Silver',
    qualification: [{
      type: 'miles',
      number: 25000,
      qualificationPeriod: 12,
      validity: 12
    }, {
      type: 'segments',
      number: 25,
      qualificationPeriod: 12,
      validity: 12,
      calculate: countSegments$3,
      note: {
        en: 'Only segments with mileage credit count.',
        de: 'Nur Segmente mit Meilengutschrift zählen.',
        //Ab Hier gibt es 25% Bonus auf AC, CM, UA, OS, SN, LH, LX
        es: ''
      }
    }],
    note: {
      en: 'Also $3,000 required (50% less for non-Canadian residents)',
      de: 'Außerdem $3,000 an Ausgaben benötigt (50% weniger for nicht-Kanadier)',
      es: ''
    }
  }, {
    name: '35K',
    allianceStatus: 'Star Alliance Silver',
    qualification: [{
      type: 'miles',
      number: 35000,
      qualificationPeriod: 12,
      validity: 12
    }, {
      type: 'segments',
      number: 35,
      qualificationPeriod: 12,
      validity: 12,
      calculate: countSegments$3,
      note: {
        en: 'Only segments with mileage credit count.',
        de: 'Nur Segmente mit Meilengutschrift zählen.',
        //Ab hier 35% Bonus
        es: ''
      }
    }],
    note: {
      en: 'Also $4,000 required (50% less for non-Canadian residents)',
      de: 'Außerdem $4,000 an Ausgaben benötigt (50% weniger for nicht-Kanadier)',
      es: ''
    }
  }, {
    name: '50K',
    allianceStatus: 'Star Alliance Gold',
    qualification: [{
      type: 'miles',
      number: 50000,
      qualificationPeriod: 12,
      validity: 12
    }, {
      type: 'segments',
      number: 50,
      qualificationPeriod: 12,
      validity: 12,
      calculate: countSegments$3,
      note: {
        en: 'Only segments with mileage credit count.',
        de: 'Nur Segmente mit Meilengutschrift zählen.',
        //Ab hier 50% Bonus
        es: ''
      }
    }],
    note: {
      en: 'Also $6,000 required (50% less for non-Canadian residents)',
      de: 'Außerdem $6,000 an Ausgaben benötigt (50% weniger for nicht-Kanadier)',
      es: ''
    }
  }, {
    name: '75K',
    allianceStatus: 'Star Alliance Gold',
    qualification: [{
      type: 'miles',
      number: 75000,
      qualificationPeriod: 12,
      validity: 12
    }, {
      type: 'segments',
      number: 75,
      qualificationPeriod: 12,
      validity: 12,
      calculate: countSegments$3,
      note: {
        en: 'Only segments with mileage credit count.',
        de: 'Nur Segmente mit Meilengutschrift zählen.',
        //Ab hier 75% Bonus
        es: ''
      }
    }],
    note: {
      en: 'Also $9,000 required (50% less for non-Canadian residents)',
      de: 'Außerdem $9,000 an Ausgaben benötigt (50% weniger for nicht-Kanadier)',
      es: ''
    }
  }, {
    name: 'Super Elite',
    allianceStatus: 'Star Alliance Gold',
    qualification: [{
      type: 'miles',
      number: 100000,
      qualificationPeriod: 12,
      validity: 12
    }, {
      type: 'segments',
      number: 100,
      qualificationPeriod: 12,
      validity: 12,
      calculate: countSegments$3,
      note: {
        en: 'Only segments with mileage credit count.',
        de: 'Nur Segmente mit Meilengutschrift zählen.',
        //Ab hier 100% Bonus
        es: ''
      }
    }],
    note: {
      en: 'Also $20,000 required (50% less for non-Canadian residents)',
      de: 'Außerdem $20,000 an Ausgaben benötigt (50% weniger for nicht-Kanadier)',
      es: ''
    }
  }],
  note: {
    en: '',
    de: '',
    es: ''
  }
};

function calculateSegments$4(segments, data) {
  return data.reduce((acc, itinerary) => {
    let mileage = itinerary.value?.totals?.find(item => 'UA' === item.id);

    if (!mileage) {
      return acc;
    }

    if (mileage.id == 'UA') {
      return acc + 1;
    }
    return 0 < mileage.rdm[0] ? acc + 1 : acc;
  }, 0);
}

function getLimit(carrier, bookingClass) {
  if (['AC', 'OS', 'SN'].includes(carrier)) {
    if (['C', 'D', 'J', 'Z', 'P'].includes(bookingClass)) {
      return 1500;
    } else {
      return 750;
    }
  }

  if (['A3'].includes(carrier)) {
    if (['C', 'D', 'Z', 'A'].includes(bookingClass)) {
      return 1000;
    } else {
      return 500;
    }
  }

  if (['CA'].includes(carrier)) {
    if (['F', 'A', 'J', 'C', 'D', 'Z', 'R'].includes(bookingClass)) {
      return 1500;
    } else {
      return 750;
    }
  }

  if (['EN'].includes(carrier)) {
    if (['F', 'A', 'C', 'D', 'J', 'Z', 'P', 'Y', 'B', 'M'].includes(bookingClass)) {
      return 1500;
    } else {
      return 750;
    }
  }

  if (['NZ'].includes(carrier)) {
    if (['C', 'D', 'J', 'Z'].includes(bookingClass)) {
      return 1500;
    } else {
      return 750;
    }
  }

  if (['NH', 'LH', 'LX'].includes(carrier)) {
    if (['C', 'D', 'J', 'Z', 'P', 'F', 'A'].includes(bookingClass)) {
      return 1500;
    } else {
      return 750;
    }
  }

  if (['AD'].includes(carrier)) {
    if (['C', 'D', 'J', 'I'].includes(bookingClass)) {
      return 1500;
    } else {
      return 750;
    }
  }

  if (['EW'].includes(carrier)) {
    if (['D', 'J'].includes(bookingClass)) {
      return 1500;
    } else {
      return 750;
    }
  }

  if (['CM'].includes(carrier)) {
    if (['C', 'D', 'J', 'R'].includes(bookingClass)) {
      return 1500;
    } else {
      return 750;
    }
  }

  if (['LO'].includes(carrier)) {
    if (['C', 'D', 'Z', 'F'].includes(bookingClass)) {
      return 1000;
    } else {
      return 500;
    }
  }

  if (['OZ', 'SQ'].includes(carrier)) {
    if (['F', 'A', 'J', 'C', 'D', 'Z', 'U'].includes(bookingClass)) {
      return 1000;
    } else {
      return 500;
    }
  }

  if (['OU'].includes(carrier)) {
    if (['C', 'D', 'Z'].includes(bookingClass)) {
      return 1000;
    } else {
      return 500;
    }
  }

  if (['MS', 'TG'].includes(carrier)) {
    if (['F', 'A', 'P', 'C', 'D', 'J', 'Z'].includes(bookingClass)) {
      return 1000;
    } else {
      return 500;
    }
  }

  if (['SK', 'TP'].includes(carrier)) {
    if (['C', 'D', 'J', 'Z'].includes(bookingClass)) {
      return 1000;
    } else {
      return 500;
    }
  }

  if (['AI'].includes(carrier)) {
    if (['C', 'D', 'J', 'Z', 'F', 'A'].includes(bookingClass)) {
      return 1000;
    } else {
      return 500;
    }
  }

  if (['AV'].includes(carrier)) {
    if (['C', 'D', 'J', 'K', 'A'].includes(bookingClass)) {
      return 1500;
    } else {
      return 750;
    }
  }

  if (['ET', 'BR'].includes(carrier)) {
    if (['C', 'D', 'J'].includes(bookingClass)) {
      return 1000;
    } else {
      return 500;
    }
  }

  if (['ZH'].includes(carrier)) {
    if (['C', 'D', 'J', 'R', 'Z'].includes(bookingClass)) {
      return 1000;
    } else {
      return 500;
    }
  }

  if (['TK'].includes(carrier)) {
    if (['C', 'D', 'J', 'Z', 'K'].includes(bookingClass)) {
      return 1000;
    } else {
      return 500;
    }
  }

  if (['SA'].includes(carrier)) {
    if (['C', 'D', 'J', 'P', 'Z'].includes(bookingClass)) {
      return 1000;
    } else {
      return 500;
    }
  }

  if (['OA'].includes(carrier)) {
    if (['C', 'D', 'Z', 'A'].includes(bookingClass)) {
      return 1000;
    } else {
      return 500;
    }
  }
}

function calculateMiles(segments, data) {
  console.log('data');
  console.log(data); // Berechnet Statuspunkte. Bei UA -> 0, da Umsatzbasiert.
  // Bei Partnerairlines -> Meilen / 5 -  mit 1500/750 Limit je nach Klasse
  // Bei anderen Airlines -> Meilen / 6 - mit 750/500 Limit je nach Klasse

  return data.reduce((acc, itinerary) => {
    let mileage = itinerary.value?.totals?.find(item => 'UA' === item.id);
    console.log("segment: " + acc[1]);
    console.log(mileage.rdm[0]);

    if (!mileage) {
      return [acc[0], acc[1] + 1];
    }

    let limit = getLimit(segments[acc[1]].carrier, segments[acc[1]].bookingClass);

    if (segments[acc[1]].carrier && segments[acc[1]].ticketer) {
      if (['UA'].includes(segments[acc[1]].carrier) || ['UA'].includes(segments[acc[1]].ticketer)) {
        return [acc[0] + segments[acc[1]].price, acc[1] + 1];
      }
    }

    if (['AC', 'CA', 'EN', 'NZ', 'NH', 'OZ', 'AV', 'AD', 'SN', 'CM', 'WK', 'EW', 'LH', 'LX'].includes(segments[acc[1]].carrier)) {
      return mileage.rdm[0] / 5 > limit ? [acc[0] + limit, acc[1] + 1] : [acc[0] + parseInt(mileage.rdm[0] / 5), acc[1] + 1];
    } else if (['UA'].includes(segments[acc[1]].carrier)) {
      return [acc[0] + 0, acc[1] + 1];
    } else {
      return mileage.rdm[0] / 5 > limit ? [acc[0] + limit, acc[1] + 1] : [acc[0] + parseInt(mileage.rdm[0] / 5), acc[1] + 1];
    }
  }, [0, 0])[0];
}
var UA = {
  name: 'United MileagePlus',
  alliance: 'Star Alliance',
  qualificationPeriodType: 'Calendar Year',
  status: [{
    name: 'Premier Silver',
    allianceStatus: 'Star Alliance Silver',
    qualification: [{
      type: 'miles',
      number: 3500,
      calculate: calculateMiles,
      milesName: {
        en: 'points (PQPs)',
        de: 'Punkten (PQP)'
      },
      qualificationPeriod: 12,
      validity: 12
    }, {
      type: 'miles',
      number: 3000,
      calculate: calculateMiles,
      milesName: {
        en: 'points (PQPs)',
        de: 'Punkten (PQP)'
      },
      secType: 'segments',
      secNumber: 8,
      secCalculate: calculateSegments$4,
      qualificationPeriod: 12,
      secmilesName: {
        en: 'Segments (PQFs)',
        de: 'Segmenten (PQF)'
      },
      validity: 12,
      secNote: {
        en: 'Segments in Basic Economy do not count',
        de: 'Für Transatlantikflüge im Light-Tarif (ohne Gepäck) und die United Basic Economy werden keine Segmente gutgeschrieben',
        es: ''
      }
    }]
  }, {
    name: 'Premier Gold',
    allianceStatus: 'Star Alliance Gold',
    qualification: [{
      type: 'miles',
      number: 7000,
      calculate: calculateMiles,
      qualificationPeriod: 12,
      validity: 12,
      milesName: {
        en: 'points (PQPs)',
        de: 'Punkten (PQP)'
      },
      note: {
        en: '',
        de: '',
        es: ''
      }
    }, {
      type: 'miles',
      number: 6000,
      calculate: calculateMiles,
      secType: 'segments',
      secNumber: 16,
      secCalculate: calculateSegments$4,
      milesName: {
        en: 'points (PQPs)',
        de: 'Punkten (PQP)'
      },
      qualificationPeriod: 12,
      validity: 12,
      secmilesName: {
        en: 'Segments (PQFs)',
        de: 'Segmenten (PQF)'
      },
      secNote: {
        en: 'Segments in Basic Economy do not count',
        de: 'Für Transatlantikflüge im Light-Tarif (ohne Gepäck) und die United Basic Economy werden keine Segmente gutgeschrieben',
        es: ''
      }
    }],
    note: {
      en: '',
      de: '',
      es: ''
    }
  }, {
    name: 'Premier Platinum',
    allianceStatus: 'Star Alliance Gold',
    qualification: [{
      type: 'miles',
      number: 10000,
      calculate: calculateMiles,
      milesName: {
        en: 'points (PQPs)',
        de: 'Punkten (PQP)'
      },
      qualificationPeriod: 12,
      validity: 12,
      note: {
        en: '',
        de: '',
        es: ''
      }
    }, {
      type: 'miles',
      number: 9000,
      calculate: calculateMiles,
      milesName: {
        en: 'points (PQPs)',
        de: 'Punkten (PQP)'
      },
      secType: 'segments',
      secNumber: 24,
      secCalculate: calculateSegments$4,
      secmilesName: {
        en: 'Segments (PQFs)',
        de: 'Segmenten (PQF)'
      },
      qualificationPeriod: 12,
      validity: 12,
      secNote: {
        en: 'Segments in Basic Economy do not count',
        de: 'Für Transatlantikflüge im Light-Tarif (ohne Gepäck) und die United Basic Economy werden keine Segmente gutgeschrieben ',
        es: ''
      }
    }],
    note: {
      en: '',
      de: '',
      es: ''
    }
  }, {
    name: 'Premier 1K',
    allianceStatus: 'Star Alliance Gold',
    qualification: [{
      type: 'miles',
      number: 15000,
      calculate: calculateMiles,
      milesName: {
        en: 'points (PQPs)',
        de: 'Punkten (PQP)'
      },
      qualificationPeriod: 12,
      validity: 12,
      note: {
        en: '',
        de: '',
        es: ''
      }
    }, {
      type: 'miles',
      number: 13500,
      calculate: calculateMiles,
      milesName: {
        en: 'points (PQPs)',
        de: 'Punkten (PQP)'
      },
      secType: 'segments',
      secNumber: 36,
      secCalculate: calculateSegments$4,
      qualificationPeriod: 12,
      secmilesName: {
        en: 'Segments (PQFs)',
        de: 'Segmenten (PQF)'
      },
      validity: 12,
      secNote: {
        en: 'Segments in Basic Economy do not count',
        de: 'Für Transatlantikflüge im Light-Tarif (ohne Gepäck) und die United Basic Economy werden keine Segmente gutgeschrieben',
        es: ''
      }
    }],
    note: {
      en: '',
      de: '',
      es: ''
    }
  }],
  note: {
    en: 'If you do not enter the ticketing carrier and the flight price, this calculation only works for flights that are not issued & operated by UA. At least 4 United Segments required to obtain a status',
    de: 'Sofern Sie nicht den Ticketing-Carrier und den Flugpreis angeben, stimmt diese Berechnung nur wenn die Flüge weder von UA ausgestellt noch ausgeführt werden. 4 United-Segmente benötigt um einen Status zu bekommen.',
    es: ''
  }
};

var BR = {
  name: 'Eva Air Infinity MileageLands',
  alliance: 'Star Alliance',
  qualificationPeriodType: 'Consecutive months',
  status: [{
    name: 'Silver',
    allianceStatus: 'Star Alliance Silver',
    qualification: [{
      type: 'miles',
      number: 30000,
      qualificationPeriod: 12,
      validity: 24,
      note: {
        en: '4 segments on Eva Air or UNI Air needed.',
        de: '4 Segmente mit Eva Air oder UNI Air benötigt.',
        es: ''
      }
    }],
    note: {
      en: '',
      de: '',
      es: ''
    }
  }, {
    name: 'Gold',
    allianceStatus: 'Star Alliance Gold',
    qualification: [{
      type: 'miles',
      number: 50000,
      qualificationPeriod: 12,
      validity: 24,
      note: {
        en: '4 segments on Eva Air or UNI Air needed.',
        de: '4 Segmente mit Eva Air oder UNI Air benötigt.',
        es: ''
      }
    }],
    note: {
      en: '',
      de: '',
      es: ''
    }
  }, {
    name: 'Diamond',
    allianceStatus: 'Star Alliance Gold',
    qualification: [{
      type: 'miles',
      number: 120000,
      qualificationPeriod: 12,
      validity: 24,
      note: {
        en: '4 segments on Eva Air or UNI Air needed.',
        de: '4 Segmente mit Eva Air oder UNI Air benötigt.',
        es: ''
      }
    }],
    note: {
      en: '',
      de: '',
      es: ''
    }
  }],
  note: {
    en: '',
    de: '',
    es: ''
  }
};

function calculateSegements$1(segments) {
  return segments.filter(segment => ['TP'].includes(segment.carrier)).length;
}

var TP = {
  name: 'TAP Miles&Go',
  alliance: 'Star Alliance',
  qualificationPeriodType: 'Membership year',
  status: [{
    name: 'Silver',
    allianceStatus: 'Star Alliance Silver',
    qualification: [{
      type: 'miles',
      number: 30000,
      qualificationPeriod: 12,
      validity: 12
    }, {
      type: 'segments',
      number: 25,
      qualificationPeriod: 12,
      validity: 12,
      calculate: calculateSegements$1,
      note: {
        en: 'Only segments with TAP count.',
        de: 'Nur Segmente durchgeführt von TAP zählen.',
        es: ''
      }
    }]
  }, {
    name: 'Gold',
    allianceStatus: 'Star Alliance Gold',
    qualification: [{
      type: 'miles',
      number: 70000,
      qualificationPeriod: 12,
      validity: 12,
      note: {
        en: '',
        de: '',
        es: ''
      }
    }, {
      type: 'segments',
      number: 50,
      qualificationPeriod: 12,
      validity: 12,
      calculate: calculateSegements$1,
      note: {
        en: 'Only segments with TAP count.',
        de: 'Nur Segmente durchgeführt von TAP zählen.',
        es: ''
      }
    }]
  }],
  note: {
    en: '',
    de: '',
    es: ''
  }
};

function countSegments$4(segments, data) {
  return data.reduce((acc, itinerary) => {
    let mileage = itinerary.value?.totals?.find(item => 'SU' === item.id);

    if (!mileage) {
      return acc;
    }

    return 0 < mileage.rdm[0] ? acc + 1 : acc;
  }, 0);
}

function countBusinessSegments(segments, data) {
  return data.reduce((acc, itinerary) => {
    let mileage = itinerary.value?.totals?.find(item => 'SU' === item.id);

    if (!mileage) {
      return acc;
    }

    let cabquery = itinerary.value?.totals?.find(item => 'DL' === item.id);

    if (cabquery["cabinclass"] == "Business Class") {
      return 0 < mileage.rdm[0] ? acc + 1 : acc;
    }

    return acc;
  }, 0);
}

var SU = {
  name: 'Aeroflot Bonus',
  alliance: 'SkyTeam',
  qualificationPeriodType: 'Calendar year',
  status: [{
    name: 'Silver',
    allianceStatus: 'SkyTeam Elite',
    qualification: [{
      type: 'miles',
      number: 20000,
      qualificationPeriod: 12,
      validity: 12
    }, {
      type: 'segments',
      number: 20,
      qualificationPeriod: 12,
      validity: 12,
      calculate: countSegments$4,
      note: {
        en: 'Only segments with mileage credit count.',
        de: 'Nur Segmente mit Meilengutschrift zählen.',
        es: ''
      }
    }],
    note: {
      en: '',
      de: '',
      es: ''
    }
  }, {
    name: 'Gold',
    allianceStatus: 'SkyTeam Elite Plus',
    qualification: [{
      type: 'miles',
      number: 40000,
      qualificationPeriod: 12,
      validity: 12
    }, {
      type: 'segments',
      number: 40,
      qualificationPeriod: 12,
      validity: 12,
      calculate: countSegments$4,
      note: {
        en: 'Only segments with mileage credit count.',
        de: 'Nur Segmente mit Meilengutschrift zählen.',
        es: ''
      }
    }],
    note: {
      en: '',
      de: '',
      es: ''
    }
  }, {
    name: 'Platinum',
    allianceStatus: 'SkyTeam Elite Plus',
    qualification: [{
      type: 'miles',
      number: 100000,
      qualificationPeriod: 12,
      validity: 12
    }, {
      type: 'segments',
      number: 40,
      qualificationPeriod: 12,
      validity: 12,
      calculate: countBusinessSegments,
      milesName: {
        en: 'business class segments',
        de: 'Business Class Segmenten'
      },
      note: {
        en: 'Only business class segments with mileage credit count.',
        de: 'Nur Business Class Segmente mit Meilengutschrift zählen.',
        es: ''
      }
    }],
    note: {
      en: '',
      de: '',
      es: ''
    }
  }],
  note: {
    en: '',
    de: '',
    es: ''
  }
};

function countSegments$5(segments, data) {
  return data.reduce((acc, itinerary) => {
    let mileage = itinerary.value?.totals?.find(item => 'AR' === item.id);

    if (!mileage) {
      return acc;
    }

    return 0 < mileage.rdm[0] ? acc + 1 : acc;
  }, 0);
}

var AR = {
  name: 'Aerolíneas Argentinas AerolíneasPlus',
  alliance: 'SkyTeam',
  qualificationPeriodType: 'Consecutive months',
  status: [{
    name: 'Oro',
    allianceStatus: 'SkyTeam Elite',
    qualification: [{
      type: 'miles',
      number: 25000,
      qualificationPeriod: 12,
      validity: 12
    }, {
      type: 'miles',
      number: 15000,
      secType: 'segments',
      secNumber: 15,
      secCalculate: countSegments$5,
      secmilesName: {
        en: 'Segments',
        de: 'Segmenten'
      },
      qualificationPeriod: 12,
      validity: 12,
      secNote: {
        en: 'Only segments with mileage credit count.',
        de: 'Nur Segmente mit Meilengutschrift zählen.'
      }
    }, {
      type: 'segments',
      number: 30,
      calculate: countSegments$5,
      qualificationPeriod: 12,
      validity: 12
    }]
  }, {
    name: 'Platino',
    allianceStatus: 'SkyTeam Elite Plus',
    qualification: [{
      type: 'miles',
      number: 50000,
      qualificationPeriod: 12,
      validity: 12
    }, {
      type: 'miles',
      number: 30000,
      secType: 'segments',
      secNumber: 30,
      secmilesName: {
        en: 'Segments',
        de: 'Segmenten'
      },
      secCalculate: countSegments$5,
      qualificationPeriod: 12,
      validity: 12,
      secNote: {
        en: 'Only segments with mileage credit count.',
        de: 'Nur Segmente mit Meilengutschrift zählen.'
      }
    }, {
      type: 'segments',
      number: 60,
      calculate: countSegments$5,
      qualificationPeriod: 12,
      validity: 12
    }]
  }, {
    name: 'Diamante',
    allianceStatus: 'SkyTeam Elite Plus',
    qualification: [{
      type: 'miles',
      number: 70000,
      qualificationPeriod: 12,
      validity: 12
    }, {
      type: 'miles',
      number: 40000,
      secType: 'segments',
      secNumber: 40,
      secCalculate: countSegments$5,
      qualificationPeriod: 12,
      secmilesName: {
        en: 'Segments',
        de: 'Segmenten'
      },
      validity: 12,
      secNote: {
        en: 'Only segments with mileage credit count.',
        de: 'Nur Segmente mit Meilengutschrift zählen.'
      }
    }, {
      type: 'segments',
      number: 80,
      calculate: countSegments$5,
      qualificationPeriod: 12,
      validity: 12
    }]
  }]
};

function calculateExecutivebonus$2(segments, data) {
  console.log(data);
  return data.reduce((miles, itinerary) => {
    let item = itinerary.value.totals.find(item => 'AM' === item.id);

    if (!item) {
      return miles;
    }

    if (50000 < miles) return miles + item.rdm[1];else if (80000 < miles) return miles + item.rdm[2];else if (100000 < miles) return miles + item.rdm[3];else return miles + item.rdm[0];
  }, 0);
}

function countAMDLMiles(segments, data) {
  return data.reduce((acc, itinerary) => {
    let mileage = itinerary.value?.totals?.find(item => 'AM' === item.id);

    if (!mileage) {
      return [acc[0], acc[1] + 1];
    }

    if (['AM', 'DL'].includes(segments[acc[1]].carrier)) {
      if (50000 > acc[0]) return [acc[0] + mileage.rdm[0], acc[1] + 1];
      if (80000 > acc[0]) return [acc[0] + mileage.rdm[1], acc[1] + 1];
      if (100000 > acc[0]) return [acc[0] + mileage.rdm[2], acc[1] + 1];
      if (100000 < acc[0]) return [acc[0] + mileage.rdm[3], acc[1] + 1];
    } else {
      return [acc[0], acc[1] + 1];
    }
  }, [0, 0])[0];
}

var AM = {
  name: 'Aeromexico Club Premier',
  alliance: 'SkyTeam',
  qualificationPeriodType: 'Calendar year',
  status: [{
    name: 'Gold',
    allianceStatus: 'SkyTeam Elite',
    qualification: [{
      type: 'miles',
      number: 50000,
      qualificationPeriod: 12,
      validity: 12
    }]
  }, {
    name: 'Platinum',
    allianceStatus: 'SkyTeam Elite Plus',
    qualification: [{
      type: 'miles',
      number: 80000,
      calculate: calculateExecutivebonus$2,
      qualificationPeriod: 12,
      validity: 12
    }]
  }, {
    name: 'Titanium',
    allianceStatus: 'SkyTeam Elite Plus',
    qualification: [{
      type: 'miles',
      number: 100000,
      secType: 'miles',
      secNumber: 80000,
      secmilesName: {
        en: 'Miles with Delta or Aeromexico',
        de: 'Meilen mit Delta oder Aeromexico'
      },
      calculate: calculateExecutivebonus$2,
      secCalculate: countAMDLMiles,
      qualificationPeriod: 12,
      validity: 12
    }]
  }]
};

function calculateMiles$1(segments, data, airports) {
  return data.reduce((acc, itinerary) => {
    let mileage = itinerary.value?.totals?.find(item => 'UX' === item.id);

    if (!mileage) {
      return [acc[0], acc[1] + 1];
    }

    if (segments[acc[1]].carrier && segments[acc[1]].ticketer) {
      if (['UX'].includes(segments[acc[1]].carrier) || ['UX'].includes(segments[acc[1]].ticketer)) {
        let multiplier = 5;

        if (['C', 'J', 'D', 'I'].includes(segments[acc[1]].bookingClass)) {
          multiplier += 3;
        }

        if (airports[segments[acc[1]].origin].country_code == "US" || airports[segments[acc[1]].destination].country_code == "US") {
          multiplier += 1;
        }

        if (18000 > acc[0]) return [acc[0] + segments[acc[1]].price * multiplier, acc[1] + 1];
        if (32000 > acc[0]) return [acc[0] + segments[acc[1]].price * multiplier * 1.5, acc[1] + 1];
        if (60000 > acc[0]) return [acc[0] + segments[acc[1]].price * multiplier * 1.75, acc[1] + 1];
        if (60000 < acc[0]) return [acc[0] + segments[acc[1]].price * multiplier * 2, acc[1] + 1];
      }

      return [acc[0] + mileage.rdm[0], acc[1] + 1];
    } else {
      return [acc[0] + mileage.rdm[0], acc[1] + 1];
    }
  }, [0, 0])[0];
}
var UX = {
  name: 'Air Europa Suma',
  alliance: 'SkyTeam',
  qualificationPeriodType: 'Consecutive months',
  status: [{
    name: 'Silver',
    allianceStatus: 'SkyTeam Elite',
    qualification: [{
      type: 'miles',
      number: 18000,
      qualificationPeriod: 12,
      calculate: calculateMiles$1,
      validity: 12
    }, {
      type: 'segments',
      number: 14,
      qualificationPeriod: 12,
      validity: 12
    }]
  }, {
    name: 'Gold',
    allianceStatus: 'SkyTeam Elite Plus',
    qualification: [{
      type: 'miles',
      number: 32000,
      qualificationPeriod: 12,
      calculate: calculateMiles$1,
      validity: 12
    }, {
      type: 'segments',
      number: 26,
      qualificationPeriod: 12,
      validity: 12
    }]
  }, {
    name: 'Platinum',
    allianceStatus: 'SkyTeam Elite Plus',
    qualification: [{
      type: 'miles',
      number: 60000,
      qualificationPeriod: 12,
      calculate: calculateMiles$1,
      validity: 12
    }, {
      type: 'segments',
      number: 50,
      qualificationPeriod: 12,
      validity: 12
    }]
  }],
  note: {
    en: 'If you do not enter the ticketing carrier and the flight price, this calculation only works for flights that are not issued & operated by Air Europa.',
    de: 'Sofern Sie nicht den Ticketing-Carrier und den Flugpreis angeben, stimmt diese Berechnung nur wenn die Flüge weder von Air Europa ausgestellt noch ausgeführt werden. ',
    es: ''
  }
};

function countSegments$6(segments, data) {
  return data.reduce((acc, itinerary) => {
    let mileage = itinerary.value?.totals?.find(item => 'AZ' === item.id);

    if (!mileage) {
      return acc;
    }

    return 0 < mileage.rdm[0] ? acc + 1 : acc;
  }, 0);
}

function calculateExecutivebonus$3(segments, data) {
  console.log(data);
  return data.reduce((miles, itinerary) => {
    let item = itinerary.value.totals.find(item => 'AZ' === item.id);

    if (!item) {
      return miles;
    }

    if (20000 < miles) {
      return miles + item.rdm[1];
    } else if (50000 < miles) {
      return miles + item.rdm[2];
    } else if (80000 < miles) {
      return miles + item.rdm[3];
    } else {
      return miles + item.rdm[0];
    }
  }, 0);
}

var AZ = {
  name: 'Alitalia Millemiglia',
  alliance: 'SkyTeam',
  qualificationPeriodType: 'Calendar year',
  status: [{
    name: 'Ulisse',
    allianceStatus: 'SkyTeam Elite',
    qualification: [{
      type: 'miles',
      number: 20000,
      calculate: calculateExecutivebonus$3,
      qualificationPeriod: 12,
      validity: 12
    }, {
      type: 'segments',
      number: 30,
      qualificationPeriod: 12,
      validity: 12,
      calculate: countSegments$6,
      note: {
        en: 'Only segments with mileage credit count.',
        de: 'Nur Segmente mit Meilengutschrift zählen.',
        es: ''
      }
    }]
  }, {
    name: 'Freccia Alata Club',
    allianceStatus: 'SkyTeam Elite Plus',
    qualification: [{
      type: 'miles',
      number: 50000,
      calculate: calculateExecutivebonus$3,
      qualificationPeriod: 12,
      validity: 12
    }, {
      type: 'segments',
      number: 60,
      qualificationPeriod: 12,
      validity: 12,
      calculate: countSegments$6,
      note: {
        en: 'Only segments with mileage credit count.',
        de: 'Nur Segmente mit Meilengutschrift zählen.',
        es: ''
      }
    }]
  }, {
    name: 'Freccia Alata Plus Club',
    allianceStatus: 'SkyTeam Elite Plus',
    qualification: [{
      type: 'miles',
      number: 80000,
      calculate: calculateExecutivebonus$3,
      qualificationPeriod: 12,
      validity: 12
    }, {
      type: 'segments',
      number: 90,
      qualificationPeriod: 12,
      validity: 12,
      calculate: countSegments$6,
      note: {
        en: 'Only segments with mileage credit count.',
        de: 'Nur Segmente mit Meilengutschrift zählen.',
        es: ''
      }
    }]
  }],
  note: {
    en: '',
    de: '',
    es: ''
  }
};

function calculateSegments$5(segments) {
  return segments.filter(segment => ['OK'].includes(segment.carrier)).length;
}

function countSegments$7(segments, data) {
  return data.reduce((acc, itinerary) => {
    let mileage = itinerary.value?.totals?.find(item => 'OK' === item.id);

    if (!mileage) {
      return acc;
    }

    return 0 < mileage.rdm[0] ? acc + 1 : acc;
  }, 0);
}

var OK = {
  name: 'CSA OK Plus',
  alliance: 'SkyTeam',
  qualificationPeriodType: 'Calendar year',
  status: [{
    name: 'Silver',
    allianceStatus: 'SkyTeam Elite',
    qualification: [{
      type: 'miles',
      number: 25000,
      secType: 'segments',
      secNumber: 2,
      secCalculate: calculateSegments$5,
      qualificationPeriod: 12,
      secmilesName: {
        en: 'Segments with Czech Airlines',
        de: 'Segmenten mit Czech Airlines'
      },
      validity: 12
    }, {
      type: 'segments',
      number: 15,
      calculate: countSegments$7,
      secType: 'segments',
      secNumber: 2,
      secCalculate: calculateSegments$5,
      qualificationPeriod: 12,
      secmilesName: {
        en: 'Segments with Czech Airlines',
        de: 'Segmenten mit Czech Airlines'
      },
      validity: 12
    }]
  }, {
    name: 'Gold',
    allianceStatus: 'SkyTeam Elite Plus',
    qualification: [{
      type: 'miles',
      number: 50000,
      secType: 'segments',
      secNumber: 6,
      secCalculate: calculateSegments$5,
      qualificationPeriod: 12,
      validity: 12,
      secmilesName: {
        en: 'Segments with Czech Airlines',
        de: 'Segmenten mit Czech Airlines'
      }
    }, {
      type: 'segments',
      number: 30,
      calculate: countSegments$7,
      secType: 'segments',
      secNumber: 6,
      secCalculate: calculateSegments$5,
      qualificationPeriod: 12,
      validity: 12,
      secmilesName: {
        en: 'Segments with Czech Airlines',
        de: 'Segmenten mit Czech Airlines'
      }
    }]
  }, {
    name: 'Platinum',
    allianceStatus: 'SkyTeam Elite Plus',
    qualification: [{
      type: 'miles',
      number: 100000,
      secType: 'segments',
      secNumber: 10,
      secCalculate: calculateSegments$5,
      qualificationPeriod: 12,
      secmilesName: {
        en: 'Segments with Czech Airlines',
        de: 'Segmenten mit Czech Airlines'
      },
      validity: 12
    }, {
      type: 'segments',
      number: 70,
      calculate: countSegments$7,
      secType: 'segments',
      secNumber: 10,
      secCalculate: calculateSegments$5,
      qualificationPeriod: 12,
      secmilesName: {
        en: 'Segments with Czech Airlines',
        de: 'Segmenten mit Czech Airlines'
      },
      validity: 12
    }]
  }]
};

function countSegments$8(segments, data) {
  return data.reduce((acc, itinerary) => {
    let mileage = itinerary.value?.totals?.find(item => 'ME' === item.id);

    if (!mileage) {
      return acc;
    }

    return 0 < mileage.rdm[0] ? acc + 1 : acc;
  }, 0);
}

var ME = {
  name: 'MEA Cedar Miles',
  alliance: 'SkyTeam',
  qualificationPeriodType: 'Calendar year',
  status: [{
    name: 'Silver',
    allianceStatus: 'SkyTeam Elite',
    qualification: [{
      type: 'miles',
      number: 20000,
      qualificationPeriod: 12,
      validity: 12
    }, {
      type: 'segments',
      number: 15,
      qualificationPeriod: 12,
      validity: 12,
      calculate: countSegments$8,
      note: {
        en: 'Only segments with mileage credit count.',
        de: 'Nur Segmente mit Meilengutschrift zählen.',
        es: ''
      }
    }]
  }, {
    name: 'Gold',
    allianceStatus: 'SkyTeam Elite Plus',
    qualification: [{
      type: 'miles',
      number: 40000,
      qualificationPeriod: 12,
      validity: 12
    }, {
      type: 'segments',
      number: 30,
      qualificationPeriod: 12,
      validity: 12,
      calculate: countSegments$8,
      note: {
        en: 'Only segments with mileage credit count.',
        de: 'Nur Segmente mit Meilengutschrift zählen.',
        es: ''
      }
    }]
  }, {
    name: 'Platinum',
    allianceStatus: 'SkyTeam Elite Plus',
    qualification: [{
      type: 'miles',
      number: 70000,
      qualificationPeriod: 12,
      validity: 12
    }, {
      type: 'segments',
      number: 60,
      qualificationPeriod: 12,
      validity: 12,
      calculate: countSegments$8,
      note: {
        en: 'Only segments with mileage credit count.',
        de: 'Nur Segmente mit Meilengutschrift zählen.',
        es: ''
      }
    }]
  }],
  note: {
    en: '',
    de: '',
    es: ''
  }
};

function countSegments$9(segments, data, airports) {
  return data.reduce((acc, itinerary) => {
    let mileage = itinerary.value?.totals?.find(item => 'OK' === item.id);

    if (!mileage) {
      return [acc[0], acc[1] + 1];
    }

    if (airports[segments[acc[1]].origin].country_code != airports[segments[acc[1]].destination].country_code) {
      return 0 < mileage.rdm[0] ? [acc[0] + 1, acc[1] + 1] : [acc[0], acc[1] + 1];
    }

    return [acc[0], acc[1] + 1];
  }, [0, 0])[0];
}

var SV = {
  name: 'Saudia ALFURSAN',
  alliance: 'SkyTeam',
  qualificationPeriodType: 'Calendar year',
  status: [{
    name: 'Silver',
    allianceStatus: 'SkyTeam Elite',
    qualification: [{
      type: 'miles',
      number: 25000,
      qualificationPeriod: 12,
      validity: 12
    }, {
      type: 'segments',
      number: 20,
      calculate: countSegments$9,
      qualificationPeriod: 12,
      milesName: {
        en: 'international segments',
        de: 'internationalen Segmenten'
      },
      validity: 12
    }]
  }, {
    name: 'Gold',
    allianceStatus: 'SkyTeam Elite Plus',
    qualification: [{
      type: 'miles',
      number: 50000,
      qualificationPeriod: 12,
      validity: 12
    }, {
      type: 'segments',
      number: 40,
      calculate: countSegments$9,
      qualificationPeriod: 12,
      milesName: {
        en: 'international segments',
        de: 'internationalen Segmenten'
      },
      validity: 12
    }]
  }]
};

function countSegments$a(segments, data) {
  return data.reduce((acc, itinerary) => {
    let mileage = itinerary.value?.totals?.find(item => 'VN' === item.id);

    if (!mileage) {
      return acc;
    }

    return 0 < mileage.rdm[0] ? acc + 1 : acc;
  }, 0);
}

function calculateExecutivebonus$4(segments, data) {
  console.log(data);
  return data.reduce((miles, itinerary) => {
    let item = itinerary.value.totals.find(item => 'VN' === item.id);

    if (!item) {
      return miles;
    }

    if (15000 < miles) {
      return miles + item.rdm[1];
    } else if (30000 < miles) {
      return miles + item.rdm[2];
    } else if (50000 < miles) {
      return miles + item.rdm[3];
    } else {
      return miles + item.rdm[0];
    }
  }, 0);
}

var VN = {
  name: 'Vietnam Airlines Lotusmiles',
  alliance: 'SkyTeam',
  qualificationPeriodType: 'consecutive months',
  status: [{
    name: 'Titanium',
    allianceStatus: 'SkyTeam Elite',
    qualification: [{
      type: 'miles',
      number: 15000,
      calculate: calculateExecutivebonus$4,
      qualificationPeriod: 12,
      validity: 12
    }, {
      type: 'segments',
      number: 20,
      qualificationPeriod: 12,
      validity: 12,
      calculate: countSegments$a,
      note: {
        en: 'Only segments with mileage credit count.',
        de: 'Nur Segmente mit Meilengutschrift zählen.',
        es: ''
      }
    }]
  }, {
    name: 'Gold',
    allianceStatus: 'SkyTeam Elite',
    qualification: [{
      type: 'miles',
      number: 30000,
      calculate: calculateExecutivebonus$4,
      qualificationPeriod: 12,
      validity: 12
    }, {
      type: 'segments',
      number: 30,
      qualificationPeriod: 12,
      validity: 12,
      calculate: countSegments$a,
      note: {
        en: 'Only segments with mileage credit count.',
        de: 'Nur Segmente mit Meilengutschrift zählen.',
        es: ''
      }
    }]
  }, {
    name: 'Platinum',
    allianceStatus: 'SkyTeam Elite Plus',
    qualification: [{
      type: 'miles',
      number: 50000,
      calculate: calculateExecutivebonus$4,
      qualificationPeriod: 12,
      validity: 12
    }, {
      type: 'segments',
      number: 50,
      qualificationPeriod: 12,
      validity: 12,
      calculate: countSegments$a,
      note: {
        en: 'Only segments with mileage credit count.',
        de: 'Nur Segmente mit Meilengutschrift zählen.',
        es: ''
      }
    }]
  }],
  note: {
    en: '',
    de: '',
    es: ''
  }
};

var AFB = {
  name: 'Flying Blue',
  alliance: 'SkyTeam',
  qualificationPeriodType: 'Membership year',
  status: [{
    name: 'Silver',
    allianceStatus: 'SkyTeam Elite',
    qualification: [{
      type: 'miles',
      number: 100,
      qualificationPeriod: 12,
      validity: 15,
      milesName: {
        en: 'XP',
        de: 'XP'
      }
    }]
  }, {
    name: 'Gold',
    allianceStatus: 'SkyTeam Elite Plus',
    qualification: [{
      type: 'miles',
      number: 180,
      qualificationPeriod: 12,
      validity: 15,
      milesName: {
        en: 'XP',
        de: 'XP'
      }
    }]
  }, {
    name: 'Platinum',
    allianceStatus: 'SkyTeam Elite Plus',
    qualification: [{
      type: 'miles',
      number: 300,
      qualificationPeriod: 12,
      validity: 15,
      milesName: {
        en: 'XP',
        de: 'XP'
      }
    }]
  }],
  note: {
    en: '',
    de: '',
    es: ''
  }
};

function countSegments$b(segments, data) {
  return data.reduce((acc, itinerary) => {
    let mileage = itinerary.value?.totals?.find(item => 'DL' === item.id);

    if (!mileage) {
      return acc;
    }

    return 0 < mileage.rdm[0] ? acc + 1 : acc;
  }, 0);
}

function getmqd(segments, data) {
  return data.reduce((acc, itinerary) => {
    let mileage = itinerary.value?.totals?.find(item => 'DL' === item.id);

    if (!mileage) {
      return [acc[0], acc[1] + 1];
    }

    return 0 < mileage.qd ? [acc[0] + mileage.qd, acc[1] + 1] : [acc[0], acc[1] + 1];
  }, [0, 0])[0];
}

var DL = {
  name: 'Delta SkyMiles',
  alliance: 'SkyTeam',
  qualificationPeriodType: 'Calendar year',
  status: [{
    name: 'Silver',
    allianceStatus: 'SkyTeam Elite',
    qualification: [{
      type: 'miles',
      number: 25000,
      qualificationPeriod: 12,
      validity: 12,
      milesName: {
        en: 'MQM',
        de: 'MQM'
      },
      secType: 'miles',
      secNumber: 3000,
      secCalculate: getmqd,
      secmilesName: {
        en: 'MQD',
        de: 'MQD'
      },
      secNote: {
        en: 'Only required for US-Residents',
        de: 'Nur für US-Einwohner erforderlich',
        es: ''
      }
    }, {
      type: 'segments',
      number: 30,
      qualificationPeriod: 12,
      validity: 12,
      calculate: countSegments$b,
      note: {
        en: 'Only segments with mileage credit count.',
        de: 'Nur Segmente mit Meilengutschrift zählen.',
        es: ''
      },
      secType: 'miles',
      secNumber: 3000,
      secCalculate: getmqd,
      secmilesName: {
        en: 'MQD',
        de: 'MQD'
      },
      secNote: {
        en: 'Only required for US-Residents',
        de: 'Nur für US-Einwohner erforderlich',
        es: ''
      }
    }]
  }, {
    name: 'Gold',
    allianceStatus: 'SkyTeam Elite Plus',
    qualification: [{
      type: 'miles',
      number: 50000,
      qualificationPeriod: 12,
      validity: 12,
      milesName: {
        en: 'MQM',
        de: 'MQM'
      },
      secType: 'miles',
      secNumber: 6000,
      secCalculate: getmqd,
      secmilesName: {
        en: 'MQD',
        de: 'MQD'
      },
      secNote: {
        en: 'Only required for US-Residents',
        de: 'Nur für US-Einwohner erforderlich',
        es: ''
      }
    }, {
      type: 'segments',
      number: 60,
      qualificationPeriod: 12,
      validity: 12,
      calculate: countSegments$b,
      note: {
        en: 'Only segments with mileage credit count.',
        de: 'Nur Segmente mit Meilengutschrift zählen.',
        es: ''
      },
      secType: 'miles',
      secNumber: 6000,
      secCalculate: getmqd,
      secmilesName: {
        en: 'MQD',
        de: 'MQD'
      },
      secNote: {
        en: 'Only required for US-Residents',
        de: 'Nur für US-Einwohner erforderlich',
        es: ''
      }
    }]
  }, {
    name: 'Platinum',
    allianceStatus: 'SkyTeam Elite Plus',
    qualification: [{
      type: 'miles',
      number: 75000,
      qualificationPeriod: 12,
      validity: 12,
      milesName: {
        en: 'MQM',
        de: 'MQM'
      },
      secType: 'miles',
      secNumber: 9000,
      secCalculate: getmqd,
      secmilesName: {
        en: 'MQD',
        de: 'MQD'
      },
      secNote: {
        en: 'Only required for US-Residents',
        de: 'Nur für US-Einwohner erforderlich',
        es: ''
      }
    }, {
      type: 'segments',
      number: 100,
      qualificationPeriod: 12,
      validity: 12,
      calculate: countSegments$b,
      note: {
        en: 'Only segments with mileage credit count.',
        de: 'Nur Segmente mit Meilengutschrift zählen.',
        es: ''
      },
      secType: 'miles',
      secNumber: 9000,
      secCalculate: getmqd,
      secmilesName: {
        en: 'MQD',
        de: 'MQD'
      },
      secNote: {
        en: 'Only required for US-Residents',
        de: 'Nur für US-Einwohner erforderlich',
        es: ''
      }
    }]
  }, {
    name: 'Diamond',
    allianceStatus: 'SkyTeam Elite',
    qualification: [{
      type: 'miles',
      number: 125000,
      qualificationPeriod: 12,
      validity: 12,
      milesName: {
        en: 'MQM',
        de: 'MQM'
      },
      secType: 'miles',
      secNumber: 15000,
      secCalculate: getmqd,
      secmilesName: {
        en: 'MQD',
        de: 'MQD'
      },
      secNote: {
        en: 'Only required for US-Residents',
        de: 'Nur für US-Einwohner erforderlich',
        es: ''
      }
    }, {
      type: 'segments',
      number: 140,
      qualificationPeriod: 12,
      validity: 12,
      calculate: countSegments$b,
      note: {
        en: 'Only segments with mileage credit count.',
        de: 'Nur Segmente mit Meilengutschrift zählen.',
        es: ''
      },
      secType: 'miles',
      secNumber: 15000,
      secCalculate: getmqd,
      secmilesName: {
        en: 'MQD',
        de: 'MQD'
      },
      secNote: {
        en: 'Only required for US-Residents',
        de: 'Nur für US-Einwohner erforderlich',
        es: ''
      }
    }]
  }]
};

function calculateSegments$6(segments) {
  return segments.filter(segment => ['BA'].includes(segment.carrier)).length;
}

var BA = {
  name: 'British Airways Executive Club',
  alliance: 'Oneworld',
  qualificationPeriodType: 'Membership year',
  status: [{
    name: 'Bronze',
    allianceStatus: 'Oneworld Ruby',
    qualification: [{
      type: 'miles',
      number: 300,
      qualificationPeriod: 12,
      validity: 12,
      milesName: {
        en: 'Tier Points',
        de: 'Tier Points'
      },
      secType: 'segments',
      secNumber: 2,
      secCalculate: calculateSegments$6,
      secmilesName: {
        en: 'Segments with British Airways',
        de: 'Segmenten mit British Airways'
      }
    }]
  }, {
    name: 'Silver',
    allianceStatus: 'Oneworld Sapphire',
    qualification: [{
      type: 'miles',
      number: 600,
      qualificationPeriod: 12,
      validity: 12,
      milesName: {
        en: 'Tier Points',
        de: 'Tier Points'
      },
      secType: 'segments',
      secNumber: 4,
      secCalculate: calculateSegments$6,
      secmilesName: {
        en: 'Segments with British Airways',
        de: 'Segmenten mit British Airways'
      }
    }]
  }, {
    name: 'Gold',
    allianceStatus: 'Oneworld Emerald',
    qualification: [{
      type: 'miles',
      number: 1500,
      qualificationPeriod: 12,
      validity: 12,
      milesName: {
        en: 'Tier Points',
        de: 'Tier Points'
      },
      secType: 'segments',
      secNumber: 4,
      secCalculate: calculateSegments$6,
      secmilesName: {
        en: 'Segments with British Airways',
        de: 'Segmenten mit British Airways'
      }
    }]
  }],
  note: {
    en: '',
    de: '',
    es: ''
  }
};

var QR = {
  name: 'Qatar Airways Privilege Club',
  alliance: 'Oneworld',
  qualificationPeriodType: 'Consecutive months',
  status: [{
    name: 'Silver',
    allianceStatus: 'Oneworld Ruby',
    qualification: [{
      type: 'miles',
      number: 150,
      qualificationPeriod: 12,
      validity: 12,
      milesName: {
        en: 'Qpoints',
        de: 'Qpoints'
      }
    }]
  }, {
    name: 'Gold',
    allianceStatus: 'Oneworld Sapphire',
    qualification: [{
      type: 'miles',
      number: 300,
      qualificationPeriod: 12,
      validity: 12,
      milesName: {
        en: 'Qpoints',
        de: 'Qpoints'
      }
    }]
  }, {
    name: 'Platinum',
    allianceStatus: 'Oneworld Emerald',
    qualification: [{
      type: 'miles',
      number: 600,
      qualificationPeriod: 12,
      validity: 12,
      milesName: {
        en: 'Qpoints',
        de: 'Qpoints'
      }
    }]
  }],
  note: {
    en: '',
    de: '',
    es: ''
  }
};

function countSegments$c(segments, data) {
  return data.reduce((acc, itinerary) => {
    let mileage = itinerary.value?.totals?.find(item => 'AY' === item.id);

    if (!mileage) {
      return segments.filter(segment => ['AY'].includes(segment.carrier)).length;
    }

    return 0 < mileage.rdm[0] ? acc + 1 : acc;
  }, 0);
}

var AY = {
  name: 'Finnair Plus',
  alliance: 'Oneworld',
  qualificationPeriodType: 'Membership year',
  status: [{
    name: 'Silver',
    allianceStatus: 'Oneworld Ruby',
    qualification: [{
      type: 'miles',
      number: 30000,
      qualificationPeriod: 12,
      validity: 12,
      milesName: {
        en: 'points',
        de: 'Punkten'
      }
    }, {
      type: 'segments',
      number: 20,
      qualificationPeriod: 12,
      validity: 12,
      calculate: countSegments$c,
      note: {
        en: 'Only segments with mileage credit count.',
        de: 'Nur Segmente mit Meilengutschrift zählen.',
        es: ''
      }
    }],
    note: {
      en: '',
      de: '',
      es: ''
    }
  }, {
    name: 'Gold',
    allianceStatus: 'Oneworld Sapphire',
    qualification: [{
      type: 'miles',
      number: 80000,
      qualificationPeriod: 12,
      validity: 12,
      milesName: {
        en: 'points',
        de: 'Punkten'
      }
    }, {
      type: 'segments',
      number: 46,
      qualificationPeriod: 12,
      validity: 12,
      calculate: countSegments$c,
      note: {
        en: 'Only segments with mileage credit count.',
        de: 'Nur Segmente mit Meilengutschrift zählen.',
        es: ''
      }
    }],
    note: {
      en: '',
      de: '',
      es: ''
    }
  }, {
    name: 'Platinum',
    allianceStatus: 'Oneworld Emerald',
    qualification: [{
      type: 'miles',
      number: 150000,
      qualificationPeriod: 12,
      validity: 12,
      milesName: {
        en: 'points',
        de: 'Punkten'
      }
    }, {
      type: 'segments',
      number: 76,
      qualificationPeriod: 12,
      validity: 12,
      calculate: countSegments$c,
      note: {
        en: 'Only segments with mileage credit count.',
        de: 'Nur Segmente mit Meilengutschrift zählen.',
        es: ''
      }
    }],
    note: {
      en: '',
      de: '',
      es: ''
    }
  }],
  note: {
    en: 'As Finnair Plus doesn\'t use the booking classes to calculate the points, we sadly cannot calculate the points for Finnair flights.',
    de: 'Da Finnair Plus bei Finnair-Flügen nicht nach Buchungsklasse berechnet, können wir leider für Finnair-Flüge die Punkte nicht berechnen.',
    es: ''
  }
};

function countSegments$d(segments, data) {
  return data.reduce((acc, itinerary) => {
    let mileage = itinerary.value?.totals?.find(item => 'AT' === item.id);

    if (!mileage) {
      return acc;
    }

    return 0 < mileage.rdm[0] ? acc + 1 : acc;
  }, 0);
}

function calculateSegments$7(segments) {
  return segments.filter(segment => ['AT'].includes(segment.carrier)).length;
}

function countMarocMiles(segments, data) {
  return data.reduce((acc, itinerary) => {
    let mileage = itinerary.value?.totals?.find(item => 'AT' === item.id);

    if (!mileage) {
      return [acc[0], acc[1] + 1];
    }

    if (['AT'].includes(segments[acc[1]].carrier)) {
      return [acc[0] + mileage.qm[0], acc[1] + 1];
    } else {
      return [acc[0], acc[1] + 1];
    }
  }, [0, 0])[0];
}

var AT = {
  name: 'Royal Air Maroc Safar Flyer',
  alliance: 'Oneworld',
  qualificationPeriodType: 'Calendar year',
  status: [{
    name: 'Silver',
    allianceStatus: 'Oneworld Ruby',
    qualification: [{
      type: 'miles',
      number: 20000,
      qualificationPeriod: 12,
      validity: 12,
      secType: 'miles',
      secNumber: 10000,
      secCalculate: countMarocMiles,
      secmilesName: {
        en: 'Miles on Royal Air Maroc flights',
        de: 'Meilen mit Royal Air Maroc Flügen'
      }
    }, {
      type: 'segments',
      number: 15,
      qualificationPeriod: 12,
      validity: 12,
      calculate: countSegments$d,
      note: {
        en: 'Only segments with mileage credit count.',
        de: 'Nur Segmente mit Meilengutschrift zählen.',
        es: ''
      },
      secType: 'segments',
      secNumber: 2,
      secCalculate: calculateSegments$7,
      secmilesName: {
        en: 'segments with Royal Air Maroc',
        de: 'Segmenten mit Royal Air Maroc'
      }
    }],
    note: {
      en: '',
      de: '',
      es: ''
    }
  }, {
    name: 'Gold',
    allianceStatus: 'Oneworld Sapphire',
    qualification: [{
      type: 'miles',
      number: 35000,
      qualificationPeriod: 12,
      validity: 12,
      secType: 'miles',
      secNumber: 17500,
      secCalculate: countMarocMiles,
      secmilesName: {
        en: 'Miles on Royal Air Maroc flights',
        de: 'Meilen mit Royal Air Maroc Flügen'
      }
    }, {
      type: 'segments',
      number: 30,
      qualificationPeriod: 12,
      validity: 12,
      calculate: countSegments$d,
      note: {
        en: 'Only segments with mileage credit count.',
        de: 'Nur Segmente mit Meilengutschrift zählen.',
        es: ''
      },
      secType: 'segments',
      secNumber: 10,
      secCalculate: calculateSegments$7,
      secmilesName: {
        en: 'segments with Royal Air Maroc',
        de: 'Segmenten mit Royal Air Maroc'
      }
    }],
    note: {
      en: '',
      de: '',
      es: ''
    }
  }, {
    name: 'Platinum',
    allianceStatus: 'Oneworld Emerald',
    qualification: [{
      type: 'miles',
      number: 75000,
      qualificationPeriod: 12,
      validity: 12,
      secType: 'miles',
      secNumber: 37500,
      secCalculate: countMarocMiles,
      secmilesName: {
        en: 'Miles on Royal Air Maroc flights',
        de: 'Meilen mit Royal Air Maroc Flügen'
      }
    }, {
      type: 'segments',
      number: 75,
      qualificationPeriod: 12,
      validity: 12,
      calculate: countSegments$d,
      note: {
        en: 'Only segments with mileage credit count.',
        de: 'Nur Segmente mit Meilengutschrift zählen.',
        es: ''
      },
      secType: 'segments',
      secNumber: 20,
      secCalculate: calculateSegments$7,
      secmilesName: {
        en: 'segments with Royal Air Maroc',
        de: 'Segmenten mit Royal Air Maroc'
      }
    }],
    note: {
      en: '',
      de: '',
      es: ''
    }
  }],
  note: {
    en: '',
    de: '',
    es: ''
  }
};

function countSegments$e(segments, data) {
  return data.reduce((acc, itinerary) => {
    let mileage = itinerary.value?.totals?.find(item => 'RJ' === item.id);

    if (!mileage) {
      return acc;
    }

    return 0 < mileage.rdm[0] ? acc + 1 : acc;
  }, 0);
}

function calculateSegments$8(segments) {
  return segments.filter(segment => ['RJ'].includes(segment.carrier)).length;
}

var RJ = {
  name: 'Royal Jordanian Royal Club',
  alliance: 'Oneworld',
  qualificationPeriodType: 'Consecutive months',
  status: [{
    name: 'Silver JAY',
    allianceStatus: 'Oneworld Ruby',
    qualification: [{
      type: 'miles',
      number: 15000,
      qualificationPeriod: 12,
      validity: 12,
      secType: 'segments',
      secNumber: 4,
      secCalculate: calculateSegments$8,
      secmilesName: {
        en: 'Segments with Royal Jordanian',
        de: 'Segmenten mit Royal Jordanian'
      }
    }, {
      type: 'segments',
      number: 14,
      qualificationPeriod: 12,
      validity: 12,
      calculate: countSegments$e,
      secType: 'segments',
      secNumber: 4,
      secCalculate: calculateSegments$8,
      secmilesName: {
        en: 'Segments with Royal Jordanian',
        de: 'Segmenten mit Royal Jordanian'
      },
      note: {
        en: 'Only segments with mileage credit count.',
        de: 'Nur Segmente mit Meilengutschrift zählen.',
        es: ''
      }
    }]
  }, {
    name: 'Gold SPARROW',
    allianceStatus: 'Oneworld Sapphire',
    qualification: [{
      type: 'miles',
      number: 40000,
      qualificationPeriod: 12,
      validity: 12,
      secType: 'segments',
      secNumber: 10,
      secCalculate: calculateSegments$8,
      secmilesName: {
        en: 'Segments with Royal Jordanian',
        de: 'Segmenten mit Royal Jordanian'
      }
    }, {
      type: 'segments',
      number: 30,
      qualificationPeriod: 12,
      validity: 12,
      calculate: countSegments$e,
      secType: 'segments',
      secNumber: 10,
      secCalculate: calculateSegments$8,
      secmilesName: {
        en: 'Segments with Royal Jordanian',
        de: 'Segmenten mit Royal Jordanian'
      },
      note: {
        en: 'Only segments with mileage credit count.',
        de: 'Nur Segmente mit Meilengutschrift zählen.',
        es: ''
      }
    }]
  }, {
    name: 'Platinum HAWK',
    allianceStatus: 'Oneworld Emerald',
    qualification: [{
      type: 'miles',
      number: 65000,
      qualificationPeriod: 12,
      validity: 12,
      secType: 'segments',
      secNumber: 20,
      secCalculate: calculateSegments$8,
      secmilesName: {
        en: 'Segments with Royal Jordanian',
        de: 'Segmenten mit Royal Jordanian'
      }
    }, {
      type: 'segments',
      number: 46,
      qualificationPeriod: 12,
      validity: 12,
      secType: 'segments',
      secNumber: 20,
      secCalculate: calculateSegments$8,
      secmilesName: {
        en: 'Segments with Royal Jordanian',
        de: 'Segmenten mit Royal Jordanian'
      },
      calculate: countSegments$e,
      note: {
        en: 'Only segments with mileage credit count.',
        de: 'Nur Segmente mit Meilengutschrift zählen.',
        es: ''
      }
    }]
  }]
};

function calculateSegments$9(segments) {
  return segments.filter(segment => ['S7'].includes(segment.carrier)).length;
}

function calculateSegmentsWeight(segments, data) {
  return data.reduce((acc, itinerary) => {
    let mileage = itinerary.value?.totals?.find(item => 'S7' === item.id);

    if (!mileage) {
      return [acc[0], acc[1] + 1];
    }

    if (['S7'].includes(segments[acc[1]].carrier)) {
      if (['J', 'C', 'D'].includes(segments[acc[1]].bookingClass)) {
        return [acc[0] + 2, acc[1] + 1];
      } else {
        return [acc[0] + 1, acc[1] + 1];
      }
    } else {
      return [acc[0], acc[1] + 1];
    }
  }, [0, 0])[0];
}

var S7 = {
  name: 'S7 Priority',
  alliance: 'Oneworld',
  qualificationPeriodType: 'Calendar year',
  status: [{
    name: 'Silver',
    allianceStatus: 'Oneworld Ruby',
    qualification: [{
      type: 'miles',
      number: 20000,
      qualificationPeriod: 12,
      validity: 12,
      secType: 'segments',
      secNumber: 1,
      secCalculate: calculateSegments$9,
      secmilesName: {
        en: 'Segments with S7',
        de: 'Segmenten mit S7'
      }
    }, {
      type: 'segments',
      number: 20,
      qualificationPeriod: 12,
      validity: 12,
      milesName: {
        en: 'Segments with S7',
        de: 'Segmenten mit S7'
      },
      calculate: calculateSegmentsWeight,
      note: {
        en: 'Business class segments count double.',
        de: 'Business Class Segmente zählen doppelt.',
        es: ''
      }
    }]
  }, {
    name: 'Gold',
    allianceStatus: 'Oneworld Sapphire',
    qualification: [{
      type: 'miles',
      number: 50000,
      qualificationPeriod: 12,
      validity: 12,
      secType: 'segments',
      secNumber: 1,
      secCalculate: calculateSegments$9,
      secmilesName: {
        en: 'Segments with S7',
        de: 'Segmenten mit S7'
      }
    }, {
      type: 'segments',
      number: 50,
      qualificationPeriod: 12,
      validity: 12,
      milesName: {
        en: 'Segments with S7',
        de: 'Segmenten mit S7'
      },
      calculate: calculateSegmentsWeight,
      note: {
        en: 'Business class segments count double.',
        de: 'Business Class Segmente zählen doppelt.',
        es: ''
      }
    }]
  }, {
    name: 'Platinum',
    allianceStatus: 'Oneworld Emerald',
    qualification: [{
      type: 'miles',
      number: 75000,
      qualificationPeriod: 12,
      validity: 12,
      secType: 'segments',
      secNumber: 1,
      secCalculate: calculateSegments$9,
      secmilesName: {
        en: 'Segments with S7',
        de: 'Segmenten mit S7'
      }
    }, {
      type: 'segments',
      number: 75,
      qualificationPeriod: 12,
      validity: 12,
      milesName: {
        en: 'Segments with S7',
        de: 'Segmenten mit S7'
      },
      calculate: calculateSegmentsWeight,
      note: {
        en: 'Business class segments count double.',
        de: 'Business Class Segmente zählen doppelt.',
        es: ''
      }
    }]
  }]
};

function countSegments$f(segments, data) {
  return data.reduce((acc, itinerary) => {
    let mileage = itinerary.value?.totals?.find(item => 'UL' === item.id);

    if (!mileage) {
      return acc;
    }

    return 0 < mileage.rdm[0] ? acc + 1 : acc;
  }, 0);
}

function calculateSegments$a(segments) {
  return segments.filter(segment => ['UL'].includes(segment.carrier)).length;
}

function countULMiles(segments, data) {
  return data.reduce((acc, itinerary) => {
    let mileage = itinerary.value?.totals?.find(item => 'UL' === item.id);

    if (!mileage) {
      return [acc[0], acc[1] + 1];
    }

    if (['UL'].includes(segments[acc[1]].carrier)) {
      return [acc[0] + mileage.qm[0], acc[1] + 1];
    } else {
      return [acc[0], acc[1] + 1];
    }
  }, [0, 0])[0];
}

var UL = {
  name: 'SriLankan FlySmiLes',
  alliance: 'Oneworld',
  qualificationPeriodType: 'Calendar year',
  status: [{
    name: 'Classic',
    allianceStatus: 'Oneworld Ruby',
    qualification: [{
      type: 'miles',
      number: 20000,
      qualificationPeriod: 12,
      validity: 12,
      secType: 'segments',
      secNumber: 1,
      secCalculate: calculateSegments$a,
      secmilesName: {
        en: 'segments with SriLankan',
        de: 'Segmenten mit SriLankan'
      }
    }, {
      type: 'segments',
      number: 20,
      qualificationPeriod: 12,
      validity: 12,
      milesName: {
        en: 'segments',
        de: 'Segmenten'
      },
      calculate: countSegments$f,
      secType: 'segments',
      secNumber: 1,
      secCalculate: calculateSegments$a,
      secmilesName: {
        en: 'segments with SriLankan',
        de: 'Segmenten mit SriLankan'
      }
    }]
  }, {
    name: 'Gold',
    allianceStatus: 'Oneworld Sapphire',
    qualification: [{
      type: 'miles',
      number: 40000,
      qualificationPeriod: 12,
      validity: 12,
      secType: 'miles',
      secNumber: 20000,
      secCalculate: countULMiles,
      secmilesName: {
        en: 'miles with SriLankan',
        de: 'Meilen mit SriLankan'
      }
    }, {
      type: 'segments',
      number: 40,
      qualificationPeriod: 12,
      validity: 12,
      milesName: {
        en: 'segments',
        de: 'Segmenten'
      },
      calculate: countSegments$f,
      secType: 'segments',
      secNumber: 20,
      secCalculate: calculateSegments$a,
      secmilesName: {
        en: 'Segments with SriLankan',
        de: 'Segmenten mit SriLankan'
      }
    }]
  }, {
    name: 'Platinum',
    allianceStatus: 'Oneworld Emerald',
    qualification: [{
      type: 'miles',
      number: 60000,
      qualificationPeriod: 12,
      validity: 12,
      secType: 'miles',
      secNumber: 30000,
      secCalculate: countULMiles,
      secmilesName: {
        en: 'miles with SriLankan',
        de: 'Meilen mit SriLankan'
      }
    }, {
      type: 'segments',
      number: 60,
      qualificationPeriod: 12,
      validity: 12,
      milesName: {
        en: 'segments',
        de: 'Segmenten'
      },
      calculate: countSegments$f,
      secType: 'segments',
      secNumber: 30,
      secCalculate: calculateSegments$a,
      secmilesName: {
        en: 'Segments with SriLankan',
        de: 'Segmenten mit SriLankan'
      }
    }]
  }]
};

var programs = {
  A3,
  AT,
  AY,
  BA,
  RJ,
  QR,
  DL,
  AFB,
  VN,
  OK,
  ET,
  ME,
  AZ,
  AM,
  AR,
  UX,
  LHM,
  MS,
  TP,
  CM,
  OZ,
  SQ,
  SV,
  S7,
  CA,
  SK,
  TG,
  TK,
  UL,
  UA,
  BR,
  SU,
  AC
};

var template$1 = /*html*/
`
  <style>
  button[disabled] {
    background-color: gray;
  }
  </style>
  <form>
    <label for="route">__(Routings)</label>
    <textarea name="route" class="w-full my-1" rows="8">LH:A:FRA-HKG-MUC</textarea>
    <small></small>
    <div class="my-3">
      <button class="mr-3 px-3 py-1 bg-brand hover:bg-gray-darker text-white" type="submit">__(Calculate)</button>
      <label for="status">__(Status)</label>
      <select name="status">
        <optgroup label="Star Alliance">
          <option>Star Alliance Silver</option>
          <option selected>Star Alliance Gold</option>
        </optgroup>
        <optgroup label="SkyTeam">
          <option>SkyTeam Elite</option>
          <option>SkyTeam Elite Plus</option>
        </optgroup>
        <optgroup label="Oneworld">
          <option>Oneworld Ruby</option>
          <option>Oneworld Sapphire</option>
          <option>Oneworld Emerald</option>
        </optgroup>
      </select>
    </div>
  </form>
  <div class="loading hidden">__(Loading & calculating...)</div>
  <div class="error hidden"></div>
  <ol id="list"></ol>
  <p><small>__(Data provided by) <a href="https://www.wheretocredit.com" target="_blank">wheretocredit.com</a></small></p>
`;

class StatusCalculator extends BaseComponent {
  constructor() {
    super();
    this.$template = template$1;
    this.$status = 'Star Alliance Gold';
  }

  connectedCallback() {
    super.connectedCallback();
  }

  calculate() {
    this.$status = this.querySelector('[name="status"]').value;
    super.calculate();
  }

  display({
    value: data,
    airports
  }, totals) {
    super.display();
    this.el_list.innerHTML = '';
    Object.keys(totals).map(id => {
      const program = programs[id];

      if (!program) {
        return [];
      }

      return program.status.filter(status => this.$status === status.allianceStatus).map(status => {
        return status.qualification.map(qualification => {
          let build = {
            program,
            status,
            qualification
          };

          switch (qualification.type) {
            case 'miles':
              build.needed = qualification.number;
              build.collected = totals[id].qm[0];
              build.progress = build.collected / build.needed;
              qualification.milesName ? build.milesname = qualification.milesName[this.$locale] : build.milesname = qualification.type;
              break;

            case 'segments':
              build.needed = qualification.number;
              build.collected = this.$segments.length;
              build.progress = build.collected / build.needed;
              qualification.milesName ? build.milesname = qualification.milesName[this.$locale] : build.milesname = qualification.type;
          }

          if (qualification.calculate) {
            build.collected = qualification.calculate(this.$segments, data, airports);
            build.progress = build.collected / build.needed;
          }

          if (qualification.secType) {
            switch (qualification.secType) {
              case 'miles':
                build.secNeeded = qualification.secNumber;
                build.secCollected = totals[id].qm[0];
                build.secProgress = build.secCollected / build.secNeeded;
                build.secNote = qualification.secNote;
                qualification.secmilesName ? build.secmilesname = qualification.secmilesName[this.$locale] : build.secmilesname = qualification.type;
                break;

              case 'segments':
                build.secNeeded = qualification.secNumber;
                build.secCollected = this.$segments.length;
                build.secProgress = build.secCollected / build.secNeeded;
                build.secNote = qualification.secNote;
                qualification.secmilesName ? build.secmilesname = qualification.secmilesName[this.$locale] : build.secmilesname = qualification.type;
            }

            if (qualification.secCalculate) {
              build.secCollected = qualification.secCalculate(this.$segments, data, airports);
              build.secProgress = build.secCollected / build.secNeeded;
            }
          }

          return build;
        });
      }).flat().filter(status => undefined !== typeof status.progress);
    }).flat().sort((a, b) => b.progress - a.progress).forEach(item => {
      let el = document.createElement('li');
      let text = `
        <h3>${item.program.name}: ${item.status.name}</h3>
        <div class="grid grid-cols-2 gap-x-4 gab-y-8 my-3" style="row-gap: 1rem; column-gap: 2rem;">
          ${item.program.note ? `
          <div class="col-span-2 text-sm">
            ${item.program.note && item.program.note[this.$locale] ? `<div>${item.program.note[this.$locale]}</div>` : ''}
          </div>
          ` : ''}
          <div class="${'undefined' === typeof item.secProgress ? 'col-span-2 ' : ''}flex flex-col justify-end">
            <div class="text-sm">${item.progress.toLocaleString(undefined, {
        style: 'percent',
        minimumFractionDigits: 0
      })} = ${item.collected.toLocaleString()} __(of) ${item.needed.toLocaleString()} __(${item.milesname})</div>
            <progress class="w-full" value="${item.progress}">${item.progress.toLocaleString(undefined, {
        style: 'percent',
        minimumFractionDigits: 0
      })}</progress>
          </div>
          ${'undefined' === typeof item.secProgress ? '' : `
          <div class="flex flex-col justify-end">
            <div class="text-sm">${item.secProgress.toLocaleString(undefined, {
        style: 'percent',
        minimumFractionDigits: 0
      })} = ${item.secCollected.toLocaleString()} __(of) ${item.secNeeded.toLocaleString()} __(${item.secmilesname})</div>
            <progress class="w-full" value="${item.secProgress}">${item.secProgress.toLocaleString(undefined, {
        style: 'percent',
        minimumFractionDigits: 0
      })}</progress>
           </div>
          `}
          ${item.qualification.note || item.qualification.secNote ? `
          <div class="text-sm${'undefined' === typeof item.qualification.secNote ? ' col-span-2 ' : ''}">
            ${item.qualification.note && item.qualification.note[this.$locale] ? `<div>${item.qualification.note[this.$locale]}</div>` : ''}
          </div>
          ${'undefined' !== typeof item.secProgress && item.qualification.secNote ? `
          <div class="text-sm">
            ${item.qualification.secNote && item.qualification.secNote[this.$locale] ? item.qualification.secNote[this.$locale] : ''}
          </div>
          ` : ''}
          ` : ''}
          ${item.status.note ? `
          <div class="col-span-2 text-sm">
            ${item.status.note && item.status.note[this.$locale] ? `<div>${item.status.note[this.$locale]}</div>` : ''}
          </div>
          ` : ''}
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
      el.innerHTML = translate(text, translations[this.$locale] ? translations[this.$locale] : []);
      this.el_list.appendChild(el);
    });
  }

}

var template$2 = /*html*/
`
  <style>
  button[disabled] {
    background-color: gray;
  }
  .align-top {
    vertical-align: top;
  }
  .text-vertical {
    writing-mode: vertical-rl;
    text-orientation: sideways
  }
  .font-light {
    font-weight: 300;
  }
  </style>
  <form>
    <label for="route">__(Routings)</label>
    <textarea name="route" class="w-full my-1" rows="8">BA:K:FRA-LHR
BA:W:LHR-HKG</textarea>
    <small></small>
    <div class="my-3">
      <button class="mr-3 px-3 py-1 bg-brand hover:bg-gray-darker text-white" type="submit">__(Calculate)</button>
      <label for="status">__(Status)</label>
      <select name="status">
      </select>
    </div>
  </form>
  <div class="loading hidden">__(Loading & calculating...)</div>
  <div class="error hidden"></div>
  <table id="list"></table>
  <p><small>__(Points Data provided by Travel-Dealz.eu) & __(Award Miles Data provided by) <a href="https://www.wheretocredit.com" target="_blank">wheretocredit.com</a></small></p>
`;

class TierpointsCalculator extends BaseComponent {
  constructor() {
    super();
    this.$template = template$2;
    this.$program = 'BA';
  }

  connectedCallback() {
    super.connectedCallback();
    this.$program = this.hasAttribute('program') ? this.getAttribute('program') : 'BA';
    this.$points_label = this.hasAttribute('points_label') ? this.getAttribute('points_label') : null;
    this.$awardmiles_label = this.hasAttribute('awardmiles_label') ? this.getAttribute('awardmiles_label') : null;
    this.$status_labels = this.hasAttribute('status_labels') ? this.getAttribute('status_labels').split(',') : ['None', 'Silver', 'Gold', 'Platinum'];
    this.el_status = this.querySelector('[name="status"]');
    this.$status_labels.forEach((status, index) => {
      let el_option = document.createElement('option');
      el_option.value = index;
      el_option.innerHTML = status;
      this.el_status.appendChild(el_option);
    });
  }

  display({
    value: data,
    airlines,
    airports
  }, totals) {
    super.display();
    this.el_list.innerHTML = '';
    let el_thead = document.createElement('thead');
    el_thead.innerHTML = translate(
    /*html*/
    `
      <tr>
        <th></th>
        <th class="text-center">__(Route)</th>
        <th class="text-center">__(Bookingclass)</th>
        <th class="text-right">${this.$awardmiles_label ? this.$awardmiles_label : '__(Award Miles)'}</th>
        <th class="text-right">${this.$points_label ? this.$points_label : '__(Points)'}</th>
      </tr>
    `, translations[this.$locale] ? translations[this.$locale] : []);
    this.el_list.appendChild(el_thead);
    const status_key = this.el_status.value;
    this.$segments.forEach((segment, index) => {
      const earning = data[index].value.totals.find(item => item.id === this.$program);
      let el = document.createElement('tr');
      el.innerHTML = translate(
      /*html*/
      `
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
        <td class="text-right">${false === data[index].success ? data[index].errorMessage : `${earning.rdm ? earning.rdm[status_key]?.toLocaleString() : '-'}`}</td>
        <td class="text-right">${false === data[index].success ? data[index].errorMessage : `${earning.qm ? earning.qm[0]?.toLocaleString() : 0}`}</td>
        `, translations[this.$locale] ? translations[this.$locale] : []);
      this.el_list.appendChild(el);
    });
    let el_foot = document.createElement('tfoot');
    el_foot.innerHTML = translate(
    /*html*/
    `
      <tr>
        <th class="text-right" colspan="3">__(Total)</th>
        <th class="text-right">${totals[this.$program].rdm ? totals[this.$program].rdm[status_key]?.toLocaleString() : 0}</th>
        <th class="text-right">${totals[this.$program].qm[status_key]?.toLocaleString()}</th>
      </tr>
    `, translations[this.$locale] ? translations[this.$locale] : []);
    this.el_list.appendChild(el_foot);
  }

}

var template$3 = /*html*/
`
  <style>
  button[disabled] {
    background-color: gray;
  }
  </style>
  <form>
    <label for="route">__(Routings)</label>
    <textarea name="route" class="w-full my-1" rows="8">LH:P:FRA-LHR-PEK
UA:K:LHR-HKG:UA:265</textarea>
    <small></small>
    <div class="my-3">
      <button class="mr-3 px-3 py-1 bg-brand hover:bg-gray-darker text-white" type="submit">__(Calculate)</button>
      <label for="status">__(Status)</label>
      <select name="status">
      </select>
    </div>
  </form>
  <div class="loading hidden">__(Loading & calculating...)</div>
  <div class="error hidden"></div>
  <table id="list"></table>
  <p><small>__(Data provided by) <a href="https://www.wheretocredit.com" target="_blank">wheretocredit.com</a></small></p>
`;

class UaPqpCalculator extends BaseComponent {
  constructor() {
    super();
    this.$template = template$3;
    this.$program = 'UA';
    this.$points_label = 'PQP';
    this.$awardmiles_label = 'Award Miles';
    this.$status_labels = ['None', 'Silver', 'Gold', 'Platinum', '1K'];
  }

  connectedCallback() {
    super.connectedCallback();
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

  display({
    value: data,
    airlines,
    airports
  }, totals) {
    let totalpqps = 0;
    super.display(data);
    this.el_list.innerHTML = '';
    let el_thead = document.createElement('thead');
    el_thead.innerHTML = translate(
    /*html*/
    `
      <tr>
        <th></th>
        <th class="text-center">__(Route)</th>
        <th class="text-center">__(Bookingclass)</th>
        <th class="text-right">${this.$awardmiles_label ? this.$awardmiles_label : '__(Award Miles)'}</th>
        <th class="text-right">${this.$points_label ? this.$points_label : '__(PQP)'}</th>
      </tr>
    `, translations[this.$locale] ? translations[this.$locale] : []);
    this.el_list.appendChild(el_thead);
    const status_key = this.el_status.value;
    this.$segments.forEach((segment, index) => {
      const earning = data[index].value.totals.find(item => item.id === this.$program);
      let el = document.createElement('tr');
      let segmentmiles = calculateMiles([segment], [data[index]]);
      totalpqps += segmentmiles;
      el.innerHTML = translate(
      /*html*/
      `
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
            </div>
          </div>
        </td>
        <td class="text-right">${false === data[index].success ? data[index].errorMessage : `${earning ? earning.rdm[status_key]?.toLocaleString() : 0}`}</td>
        <td class="text-right">${false === data[index].success ? data[index].errorMessage : `${data[index].value.totals[0] ? segmentmiles.toLocaleString() : 0}`}</td>
        `, translations[this.$locale] ? translations[this.$locale] : []);
      this.el_list.appendChild(el);
    });
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

customElements.define("status-calculator", StatusCalculator);
customElements.define("tierpoints-calculator", TierpointsCalculator);
customElements.define("ua-pqp-calculator", UaPqpCalculator);
