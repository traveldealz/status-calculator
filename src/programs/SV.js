

function countSegments( segments, data ) {
  //TODO: Prüfen ob Segment international ist.
  return data.reduce((acc,itinerary) => {
    let mileage = itinerary.value?.totals?.find(item => 'OK' === item.id);
    if(!mileage) {
      return acc;
    }
    return 0 < mileage.rdm[0] ? acc+1 : acc;
  }, 0);
}


export default {
    name: 'Saudia ALFURSAN',
    alliance: 'SkyTeam',
    qualificationPeriodType: 'Calendar year',
    status: [
        {
            name: 'Silver',
            allianceStatus: 'SkyTeam Elite',
            qualification: [
                {
                    type: 'miles',
                    number: 25000,
                    qualificationPeriod: 12,
                    validity: 12,
                
                },
                {
                    type: 'segments',
                    number: 20,
                    calculate: countSegments,
                    qualificationPeriod: 12,
                    milesName: {
                        en: 'international segments',
                        de: 'internationalen Segmenten',
                    },
                    validity: 12,
                
                },
            ]
        },
        {
            name: 'Gold',
            allianceStatus: 'SkyTeam Elite Plus',
            qualification: [
                {
                    type: 'miles',
                    number: 50000,
                    qualificationPeriod: 12,
                    validity: 12,
                
                },
                {
                    type: 'segments',
                    number: 40,
                    calculate: countSegments,
                    qualificationPeriod: 12,
                    milesName: {
                        en: 'international segments',
                        de: 'internationalen Segmenten',
                    },
                    validity: 12,
                
                },
            ]
        },
           
    ]
};