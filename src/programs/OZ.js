function countSegments( segments ) {
  return segments.filter(segment => ['OZ'].includes(segment.carrier)).length;
}

export default {
  name: 'Asiana Club',
  alliance: 'Star Alliance',
  qualificationPeriodType: 'Membership months',
  status: [
    {
      name: 'Gold',
      allianceStatus: 'Star Alliance Silver',
      qualification: [
        {
          type: 'miles',
          number: 20000,
          qualificationPeriod: 24,
          validity: 24,
        },
        {
          type: 'segments',
          number: 30,
          calculate: countSegments,
          qualificationPeriod: 24,
          validity: 24,
          note: {
            en: 'Only segments with Asiana count.',
            de: 'Nur Segmente mit Asiana zählen.',
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
          number: 40000,
          qualificationPeriod: 24,
          validity: 24,
        },
        {
          type: 'segments',
          number: 50,
          calculate: countSegments,
          qualificationPeriod: 24,
          validity: 24,
          note: {
            en: 'Only segments with Asiana count.',
            de: 'Nur Segmente mit Asiana zählen.',
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
      name: 'Diamond Plus',
      allianceStatus: 'Star Alliance Gold',
      qualification: [
        {
          type: 'miles',
          number: 100000,
          qualificationPeriod: 24,
          validity: 24,
        },
        {
          type: 'segments',
          number: 100,
          calculate: countSegments,
          qualificationPeriod: 24,
          validity: 24,
          note: {
            en: 'Only segments with Asiana count.',
            de: 'Nur Segmente mit Asiana zählen.',
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
      name: 'Platinum',
      allianceStatus: 'Star Alliance Gold',
      qualification: [
        {
          type: 'miles',
          number: 1000000,
          qualificationPeriod: 0,
          validity: 0,
          note: {
            en: 'Miles accumulated since joining Asiana Club.',
            de: 'Gesammelte Meilen seit der Registrierung bei Asiana Club.',
            es: '',
          },
        },
        {
          type: 'segments',
          number: 1000,
          calculate: countSegments,
          qualificationPeriod: 24,
          validity: 24,
          note: {
            en: 'Segments with Asiana accumulated since joining Asiana Club.',
            de: 'Von Asiana durchgeführte Segmente seit der Registrierung bei Asiana Club.',
            es: '',
          },
        },
      ],
      note: {
        en: 'Lifetime Status',
        de: 'Lebenslanger Status',
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