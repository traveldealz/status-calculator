export default {
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