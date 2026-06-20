import fs from 'fs/prmoises' ; 
import path from 'path' ;

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