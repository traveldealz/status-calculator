function calculateExecutivebonus(segments, data) {
  console.log(data);
  return data.reduce((miles, itinerary) => {
        let item = itinerary.value.totals.find(item => 'AM' === item.id);
        if(!item) {
          return miles;
        }
        if(50000 < miles) return miles + item.rdm[1];
        else if(80000 < miles) return miles + item.rdm[2];
        else if(100000 < miles) return miles + item.rdm[3];
        else return miles + item.rdm[0];
      }, 0 );

}

function countAMDLMiles(segments, data) {
  return data.reduce((acc,itinerary) => {

        let mileage = itinerary.value?.totals?.find(item => 'AM' === item.id);
        if(!mileage) {
          return [acc[0], acc[1]+1];
        }
        if(['AM','DL'].includes(segments[acc[1]].carrier)) {
          if(50000 > acc[0]) return [acc[0] + mileage.rdm[0], acc[1]+1];
          if(80000 > acc[0]) return [acc[0] + mileage.rdm[1], acc[1]+1];
          if(100000 > acc[0]) return [acc[0] + mileage.rdm[2], acc[1]+1];
          if(100000 < acc[0]) return [acc[0] + mileage.rdm[3], acc[1]+1];        
        
        }else{
          return [acc[0], acc[1]+1];
        }
        
        }, [0, 0])[0];

}


export default {
  name: 'Aeromexico Club Premier',
  alliance: 'SkyTeam',
  qualificationPeriodType: 'Calendar year',
  status: [
    {
      name: 'Gold',
      allianceStatus: 'SkyTeam Elite',
      qualification: [
        {
          type: 'miles',
          number: 50000,
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
          number: 80000,
          calculate: calculateExecutivebonus,
          qualificationPeriod: 12,
          validity: 12,
        },
      ],
    },
    {
      name: 'Titanium',
      allianceStatus: 'SkyTeam Elite Plus',
      qualification: [
        {
          type: 'miles',
          number: 100000,
          secType: 'miles',
          secNumber: 80000,
          secmilesName: {
              en: 'Miles with Delta or Aeromexico',
              de: 'Meilen mit Delta oder Aeromexico',
          },
          calculate: calculateExecutivebonus,
          secCalculate: countAMDLMiles,
          qualificationPeriod: 12,
          validity: 12,
        },
      ]
    }
  ]
};