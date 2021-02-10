function calculateSegements(segments) {
    return segments.filter(segment => ['TP'].includes(segment.carrier)).length;
}


export default {
    name: 'TAP Miles&Go',
    alliance: 'Star Alliance',
    qualificationPeriodType: 'Membership year',
    status: [
        {
            name: 'Silver',
            allianceStatus: 'Star Alliance Silver',
            qualification: [
                {
                    type: 'miles',
                    number: 30000,
                    qualificationPeriod: 12,
                    validity: 12,
                },
                {
                    type: 'segments',
                    number: 25,
                    qualificationPeriod: 12,
                    validity: 12,
                    calculate: calculateSegements,
                    note: {
                        en: 'Only segments with TAP count.',
                        de: 'Nur Segmente durchgeführt von TAP zählen.',
                        es: '',
                    },
                },
            ],
        },
        {
            name: 'Gold',
            allianceStatus: 'Star Alliance Gold',
            qualification: [
                {
                    type: 'miles',
                    number: 70000,
                    qualificationPeriod: 12,
                    validity: 12,
                    note: {
                        en: '',
                        de: '',
                        es: '',
                    },
                },
                {
                    type: 'segments',
                    number: 50,
                    qualificationPeriod: 12,
                    validity: 12,
                    calculate: calculateSegements,
                    note: {
                        en: 'Only segments with TAP count.',
                        de: 'Nur Segmente durchgeführt von TAP zählen.',
                        es: '',
                    },
                },
            ],
        },
    ],
    note: {
        en: '',
        de: '',
        es: '',
    },
};