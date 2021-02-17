function calculateSegments(segments) {
    return segments.filter(segment => ['CM'].includes(segment.carrier)).length;
}


export default {
    name: 'Copa Airlines ConnectMiles',
    alliance: 'Star Alliance',
    qualificationPeriodType: 'Calendar year',
    status: [
        {
            name: 'Silver',
            allianceStatus: 'Star Alliance Silver',
            qualification: [
                {
                    type: 'miles',
                    number: 25000,
                    secType: 'segments',
                    secNumber: 4,
                    secCalculate: calculateSegments,
                    qualificationPeriod: 12,
                    secmilesName: {
                        en: 'Segments with Copa Airlines',
                        de: 'Segmenten mit Copa Airlines',
                    },
                    validity: 12,
                
                },
            ],
            note: {
                en: '',
                de: '',
                es: '',
            },
        },
        {
            name: 'Gold',
            allianceStatus: 'Star Alliance Gold',
            qualification: [
                {
                    type: 'miles',
                    number: 45000,
                    secType: 'segments',
                    secNumber: 4,
                    secCalculate: calculateSegments,
                    qualificationPeriod: 12,
                    validity: 12,
                    secmilesName: {
                        en: 'Segments with Copa Airlines',
                        de: 'Segmenten mit Copa Airlines',
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
            name: 'Platinum',
            allianceStatus: 'Star Alliance Gold',
            qualification: [
                {
                    type: 'miles',
                    number: 75000,
                    secType: 'segments',
                    secNumber: 4,
                    secCalculate: calculateSegments,
                    qualificationPeriod: 12,
                    secmilesName: {
                        en: 'Segments with Copa Airlines',
                        de: 'Segmenten mit Copa Airlines',
                    },
                    validity: 12,
                 
                },
            ],
            note: {
                en: '',
                de: '',
                es: '',
            },
        },
        {
            name: 'Presidential',
            allianceStatus: 'Star Alliance Gold',
            qualification: [
                {
                    type: 'miles',
                    number: 95000,
                    secType: 'segments',
                    secNumber: 4,
                    secCalculate: calculateSegments,
                    qualificationPeriod: 12,
                    secmilesName: {
                        en: 'Segments with Copa Airlines',
                        de: 'Segmenten mit Copa Airlines',
                    },
                    validity: 12,
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
        en: '',
        de: '',
        es: '',
    },
};