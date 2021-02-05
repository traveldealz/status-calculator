function countSegments( segments, data ) {
    return data.reduce((acc,itinerary) => {
        let mileage = itinerary.value?.totals?.find(item => 'CA' === item.id);
        if(!mileage) {
            return acc;
        }
        return 0 < mileage.rdm[0] ? acc+1 : acc;
    }, 0);
}


export default {
    name: 'Air China PhoenixMiles',
    alliance: 'Star Alliance',
    qualificationPeriodType: '12 consecutive months',
    status: [
        {
            name: 'Silver Card',
            allianceStatus: 'Star Alliance Silver',
            qualification: [
                {
                    type: 'miles',
                    number: 40000,
                    qualificationPeriod: 12,
                    validity: 24,
                },
                {
                    type: 'segments',
                    number: 25,
                    qualificationPeriod: 12,
                    validity: 24,
                    calculate: countSegments,
                    note: {
                        en: 'Only segments with mileage credit count.',
                        de: 'Nur Segmente mit Meilengutschrift zählen.',
                        es: '',
                    },
                },
            ],
        },
        {
            name: 'Gold Card',
            allianceStatus: 'Star Alliance Gold',
            qualification: [
                {
                    type: 'miles',
                    number: 80000,
                    qualificationPeriod: 12,
                    validity: 24,
                },
                {
                    type: 'segments',
                    number: 40,
                    qualificationPeriod: 12,
                    validity: 24,
                    calculate: countSegments,
                    note: {
                        en: 'Only segments with mileage credit count.',
                        de: 'Nur Segmente mit Meilengutschrift zählen.',
                        es: '',
                    },
                },
            ],
        },
        {
            name: 'Platinum Card',
            allianceStatus: 'Star Alliance Gold',
            qualification: [
                {
                    type: 'miles',
                    number: 160000,
                    qualificationPeriod: 12,
                    validity: 24,
                },
                {
                    type: 'segments',
                    number: 90,
                    qualificationPeriod: 12,
                    validity: 24,
                    calculate: countSegments,
                    note: {
                        en: 'Only segments with mileage credit count.',
                        de: 'Nur Segmente mit Meilengutschrift zählen.',
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