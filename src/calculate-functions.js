export default {
    countSegments: (arg) =>
        arg.data.reduce((acc, itinerary) => {
            let mileage = itinerary.value?.totals?.find(
                (item) => arg.program.code === item.id
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

    getmqd: (arg) =>
        arg.data.reduce(
            (acc, itinerary) => {
                let mileage = itinerary.value?.totals?.find(
                    (item) => arg.program.code === item.id
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

    calculateAMExecutivebonus: (segments) =>
        segments.data.reduce((miles, itinerary) => {
            let item = itinerary.value.totals.find((item) => "AM" === item.id);
            if (!item) {
                return miles;
            }
            if (50000 < miles) return miles + item.rdm[1];
            else if (80000 < miles) return miles + item.rdm[2];
            else if (100000 < miles) return miles + item.rdm[3];
            else return miles + item.rdm[0];
        }, 0),

    countAMDLMiles: (arg) =>
        arg.data.reduce(
            (acc, itinerary) => {
                let mileage = itinerary.value?.totals?.find((item) => "AM" === item.id);
                if (!mileage) {
                    return [acc[0], acc[1] + 1];
                }
                if (["AM", "DL"].includes(arg.segments[acc[1]].carrier)) {
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

    calculateSegments: (arg) =>
        arg.segments.filter((segment) =>
            arg.program.airlines.map((x) => x.iatacode).includes(segment.carrier)
        ).length,

    countMiles: (arg) =>
        arg.data.reduce(
            (acc, itinerary) => {
                let mileage = itinerary.value?.totals?.find(
                    (item) => arg.program.code === item.id
                );
                if (!mileage) {
                    return [acc[0], acc[1] + 1];
                }
                if ([arg.program.code].includes(arg.segments[acc[1]].carrier)) {
                    return [acc[0] + mileage.qm[0], acc[1] + 1];
                } else {
                    return [acc[0], acc[1] + 1];
                }
            },
            [0, 0]
        )[0],

    calculateAZExecutivebonus: (segments) =>
        segments.data.reduce((miles, itinerary) => {
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

    calculateLHMSegements: (arg) =>
        arg.segments.filter((segment) =>
            ["EN", "OS", "SN", "OU", "EW", "LO", "LH", "LG", "LX"].includes(
                segment.carrier
            )
        ).length,

    calculateLHMExecutivebonus: (arg) => {
        // If >35000 miles, take Executive Bonus
        return arg.data.reduce((miles, itinerary) => {
            let item = itinerary.value.totals.find((item) => "LHM" === item.id);
            if (!item) {
                return miles;
            }
            return 35000 < miles ? miles + item.qm[1] : miles + item.qm[0];
        }, 0);
    },
    calcLHM2021: (arg) =>
        arg.data.reduce(
            (acc, itinerary) => {
                let mileage = itinerary.value?.totals?.find(
                    (item) => "LHM" === item.id
                );
                if (!mileage) {
                    return [acc[0], acc[1] + 1];
                }
                if (
                    ["EN", "OS", "SN", "OU", "EW", "LO", "LH", "LG", "LX", "WK"].includes(
                        arg.segments[acc[1]].carrier
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

    calculateS7SegmentsWeight: (segments) =>
        segments.data.reduce(
            (acc, itinerary) => {
                let mileage = itinerary.value?.totals?.find((item) => "S7" === item.id);
                if (!mileage) {
                    return [acc[0], acc[1] + 1];
                }
                if (["S7"].includes(segments.segments[acc[1]].carrier)) {
                    if (
                        ["J", "C", "D"].includes(segments.segments[acc[1]].bookingClass)
                    ) {
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
        segments.segments.filter((segment) =>
            ["SK", "WF"].includes(segment.carrier)
        ).length,

    calculateSQExecutivebonus: (segments) => {
        // If >25000 miles, take Executive Bonus
        return segments.data.reduce((miles, itinerary) => {
            let item = itinerary.value.totals.find((item) => "SQ" === item.id);
            if (!item) {
                return miles;
            }
            return 25000 < miles ? miles + item.rdm[1] : miles + item.rdm[0];
        }, 0);
    },

    countSUBusinessSegments: (segments) =>
        segments.data.reduce((acc, itinerary) => {
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

    countSVSegments: (segments) =>
        segments.data.reduce(
            (acc, itinerary) => {
                let mileage = itinerary.value?.totals?.find(
                    (item) => segments.program === item.id
                );
                if (!mileage) {
                    return [acc[0], acc[1] + 1];
                }
                if (
                    segments.airports[segments.segments[acc[1]].origin].country_code !=
                    segments.airports[segments.segments[acc[1]].destination].country_code
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
        segments.segments
            .filter((segment) => ["TG"].includes(segment.carrier))
            .filter((segment) => !["G", "V", "W"].includes(segment.bookingClass))
            .length,

    calculateUXMiles: (segments) =>
        segments.data.reduce(
            (acc, itinerary) => {
                let mileage = itinerary.value?.totals?.find(
                    (item) => segments.program === item.id
                );
                if (!mileage) {
                    return [acc[0], acc[1] + 1];
                }
                if (
                    segments.segments[acc[1]].carrier &&
                    segments.segments[acc[1]].ticketer
                ) {
                    if (
                        [segments.program].includes(segments.segments[acc[1]].carrier) ||
                        [segments.program].includes(segments.segments[acc[1]].ticketer)
                    ) {
                        let multiplier = 5;
                        if (
                            ["C", "J", "D", "I"].includes(
                                segments.segments[acc[1]].bookingClass
                            )
                        ) {
                            multiplier += 3;
                        }
                        if (
                            segments.airports[segments.segments[acc[1]].origin]
                                .country_code == "US" ||
                            segments.airports[segments.segments[acc[1]].destination]
                                .country_code == "US"
                        ) {
                            multiplier += 1;
                        }
                        if (18000 > acc[0])
                            return [
                                acc[0] + segments.segments[acc[1]].price * multiplier,
                                acc[1] + 1,
                            ];
                        if (32000 > acc[0])
                            return [
                                acc[0] + segments.segments[acc[1]].price * multiplier * 1.5,
                                acc[1] + 1,
                            ];
                        if (60000 > acc[0])
                            return [
                                acc[0] + segments.segments[acc[1]].price * multiplier * 1.75,
                                acc[1] + 1,
                            ];
                        if (60000 < acc[0])
                            return [
                                acc[0] + segments.segments[acc[1]].price * multiplier * 2,
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

    calculateVNExecutivebonus: (segments) =>
        segments.data.reduce((miles, itinerary) => {
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
