export function getDatesForStay(arrivalString, nightsCount) {
    const dates = []
    let current = new Date(arrivalString);
    for (let i = 0; i < nightsCount; i++) {
        dates.push(current.toISOString().split('T')[0]);
        current.setDate(current.getDate() + 1);
    }
    return dates;
}

export function getRemainingCapacity(hutId, checkDate) {
    const hut = state.huts.find(h => h.id === hutId);
    if (!hut) return 0;

    const totalBooked = state.bookings
        .filter(b => b.hutId === hutId)
        .reduce((sum, b) => {
            const stayDates = getDatesForStay(b.arrivalDate, b.nights);
            return stayDates.includes(checkDate) ? sum + b.partySize : sum;
        }, 0);
    return hut.capacity - totalBooked;
}