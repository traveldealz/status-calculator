function countSegments(segments, data) {
  return data.reduce((acc, itinerary) => {
    let mileage = itinerary.value?.totals?.find(item => 'AA' === item.id);

    if (!mileage) {
      return acc;
    }

    if (mileage.rdm) {
      return 0 < mileage.rdm[0] ? acc + 1 : acc;
    } else {
      return acc;
    }
  }, 0);
}

function getmqd(segments, data) {
  return data.reduce((acc, itinerary) => {
    let mileage = itinerary.value?.totals?.find(item => 'AA' === item.id);

    if (!mileage) {
      return [acc[0], acc[1] + 1];
    }

    return 0 < mileage.qd[0] ? [acc[0] + mileage.qd[0], acc[1] + 1] : [acc[0], acc[1] + 1];
  }, [0, 0])[0];
}

export default {
  name: 'American AAdvantage',
  alliance: 'Oneworld',
  qualificationPeriodType: 'Calendar year',
  status: [{
    name: 'Gold',
    allianceStatus: 'Oneworld Ruby',
    qualification: [{
      type: 'miles',
      number: 25000,
      qualificationPeriod: 12,
      validity: 12,
      milesName: {
        en: 'EQM',
        de: 'EQM'
      },
      secType: 'miles',
      secNumber: 3000,
      secCalculate: getmqd,
      secmilesName: {
        en: 'EQD',
        de: 'EQD'
      }
    }, {
      type: 'segments',
      number: 30,
      qualificationPeriod: 12,
      validity: 12,
      calculate: countSegments,
      note: {
        en: 'Only segments with mileage credit count.',
        de: 'Nur Segmente mit Meilengutschrift zählen.',
        es: ''
      },
      secType: 'miles',
      secNumber: 3000,
      secCalculate: getmqd,
      secmilesName: {
        en: 'EQD',
        de: 'EQD'
      }
    }]
  }, {
    name: 'Platinum',
    allianceStatus: 'Oneworld Sapphire',
    qualification: [{
      type: 'miles',
      number: 50000,
      qualificationPeriod: 12,
      validity: 12,
      milesName: {
        en: 'EQM',
        de: 'EQM'
      },
      secType: 'miles',
      secNumber: 6000,
      secCalculate: getmqd,
      secmilesName: {
        en: 'EQD',
        de: 'EQD'
      }
    }, {
      type: 'segments',
      number: 60,
      qualificationPeriod: 12,
      validity: 12,
      calculate: countSegments,
      note: {
        en: 'Only segments with mileage credit count.',
        de: 'Nur Segmente mit Meilengutschrift zählen.',
        es: ''
      },
      secType: 'miles',
      secNumber: 6000,
      secCalculate: getmqd,
      secmilesName: {
        en: 'EQD',
        de: 'EQD'
      }
    }]
  }, {
    name: 'Platinum Pro',
    allianceStatus: 'Oneworld Sapphire',
    qualification: [{
      type: 'miles',
      number: 75000,
      qualificationPeriod: 12,
      validity: 12,
      milesName: {
        en: 'EQM',
        de: 'EQM'
      },
      secType: 'miles',
      secNumber: 9000,
      secCalculate: getmqd,
      secmilesName: {
        en: 'EQD',
        de: 'EQD'
      }
    }, {
      type: 'segments',
      number: 90,
      qualificationPeriod: 12,
      validity: 12,
      calculate: countSegments,
      note: {
        en: 'Only segments with mileage credit count.',
        de: 'Nur Segmente mit Meilengutschrift zählen.',
        es: ''
      },
      secType: 'miles',
      secNumber: 9000,
      secCalculate: getmqd,
      secmilesName: {
        en: 'EQD',
        de: 'EQD'
      }
    }]
  }, {
    name: 'Executive Platinum',
    allianceStatus: 'Oneworld Emerald',
    qualification: [{
      type: 'miles',
      number: 100000,
      qualificationPeriod: 12,
      validity: 12,
      milesName: {
        en: 'EQM',
        de: 'EQM'
      },
      secType: 'miles',
      secNumber: 15000,
      secCalculate: getmqd,
      secmilesName: {
        en: 'EQD',
        de: 'EQD'
      }
    }, {
      type: 'segments',
      number: 120,
      qualificationPeriod: 12,
      validity: 12,
      calculate: countSegments,
      note: {
        en: 'Only segments with mileage credit count.',
        de: 'Nur Segmente mit Meilengutschrift zählen.',
        es: ''
      },
      secType: 'miles',
      secNumber: 15000,
      secCalculate: getmqd,
      secmilesName: {
        en: 'EQD',
        de: 'EQD'
      }
    }]
  }]
};