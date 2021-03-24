function countSegments( segments, data ) {
  return data.reduce((acc,itinerary) => {
    let mileage = itinerary.value?.totals?.find(item => 'UL' === item.id);
    if(!mileage) {
      return acc;
    }
    return 0 < mileage.rdm[0] ? acc+1 : acc;
  }, 0);
}

function calculateSegments(segments) {
    return segments.filter(segment => ['UL'].includes(segment.carrier)).length;
}

function countULMiles( segments, data ) {
   return data.reduce((acc,itinerary) => {

        let mileage = itinerary.value?.totals?.find(item => 'UL' === item.id);
        if(!mileage) {
          return [acc[0], acc[1]+1];
        }
        if(['UL'].includes(segments[acc[1]].carrier)) {
                return [acc[0] + mileage.qm[0], acc[1]+1];
        }
        else {
                return [acc[0], acc[1]+1];   
        }
        }, [0, 0])[0];
}

export default {
  name: 'SriLankan FlySmiLes',
  alliance: 'Oneworld',
  qualificationPeriodType: 'Calendar year',
  status: [
    {
      name: 'Classic',
      allianceStatus: 'Oneworld Ruby',
      qualification: [
        {
          type: 'miles',
          number: 20000,
          qualificationPeriod: 12,
          validity: 12,
          secType: 'segments',
                    secNumber: 1,
                    secCalculate: calculateSegments,
                    secmilesName: {
                        en: 'segments with SriLankan',
                        de: 'Segmenten mit SriLankan',
                    },
        },
        {
          type: 'segments',
          number: 20,
          qualificationPeriod: 12,
          validity: 12,
          milesName: {
                        en: 'segments',
                        de: 'Segmenten',
                    },
          calculate: countSegments,
          secType: 'segments',
                    secNumber: 1,
                    secCalculate: calculateSegments,
                    secmilesName: {
                        en: 'segments with SriLankan',
                        de: 'Segmenten mit SriLankan',
                    },
        },
      ]
    },
    {
      name: 'Gold',
      allianceStatus: 'Oneworld Sapphire',
      qualification: [
        {
          type: 'miles',
          number: 40000,
          qualificationPeriod: 12,
          validity: 12,
          secType: 'miles',
                    secNumber: 20000,
                    secCalculate: countULMiles,
                    secmilesName: {
                        en: 'miles with SriLankan',
                        de: 'Meilen mit SriLankan',
                    },
        },
        {
          type: 'segments',
          number: 40,
          qualificationPeriod: 12,
          validity: 12,
          milesName: {
                        en: 'segments',
                        de: 'Segmenten',
                    },
          calculate: countSegments,
          secType: 'segments',
                    secNumber: 20,
                    secCalculate: calculateSegments,
                    secmilesName: {
                        en: 'Segments with SriLankan',
                        de: 'Segmenten mit SriLankan',
                    },
        },
      ]
    },
    {
      name: 'Platinum',
      allianceStatus: 'Oneworld Emerald',
      qualification: [
        {
          type: 'miles',
          number: 60000,
          qualificationPeriod: 12,
          validity: 12,
          secType: 'miles',
                    secNumber: 30000,
                    secCalculate: countULMiles,
                    secmilesName: {
                        en: 'miles with SriLankan',
                        de: 'Meilen mit SriLankan',
                    },
        },
        {
          type: 'segments',
          number: 60,
          qualificationPeriod: 12,
          validity: 12,
          milesName: {
                        en: 'segments',
                        de: 'Segmenten',
                    },
          calculate: countSegments,
          secType: 'segments',
                    secNumber: 30,
                    secCalculate: calculateSegments,
                    secmilesName: {
                        en: 'Segments with SriLankan',
                        de: 'Segmenten mit SriLankan',
                    },
        },
      ]
    },
  ]
};