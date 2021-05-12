function calculateSegments(segments) {
  return segments.filter(segment => ["AS"].includes(segment.carrier)).length;
}

function countSegments(segments, data) {
  return data.reduce((acc, itinerary) => {
    let mileage = itinerary.value?.totals?.find(item => "AS" === item.id);

    if (!mileage) {
      return acc;
    }

    if (mileage.rdm) {
      return 0 < mileage.rdm[0] ? acc + 1 : acc;
    } else {
      return acc;
    }
  }, 0);
}

export default {
  name: "Alaska Airlines Mileage Plan",
  alliance: "Oneworld",
  qualificationPeriodType: "Calendar year",
  status: [{
    name: "MVP",
    allianceStatus: "Oneworld Ruby",
    qualification: [{
      type: "miles",
      number: 20000,
      qualificationPeriod: 12,
      validity: 12,
      secType: "segments",
      secNumber: 2,
      secCalculate: calculateSegments,
      secmilesName: {
        en: "Segments with Alaska Airlines",
        de: "Segmenten mit Alaska Airlines"
      }
    }, {
      type: "segments",
      number: 30,
      calculate: countSegments,
      qualificationPeriod: 12,
      validity: 12,
      secType: "segments",
      secNumber: 2,
      secCalculate: calculateSegments,
      secmilesName: {
        en: "Segments with Alaska Airlines",
        de: "Segmenten mit Alaska Airlines"
      }
    }]
  }, {
    name: "MVP Gold",
    allianceStatus: "Oneworld Sapphire",
    qualification: [{
      type: "miles",
      number: 40000,
      qualificationPeriod: 12,
      validity: 12,
      secType: "segments",
      secNumber: 4,
      secCalculate: calculateSegments,
      secmilesName: {
        en: "Segments with Alaska Airlines",
        de: "Segmenten mit Alaska Airlines"
      }
    }, {
      type: "segments",
      number: 60,
      qualificationPeriod: 12,
      calculate: countSegments,
      validity: 12,
      secType: "segments",
      secNumber: 4,
      secCalculate: calculateSegments,
      secmilesName: {
        en: "Segments with Alaska Airlines",
        de: "Segmenten mit Alaska Airlines"
      }
    }]
  }, {
    name: "MVP GOld 75K",
    allianceStatus: "Oneworld Emerald",
    qualification: [{
      type: "miles",
      number: 75000,
      qualificationPeriod: 12,
      validity: 12,
      secType: "segments",
      secNumber: 6,
      secCalculate: calculateSegments,
      secmilesName: {
        en: "Segments with Alaska Airlines",
        de: "Segmenten mit Alaska Airlines"
      }
    }, {
      type: "segments",
      number: 90,
      qualificationPeriod: 12,
      calculate: countSegments,
      validity: 12,
      secType: "segments",
      secNumber: 6,
      secCalculate: calculateSegments,
      secmilesName: {
        en: "Segments with Alaska Airlines",
        de: "Segmenten mit Alaska Airlines"
      }
    }]
  }],
  note: {
    en: "",
    de: "",
    es: ""
  }
};