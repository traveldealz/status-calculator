function countSegments( segments, data ) {
  return data.reduce((acc,itinerary) => {
    let mileage = itinerary.value?.totals?.find(item => 'AR' === item.id);
    if(!mileage) {
      return acc;
    }
    return 0 < mileage.rdm[0] ? acc+1 : acc;
  }, 0);
}


export default {
    name: 'Aerolíneas Argentinas AerolíneasPlus',
    alliance: 'SkyTeam',
    qualificationPeriodType: 'Consecutive months',
    status: [
        {
            name: 'Oro',
            allianceStatus: 'SkyTeam Elite',
            qualification: [
                {
                    type: 'miles',
                    number: 25000,
                    qualificationPeriod: 12,
                    validity: 12,
                },
                {
                    type: 'miles',
                    number: 15000,
                    secType: 'segments',
                    secNumber: 15,
                    secCalculate: countSegments,
                    secmilesName: {
                        en: 'Segments',
                        de: 'Segmenten',
                    },
                    qualificationPeriod: 12,
                    validity: 12,
                    secNote: {
                      en: 'Only segments with mileage credit count.',
                      de: 'Nur Segmente mit Meilengutschrift zählen.',
                    },
                },
                {
                    type: 'segments',
                    number: 30,
                    calculate: countSegments,
                    qualificationPeriod: 12,
                    validity: 12,
                },
            ],
        },
        {
            name: 'Platino',
            allianceStatus: 'SkyTeam Elite Plus',
            qualification: [
                {
                    type: 'miles',
                    number: 50000,
                    qualificationPeriod: 12,
                    validity: 12,
                },
                {
                    type: 'miles',
                    number: 30000,
                    secType: 'segments',
                    secNumber: 30,
                    secmilesName: {
                        en: 'Segments',
                        de: 'Segmenten',
                    },
                    secCalculate: countSegments,
                    qualificationPeriod: 12,
                    validity: 12,
                    secNote: {
                      en: 'Only segments with mileage credit count.',
                      de: 'Nur Segmente mit Meilengutschrift zählen.',
                    },
                },
                {
                    type: 'segments',
                    number: 60,
                    calculate: countSegments,
                    qualificationPeriod: 12,
                    validity: 12,
                },
            ],
        },
        {
            name: 'Diamante',
            allianceStatus: 'SkyTeam Elite Plus',
            qualification: [
                {
                    type: 'miles',
                    number: 70000,
                    qualificationPeriod: 12,
                    validity: 12,
                },
                {
                    type: 'miles',
                    number: 40000,
                    secType: 'segments',
                    secNumber: 40,
                    secCalculate: countSegments,
                    qualificationPeriod: 12,
                    secmilesName: {
                        en: 'Segments',
                        de: 'Segmenten',
                    },
                    validity: 12,
                    secNote: {
                      en: 'Only segments with mileage credit count.',
                      de: 'Nur Segmente mit Meilengutschrift zählen.',
                    },
                },
                {
                    type: 'segments',
                    number: 80,
                    calculate: countSegments,
                    qualificationPeriod: 12,
                    validity: 12,
                },
            ],
        }
    ]     
};