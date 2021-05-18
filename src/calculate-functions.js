export default {
  calculateA3Segments: (segments) =>
    segments.filter((segment) => ["A3", "OA"].includes(segment.carrier)).length,

  countAASegments: (segments, data) =>
    data.reduce((acc, itinerary) => {
      let mileage = itinerary.value?.totals?.find((item) => "AA" === item.id);
      if (!mileage) {
        return acc;
      }
      if (mileage.rdm) {
        return 0 < mileage.rdm[0] ? acc + 1 : acc;
      } else {
        return acc;
      }
    }, 0),

  getmqd: (segments, data) =>
    data.reduce(
      (acc, itinerary) => {
        let mileage = itinerary.value?.totals?.find((item) => "AA" === item.id);
        if (!mileage) {
          return [acc[0], acc[1] + 1];
        }
        return 0 < mileage.qd[0]
          ? [acc[0] + mileage.qd[0], acc[1] + 1]
          : [acc[0], acc[1] + 1];
      },
      [0, 0]
    )[0],

  countACSegments: (segments, data) =>
    data.reduce((acc, itinerary) => {
      let mileage = itinerary.value?.totals?.find((item) => "AC" === item.id);
      if (!mileage) {
        return acc;
      }
      return 0 < mileage.rdm[0] ? acc + 1 : acc;
    }, 0),

  calculateAMExecutivebonus: (segments, data) =>
    data.reduce((miles, itinerary) => {
      let item = itinerary.value.totals.find((item) => "AM" === item.id);
      if (!item) {
        return miles;
      }
      if (50000 < miles) return miles + item.rdm[1];
      else if (80000 < miles) return miles + item.rdm[2];
      else if (100000 < miles) return miles + item.rdm[3];
      else return miles + item.rdm[0];
    }, 0),

  countAMDLMiles: (segments, data) =>
    data.reduce(
      (acc, itinerary) => {
        let mileage = itinerary.value?.totals?.find((item) => "AM" === item.id);
        if (!mileage) {
          return [acc[0], acc[1] + 1];
        }
        if (["AM", "DL"].includes(segments[acc[1]].carrier)) {
          if (50000 > acc[0]) return [acc[0] + mileage.rdm[0], acc[1] + 1];
          if (80000 > acc[0]) return [acc[0] + mileage.rdm[1], acc[1] + 1];
          if (100000 > acc[0]) return [acc[0] + mileage.rdm[2], acc[1] + 1];
          if (100000 < acc[0]) return [acc[0] + mileage.rdm[3], acc[1] + 1];
        } else {
          return [acc[0], acc[1] + 1];
        }
      },
      [0, 0]
    )[0],

  countARSegments: (segments, data) =>
    data.reduce((acc, itinerary) => {
      let mileage = itinerary.value?.totals?.find((item) => "AR" === item.id);
      if (!mileage) {
        return acc;
      }
      return 0 < mileage.rdm[0] ? acc + 1 : acc;
    }, 0),

  calculateASSegments: (segments) =>
    segments.filter((segment) => ["AS"].includes(segment.carrier)).length,

  countASSegments: (segments, data) =>
    data.reduce((acc, itinerary) => {
      let mileage = itinerary.value?.totals?.find((item) => "AS" === item.id);
      if (!mileage) {
        return acc;
      }
      if (mileage.rdm) {
        return 0 < mileage.rdm[0] ? acc + 1 : acc;
      } else {
        return acc;
      }
    }, 0),

  countATSegments: (segments, data) =>
    data.reduce((acc, itinerary) => {
      let mileage = itinerary.value?.totals?.find((item) => "AT" === item.id);
      if (!mileage) {
        return acc;
      }
      return 0 < mileage.rdm[0] ? acc + 1 : acc;
    }, 0),

  calculateATSegments: (segments) =>
    segments.filter((segment) => ["AT"].includes(segment.carrier)).length,

  countMarocMiles: (segments, data) =>
    data.reduce(
      (acc, itinerary) => {
        let mileage = itinerary.value?.totals?.find((item) => "AT" === item.id);
        if (!mileage) {
          return [acc[0], acc[1] + 1];
        }
        if (["AT"].includes(segments[acc[1]].carrier)) {
          return [acc[0] + mileage.qm[0], acc[1] + 1];
        } else {
          return [acc[0], acc[1] + 1];
        }
      },
      [0, 0]
    )[0],

  countAYSegments: (segments, data) =>
    data.reduce((acc, itinerary) => {
      let mileage = itinerary.value?.totals?.find((item) => "AY" === item.id);
      if (!mileage) {
        return segments.filter((segment) => ["AY"].includes(segment.carrier))
          .length;
      }
      return 0 < mileage.rdm[0] ? acc + 1 : acc;
    }, 0),

  countAZSegments: (segments, data) =>
    data.reduce((acc, itinerary) => {
      let mileage = itinerary.value?.totals?.find((item) => "AZ" === item.id);
      if (!mileage) {
        return acc;
      }
      return 0 < mileage.rdm[0] ? acc + 1 : acc;
    }, 0),

  calculateAZExecutivebonus: (segments, data) =>
    data.reduce((miles, itinerary) => {
      let item = itinerary.value.totals.find((item) => "AZ" === item.id);
      if (!item) {
        return miles;
      }
      if (20000 < miles) {
        return miles + item.rdm[1];
      } else if (50000 < miles) {
        return miles + item.rdm[2];
      } else if (80000 < miles) {
        return miles + item.rdm[3];
      } else {
        return miles + item.rdm[0];
      }
    }, 0),

  calculateBASegments: (segments) =>
    segments.filter((segment) => ["BA"].includes(segment.carrier)).length,

  countCASegments: (segments, data) =>
    data.reduce((acc, itinerary) => {
      let mileage = itinerary.value?.totals?.find((item) => "CA" === item.id);
      if (!mileage) {
        return acc;
      }
      return 0 < mileage.rdm[0] ? acc + 1 : acc;
    }, 0),

  calculateCMSegments: (segments) =>
    segments.filter((segment) => ["CM"].includes(segment.carrier)).length,

  calculateCXSegments: (segments) =>
    segments.filter((segment) => ["CX"].includes(segment.carrier)).length,

  countDLSegments: (segments, data) =>
    data.reduce((acc, itinerary) => {
      let mileage = itinerary.value?.totals?.find((item) => "DL" === item.id);
      if (!mileage) {
        return acc;
      }
      if (mileage.rdm) {
        return 0 < mileage.rdm[0] ? acc + 1 : acc;
      } else {
        return acc;
      }
    }, 0),

  countETSegments: (segments, data) =>
    data.reduce((acc, itinerary) => {
      let mileage = itinerary.value?.totals?.find((item) => "ET" === item.id);
      if (!mileage) {
        return acc;
      }
      return 0 < mileage.rdm[0] ? acc + 1 : acc;
    }, 0),

  calculateIBSegments: (segments) =>
    segments.filter((segment) => ["IB"].includes(segment.carrier)).length,

  countIBSegments: (segments, data) =>
    data.reduce((acc, itinerary) => {
      let mileage = itinerary.value?.totals?.find((item) => "IB" === item.id);
      if (!mileage) {
        return acc;
      }
      if (mileage.rdm) {
        return 0 < mileage.rdm[0] ? acc + 1 : acc;
      } else {
        return acc;
      }
    }, 0),

  calculateLHMSegements: (segments) =>
    segments.filter((segment) =>
      ["EN", "OS", "SN", "OU", "EW", "LO", "LH", "LG", "LX"].includes(
        segment.carrier
      )
    ).length,
  calculateLHMExecutivebonus: (segments, data) => {
    // If >35000 miles, take Executive Bonus
    return data.reduce((miles, itinerary) => {
      let item = itinerary.value.totals.find((item) => "LHM" === item.id);
      if (!item) {
        return miles;
      }
      return 35000 < miles ? miles + item.qm[1] : miles + item.qm[0];
    }, 0);
  },
  calcLHM2021: (segments, data) =>
    data.reduce(
      (acc, itinerary) => {
        let mileage = itinerary.value?.totals?.find(
          (item) => "LHM" === item.id
        );
        if (!mileage) {
          return [acc[0], acc[1] + 1];
        }
        if (
          ["EN", "OS", "SN", "OU", "EW", "LO", "LH", "LG", "LX", "WK"].includes(
            segments[acc[1]].carrier
          )
        ) {
          return acc[0] > 35000
            ? [acc[0] + mileage.qm[1] * 2, acc[1] + 1]
            : [acc[0] + mileage.qm[0] * 2, acc[1] + 1];
        } else {
          return acc[0] > 35000
            ? [acc[0] + mileage.qm[1], acc[1] + 1]
            : [acc[0] + mileage.qm[0], acc[1] + 1];
        }
      },
      [0, 0]
    )[0],

  countMESegments: (segments, data) =>
    data.reduce((acc, itinerary) => {
      let mileage = itinerary.value?.totals?.find((item) => "ME" === item.id);
      if (!mileage) {
        return acc;
      }
      return 0 < mileage.rdm[0] ? acc + 1 : acc;
    }, 0),

  calculateOKSegments: (segments) =>
    segments.filter((segment) => ["OK"].includes(segment.carrier)).length,
  countOKSegments: (segments, data) =>
    data.reduce((acc, itinerary) => {
      let mileage = itinerary.value?.totals?.find((item) => "OK" === item.id);
      if (!mileage) {
        return acc;
      }
      return 0 < mileage.rdm[0] ? acc + 1 : acc;
    }, 0),

  countOZSegments: (segments) =>
    segments.filter((segment) => ["OZ"].includes(segment.carrier)).length,

  countRJSegments: (segments, data) =>
    data.reduce((acc, itinerary) => {
      let mileage = itinerary.value?.totals?.find((item) => "RJ" === item.id);
      if (!mileage) {
        return acc;
      }
      return 0 < mileage.rdm[0] ? acc + 1 : acc;
    }, 0),
  calculateRJSegments: (segments) =>
    segments.filter((segment) => ["RJ"].includes(segment.carrier)).length,

  countS7Segments: (segments, data) =>
    data.reduce((acc, itinerary) => {
      let mileage = itinerary.value?.totals?.find((item) => "S7" === item.id);
      if (!mileage) {
        return acc;
      }
      return 0 < mileage.rdm[0] ? acc + 1 : acc;
    }, 0),

  calculateS7Segments: (segments) =>
    segments.filter((segment) => ["S7"].includes(segment.carrier)).length,

  calculateS7SegmentsWeight: (segments, data) =>
    data.reduce(
      (acc, itinerary) => {
        let mileage = itinerary.value?.totals?.find((item) => "S7" === item.id);
        if (!mileage) {
          return [acc[0], acc[1] + 1];
        }
        if (["S7"].includes(segments[acc[1]].carrier)) {
          if (["J", "C", "D"].includes(segments[acc[1]].bookingClass)) {
            return [acc[0] + 2, acc[1] + 1];
          } else {
            return [acc[0] + 1, acc[1] + 1];
          }
        } else {
          return [acc[0], acc[1] + 1];
        }
      },
      [0, 0]
    )[0],

  calculateSKSegments: (segments) =>
    segments.filter((segment) => ["SK", "WF"].includes(segment.carrier)).length,

  calculateSQExecutivebonus: (segments, data) => {
    // If >25000 miles, take Executive Bonus
    return data.reduce((miles, itinerary) => {
      let item = itinerary.value.totals.find((item) => "SQ" === item.id);
      if (!item) {
        return miles;
      }
      return 25000 < miles ? miles + item.rdm[1] : miles + item.rdm[0];
    }, 0);
  },

  countSuSegments: (segments, data) =>
    data.reduce((acc, itinerary) => {
      let mileage = itinerary.value?.totals?.find((item) => "SU" === item.id);
      if (!mileage) {
        return acc;
      }
      return 0 < mileage.rdm[0] ? acc + 1 : acc;
    }, 0),

  countSUBusinessSegments: (segments, data) =>
    data.reduce((acc, itinerary) => {
      let mileage = itinerary.value?.totals?.find((item) => "SU" === item.id);
      if (!mileage) {
        return acc;
      }
      let cabquery = itinerary.value?.totals?.find((item) => "DL" === item.id);
      if (cabquery["cabinclass"] == "Business Class") {
        return 0 < mileage.rdm[0] ? acc + 1 : acc;
      }
      return acc;
    }, 0),

  countSVSegments: (segments, data, airports) =>
    data.reduce(
      (acc, itinerary) => {
        let mileage = itinerary.value?.totals?.find((item) => "OK" === item.id);
        if (!mileage) {
          return [acc[0], acc[1] + 1];
        }
        if (
          airports[segments[acc[1]].origin].country_code !=
          airports[segments[acc[1]].destination].country_code
        ) {
          return 0 < mileage.rdm[0]
            ? [acc[0] + 1, acc[1] + 1]
            : [acc[0], acc[1] + 1];
        }
        return [acc[0], acc[1] + 1];
      },
      [0, 0]
    )[0],

  calculateTGSegments: (segments) =>
    segments
      .filter((segment) => ["TG"].includes(segment.carrier))
      .filter((segment) => !["G", "V", "W"].includes(segment.bookingClass))
      .length,

  calculateTPSegements: (segments) =>
    segments.filter((segment) => ["TP"].includes(segment.carrier)).length,

  calculateUASegments: (segments, data) =>
    data.reduce((acc, itinerary) => {
      let mileage = itinerary.value?.totals?.find((item) => "UA" === item.id);
      if (!mileage) {
        return acc;
      }
      if (mileage.id == "UA") {
        return acc + 1;
      }
      return 0 < mileage.rdm[0] ? acc + 1 : acc;
    }, 0),

  countULSegments: (segments, data) =>
    data.reduce((acc, itinerary) => {
      let mileage = itinerary.value?.totals?.find((item) => "UL" === item.id);
      if (!mileage) {
        return acc;
      }
      return 0 < mileage.rdm[0] ? acc + 1 : acc;
    }, 0),

  calculateULSegments: (segments) =>
    segments.filter((segment) => ["UL"].includes(segment.carrier)).length,

  countULMiles: (segments, data) =>
    data.reduce(
      (acc, itinerary) => {
        let mileage = itinerary.value?.totals?.find((item) => "UL" === item.id);
        if (!mileage) {
          return [acc[0], acc[1] + 1];
        }
        if (["UL"].includes(segments[acc[1]].carrier)) {
          return [acc[0] + mileage.qm[0], acc[1] + 1];
        } else {
          return [acc[0], acc[1] + 1];
        }
      },
      [0, 0]
    )[0],

  calculateUXMiles: (segments, data, airports) =>
    data.reduce(
      (acc, itinerary) => {
        let mileage = itinerary.value?.totals?.find((item) => "UX" === item.id);
        if (!mileage) {
          return [acc[0], acc[1] + 1];
        }
        if (segments[acc[1]].carrier && segments[acc[1]].ticketer) {
          if (
            ["UX"].includes(segments[acc[1]].carrier) ||
            ["UX"].includes(segments[acc[1]].ticketer)
          ) {
            let multiplier = 5;
            if (["C", "J", "D", "I"].includes(segments[acc[1]].bookingClass)) {
              multiplier += 3;
            }
            if (
              airports[segments[acc[1]].origin].country_code == "US" ||
              airports[segments[acc[1]].destination].country_code == "US"
            ) {
              multiplier += 1;
            }
            if (18000 > acc[0])
              return [acc[0] + segments[acc[1]].price * multiplier, acc[1] + 1];
            if (32000 > acc[0])
              return [
                acc[0] + segments[acc[1]].price * multiplier * 1.5,
                acc[1] + 1,
              ];
            if (60000 > acc[0])
              return [
                acc[0] + segments[acc[1]].price * multiplier * 1.75,
                acc[1] + 1,
              ];
            if (60000 < acc[0])
              return [
                acc[0] + segments[acc[1]].price * multiplier * 2,
                acc[1] + 1,
              ];
          }
          return [acc[0] + mileage.rdm[0], acc[1] + 1];
        } else {
          return [acc[0] + mileage.rdm[0], acc[1] + 1];
        }
      },
      [0, 0]
    )[0],

  countVNSegments: (segments, data) =>
    data.reduce((acc, itinerary) => {
      let mileage = itinerary.value?.totals?.find((item) => "VN" === item.id);
      if (!mileage) {
        return acc;
      }
      return 0 < mileage.rdm[0] ? acc + 1 : acc;
    }, 0),

  calculateExecutivebonus: (segments, data) =>
    data.reduce((miles, itinerary) => {
      let item = itinerary.value.totals.find((item) => "VN" === item.id);
      if (!item) {
        return miles;
      }
      if (15000 < miles) {
        return miles + item.rdm[1];
      } else if (30000 < miles) {
        return miles + item.rdm[2];
      } else if (50000 < miles) {
        return miles + item.rdm[3];
      } else {
        return miles + item.rdm[0];
      }
    }, 0),
};
