function countSegments( segments, data ) {
  return data.reduce((acc,itinerary) => {
    let mileage = itinerary.value?.totals?.find(item => 'AT' === item.id);
    if(!mileage) {
      return acc;
    }
    return 0 < mileage.rdm[0] ? acc+1 : acc;
  }, 0);
}

function calculateSegments(segments) {
    return segments.filter(segment => ['AT'].includes(segment.carrier)).length;
}


function countMarocMiles( segments, data ) {
   return data.reduce((acc,itinerary) => {

        let mileage = itinerary.value?.totals?.find(item => 'AT' === item.id);
        if(!mileage) {
          return [acc[0], acc[1]+1];
        }
        if(['AT'].includes(segments[acc[1]].carrier)) {
                return [acc[0] + mileage.qm[0], acc[1]+1];
        }
        else {
                return [acc[0], acc[1]+1];   
        }
        }, [0, 0])[0];
}

export default {
  name: 'Royal Air Maroc Safar Flyer',
  alliance: 'Oneworld',
  qualificationPeriodType: 'Calendar year',
  status: [
    {
      name: 'Silver',
      allianceStatus: 'Oneworld Ruby',
      qualification: [
        {
          type: 'miles',
          number: 20000,
          qualificationPeriod: 12,
          validity: 12,
          secType: 'miles',
          secNumber: 10000,
          secCalculate: countMarocMiles,
          secmilesName: {
            en: 'Miles on Royal Air Maroc flights',
            de: 'Meilen mit Royal Air Maroc Flügen',
          },
        },
        {
          type: 'segments',
          number: 15,
          qualificationPeriod: 12,
          validity: 12,
          calculate: countSegments,
          note: {
            en: 'Only segments with mileage credit count.',
            de: 'Nur Segmente mit Meilengutschrift zählen.',
            es: '',
          },
          secType: 'segments',
          secNumber: 2,
          secCalculate: calculateSegments,
          secmilesName: {
            en: 'segments with Royal Air Maroc',
            de: 'Segmenten mit Royal Air Maroc',
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
          number: 35000,
          qualificationPeriod: 12,
          validity: 12,
          secType: 'miles',
          secNumber: 17500,
          secCalculate: countMarocMiles,
          secmilesName: {
            en: 'Miles on Royal Air Maroc flights',
            de: 'Meilen mit Royal Air Maroc Flügen',
          },
        },
        {
          type: 'segments',
          number: 30,
          qualificationPeriod: 12,
          validity: 12,
          calculate: countSegments,
          note: {
            en: 'Only segments with mileage credit count.',
            de: 'Nur Segmente mit Meilengutschrift zählen.',
            es: '',
          },
          secType: 'segments',
          secNumber: 10,
          secCalculate: calculateSegments,
          secmilesName: {
            en: 'segments with Royal Air Maroc',
            de: 'Segmenten mit Royal Air Maroc',
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
          number: 75000,
          qualificationPeriod: 12,
          validity: 12,
          secType: 'miles',
          secNumber: 37500,
          secCalculate: countMarocMiles,
          secmilesName: {
            en: 'Miles on Royal Air Maroc flights',
            de: 'Meilen mit Royal Air Maroc Flügen',
          },
        },
        {
          type: 'segments',
          number: 75,
          qualificationPeriod: 12,
          validity: 12,
          calculate: countSegments,
          note: {
            en: 'Only segments with mileage credit count.',
            de: 'Nur Segmente mit Meilengutschrift zählen.',
            es: '',
          },
          secType: 'segments',
          secNumber: 20,
          secCalculate: calculateSegments,
          secmilesName: {
            en: 'segments with Royal Air Maroc',
            de: 'Segmenten mit Royal Air Maroc',
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