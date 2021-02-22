function calculateSegments( segments, data ) {
    return data.reduce((acc,itinerary) => {
        let mileage = itinerary.value?.totals?.find(item => 'UA' === item.id);
        if(!mileage) {
            return acc;
        }
        if(mileage.id == 'UA'){return acc+1}; 
        return 0 < mileage.rdm[0] ? acc+1 : acc;
    }, 0);
}

function getLimit(carrier, bookingClass){
    if(['AC','OS','SN'].includes(carrier)) {
        if(['C','D','J', 'Z', 'P'].includes(bookingClass)) {
            return 1500;
        }else{
            return 750;
        }
    }
    if(['A3'].includes(carrier)) {
        if(['C','D', 'Z', 'A'].includes(bookingClass)) {
            return 1000;
        }else{
            return 500;
        }
    }
    if(['CA'].includes(carrier)) {
        if(['F','A','J', 'C', 'D', 'Z', 'R'].includes(bookingClass)) {
            return 1500;
        }else{
            return 750;
        }
    }
    if(['EN'].includes(carrier)) {
        if(['F', 'A', 'C','D','J', 'Z', 'P', 'Y', 'B', 'M'].includes(bookingClass)) {
            return 1500;
        }else{
            return 750;
        }
    }
    if(['NZ'].includes(carrier)) {
        if(['C','D','J', 'Z'].includes(bookingClass)) {
            return 1500;
        }else{
            return 750;
        }
    }
    if(['NH','LH','LX'].includes(carrier)){
        if(['C','D','J', 'Z', 'P', 'F', 'A'].includes(bookingClass)){
            return 1500;
        }else{
            return 750;
        }
    }
    if(['AD'].includes(carrier)) {
        if(['C','D','J', 'I'].includes(bookingClass)) {
            return 1500;
        }else{
            return 750;
        }
    }
    if(['EW'].includes(carrier)) {
        if(['D','J'].includes(bookingClass)) {
            return 1500;
        }else{
            return 750;
        }
    }
    if(['CM'].includes(carrier)) {
        if(['C','D','J', 'R'].includes(bookingClass)) {
            return 1500;
        }else{
            return 750;
        }
    }
    if(['LO'].includes(carrier)) {
        if(['C','D','Z', 'F'].includes(bookingClass)) {
            return 1000;
        }else{
            return 500;
        }
    }
    if(['OZ', 'SQ'].includes(carrier)) {
        if(['F','A','J', 'C', 'D','Z', 'U'].includes(bookingClass)) {
            return 1000;
        }else{
            return 500;
        }
    }
    if(['OU'].includes(carrier)) {
        if(['C','D','Z'].includes(bookingClass)) {
            return 1000;
        }else{
            return 500;
        }
    }
    if(['MS', 'TG'].includes(carrier)) {
        if(['F','A','P', 'C', 'D', 'J', 'Z'].includes(bookingClass)) {
            return 1000;
        }else{
            return 500;
        }
    }
    if(['SK', 'TP'].includes(carrier)) {
        if(['C','D','J', 'Z'].includes(bookingClass)) {
            return 1000;
        }else{
            return 500;
        }
    }
    if(['AI'].includes(carrier)) {
        if(['C','D','J', 'Z', 'F', 'A'].includes(bookingClass)) {
            return 1000;
        }else{
            return 500;
        }
    }
    if(['AV'].includes(carrier)) {
        if(['C','D','J', 'K', 'A'].includes(bookingClass)) {
            return 1500;
        }else{
            return 750;
        }
    }
    if(['ET', 'BR'].includes(carrier)) {
        if(['C','D','J'].includes(bookingClass)) {
            return 1000;
        }else{
            return 500;
        }
    }
    if(['ZH'].includes(carrier)) {
        if(['C','D','J', 'R', 'Z'].includes(bookingClass)) {
            return 1000;
        }else{
            return 500;
        }
    }
    if(['TK'].includes(carrier)) {
        if(['C','D','J', 'Z', 'K'].includes(bookingClass)) {
            return 1000;
        }else{
            return 500;
        }
    }
    if(['SA'].includes(carrier)) {
        if(['C','D','J', 'P', 'Z'].includes(bookingClass)) {
            return 1000;
        }else{
            return 500;
        }
    }
    if(['OA'].includes(carrier)) {
        if(['C','D','Z', 'A'].includes(bookingClass)) {
            return 1000;
        }else{
            return 500;
        }
    }
    }



export function calculateMiles(segments, data) {
    console.log('data');
    console.log(data);
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
        let limit = getLimit(segments[acc[1]].carrier, segments[acc[1]].bookingClass);
        if(segments[acc[1]].carrier  && segments[acc[1]].ticketer){
        if(['UA'].includes(segments[acc[1]].carrier) || ['UA'].includes(segments[acc[1]].ticketer)) {
            return [acc[0] + segments[acc[1]].price, acc[1]+1];
        }
        }
        if(['AC','CA','EN','NZ','NH','OZ', 'AV','AD', 'SN','CM', 'WK','EW','LH','LX'].includes(segments[acc[1]].carrier)) {
                return (mileage.rdm[0] / 5) > limit ? [acc[0] + limit, acc[1]+1] : [acc[0] + parseInt((mileage.rdm[0] / 5)), acc[1]+1];
        }
        else if(['UA'].includes(segments[acc[1]].carrier)) {
            return [acc[0] + 0, acc[1]+1];
        }
        else {
                return (mileage.rdm[0] / 5) > limit ? [acc[0] + limit, acc[1]+1] : [acc[0] + parseInt(mileage.rdm[0] / 5), acc[1]+1];   
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
                    milesName: {
                        en: 'points (PQPs)',
                        de: 'Punkten (PQP)',
                    },
                    qualificationPeriod: 12,
                    validity: 12,
                },
                {
                    type: 'miles',
                    number: 3000,
                    calculate: calculateMiles,
                    milesName: {
                        en: 'points (PQPs)',
                        de: 'Punkten (PQP)',
                    },
                    secType: 'segments',
                    secNumber: 8,
                    secCalculate: calculateSegments,
                    qualificationPeriod: 12,
                    secmilesName: {
                        en: 'Segments (PQFs)',
                        de: 'Segmenten (PQF)',
                    },
                    validity: 12,
                    secNote: {
                        en: 'Segments in Basic Economy do not count',
                        de: 'Für Transatlantikflüge im Light-Tarif (ohne Gepäck) und die United Basic Economy werden keine Segmente gutgeschrieben',
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
                    milesName: {
                        en: 'points (PQPs)',
                        de: 'Punkten (PQP)',
                    },
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
                    milesName: {
                        en: 'points (PQPs)',
                        de: 'Punkten (PQP)',
                    },
                    qualificationPeriod: 12,
                    validity: 12,
                    secmilesName: {
                        en: 'Segments (PQFs)',
                        de: 'Segmenten (PQF)',
                    },
                    secNote: {
                        en: 'Segments in Basic Economy do not count',
                        de: 'Für Transatlantikflüge im Light-Tarif (ohne Gepäck) und die United Basic Economy werden keine Segmente gutgeschrieben',
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
                    milesName: {
                        en: 'points (PQPs)',
                        de: 'Punkten (PQP)',
                    },
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
                    milesName: {
                        en: 'points (PQPs)',
                        de: 'Punkten (PQP)',
                    },
                    secType: 'segments',
                    secNumber: 24,
                    secCalculate: calculateSegments,
                    secmilesName: {
                        en: 'Segments (PQFs)',
                        de: 'Segmenten (PQF)',
                    },
                    qualificationPeriod: 12,
                    validity: 12,
                    secNote: {
                        en: 'Segments in Basic Economy do not count',
                        de: 'Für Transatlantikflüge im Light-Tarif (ohne Gepäck) und die United Basic Economy werden keine Segmente gutgeschrieben ',
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
                    milesName: {
                        en: 'points (PQPs)',
                        de: 'Punkten (PQP)',
                    },
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
                    milesName: {
                        en: 'points (PQPs)',
                        de: 'Punkten (PQP)',
                    },
                    secType: 'segments',
                    secNumber: 36,
                    secCalculate: calculateSegments,
                    qualificationPeriod: 12,
                    secmilesName: {
                        en: 'Segments (PQFs)',
                        de: 'Segmenten (PQF)',
                    },
                    validity: 12,
                    secNote: {
                        en: 'Segments in Basic Economy do not count',
                        de: 'Für Transatlantikflüge im Light-Tarif (ohne Gepäck) und die United Basic Economy werden keine Segmente gutgeschrieben',
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
        en: 'If you do not enter the ticketing carrier and the flight price, this calculation only works for flights that are not issued & operated by UA. At least 4 United Segments required to obtain a status',
        de: 'Sofern Sie nicht den Ticketing-Carrier und den Flugpreis angeben, stimmt diese Berechnung nur wenn die Flüge weder von UA ausgestellt noch ausgeführt werden. 4 United-Segmente benötigt um einen Status zu bekommen.',
        es: '',
    },
};