import { saveDatabase } from "./dataStorage";

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

export async function createBooking(data) {
    const stayDates = getDatesForStay(data.arrivalDate, data.nights);

    for (const singleNight of stayDates) {
        const availableBunks = getRemainingCapacity(data.hutId, singleNight);
        if (data.partySize > availableBunks) {
            return { success: false, message: `Rejected: Exceeds remaing bunk capacity on night: ${singleNight}.`};
        }
    }  

    const newBooking = {
        id: `BK-${Math.floor(1000 + Math.random() * 9000)}`
        ...data
    };

    state.booking.push(newBooking);
    await saveDatabase();
    return { success: true, id: newBooking.id};
}