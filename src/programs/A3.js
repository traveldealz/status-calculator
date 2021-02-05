function calculateSegments(segments) {
  return segments.filter(segment => ['A3','OA'].includes(segment.carrier)).length;
}

export default {
  name: 'Aegean Miles+Bonus',
  alliance: 'Star Alliance',
  qualificationPeriodType: '12 consecutive months',
  status: [
    {
      name: 'Silver',
      allianceStatus: 'Star Alliance Silver',
      qualification: [
        {
          type: 'miles',
          number: 24000,
          qualificationPeriod: 12,
          validity: 12,
        },
        {
          type: 'miles',
          number: 12000,
          secType: 'segments',
          secNumber: 2,
          secCalculate: calculateSegments,
          qualificationPeriod: 12,
          validity: 12,
          note: {
            en: '2 segments on Aegean or Olympic Air needed.',
            de: '2 Segmente mit Aegean oder Olympic Air benötigt.',
            es: '',
          },
        },
      ],
      note: {
        en: '',
        de: '',
        es: '',
      },
    },
    {
      name: 'Gold',
      allianceStatus: 'Star Alliance Gold',
      qualification: [
        {
          type: 'miles',
          number: 72000,
          qualificationPeriod: 12,
          validity: 12,
          note: {
            en: 'Qualification period of 12 months starts after reaching Silver status to collect further 48.000 miles.',
            de: 'Qualifikationszeitraum von 12 Monaten beginnt nach Erreichen des Silver Status, um weitere 48.000 Meilen zu sammeln.',
            es: '',
          },
        },
        {
          type: 'miles',
          number: 36000,
          secType: 'segments',
          secNumber: 6,
          secCalculate: calculateSegments,
          qualificationPeriod: 12,
          validity: 12,
          note: {
            en: 'Qualification period of 12 months starts after reaching Silver status to collect further 24.000 miles + 4 segments with Aegean or Olympic Air.',
            de: 'Qualifikationszeitraum von 12 Monaten beginnt nach Erreichen des Silver Status, um weitere 24.000 Meilen + 4 Segmente mit Aegean oder Olympic Air zu sammeln.',
            es: '',
          },
        },
      ],
      note: {
        en: '',
        de: '',
        es: '',
      },
    },
  ],
  note: {
    en: '',
    de: '',
    es: '',
  },
};