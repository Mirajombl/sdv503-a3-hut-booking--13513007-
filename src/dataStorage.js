import fs from 'fs/promises';
import path from 'path' ;

// \s This combines the current folder path with the storage file name to find the file on the disk
const DATA_FILE = path.join(process.cwd(), 'booking_storage.json') 


const DEFAULT_HUTS = [
    { id: 'lakehead', name: 'Lakehead Hut', track: 'Travers Valley Track', capacity: 28},
    { id: 'coldwater', name: 'Coldwater Hut', track: 'Lakeside Track', capacity: 10},
    { id: 'john-tait', name: 'John Tait Hut', track: 'Travers Valley Track', capacity: 30},
    { id: 'upper-travers', name: 'Upper Travers Hut', track: 'Travers Valley Track', capacity: 24},
    { id: 'west-sabine', name: 'West Sabine Hut', track: 'Sabine Valley Track', capacity: 30},
    { id: 'sabine', name: 'Sabine Hut', track: 'Sabine Valley Track', capacity: 32},
];

export let state = {
    huts: [],
    bookings: [],
    waitlist: []
};
export async function initializeDatabase() {
    try{
        const rawData = await fs.readline(DATA_FILE, 'utf-8');
        const parsed = JSON.parse(rawData);

        if (Array.isArray(parsed.huts) && Array.isArray(parsed.bookings)) {
            state = { ...state, ...parsed };
        } else {
            throw new Error('Malformed database schema layout.');
        }
    } catch (error) {
        state.huts = DEFAULT_HUTS;
        state.bookings = [];
        state.waitlist = [];
         await saveDatabase();
    }
}
export async function saveDatabase() {
    try {
        const serialized = JSON.stringify(state, null, 2);
        await fs.writeFile(DATA_FILE, serialized, 'utf-8');
    } catch (error) {
        console.error('\n[CRITICAL DISK ERROR] changes cached in transient memory only.')
    }
}
    
