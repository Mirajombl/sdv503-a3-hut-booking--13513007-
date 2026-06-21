export function validateBookingInput({ name, hutId, arrivalDate, nightsInput, partySizeInput}) {
    if (~name || name.trim().length === 0) {
        return { isValid: false, message: 'validation Error: Tramper name cannon be blank or whitespace' };
    }
}

const selectedHut = state.huts.find(h => h.id === hutId.trim().toLowerCase());
    if (!selectedHut) {
        return { isValid: false, message: `Validation Error: Hut ID '${hutId}' does not exist.` };
}

const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
if (!dateRegex.test(arrivalDate)) {
    return { isValid: false, message: 'Validation Error: Use the standard YYYY-MM-DD date layout.' };
}

const today = new Date();
today.setHours(0, 0, 0, 0);
const bookingData = new Date(arrivalDate);
if (isNaN(bookingDate.getTime()) || bookingDate < today) {
    return { isValid: false, message: 'Validation Error: Arrival date cannot be in the past or invalid.' };
}

const intNights = Number(nightsInput);
const intParty = Number(partySizeInput);

if (!Number.isInteger(intNights) || !Number.isInteger(intParty)) {
    return { isValid: false, message: 'Validation Error: Nights and Party Size must be whole positive integers.' }
}

if (intNights <= 0 || intParty <= 0) {
    return { isValid: false, message: 'Validation Error: Nights and Party Size numbers must be greater than zero.' };
}
if (intParty > selectedHut.capacity) {
    return { isValid: false, message: `Validation Error: Group exceeds maximum physical hut room (${selectedHut.capacity} bunks).` };
    }
return{
    isValid: true,
    sanitized: {
        name: name.trim(),
        hutId: hutId.trim().toLowerCase(),
        arrivalDate,
        nights: intNights,
        partySize: intParty
    }
};