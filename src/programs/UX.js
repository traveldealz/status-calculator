export function calculateMiles(segments, data) {
    return data.reduce((acc,itinerary) => {

        let mileage = itinerary.value?.totals?.find(item => 'UX' === item.id);
        if(!mileage) {
          return [acc[0], acc[1]+1];
        }
        if(segments[acc[1]].carrier  && segments[acc[1]].ticketer){
        if(['UX'].includes(segments[acc[1]].carrier) || ['UX'].includes(segments[acc[1]].ticketer)) {
          let multiplier = 5;
          if(['C','J','D','I'].includes(segments[acc[1]].bookingClass)) {
              multiplier += 3;}
          //TODO: Checken ob Flughafen in USA, dann multiplier +1
          if(18000 > acc[0]) return [acc[0] + (segments[acc[1]].price * multiplier), acc[1]+1];
          if(32000 > acc[0]) return [acc[0] + (segments[acc[1]].price * multiplier)*1.5, acc[1]+1];
          if(60000 > acc[0]) return [acc[0] + (segments[acc[1]].price * multiplier)*1.75, acc[1]+1];
          if(60000 < acc[0]) return [acc[0] + (segments[acc[1]].price * multiplier)*2, acc[1]+1];
            ;
        }
        }
        else {
                return  [acc[0] + mileage.rdm[0], acc[1]+1];   
        }
        }, [0, 0])[0];
}



export default {
  name: 'Air Europa Suma',
  alliance: 'SkyTeam',
  qualificationPeriodType: 'Consecutive months',
  status: [
    {
      name: 'Silver',
      allianceStatus: 'SkyTeam Elite',
      qualification: [
        {
          type: 'miles',
          number: 18000,
          qualificationPeriod: 12,
          calculate: calculateMiles,
          validity: 12,
        },
        {
          type: 'segments',
          number: 14,
          qualificationPeriod: 12,
          validity: 12,
        },
      ],
    },
    {
      name: 'Gold',
      allianceStatus: 'SkyTeam Elite Plus',
      qualification: [
        {
          type: 'miles',
          number: 32000,
          qualificationPeriod: 12,
          calculate: calculateMiles,
          validity: 12,
        },
        {
          type: 'segments',
          number: 26,
          qualificationPeriod: 12,
          validity: 12,
        },
      ],
    },
    {
      name: 'Platinum',
      allianceStatus: 'SkyTeam Elite Plus',
      qualification: [
        {
          type: 'miles',
          number: 60000,
          qualificationPeriod: 12,
          calculate: calculateMiles,
          validity: 12,
        },
        {
          type: 'segments',
          number: 50,
          qualificationPeriod: 12,
          validity: 12,
        },
      ]
    }
  ]
};