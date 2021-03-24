function countSegments( segments, data ) {
  return data.reduce((acc,itinerary) => {
    let mileage = itinerary.value?.totals?.find(item => 'RJ' === item.id);
    if(!mileage) {
      return acc;
    }
    return 0 < mileage.rdm[0] ? acc+1 : acc;
  }, 0);
}

function calculateSegments(segments) {
    return segments.filter(segment => ['RJ'].includes(segment.carrier)).length;
}

export default {
  name: 'Royal Jordanian Royal Club',
  alliance: 'Oneworld',
  qualificationPeriodType: 'Consecutive months',
  status: [
    {
      name: 'Silver JAY',
      allianceStatus: 'Oneworld Ruby',
      qualification: [
        {
          type: 'miles',
          number: 15000,
          qualificationPeriod: 12,
          validity: 12,
          secType: 'segments',
                    secNumber: 4,
                    secCalculate: calculateSegments,
                    secmilesName: {
                        en: 'Segments with Royal Jordanian',
                        de: 'Segmenten mit Royal Jordanian',
                    },
        },
        {
          type: 'segments',
          number: 14,
          qualificationPeriod: 12,
          validity: 12,
          calculate: countSegments,
          secType: 'segments',
                    secNumber: 4,
                    secCalculate: calculateSegments,
                    secmilesName: {
                        en: 'Segments with Royal Jordanian',
                        de: 'Segmenten mit Royal Jordanian',
                    },
          note: {
            en: 'Only segments with mileage credit count.',
            de: 'Nur Segmente mit Meilengutschrift zählen.',
            es: '',
          },
        },
      ]
    },
    {
      name: 'Gold SPARROW',
      allianceStatus: 'Oneworld Sapphire',
      qualification: [
        {
          type: 'miles',
          number: 40000,
          qualificationPeriod: 12,
          validity: 12,
          secType: 'segments',
                    secNumber: 10,
                    secCalculate: calculateSegments,
                    secmilesName: {
                        en: 'Segments with Royal Jordanian',
                        de: 'Segmenten mit Royal Jordanian',
                    },
        },
        {
          type: 'segments',
          number: 30,
          qualificationPeriod: 12,
          validity: 12,
          calculate: countSegments,
          secType: 'segments',
                    secNumber: 10,
                    secCalculate: calculateSegments,
                    secmilesName: {
                        en: 'Segments with Royal Jordanian',
                        de: 'Segmenten mit Royal Jordanian',
                    },
          note: {
            en: 'Only segments with mileage credit count.',
            de: 'Nur Segmente mit Meilengutschrift zählen.',
            es: '',
          },
        },
      ]
    },
    {
      name: 'Platinum HAWK',
      allianceStatus: 'Oneworld Emerald',
      qualification: [
        {
          type: 'miles',
          number: 65000,
          qualificationPeriod: 12,
          validity: 12,
          secType: 'segments',
                    secNumber: 20,
                    secCalculate: calculateSegments,
                    secmilesName: {
                        en: 'Segments with Royal Jordanian',
                        de: 'Segmenten mit Royal Jordanian',
                    },
        },
        {
          type: 'segments',
          number: 46,
          qualificationPeriod: 12,
          validity: 12,
          secType: 'segments',
                    secNumber: 20,
                    secCalculate: calculateSegments,
                    secmilesName: {
                        en: 'Segments with Royal Jordanian',
                        de: 'Segmenten mit Royal Jordanian',
                    },
          calculate: countSegments,
          note: {
            en: 'Only segments with mileage credit count.',
            de: 'Nur Segmente mit Meilengutschrift zählen.',
            es: '',
          },
        },
      ]
    }
  ]
};