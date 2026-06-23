import readline from 'node:readline';
import { initializeDatabase, state } from './dataStorage.js';
import { validateBookingInput } from './validation.js';
import { createBooking, cancelBooking, getOccupancySummary, getRemainingCapacity } from './bookingEngine.js';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const askQuestion = (query) => new Promise((resolve) => rl.question(query, resolve));

async function displayMainMenu() {
    console.log('\n======================================================================');
    console.log('              DEPARTMENT OF CONSERVATION HUT MANAGER CLI   ');
    console.log('======================================================================');
    
    console.log('ACTIVE DOC PROPERTY DIRECTORY:');
    console.log('ID           | Hut Name          | Track Location       | Bunks');
    console.log('======================================================================');
    
    state.huts.forEach(hut => {
        const idCol = (hut.id || '').padEnd(13);
        const nameCol = (hut.name || '').padEnd(17);
        const trackCol = (hut.track || '').padEnd(20);
        const bunkCol = String(hut.capacity || '').padEnd(5);
        
        console.log(`${idCol} | ${nameCol} | ${trackCol} | ${bunkCol}`);
    });
    
    console.log('======================================================================');
    
    console.log('1. Record New Booking');
    console.log('2. View Bunk Allocation');
    console.log('3. Cancel Existing Booking');
    console.log('4. Print Occupancy Analytics Report');
    console.log('5. Exit Application');
    
    const choice = await askQuestion('\nSelect operation task (1-5): ');
    await routeSelection(choice.trim());
}

async function routeSelection(choice) {
    switch (choice) {
        case '1':
            console.log('\n--- Record New Booking ---');
            const nameInput = await askQuestion('Enter Lead Tramper Name: ');
            const hutIdInput = await askQuestion('Enter target Hut ID: ');
            const arrivalDateInput = await askQuestion('Enter Arrival Calendar Date (YYYY-MM-DD): ');
            const nightsInput = await askQuestion('Enter Total Duration of Stay (Nights count): ');
            const partySizeInput = await askQuestion('Enter Total Party Headcount: ');

            // Force convert everything into flat, raw string before sending
            const cleanName = String(nameInput || '');
            const cleanHutId = String(hutIdInput || '');
            const cleanArrival = String(arrivalDateInput || '');
            const cleanNights = String(nightsInput || '');
            const cleanParty = String(partySizeInput || '');

            // Step 1: Run input data validation checks by passing flat strings directly
            const check = validateBookingInput(cleanName, cleanHutId, cleanArrival, cleanNights, cleanParty);
            
            if (!check.isValid) {
                console.log(`\n[TRANSACTION BLOCKED]\n${check.message}`);
            } else {
                // Step 2: If inputs are safe, hand the clean dataset over to the capacity checker engine
                const result = await createBooking(check.sanitized);
                if (result.success) {
                    console.log(`\n[SUCCESS] Bunks secured! Booking ID assigned: ${result.id}`);
                } else {
                    console.log(`\n[CAPACITY REJECTED] ${result.message}`);
                }
            }
            break;

        case '2':
            console.log('\n--- View Bunk Allocation ---');
            const targetHut = await askQuestion('Enter Target Hut ID: ');
            const targetDate = await askQuestion('Enter Evaluation Date (YYYY-MM-DD): ');
            
            const capacityLeft = getRemainingCapacity(targetHut.trim().toLowerCase(), targetDate.trim());
            console.log(`\nRemaining Room: ${capacityLeft} operational bunks left on that date.`);
            break;

        case '3':
            console.log('\n--- Cancel Existing Booking ---');
            const idToCancel = await askQuestion('Enter active Booking ID string to drop: ');
            const cancelRes = await cancelBooking(idToCancel);
            
            if (cancelRes.success) {
                console.log('\n[SUCCESS] Target booking dropped. Bunks returned back to open pool.');
            } else {
                console.log(`\n[CANCELLATION FAILED] ${cancelRes.message}`);
            }
            break;

        case '4':
            console.log('\n--- Core Occupancy Analytics Report ---');
            const summaries = getOccupancySummary();
            summaries.forEach(s => {
                console.log(`\nProperty identity: ${s.name}`);
                console.log(`  - Active Registered Reservation Groups: ${s.totalBookings}`);
                console.log(`  - Days Exceeding 80% Operational Load Limit: ${s.peakNightsCount}`);
            });
            break;

        case '5': 
            console.log('\nClosing terminal streams. Secure shutdown routine completed.');
            rl.close();
            process.exit(0);
            break;

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