export default {
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