function calculateSegments(segments) {
  return segments.filter(segment => ['A3','OA'].includes(segment.carrier)).length;
}

export default {
  name: 'Aegean Miles+Bonus',
  alliance: 'Star Alliance',
  qualificationPeriodType: 'Consecutive months',
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
            en: 'At least 2 segments with Aegean or Olympic Air are required.',
            de: 'Es müssen mind. 2 Segmente mit Aegean oder Olympic Air geflogen werden.',
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
            en: '',
            de: '',
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
            en: '',
            de: '',
            es: '',
          },
        },
      ],
      note: {
        en: 'The qualification period of 12 months starts after reaching the Silver status',
        de: 'Der Qualifikationszeitraum von 12 Monaten beginnt nach Erreichen des Silver Status',
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