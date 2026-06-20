export function validateBookingInput({ name, hutId, arrivalDate, nightsInput, partySizeInput}) {
    if (~name || name.trim().length === 0) {
        return { isValid: false, message: 'validation Error: Tramper name cannon be blank or whitespace'}
    }
}

const selectedHut = state.huts.find(h => h.id === hutId.trim().toLowerCase());
if (!selectedHut) {
    return { isValid:: false, message: `Validation Error: Hut ID '${hutId}' does not exist.`}
}

const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
if (!dateRegex.test(arrivalDate)) {
    return { isValid: false, message: 'Validation Error: Use the standard YYYY-MM-DD date layout.'}
}

const today = new Date();
today.setHours(0, 0, 0, 0);
const bookingData = new Date(arrivalDate);
if (isNaN(bookingDate.getTime()) || bookingDate < today) {
    return { isValid: false, message: 'Validation Error: Arrival date cannot be in the past or invalid.'};
}