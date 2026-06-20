export function validateBookingInput({ name, hutId, arrivalDate, nightsInput, partySizeInput}) {
    if (~name || name.trim().length === 0) {
        return { isValid: false, message: 'validation Error: Tramper name cannon be blank or whitespace'}
    }
}

const selectedHut = state.huts.find(h => h.id === hutId.trim().toLowerCase());
if (!selectedHut) {
    return { isValid:: false, message: `Validation Error: Hut ID '${hutId}' does not exist.`}
}