export default {
  name: 'Egyptair Plus',
  alliance: 'Star Alliance',
  qualificationPeriodType: 'Consecutive months',
  status: [
    {
      name: 'Silver',
      allianceStatus: 'Star Alliance Silver',
      qualification: [
        {
          type: 'miles',
          number: 30000,
          qualificationPeriod: 0,
          validity: 24,
        },
      ],
      note: {
        en: 'There is no time limit to collect 30.000 miles.',
        de: 'Es gibt kein Zeitlimit um die 30.000 Meilen zu sammeln.',
        es: '',
      },
    },
    {
      name: 'Gold',
      allianceStatus: 'Star Alliance Gold',
      qualification: [
        {
          type: 'miles',
          number: 60000,
          qualificationPeriod: 24,
          validity: 24,
        },
      ],
      note: {
        en: 'You have 2 years after reaching Silver (at 30.000 miles) to collect further 30.000 miles.',
        de: 'Ab erreichen des Silver Status (bei 30.000 Meilen) hat man weitere 2 Jahre Zeit um weitere 30.000 Meilen zu sammeln.',
        es: '',
      },
    },
    {
      name: 'Elite',
      allianceStatus: 'Star Alliance Gold',
      qualification: [
        {
          type: 'miles',
          number: 360000,
          qualificationPeriod: 24,
          validity: 24,
        },
      ],
      note: {
        en: 'The qualification period of 2 years starts after reaching Gold status to collect further 300.000 miles',
        de: 'Der Qualifikationszeitraum von 2 Jahren startet ab Erreichen des Gold Status, um weitere 300.000 Meilen zu sammeln.',
        es: '',
      },
    }
  ],
  note: {
    en: '',
    de: '',
    es: '',
  },
};