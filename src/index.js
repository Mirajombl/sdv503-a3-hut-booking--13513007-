import readline from 'readline';
import { initializeDatabase, state } from './dataStore.js';
import { validateBookingInput } from './validation.js';
import { createBooking, cancelBooking, getOccupancySummary, getRemainingCapacity } from './bookingEngine.js';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const askQuestion = (query) => new Promise((resolve) => rl.question(query, resolve));

async function displayMainMenu() {
    console.log('\n=================================================');
    console.log('    DEPARTMENT OF CONSERVATION HUT MANAGER    ');
    console.log('=================================================');
    console.log('1. Record New Booking');
    console.log('2. View Bunk Allocation');
    console.log('3. Cancel Existing Booking');
    console.log('4. Print Core Occupancy Report');
    console.log('5. Exit Application');

    const choice = await askQuestion('\nSelect operation task (1-5): ');
    await routeSelection(choice.trim());
};

async function routeSelection(choice) {
    switch (choice) {
        case '1':
            console.log('\n--- Record New Booking ---');
            const name = await askQuestion('Enter Lead Tramper Name: ');
            const hutId = await askQuestion('Enter target Hut ID slug (e.g. mintaro): ');
            const arrivalDate = await askQuestion('Enter Arrival Calendar Date (YYYY-MM-DD): ');
            const nightsInput = await askQuestion('Enter Total Duration of Stay (Nights count): ');
            const partySizeInput = await askQuestion('Enter Total Party Headcount Size: ');

            const check = validateBookingInput({ name, hutId, arrivalDate, nightsInput, partySizeInput });
            
            if (!check.isValid) {
                console.log(`\n[TRANSACTION BLOCKED]\n${check.message}`);
            } else {
                const result = await createBooking(check.sanitized);
                if (result.success) {
                    console.log(`\n[SUCCESS] Bunks secured! Booking ID assigned: ${result.id}`);
                } else {
                    console.log(`\n[CAPACITY REJECTED] ${result.message}`);
                }
            }
            break;
        case '2':
            // Displays remainders for a hut & date
        case '3':
            // Handles execution calls for cancellations
        case '4':
            // Outputs occupancy summary analytics reports
        case '5':
            console.log('\nClosing terminal streams. Secure shutdown routine completed.');
            rl.close();
            process.exit(0);
        default:
            console.log('\n[INVALID SELECTION] Input a whole integer option between 1 and 5.');
            break;
    }
    await displayMainMenu();
}

(async () => {
    await initializeDatabase();
    await displayMainMenu();
})();