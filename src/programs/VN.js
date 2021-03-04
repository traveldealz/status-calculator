function countSegments( segments, data ) {
  return data.reduce((acc,itinerary) => {
    let mileage = itinerary.value?.totals?.find(item => 'VN' === item.id);
    if(!mileage) {
      return acc;
    }
    return 0 < mileage.rdm[0] ? acc+1 : acc;
  }, 0);
}

function calculateExecutivebonus(segments, data) {
  console.log(data);
  return data.reduce((miles, itinerary) => {
        let item = itinerary.value.totals.find(item => 'VN' === item.id);
        if(!item) {
          return miles;
        }
        if(15000 < miles){ return miles + item.rdm[1];}
        else if(30000 < miles){ return miles + item.rdm[2];}
        else if(50000 < miles){ return miles + item.rdm[3];}
        else { return miles + item.rdm[0];}
      }, 0 );

}

export default {
  name: 'Vietnam Airlines Lotusmiles',
  alliance: 'SkyTeam',
  qualificationPeriodType: 'consecutive months',
  status: [
    {
      name: 'Titanium',
      allianceStatus: 'SkyTeam Elite',
      qualification: [
        {
          type: 'miles',
          number: 15000,
          calculate: calculateExecutivebonus,
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
      ]
    },
    {
      name: 'Gold',
      allianceStatus: 'SkyTeam Elite',
      qualification: [
        {
          type: 'miles',
          number: 30000,
          calculate: calculateExecutivebonus,
          qualificationPeriod: 12,
          validity: 12,
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
        },
      ]
    },
    {
      name: 'Platinum',
      allianceStatus: 'SkyTeam Elite Plus',
      qualification: [
        {
          type: 'miles',
          number: 50000,
          calculate: calculateExecutivebonus,
          qualificationPeriod: 12,
          validity: 12,
        },
        {
          type: 'segments',
          number: 50,
          qualificationPeriod: 12,
          validity: 12,
          calculate: countSegments,
          note: {
            en: 'Only segments with mileage credit count.',
            de: 'Nur Segmente mit Meilengutschrift zählen.',
            es: '',
          },
        }
      ]
    }
  ],
  note: {
    en: '',
    de: '',
    es: '',
  },
};