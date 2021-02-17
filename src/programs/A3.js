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
          secmilesName: {
                        en: 'Segments with Aegean or Olympic Air',
                        de: 'Segmenten mit Aegean oder Olympic Air',
                    },
          secNumber: 2,
          secCalculate: calculateSegments,
          qualificationPeriod: 12,
          validity: 12,
          secNote: {
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
           note: {
        en: 'Qualification period of 12 months starts after reaching Silver status to collect further 24.000 miles (total 36.000) and 4 (total 6) segments with Aegean or Olympic Air.',
        de: 'Qualifikationszeitraum von 12 Monaten beginnt nach Erreichen des Silver Status, um weitere 24.000 Meilen (insgesamt 36.000) und 4 (insgesamt 6) Segmente mit Aegean oder Olympic Air zu sammeln.',
        es: '',
      },
          secmilesName: {
                        en: 'Segments with Aegean or Olympic Air',
                        de: 'Segmenten mit Aegean oder Olympic Air',
                    },
          qualificationPeriod: 12,
          validity: 12,
         
        },
      ],
     
    },
  ],
  note: {
    en: '',
    de: '',
    es: '',
  },
};