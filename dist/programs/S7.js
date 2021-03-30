function countSegments(segments, data) {
  return data.reduce((acc, itinerary) => {
    let mileage = itinerary.value?.totals?.find(item => 'S7' === item.id);

    if (!mileage) {
      return acc;
    }

    return 0 < mileage.rdm[0] ? acc + 1 : acc;
  }, 0);
}

function calculateSegments(segments) {
  return segments.filter(segment => ['S7'].includes(segment.carrier)).length;
}

function calculateSegmentsWeight(segments, data) {
  return data.reduce((acc, itinerary) => {
    let mileage = itinerary.value?.totals?.find(item => 'S7' === item.id);

    if (!mileage) {
      return [acc[0], acc[1] + 1];
    }

    if (['S7'].includes(segments[acc[1]].carrier)) {
      if (['J', 'C', 'D'].includes(segments[acc[1]].bookingClass)) {
        return [acc[0] + 2, acc[1] + 1];
      } else {
        return [acc[0] + 1, acc[1] + 1];
      }
    } else {
      return [acc[0], acc[1] + 1];
    }
  }, [0, 0])[0];
}

export default {
  name: 'S7 Priority',
  alliance: 'Oneworld',
  qualificationPeriodType: 'Calendar year',
  status: [{
    name: 'Silver',
    allianceStatus: 'Oneworld Ruby',
    qualification: [{
      type: 'miles',
      number: 20000,
      qualificationPeriod: 12,
      validity: 12,
      secType: 'segments',
      secNumber: 1,
      secCalculate: calculateSegments,
      secmilesName: {
        en: 'Segments with S7',
        de: 'Segmenten mit S7'
      }
    }, {
      type: 'segments',
      number: 20,
      qualificationPeriod: 12,
      validity: 12,
      milesName: {
        en: 'Segments with S7',
        de: 'Segmenten mit S7'
      },
      calculate: calculateSegmentsWeight,
      note: {
        en: 'Business class segments count double.',
        de: 'Business Class Segmente zählen doppelt.',
        es: ''
      }
    }]
  }, {
    name: 'Gold',
    allianceStatus: 'Oneworld Sapphire',
    qualification: [{
      type: 'miles',
      number: 50000,
      qualificationPeriod: 12,
      validity: 12,
      secType: 'segments',
      secNumber: 1,
      secCalculate: calculateSegments,
      secmilesName: {
        en: 'Segments with S7',
        de: 'Segmenten mit S7'
      }
    }, {
      type: 'segments',
      number: 50,
      qualificationPeriod: 12,
      validity: 12,
      milesName: {
        en: 'Segments with S7',
        de: 'Segmenten mit S7'
      },
      calculate: calculateSegmentsWeight,
      note: {
        en: 'Business class segments count double.',
        de: 'Business Class Segmente zählen doppelt.',
        es: ''
      }
    }]
  }, {
    name: 'Platinum',
    allianceStatus: 'Oneworld Emerald',
    qualification: [{
      type: 'miles',
      number: 75000,
      qualificationPeriod: 12,
      validity: 12,
      secType: 'segments',
      secNumber: 1,
      secCalculate: calculateSegments,
      secmilesName: {
        en: 'Segments with S7',
        de: 'Segmenten mit S7'
      }
    }, {
      type: 'segments',
      number: 75,
      qualificationPeriod: 12,
      validity: 12,
      milesName: {
        en: 'Segments with S7',
        de: 'Segmenten mit S7'
      },
      calculate: calculateSegmentsWeight,
      note: {
        en: 'Business class segments count double.',
        de: 'Business Class Segmente zählen doppelt.',
        es: ''
      }
    }]
  }]
};