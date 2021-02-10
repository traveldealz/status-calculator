function calculateExecutivebonus(segments, data) {
    // If >25000 miles, take Executive Bonus
    console.log(data);
    return data.reduce((miles, itinerary) => {
        let item = itinerary.value.totals.find(item => 'SQ' === item.id);
        if(!item) {
            return miles;
        }
        return 25000 < miles ? miles + item.rdm[1] : miles + item.rdm[0];
    }, 0 );

}

export default {
    name: 'Singapore Airlinse KrisFlyer',
    alliance: 'Star Alliance',
    qualificationPeriodType: 'Consecutive months',
    status: [
        {
            name: 'Elite Silver',
            allianceStatus: 'Star Alliance Silver',
            qualification: [
                {
                    type: 'miles',
                    number: 25000,
                    qualificationPeriod: 12,
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
            name: 'Elite Gold',
            allianceStatus: 'Star Alliance Gold',
            qualification: [
                {
                    type: 'miles',
                    number: 50000,
                    qualificationPeriod: 12,
                    validity: 12,
                    calculate: calculateExecutivebonus,
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