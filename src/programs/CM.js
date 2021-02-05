function calculateSegments(segments) {
    return segments.filter(segment => ['CM'].includes(segment.carrier)).length;
}

//TODO: Checken, was mit den verschiedenen Segment-Gewichtungen passiert, ggfs. Quali via Segmente entfernen. Min. 4 Segmente mit Copa muss aber drinbleiben.

export default {
    name: 'Copa Airlines ConnectMiles',
    alliance: 'Star Alliance',
    qualificationPeriodType: 'Calendar Year',
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
                    validity: 12,
                    note: {
                        en: '4 segments on Copa Airlines needed.',
                        de: '4 Segmente mit Copa Airlines benötigt.',
                        es: '',
                    },
                },
                {
                    type: 'segments',
                    number: 20,
                    secCalculate: calculateSegments,
                    qualificationPeriod: 12,
                    validity: 12,
                    note: {
                        en: 'Only segments on Copa Airlines.',
                        de: 'Nur Segmente mit Copa Airlines.',
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
            name: 'Gold',
            allianceStatus: 'Star Alliance Gold',
            qualification: [
                {
                    type: 'segments',
                    number: 40,
                    secCalculate: calculateSegments,
                    qualificationPeriod: 12,
                    validity: 12,
                    note: {
                        en: 'Only segments on Copa Airlines.',
                        de: 'Nur Segmente mit Copa Airlines.',
                        es: '',
                    },
                },
                {
                    type: 'miles',
                    number: 45000,
                    secType: 'segments',
                    secNumber: 4,
                    secCalculate: calculateSegments,
                    qualificationPeriod: 12,
                    validity: 12,
                    note: {
                        en: '4 segments on Copa Airlines needed.',
                        de: '4 Segmente mit Copa Airlines benötigt.',
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
            name: 'Platinum',
            allianceStatus: 'Star Alliance Gold',
            qualification: [
                {
                    type: 'segments',
                    number: 70,
                    secCalculate: calculateSegments,
                    qualificationPeriod: 12,
                    validity: 12,
                    note: {
                        en: 'Only segments on Copa Airlines.',
                        de: 'Nur Segmente mit Copa Airlines.',
                        es: '',
                    },
                },
                {
                    type: 'miles',
                    number: 75000,
                    secType: 'segments',
                    secNumber: 4,
                    secCalculate: calculateSegments,
                    qualificationPeriod: 12,
                    validity: 12,
                    note: {
                        en: '4 segments on Copa Airlines needed.',
                        de: '4 Segmente mit Copa Airlines benötigt.',
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
            name: 'Presidential',
            allianceStatus: 'Star Alliance Gold',
            qualification: [
                {
                    type: 'segments',
                    number: 90,
                    secCalculate: calculateSegments,
                    qualificationPeriod: 12,
                    validity: 12,
                    note: {
                        en: 'Only segments on Copa Airlines.',
                        de: 'Nur Segmente mit Copa Airlines.',
                        es: '',
                    },
                },
                {
                    type: 'miles',
                    number: 95000,
                    secType: 'segments',
                    secNumber: 4,
                    secCalculate: calculateSegments,
                    qualificationPeriod: 12,
                    validity: 12,
                    note: {
                        en: '4 segments on Copa Airlines needed.',
                        de: '4 Segmente mit Copa Airlines benötigt.',
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
        en: '',
        de: '',
        es: '',
    },
};