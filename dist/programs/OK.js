function calculateSegments(segments) {
  return segments.filter(segment => ['OK'].includes(segment.carrier)).length;
}

function countSegments(segments, data) {
  return data.reduce((acc, itinerary) => {
    let mileage = itinerary.value?.totals?.find(item => 'OK' === item.id);

    if (!mileage) {
      return acc;
    }

    return 0 < mileage.rdm[0] ? acc + 1 : acc;
  }, 0);
}

export default {
  name: 'CSA OK Plus',
  alliance: 'SkyTeam',
  qualificationPeriodType: 'Calendar year',
  status: [{
    name: 'Silver',
    allianceStatus: 'SkyTeam Elite',
    qualification: [{
      type: 'miles',
      number: 25000,
      secType: 'segments',
      secNumber: 2,
      secCalculate: calculateSegments,
      qualificationPeriod: 12,
      secmilesName: {
        en: 'Segments with Czech Airlines',
        de: 'Segmenten mit Czech Airlines'
      },
      validity: 12
    }, {
      type: 'segments',
      number: 15,
      calculate: countSegments,
      secType: 'segments',
      secNumber: 2,
      secCalculate: calculateSegments,
      qualificationPeriod: 12,
      secmilesName: {
        en: 'Segments with Czech Airlines',
        de: 'Segmenten mit Czech Airlines'
      },
      validity: 12
    }]
  }, {
    name: 'Gold',
    allianceStatus: 'SkyTeam Elite Plus',
    qualification: [{
      type: 'miles',
      number: 50000,
      secType: 'segments',
      secNumber: 6,
      secCalculate: calculateSegments,
      qualificationPeriod: 12,
      validity: 12,
      secmilesName: {
        en: 'Segments with Czech Airlines',
        de: 'Segmenten mit Czech Airlines'
      }
    }, {
      type: 'segments',
      number: 30,
      calculate: countSegments,
      secType: 'segments',
      secNumber: 6,
      secCalculate: calculateSegments,
      qualificationPeriod: 12,
      validity: 12,
      secmilesName: {
        en: 'Segments with Czech Airlines',
        de: 'Segmenten mit Czech Airlines'
      }
    }]
  }, {
    name: 'Platinum',
    allianceStatus: 'SkyTeam Elite Plus',
    qualification: [{
      type: 'miles',
      number: 100000,
      secType: 'segments',
      secNumber: 10,
      secCalculate: calculateSegments,
      qualificationPeriod: 12,
      secmilesName: {
        en: 'Segments with Czech Airlines',
        de: 'Segmenten mit Czech Airlines'
      },
      validity: 12
    }, {
      type: 'segments',
      number: 70,
      calculate: countSegments,
      secType: 'segments',
      secNumber: 10,
      secCalculate: calculateSegments,
      qualificationPeriod: 12,
      secmilesName: {
        en: 'Segments with Czech Airlines',
        de: 'Segmenten mit Czech Airlines'
      },
      validity: 12
    }]
  }]
};