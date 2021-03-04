function countSegments( segments, data ) {
  return data.reduce((acc,itinerary) => {
    let mileage = itinerary.value?.totals?.find(item => 'SU' === item.id);
    if(!mileage) {
      return acc;
    }
    return 0 < mileage.rdm[0] ? acc+1 : acc;
  }, 0);
}

function countBusinessSegments( segments, data ) {
  return data.reduce((acc,itinerary) => {
    let mileage = itinerary.value?.totals?.find(item => 'SU' === item.id);
    if(!mileage) {
      return acc;
    }
    //TODO: in Farecollection nachsehen, ob Buchungsklasse Business ist
    return 0 < mileage.rdm[0] ? acc+1 : acc;
  }, 0);
}

export default {
  name: 'Aeroflot Bonus',
  alliance: 'SkyTeam',
  qualificationPeriodType: 'Calendar year',
  status: [
    {
      name: 'Silver',
      allianceStatus: 'SkyTeam Elite',
      qualification: [
        {
          type: 'miles',
          number: 20000,
          qualificationPeriod: 12,
          validity: 12,
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
      allianceStatus: 'SkyTeam Elite Plus',
      qualification: [
        {
          type: 'miles',
          number: 40000,
          qualificationPeriod: 12,
          validity: 12,
        },
        {
          type: 'segments',
          number: 40,
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
      allianceStatus: 'SkyTeam Elite Plus',
      qualification: [
        {
          type: 'miles',
          number: 100000,
          qualificationPeriod: 12,
          validity: 12,
        },
        {
          type: 'segments',
          number: 40,
          qualificationPeriod: 12,
          validity: 12,
          calculate: countBusinessSegments,
          milesName: {
              en: 'business class segments',
              de: 'Business Class Segmenten',
          },
          note: {
            en: 'Only business class segments with mileage credit count.',
            de: 'Nur Business Class Segmente mit Meilengutschrift zählen.',
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