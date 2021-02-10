function calculateExecutivebonus(segments, data) {
    console.log(data);
    return data.reduce((miles, itinerary) => {
        let item = itinerary.value.totals.find(item => 'SQ' === item.id);
        if(!item) {
            return miles;
        }
        if(25000 < miles){
            return miles + item.rdm[1];
        }else if(50000 < miles){
            return miles + item.rdm[2];
        }else if (75000 < miles){
            return miles + item.rdm[3];
        }else{
            return miles + item.rdm[0];
        }
    }, 0 );

}

export default {
    name: 'Air India Flying Returns',
    alliance: 'Star Alliance',
    qualificationPeriodType: 'Consecutive months',
    status: [
        {
            name: 'Silver Edge Club',
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
            name: 'Golden Edge Club',
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
        {
            name: 'Maharajah Club',
            allianceStatus: 'Star Alliance Gold',
            qualification: [
                {
                    type: 'miles',
                    number: 75000,
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