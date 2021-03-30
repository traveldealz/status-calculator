function countSegments(segments, data) {
  return data.reduce((acc, itinerary) => {
    let mileage = itinerary.value?.totals?.find(item => 'AY' === item.id);

    if (!mileage) {
      return segments.filter(segment => ['AY'].includes(segment.carrier)).length;
    }

    return 0 < mileage.rdm[0] ? acc + 1 : acc;
  }, 0);
}

export default {
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
    en: 'As Finnair Plus doesn\'t use the booking classes to calculate the points, we sadly cannot calculate the points for Finnair flights.',
    de: 'Da Finnair Plus bei Finnair-Flügen nicht nach Buchungsklasse berechnet, können wir leider für Finnair-Flüge die Punkte nicht berechnen.',
    es: ''
  }
};