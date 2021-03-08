

function countSegments( segments, data, airports ) {
  return data.reduce((acc,itinerary) => {
    let mileage = itinerary.value?.totals?.find(item => 'OK' === item.id);
    if(!mileage) {
      return [acc[0], acc[1]+1];
    }
    if(airports[segments[acc[1]].origin].country_code != airports[segments[acc[1]].destination].country_code){
        return 0 < mileage.rdm[0] ? [acc[0]+1, acc[1]+1] : [acc[0], acc[1]+1];
    }
          return [acc[0], acc[1]+1];
  }, [0, 0])[0];
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