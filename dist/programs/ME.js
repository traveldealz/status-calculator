function countSegments(segments, data) {
  return data.reduce((acc, itinerary) => {
    let mileage = itinerary.value?.totals?.find(item => 'ME' === item.id);

    if (!mileage) {
      return acc;
    }

    return 0 < mileage.rdm[0] ? acc + 1 : acc;
  }, 0);
}

export default {
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
      calculate: countSegments,
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
      calculate: countSegments,
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
      calculate: countSegments,
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