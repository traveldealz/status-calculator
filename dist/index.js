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
      secNumber: 2,
      secCalculate: calculateSegments,
      qualificationPeriod: 12,
      validity: 12,
      note: {
        en: '2 segments on Aegean or Olympic Air needed.',
        de: '2 Segmente mit Aegean oder Olympic Air benötigt.',
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
      qualificationPeriod: 12,
      validity: 12,
      note: {
        en: 'Qualification period of 12 months starts after reaching Silver status to collect further 24.000 miles + 4 segments with Aegean or Olympic Air.',
        de: 'Qualifikationszeitraum von 12 Monaten beginnt nach Erreichen des Silver Status, um weitere 24.000 Meilen + 4 Segmente mit Aegean oder Olympic Air zu sammeln.',
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

    return 35000 < miles ? miles + item.rdm[1] : miles + item.rdm[0];
  }, 0);
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
      validity: 24
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
      calculate: calculateExecutivebonus,
      note: {
        en: 'After reaching the Frequent Traveller status you get 25 percentage points Executive Bonus.',
        de: 'Nachdem man den Frequenz Traveller Status erreicht hat, erhält man 25 Prozentpunkte Excutive Bonus.',
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
  }, {
    name: 'Platinum',
    allianceStatus: 'Star Alliance Gold',
    qualification: [{
      type: 'miles',
      number: 1000000,
      qualificationPeriod: 0,
      validity: 0,
      note: {
        en: 'Miles accumulated from joining Asiana Club.',
        de: 'Gesammelte Meilen ab dem Beitritt zum Asiana Club.',
        es: ''
      }
    }, {
      type: 'segments',
      number: 1000,
      calculate: countSegments$1,
      qualificationPeriod: 24,
      validity: 24,
      note: {
        en: 'Segments with Asiana accumulated from joining Asiana Club.',
        de: 'Gesammelte Segmente durchgeführt von Asiana ab dem Beitritt zum Asiana Club.',
        es: ''
      }
    }],
    note: {
      en: 'Lifetime Status',
      de: 'Lebenslanger Status',
      es: ''
    }
  }],
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
      validity: 12
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
      validity: 12
    }, {
      type: 'segments',
      number: 45,
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
  name: 'Singapore Airlinse KrisFlyer',
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
  qualificationPeriodType: 'Calendar Year',
  status: [{
    name: 'Silver',
    allianceStatus: 'Star Alliance Silver',
    qualification: [{
      type: 'miles',
      number: 25000,
      secType: 'segments',
      secNumber: 4,
      secCalculate: calculateSegments$3,
      qualificationPeriod: 12,
      validity: 12,
      note: {
        en: '4 segments on Copa Airlines needed.',
        de: '4 Segmente mit Copa Airlines benötigt.',
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
      secType: 'segments',
      secNumber: 4,
      secCalculate: calculateSegments$3,
      qualificationPeriod: 12,
      validity: 12,
      note: {
        en: '4 segments on Copa Airlines needed.',
        de: '4 Segmente mit Copa Airlines benötigt.',
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
      number: 75000,
      secType: 'segments',
      secNumber: 4,
      secCalculate: calculateSegments$3,
      qualificationPeriod: 12,
      validity: 12,
      note: {
        en: '4 segments on Copa Airlines needed.',
        de: '4 Segmente mit Copa Airlines benötigt.',
        es: ''
      }
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
      validity: 12,
      note: {
        en: '4 segments on Copa Airlines needed.',
        de: '4 Segmente mit Copa Airlines benötigt.',
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

    return 0 < mileage.rdm[0] ? acc + 1 : acc;
  }, 0);
}

function calculateMiles(segments, data) {
  // Berechnet Statuspunkte. Bei UA -> 0, da Umsatzbasiert.
  // Bei Partnerairlines -> Meilen / 5 -  mit 1500/750 Limit je nach Klasse
  // Bei anderen Airlines -> Meilen / 6 - mit 750/500 Limit je nach Klasse
  return data.reduce((acc, itinerary) => {
    let mileage = itinerary.value?.totals?.find(item => 'UA' === item.id);

    if (segments.filter(segment => ['AC', 'CA', 'EN', 'NZ', 'NH', 'OZ', 'AV', 'AD', 'SN', 'CM', 'WK', 'EW', 'LH', 'LX'].includes(segment.carrier))) {
      if (segments.filter(segment => ['F', 'A', 'J', 'C', 'D', 'Z', 'P'].includes(segment.bookingClass))) {
        return mileage.rdm[0] / 5 > 1500 ? 1500 : parseInt(mileage.rdm[0] / 5);
      } else {
        return mileage.rdm[0] / 5 > 750 ? 750 : parseInt(mileage.rdm[0] / 5);
      }
    }

    if (segments.filter(segment => ['UA'].includes(segment.carrier))) {
      return 0;
    }

    if (segments.filter(segment => ['F', 'A', 'J', 'C', 'D', 'Z'].includes(segment.bookingClass))) {
      return mileage.rdm[0] / 6 > 1000 ? 1000 : parseInt(mileage.rdm[0] / 6);
    } else {
      return mileage.rdm[0] / 6 > 500 ? 500 : parseInt(mileage.rdm[0] / 6);
    }
  }, 0);
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
      qualificationPeriod: 12,
      validity: 12
    }, {
      type: 'miles',
      number: 3000,
      calculate: calculateMiles,
      secType: 'segments',
      secNumber: 8,
      secCalculate: calculateSegments$4,
      qualificationPeriod: 12,
      validity: 12,
      note: {
        en: 'Only if not issued & operated by UA. Segments in Basic Economy do not count.',
        de: 'Nur wenn weder von UA ausgestellt noch ausgeführt. Interkontinentale Segmente im billigsten Economy-Tarif ohne Gepäck zählen nicht. ',
        es: ''
      }
    }],
    note: {
      en: '',
      de: '',
      es: ''
    }
  }, {
    name: 'Premier Gold',
    allianceStatus: 'Star Alliance Gold',
    qualification: [{
      type: 'miles',
      number: 7000,
      calculate: calculateMiles,
      qualificationPeriod: 12,
      validity: 12,
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
      qualificationPeriod: 12,
      validity: 12,
      note: {
        en: 'Segments in Basic Economy do not count',
        de: 'Nur wenn weder von UA ausgestellt noch ausgeführt. Interkontinentale Segmente im billigsten Economy-Tarif ohne Gepäck zählen nicht. ',
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
      secType: 'segments',
      secNumber: 24,
      secCalculate: calculateSegments$4,
      qualificationPeriod: 12,
      validity: 12,
      note: {
        en: 'Segments in Basic Economy do not count',
        de: 'Nur wenn weder von UA ausgestellt noch ausgeführt. Interkontinentale Segmente im billigsten Economy-Tarif ohne Gepäck zählen nicht. ',
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
      secType: 'segments',
      secNumber: 36,
      secCalculate: calculateSegments$4,
      qualificationPeriod: 12,
      validity: 12,
      note: {
        en: 'Segments in Basic Economy do not count',
        de: 'Nur wenn weder von UA ausgestellt noch ausgeführt. Interkontinentale Segmente im billigsten Economy-Tarif ohne Gepäck zählen nicht. ',
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
    en: '4 United Segments required',
    de: '4 United-Segmente benötigt',
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

var programs = {
  A3,
  ET,
  LHM,
  MS,
  TP,
  CM,
  OZ,
  SQ,
  CA,
  SK,
  TG,
  TK,
  UA,
  BR,
  AC
};

const template = document.createElement("template");
template.innerHTML =
/*html*/
`
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
`; // const needed = {
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
    this.attachShadow({
      mode: "open"
    });
    this.$status = 'Star Alliance Gold';
    this.$segments = [];
  }

  connectedCallback() {
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.el_route = this.shadowRoot.querySelector('[name="route"]');
    this.el_list = this.shadowRoot.querySelector('#list');
    this.shadowRoot.querySelector('form').addEventListener('submit', event => {
      event.preventDefault();
      this.calculate();
    });
  }

  calculate() {
    this.$status = this.shadowRoot.querySelector('[name="status"]').value;
    let itineraries = this.el_route.value.trim().split('\n').map(value => {
      let parts = value.split(':').map(v => v.trim());
      let carrier = parts[0];
      let bookingClass = parts[1];
      let route = parts[2].split('-').map(v => v.trim());
      return route.reduce((accumulator, airport, index, route) => {
        if (0 === index || !accumulator) {
          return accumulator;
        }

        accumulator.push({
          carrier,
          bookingClass,
          origin: route[index - 1],
          destination: airport
        });
        return accumulator;
      }, []);
    }).flat();
    this.$segments = itineraries.flat();
    this.query(itineraries);
  }

  query(itineraries) {
    fetch('https://www.wheretocredit.com/api/2.0/calculate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(itineraries.map(itinerary => {
        return {
          segments: [itinerary]
        };
      }))
    }).then(response => response.json()).then(data => this.display(data.value)).catch(error => alert(`Where to Credit ${error.toString()}`));
  }

  display(data) {
    let totals = data.reduce((totals, itinerary) => {
      itinerary.value.totals.forEach(item => {
        totals[item.id] = totals[item.id] ? totals[item.id] + item.rdm[0] : item.rdm[0];
      });
      return totals;
    }, {});
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
              build.collected = totals[id];
              build.progress = build.collected / build.needed;
              break;

            case 'segments':
              build.needed = qualification.number;
              build.collected = this.$segments.length;
              build.progress = build.collected / build.needed;
          }

          if (qualification.calculate) {
            build.collected = qualification.calculate(this.$segments, data);
            build.progress = build.collected / build.needed;
          }

          if (qualification.secType) {
            switch (qualification.secType) {
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

            if (qualification.secCalculate) {
              build.secCollected = qualification.secCalculate(this.$segments, data);
              build.secProgress = build.secCollected / build.secNeeded;
            }
          }

          return build;
        });
      }).flat().filter(status => undefined !== typeof status.progress);
    }).flat().sort((a, b) => b.progress - a.progress).forEach(item => {
      let el = document.createElement('li');
      el.innerHTML = `
        <strong>${item.program.name}: ${item.status.name}</strong><br />
        <small>${item.progress.toLocaleString(undefined, {
        style: 'percent',
        minimumFractionDigits: 0
      })} = ${item.collected.toLocaleString()} of ${item.needed.toLocaleString()} ${item.qualification.type}</small><br />
        <progress value="${item.progress}">${item.progress.toLocaleString(undefined, {
        style: 'percent',
        minimumFractionDigits: 0
      })}</progress>
        ${'undefined' === typeof item.secProgress ? '' : `
          <br /><small>${item.secProgress.toLocaleString(undefined, {
        style: 'percent',
        minimumFractionDigits: 0
      })} = ${item.secCollected.toLocaleString()} of ${item.secNeeded.toLocaleString()} ${item.qualification.secType}</small><br />
          <progress value="${item.secProgress}">${item.secProgress.toLocaleString(undefined, {
        style: 'percent',
        minimumFractionDigits: 0
      })}</progress>
          `}
        ${item.qualification.note?.en ? `<br /><small>${item.qualification.note.en}</small>` : ''}
        ${item.status.note?.en ? `<br /><small>${item.status.note.en}</small>` : ''}
        ${item.program.note?.en ? `<br /><small>${item.program.note.en}</small>` : ''}
        <br /><small>Qualification period: ${item.qualification.qualificationPeriod} month (${item.program.qualificationPeriodType})</small>
        <br /><small>Validity: at least ${item.qualification.validity} months</small>
        `;
      this.el_list.appendChild(el);
    });
  }

}

customElements.define("status-calculator", StatusCalculator);
