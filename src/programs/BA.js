function calculateSegments(segments) {
    return segments.filter(segment => ['BA'].includes(segment.carrier)).length;
}

export default {
  name: 'British Airways Executive Club',
  alliance: 'Oneworld',
  qualificationPeriodType: 'Membership year',
  status: [
    {
      name: 'Bronze',
      allianceStatus: 'Oneworld Ruby',
      qualification: [
        {
          type: 'miles',
          number: 300,
          qualificationPeriod: 12,
          validity: 12,
          milesName: {
                        en: 'Tier Points',
                        de: 'Tier Points',
                    },
          secType: 'segments',
          secNumber: 2,
          secCalculate: calculateSegments,
          secmilesName: {
            en: 'Segments with British Airways',
            de: 'Segmenten mit British Airways',
          },
        }
      ]
    },
    {
      name: 'Silver',
      allianceStatus: 'Oneworld Sapphire',
      qualification: [
        {
          type: 'miles',
          number: 600,
          qualificationPeriod: 12,
          validity: 12,
          milesName: {
                        en: 'Tier Points',
                        de: 'Tier Points',
                    },
          secType: 'segments',
          secNumber: 4,
          secCalculate: calculateSegments,
          secmilesName: {
            en: 'Segments with British Airways',
            de: 'Segmenten mit British Airways',
          },
        }
      ]
    },
    {
      name: 'Gold',
      allianceStatus: 'Oneworld Emerald',
      qualification: [
        {
          type: 'miles',
          number: 1500,
          qualificationPeriod: 12,
          validity: 12,
          milesName: {
                        en: 'Tier Points',
                        de: 'Tier Points',
                    },
          secType: 'segments',
          secNumber: 4,
          secCalculate: calculateSegments,
          secmilesName: {
            en: 'Segments with British Airways',
            de: 'Segmenten mit British Airways',
          },
        }
      ]
    },
  ],
  note: {
    en: '',
    de: '',
    es: '',
  },
  
};