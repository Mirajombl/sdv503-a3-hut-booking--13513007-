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
    console.log('2. View Bunk Allocation Matrix');
    console.log('3. Cancel Existing Booking');
    console.log('4. Print Core Occupancy Analytics Report');
    console.log('5. Exit Application');

    const choice = await askQuestion('\nSelect operation task (1-5): ');
    await routeSelection(choice.trim());
};

