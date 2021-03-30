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

export default {
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