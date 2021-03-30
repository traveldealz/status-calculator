function calculateSegments(segments) {
  return segments.filter(segment => ['TG'].includes(segment.carrier)).filter(segment => !['G', 'V', 'W'].includes(segment.bookingClass)).length;
}

export default {
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
      calculate: calculateSegments,
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