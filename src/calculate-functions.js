export default {
  countSegments: ({ data, program }) =>
    data.reduce((acc, itinerary) => {
      let mileage = itinerary.value?.totals?.find(
        (item) => program.code === item.id
      );
      if (!mileage) {
        return acc;
      }
      if (mileage.rdm) {
        return 0 < mileage.rdm[0] ? acc + 1 : acc;
      } else {
        return acc;
      }
    }, 0),

  countMilesLHM: ({ data, program, segments }) =>
    data.reduce(
      (acc, itinerary) => {
        let mileage = itinerary.value?.totals?.find(
          (item) => program.code === item.id
        );
        if (!mileage) {
          return [acc[0], acc[1] + 1];
        }
        if (
          [
            "EN",
            "OS",
            "SN",
            "OU",
            "EW",
            "LO",
            "LH",
            "LG",
            "LX",
            "4Y",
            "AZ",
          ].includes(segments[acc[1]].carrier)
        ) {
          return [acc[0] + (mileage.qm ? mileage.qm[0] : 0), acc[1] + 1];
        } else {
          return [acc[0], acc[1] + 1];
        }
      },
      [0, 0]
    )[0],

  getmqd: ({ data, program }) =>
    data.reduce(
      (acc, itinerary) => {
        let mileage = itinerary.value?.totals?.find(
          (item) => program.code === item.id
        );
        if (!mileage) {
          return [acc[0], acc[1] + 1];
        }
        return 0 < mileage.qd[0]
          ? [acc[0] + mileage.qd[0], acc[1] + 1]
          : [acc[0], acc[1] + 1];
      },
      [0, 0]
    )[0],

  calculateAMExecutivebonus: ({ data }) =>
    data.reduce((miles, itinerary) => {
      let item = itinerary.value.totals.find((item) => "AM" === item.id);
      if (!item) {
        return miles;
      }
      if (item.rdm) {
        if (50000 < miles) return miles + item.rdm[1];
        else if (80000 < miles) return miles + item.rdm[2];
        else if (100000 < miles) return miles + item.rdm[3];
        else return miles + item.rdm[0];
      } else {
        return miles;
      }
    }, 0),

  countAMDLMiles: ({ data, segments }) =>
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

  calculateSegments: ({ segments, program }) =>
    segments.filter((segment) =>
      program.airlines.map((x) => x.iatacode).includes(segment.carrier)
    ).length,

  countMiles: ({ data, program, segments }) =>
    data.reduce(
      (acc, itinerary) => {
        let mileage = itinerary.value?.totals?.find(
          (item) => program.code === item.id
        );
        if (!mileage) {
          return [acc[0], acc[1] + 1];
        }
        if ([program.code].includes(segments[acc[1]].carrier)) {
          return [acc[0] + (mileage.qm ? mileage.qm[0] : 0), acc[1] + 1];
        } else {
          return [acc[0], acc[1] + 1];
        }
      },
      [0, 0]
    )[0],

  calculateAZExecutivebonus: ({ data }) =>
    data.reduce((miles, itinerary) => {
      let item = itinerary.value.totals.find((item) => "AZ" === item.id);
      if (!item) {
        return miles;
      }
      if (item.rdm) {
        if (20000 < miles) {
          return miles + item.rdm[1];
        } else if (50000 < miles) {
          return miles + item.rdm[2];
        } else if (80000 < miles) {
          return miles + item.rdm[3];
        } else {
          return miles + item.rdm[0];
        }
      } else {
        return miles;
      }
    }, 0),

  calculateLHMSegements: ({ segments }) =>
    segments.filter((segment) =>
      ["EN", "OS", "SN", "OU", "EW", "LO", "LH", "LG", "LX"].includes(
        segment.carrier
      )
    ).length,

  calculateLHMExecutivebonus: ({ data }) => {
    // If >35000 miles, take Executive Bonus
    return data.reduce((miles, itinerary) => {
      let item = itinerary.value.totals.find((item) => "LHM" === item.id);
      if (!item) {
        return miles;
      }
      if (item.qm) {
        return 35000 < miles ? miles + item.qm[1] : miles + item.qm[0];
      } else {
        return miles;
      }
    }, 0);
  },
  calcLHM2021: ({ data, segments }) =>
    data.reduce(
      (acc, itinerary) => {
        let mileage = itinerary.value?.totals?.find(
          (item) => "LHM" === item.id
        );
        if (!mileage) {
          return [acc[0], acc[1] + 1];
        }
        if (
          [
            "EN",
            "OS",
            "SN",
            "OU",
            "EW",
            "LO",
            "LH",
            "LG",
            "LX",
            "WK",
            "AZ",
          ].includes(segments[acc[1]].carrier)
        ) {
          return acc[0] > 35000
            ? [acc[0] + (mileage.qm ? mileage.qm[1] : 0) * 2, acc[1] + 1]
            : [acc[0] + (mileage.qm ? mileage.qm[0] : 0) * 2, acc[1] + 1];
        } else {
          return acc[0] > 35000
            ? [acc[0] + (mileage.qm ? mileage.qm[1] : 0), acc[1] + 1]
            : [acc[0] + (mileage.qm ? mileage.qm[0] : 0), acc[1] + 1];
        }
      },
      [0, 0]
    )[0],

  calculateS7SegmentsWeight: ({ data, segments }) =>
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

  calculateSKSegments: ({ segments }) =>
    segments.filter((segment) => ["SK", "WF"].includes(segment.carrier)).length,

  calculateSQExecutivebonus: ({ data }) => {
    // If >25000 miles, take Executive Bonus
    return data.reduce((miles, itinerary) => {
      let item = itinerary.value.totals.find((item) => "SQ" === item.id);
      if (!item) {
        return miles;
      }
      if (item.rdm) {
        return 25000 < miles ? miles + item.rdm[1] : miles + item.rdm[0];
      } else {
        return miles;
      }
    }, 0);
  },

  countSUBusinessSegments: ({ data }) =>
    data.reduce((acc, itinerary) => {
      let mileage = itinerary.value?.totals?.find((item) => "SU" === item.id);
      if (!mileage) {
        return acc;
      }
      let cabquery = itinerary.value?.totals?.find((item) => "SU" === item.id);
      if (cabquery["cabinclass"] == "Business Class") {
        return 0 < mileage.rdm[0] ? acc + 1 : acc;
      }
      return acc;
    }, 0),

  countSVSegments: ({ data, program, segments }) =>
    data.reduce(
      (acc, itinerary) => {
        let mileage = itinerary.value?.totals?.find(
          (item) => program === item.id
        );
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

  calculateTGSegments: ({ segments }) =>
    segments
      .filter((segment) => ["TG"].includes(segment.carrier))
      .filter((segment) => !["G", "V", "W"].includes(segment.bookingClass))
      .length,

  calculateUXMiles: ({ data, program, segments, airports }) =>
    data.reduce(
      (acc, itinerary) => {
        let mileage = itinerary.value?.totals?.find(
          (item) => program === item.id
        );
        if (!mileage) {
          return [acc[0], acc[1] + 1];
        }
        if (segments[acc[1]].carrier && segments[acc[1]].ticketer) {
          if (
            [program].includes(segments[acc[1]].carrier) ||
            [program].includes(segments[acc[1]].ticketer)
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

  calculateVNExecutivebonus: ({ data }) =>
    data.reduce((miles, itinerary) => {
      let item = itinerary.value.totals.find((item) => "VN" === item.id);
      if (!item) {
        return miles;
      }
      if (item.rdm) {
        if (15000 < miles) {
          return miles + item.rdm[1];
        } else if (30000 < miles) {
          return miles + item.rdm[2];
        } else if (50000 < miles) {
          return miles + item.rdm[3];
        } else {
          return miles + item.rdm[0];
        }
      } else {
        return miles;
      }
    }, 0),
};
