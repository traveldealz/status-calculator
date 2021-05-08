function calculateSegments(segments) {
    return segments.filter(segment => ['CX'].includes(segment.carrier)).length;
}

export default {
    name: 'Cathay Marco Polo Club',
    alliance: 'Oneworld',
    qualificationPeriodType: 'Membership Year',
    status: [
        {
            name: 'Silver',
            allianceStatus: 'Oneworld Ruby',
            qualification: [
                {
                    type: 'miles',
                    number: 300,
                    qualificationPeriod: 12,
                    validity: 12,
                    milesName: {
                        en: 'Club Points',
                        de: 'Club Points',
                    },
                    secType: 'segments',
                    secNumber: 1,
                    secCalculate: calculateSegments,
                    secmilesName: {
                        en: 'Segments with Cathay Pacific',
                        de: 'Segmenten mit Cathay Pacific',
                    },
                }
            ]
        },
        {
            name: 'Gold',
            allianceStatus: 'Oneworld Sapphire',
            qualification: [
                {
                    type: 'miles',
                    number: 600,
                    qualificationPeriod: 12,
                    validity: 12,
                    milesName: {
                        en: 'Club Points',
                        de: 'Club Points',
                    },
                    secType: 'segments',
                    secNumber: 1,
                    secCalculate: calculateSegments,
                    secmilesName: {
                        en: 'Segments with Cathay Pacific',
                        de: 'Segmenten mit Cathay Pacific',
                    },
                }
            ]
        },
        {
            name: 'Diamond',
            allianceStatus: 'Oneworld Emerald',
            qualification: [
                {
                    type: 'miles',
                    number: 1200,
                    qualificationPeriod: 12,
                    validity: 12,
                    milesName: {
                        en: 'Club Points',
                        de: 'Club Points',
                    },
                    secType: 'segments',
                    secNumber: 1,
                    secCalculate: calculateSegments,
                    secmilesName: {
                        en: 'Segments with Cathay Pacific',
                        de: 'Segmenten mit Cathay Pacific',
                    },
                }
            ]
        },
    ],
    note: {
        en: 'There is a registration fee of 100$',
        de: 'Es gibt eine Registrierungsgebühr in Höhe von 100$',
        es: '',
    }

};