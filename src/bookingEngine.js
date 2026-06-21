export function getDatesForStay(arrivalString, nightsCount) {
    const dates = []
    let current = new Date(arrivalString);
    for (let i = 0; i < nightsCount; i++) {
        dates.push(current.toISOString().split('T')[0]);
        current.setDate(current.getDate() + 1);
    }
    return dates;
}