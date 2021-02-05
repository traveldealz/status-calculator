function calculateSegments(segments) {
  return segments.filter(segment => ['SK', 'WF'].includes(segment.carrier)).length;
}

export default {
  name: 'SAS EuroBonus',
  alliance: 'Star Alliance',
  qualificationPeriodType: 'Membership year',
  status: [
    {
      name: 'Silver',
      allianceStatus: 'Star Alliance Silver',
      qualification: [
        {
          type: 'miles',
          number: 20000,
          qualificationPeriod: 12,
          validity: 12,
        },
        {
          type: 'segments',
          number: 10,
          calculate: calculateSegments,
          note: {
            en: 'Only segments with SAS or Widerøe counts.',
            de: 'Nur Segmente mit SAS oder Widerøe zählen.',
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
          number: 45000,
          qualificationPeriod: 12,
          validity: 12,
        },
        {
          type: 'segments',
          number: 45,
          calculate: calculateSegments,
          note: {
            en: 'Only segments with SAS or Widerøe counts.',
            de: 'Nur Segmente mit SAS oder Widerøe zählen.',
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
      name: 'Diamond',
      allianceStatus: 'Star Alliance Gold',
      qualification: [
        {
          type: 'miles',
          number: 90000,
          qualificationPeriod: 12,
          validity: 12,
        },
        {
          type: 'segments',
          number: 90,
          calculate: calculateSegments,
          note: {
            en: 'Only segments with SAS or Widerøe counts.',
            de: 'Nur Segmente mit SAS oder Widerøe zählen.',
            es: '',
          },
        },
      ],
      note: {
        en: '',
        de: '',
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