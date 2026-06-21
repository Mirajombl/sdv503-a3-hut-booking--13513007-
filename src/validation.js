import { state } from './dataStorage.js';

/**
 * Validates booking inputs. Accepts individual variables directly.
 */
export function validateBookingInput(name, hutId, arrivalDate, nightsInput, partySizeInput) {
    
    // 1. Verify name isn't blank
    if (!name || name.trim().length === 0) {
        return { isValid: false, message: 'Validation Error: Tramper name cannot be blank or whitespace.' };
    }

    // 2. Look up the hut ID slug
    const selectedHut = state.huts.find(h => h.id === hutId.trim().toLowerCase());
    if (!selectedHut) {
        return { isValid: false, message: `Validation Error: Hut ID '${hutId}' does not exist.` };
    }

    // 3. Verify date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(arrivalDate)) {
        return { isValid: false, message: 'Validation Error: Use the standard YYYY-MM-DD date layout.' };
    }

    // 4. Verify arrival date isn't in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0); 
    const bookingDate = new Date(arrivalDate);
    if (isNaN(bookingDate.getTime()) || bookingDate < today) {
        return { isValid: false, message: 'Validation Error: Arrival date cannot be in the past or invalid.' };
    }

    // 5. Verify numbers are whole integers
    const intNights = Number(nightsInput);
    const intParty = Number(partySizeInput);
    if (!Number.isInteger(intNights) || !Number.isInteger(intParty)) {
        return { isValid: false, message: 'Validation Error: Nights and Party Size must be whole positive integers.' };
    }

    // 6. Verify numbers are greater than zero
    if (intNights <= 0 || intParty <= 0) {
        return { isValid: false, message: 'Validation Error: Nights and Party Size numbers must be greater than zero.' };
    }

    // 7. Max physical capacity check
    if (intParty > selectedHut.capacity) {
        return { isValid: false, message: `Validation Error: Group exceeds maximum physical hut room (${selectedHut.capacity} bunks).` };
    }

    // Return the sanitized clean data
    return {
        isValid: true,
        sanitized: {
            name: name.trim(),
            hutId: hutId.trim().toLowerCase(),
            arrivalDate,
            nights: intNights,
            partySize: intParty
        }
    };
}