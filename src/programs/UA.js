function calculateSegments( segments, data ) {
    return data.reduce((acc,itinerary) => {
        let mileage = itinerary.value?.totals?.find(item => 'UA' === item.id);
        if(!mileage) {
            return acc;
        }
        return 0 < mileage.rdm[0] ? acc+1 : acc;
    }, 0);
}

function calculateMiles(segments, data) {
    // Berechnet Statuspunkte. Bei UA -> 0, da Umsatzbasiert.
    // Bei Partnerairlines -> Meilen / 5 -  mit 1500/750 Limit je nach Klasse
    // Bei anderen Airlines -> Meilen / 6 - mit 750/500 Limit je nach Klasse
    return data.reduce((acc,itinerary) => {

        let mileage = itinerary.value?.totals?.find(item => 'UA' === item.id);
        console.log("segment: " + acc[1]);
        console.log(mileage.rdm[0]);
        if(!mileage) {
          return [acc[0], acc[1]+1];
        }
        if(['AC','CA','EN','NZ','NH','OZ', 'AV','AD', 'SN','CM', 'WK','EW','LH','LX'].includes(segments[acc[1]].carrier)) {
            if(['F','A','J','C','D','Z', 'P'].includes(segments[acc[1]].bookingClass)) {
                return (mileage.rdm[0] / 5) > 1500 ? [acc[0] + 1500, acc[1]+1] : [acc[0] + parseInt(mileage.rdm[0] / 5), acc[1]+1];
            }else{
                return (mileage.rdm[0] / 5) > 750 ? [acc[0] + 750, acc[1]+1] : [acc[0] + parseInt((mileage.rdm[0] / 5)), acc[1]+1];
            }
        }
        if(['UA'].includes(segments[acc[1]].carrier)) {
            return [0, acc[1]+1];
        }
        if(['F','A','J','C','D','Z'].includes(segments[acc[1]].bookingClass)) {
                return (mileage.rdm[0] / 5) > 1000 ? [acc[0] + 1000, acc[1]+1] : [acc[0] + parseInt(mileage.rdm[0] / 5), acc[1]+1];
            }else{
                return (mileage.rdm[0] / 5) > 500 ? [acc[0] + 500, acc[1]+1] : [acc[0] + parseInt((mileage.rdm[0] / 5)), acc[1]+1];
            }   
        }, [0, 0])[0];
}


export default {
    name: 'United MileagePlus',
    alliance: 'Star Alliance',
    qualificationPeriodType: 'Calendar Year',
    status: [
        {
            name: 'Premier Silver',
            allianceStatus: 'Star Alliance Silver',
            qualification: [
                {
                    type: 'miles',
                    number: 3500,
                    calculate: calculateMiles,
                    qualificationPeriod: 12,
                    validity: 12,
                },
                {
                    type: 'miles',
                    number: 3000,
                    calculate: calculateMiles,
                    secType: 'segments',
                    secNumber: 8,
                    secCalculate: calculateSegments,
                    qualificationPeriod: 12,
                    validity: 12,
                    note: {
                        en: 'Segments in Basic Economy do not count',
                        de: 'Interkontinentale Segmente im billigsten Economy-Tarif ohne Gepäck zählen nicht. ',
                        es: '',
                    },
                },
            ],
        },
        {
            name: 'Premier Gold',
            allianceStatus: 'Star Alliance Gold',
            qualification: [
                {
                    type: 'miles',
                    number: 7000,
                    calculate: calculateMiles,
                    qualificationPeriod: 12,
                    validity: 12,
                    note: {
                        en: '',
                        de: '',
                        es: '',
                    },
                },
                {
                    type: 'miles',
                    number: 6000,
                    calculate: calculateMiles,
                    secType: 'segments',
                    secNumber: 16,
                    secCalculate: calculateSegments,
                    qualificationPeriod: 12,
                    validity: 12,
                    note: {
                        en: 'Segments in Basic Economy do not count',
                        de: 'Interkontinentale Segmente im billigsten Economy-Tarif ohne Gepäck zählen nicht. ',
                        es: '',
                    },
                },
            ],
            note: {
                en: '',
                de: '',
                es: '',
            },
        },
        {
            name: 'Premier Platinum',
            allianceStatus: 'Star Alliance Gold',
            qualification: [
                {
                    type: 'miles',
                    number: 10000,
                    calculate: calculateMiles,
                    qualificationPeriod: 12,
                    validity: 12,
                    note: {
                        en: '',
                        de: '',
                        es: '',
                    },
                },
                {
                    type: 'miles',
                    number: 9000,
                    calculate: calculateMiles,
                    secType: 'segments',
                    secNumber: 24,
                    secCalculate: calculateSegments,
                    qualificationPeriod: 12,
                    validity: 12,
                    note: {
                        en: 'Segments in Basic Economy do not count',
                        de: 'Interkontinentale Segmente im billigsten Economy-Tarif ohne Gepäck zählen nicht. ',
                        es: '',
                    },
                },
            ],
            note: {
                en: '',
                de: '',
                es: '',
            },
        },
        {
            name: 'Premier 1K',
            allianceStatus: 'Star Alliance Gold',
            qualification: [
                {
                    type: 'miles',
                    number: 15000,
                    calculate: calculateMiles,
                    qualificationPeriod: 12,
                    validity: 12,
                    note: {
                        en: '',
                        de: '',
                        es: '',
                    },
                },
                {
                    type: 'miles',
                    number: 13500,
                    calculate: calculateMiles,
                    secType: 'segments',
                    secNumber: 36,
                    secCalculate: calculateSegments,
                    qualificationPeriod: 12,
                    validity: 12,
                    note: {
                        en: 'Segments in Basic Economy do not count',
                        de: 'Interkontinentale Segmente im billigsten Economy-Tarif ohne Gepäck zählen nicht. ',
                        es: '',
                    },
                },
            ],
            note: {
                en: '',
                de: '',
                es: '',
            },
        },
    ],
    note: {
        en: 'This calculation only works for flights that are not issued & operated by UA. At least 4 United Segments required to obtain a status',
        de: 'Diese Berechnung stimmt nur wenn die Flüge weder von UA ausgestellt noch ausgeführt werden. 4 United-Segmente benötigt um einen Status zu bekommen.',
        es: '',
    },
};