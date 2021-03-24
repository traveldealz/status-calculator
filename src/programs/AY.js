function countSegments( segments, data ) {
  return data.reduce((acc,itinerary) => {
    let mileage = itinerary.value?.totals?.find(item => 'AY' === item.id);
    if(!mileage) {
      return acc;
    }
    return 0 < mileage.rdm[0] ? acc+1 : acc;
  }, 0);
}

export default {
  name: 'Finnair Plus',
  alliance: 'Oneworld',
  qualificationPeriodType: 'Membership year',
  status: [
    {
      name: 'Silver',
      allianceStatus: 'Oneworld Ruby',
      qualification: [
        {
          type: 'miles',
          number: 30000,
          qualificationPeriod: 12,
          validity: 12,
          milesName: {
            en: 'points',
            de: 'Punkten',
          },
        },
        {
          type: 'segments',
          number: 20,
          qualificationPeriod: 12,
          validity: 12,
          calculate: countSegments,
          note: {
            en: 'Only segments with mileage credit count.',
            de: 'Nur Segmente mit Meilengutschrift zählen.',
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
      allianceStatus: 'Oneworld Sapphire',
      qualification: [
        {
          type: 'miles',
          number: 80000,
          qualificationPeriod: 12,
          validity: 12,
          milesName: {
            en: 'points',
            de: 'Punkten',
          },
        },
        {
          type: 'segments',
          number: 46,
          qualificationPeriod: 12,
          validity: 12,
          calculate: countSegments,
          note: {
            en: 'Only segments with mileage credit count.',
            de: 'Nur Segmente mit Meilengutschrift zählen.',
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
      allianceStatus: 'Oneworld Emerald',
      qualification: [
        {
          type: 'miles',
          number: 150000,
          qualificationPeriod: 12,
          validity: 12,
          milesName: {
            en: 'points',
            de: 'Punkten',
          },
        },
        {
          type: 'segments',
          number: 76,
          qualificationPeriod: 12,
          validity: 12,
          calculate: countSegments,
          note: {
            en: 'Only segments with mileage credit count.',
            de: 'Nur Segmente mit Meilengutschrift zählen.',
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