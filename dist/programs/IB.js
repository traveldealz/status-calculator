function calculateSegments(segments) {
  return segments.filter(segment => ['IB'].includes(segment.carrier)).length;
}

export default {
  name: 'Iberia Plus',
  alliance: 'Oneworld',
  qualificationPeriodType: 'April 1 - March 31',
  status: [{
    name: 'Plata',
    allianceStatus: 'Oneworld Ruby',
    qualification: [{
      type: 'miles',
      number: 1100,
      qualificationPeriod: 12,
      validity: 12,
      milesName: {
        en: 'Elite Points',
        de: 'Elite Points'
      }
    }, {
      type: 'segments',
      number: 25,
      qualificationPeriod: 12,
      validity: 12,
      secType: 'segments',
      secNumber: 1,
      secCalculate: calculateSegments,
      secmilesName: {
        en: 'Segments with Iberia',
        de: 'Segmenten mit Iberia'
      }
    }]
  }, {
    name: 'Oro',
    allianceStatus: 'Oneworld Sapphire',
    qualification: [{
      type: 'miles',
      number: 2250,
      qualificationPeriod: 12,
      validity: 12,
      milesName: {
        en: 'Elite Points',
        de: 'Elite Points'
      }
    }, {
      type: 'segments',
      number: 50,
      qualificationPeriod: 12,
      validity: 12,
      secType: 'segments',
      secNumber: 1,
      secCalculate: calculateSegments,
      secmilesName: {
        en: 'Segments with Iberia',
        de: 'Segmenten mit Iberia'
      }
    }]
  }, {
    name: 'Platino',
    allianceStatus: 'Oneworld Emerald',
    qualification: [{
      type: 'miles',
      number: 12500,
      qualificationPeriod: 24,
      validity: 24,
      milesName: {
        en: 'Elite Points',
        de: 'Elite Points'
      }
    }]
  }],
  note: {
    en: '',
    de: '',
    es: ''
  }
};