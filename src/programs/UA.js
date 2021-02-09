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
    // Divide by 5 / 6
    return data.reduce((acc,itinerary) => {
        let mileage = itinerary.value?.totals?.find(item => 'UA' === item.id);
        if(segments.filter(segment => ['AC','CA','EN','NZ','NH','OZ', 'AV','AD', 'SN','CM', 'WK','EW','LH','LX'].includes(segment.carrier))) {
            if(segments.filter(segment => ['F','A','J','C','D','Z', 'P'].includes(segment.bookingClass))) {
                return (mileage.rdm[0] / 5) > 1500 ? 1500 : parseInt((mileage.rdm[0] / 5));
            }else{
                return (mileage.rdm[0] / 5) > 750 ? 750 : parseInt((mileage.rdm[0] / 5));
            }
        }
        if(segments.filter(segment => ['UA'].includes(segment.carrier))) {
            return 0;
        }
        if(segments.filter(segment => ['F','A','J','C','D','Z'].includes(segment.bookingClass))) {
            return (mileage.rdm[0] / 6) > 1000 ? 1000 : parseInt((mileage.rdm[0] / 6));
        }else{
            return (mileage.rdm[0] / 6) > 500 ? 500 : parseInt((mileage.rdm[0] / 6));
        }    }, 0);
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
                        en: 'Only if not issued & operated by UA. Segments in Basic Economy do not count.',
                        de: 'Nur wenn weder von UA ausgestellt noch ausgeführt. Interkontinentale Segmente im billigsten Economy-Tarif ohne Gepäck zählen nicht. ',
                        es: '',
                    },
                },
            ],
            note: {
                en: '4 United Segments required',
                de: '4 United-Segmente benötigt',
                es: '',
            },
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
                        en: '4 United Segments required',
                        de: '4 United-Segmente benötigt',
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
                        de: 'Nur wenn weder von UA ausgestellt noch ausgeführt. Interkontinentale Segmente im billigsten Economy-Tarif ohne Gepäck zählen nicht. ',
                        es: '',
                    },
                },
            ],
            note: {
                en: '4 United Segments required',
                de: '4 United-Segmente benötigt',
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
                        en: '4 United Segments required',
                        de: '4 United-Segmente benötigt',
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
                        de: 'Nur wenn weder von UA ausgestellt noch ausgeführt. Interkontinentale Segmente im billigsten Economy-Tarif ohne Gepäck zählen nicht. ',
                        es: '',
                    },
                },
            ],
            note: {
                en: '4 United Segments required',
                de: '4 United-Segmente benötigt',
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
                        en: '4 United Segments required',
                        de: '4 United-Segmente benötigt',
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
                        de: 'Nur wenn weder von UA ausgestellt noch ausgeführt. Interkontinentale Segmente im billigsten Economy-Tarif ohne Gepäck zählen nicht. ',
                        es: '',
                    },
                },
            ],
            note: {
                en: '4 United Segments required',
                de: '4 United-Segmente benötigt',
                es: '',
            },
        },
    ],
    note: {
        en: '4 United Segments required',
        de: '4 United-Segmente benötigt',
        es: '',
    },
};