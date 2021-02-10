function calculateSegements(segments) {
  return segments.filter(segment => ['EN','OS','SN','OU','EW','LO','LH','LG','LX'].includes(segment.carrier)).length;
}
function calculateExecutivebonus(segments, data) {
  // If >35000 miles, take Executive Bonus
  console.log(data);
  return data.reduce((miles, itinerary) => {
        let item = itinerary.value.totals.find(item => 'LHM' === item.id);
        if(!item) {
          return miles;
        }
        return 35000 < miles ? miles + item.rdm[1] : miles + item.rdm[0];
      }, 0 );

}

export default {
  name: 'Miles & More',
  alliance: 'Star Alliance',
  qualificationPeriodType: 'Calendar year',
  status: [
    {
      name: 'Frequent Traveller',
      allianceStatus: 'Star Alliance Silver',
      qualification: [
        {
          type: 'miles',
          number: 35000,
          qualificationPeriod: 12,
          validity: 24,
        },
        {
          type: 'segments',
          number: 30,
          qualificationPeriod: 12,
          validity: 24,
          calculate: calculateSegements,
          note: {
            en: 'Only segments on Miles & More Member airline partners count.',
            de: 'Nur Segmente mit Miles & More Partnerairlines zählen.',
            es: '',
          },
        },
      ],
    },
    {
      name: 'Senator',
      allianceStatus: 'Star Alliance Gold',
      qualification: [
        {
          type: 'miles',
          number: 100000,
          qualificationPeriod: 12,
          validity: 24,
          calculate: calculateExecutivebonus,
          note: {
            en: '',
            de: '',
            es: '',
          },
        },
      ],
    },
    // {
    //   name: 'HON Circle Member',
    //   allianceStatus: 'Star Alliance Silver',
    //   qualification: [
    //     {
    //       type: 'miles',
    //       number: 600000,
    //       qualificationPeriod: 24,
    //       validity: 24,
    //       calculate: segments => segments.filter(segment => ['SK', 'WF'].includes(segment.carrier)).length,
    //       note: {
    //         en: 'Only HON Circle Miles in Business- & First Class on Miles&More Member Airlines counts',
    //         de: '',
    //         es: '',
    //       },
    //     },
    //   ],
    // }
  ],
  note: {
    en: '',
    de: '',
    es: '',
  },
};