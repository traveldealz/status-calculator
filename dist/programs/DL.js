function countSegments(segments, data) {
  return data.reduce((acc, itinerary) => {
    let mileage = itinerary.value?.totals?.find(item => 'DL' === item.id);

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
    let mileage = itinerary.value?.totals?.find(item => 'DL' === item.id);

    if (!mileage) {
      return [acc[0], acc[1] + 1];
    }

    return 0 < mileage.qd[0] ? [acc[0] + mileage.qd[0], acc[1] + 1] : [acc[0], acc[1] + 1];
  }, [0, 0])[0];
}

export default {
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