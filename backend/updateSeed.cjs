const fs = require('fs');
const path = require('path');

const seedJsPath = path.join(__dirname, 'src', 'seed.js');
let seedJs = fs.readFileSync(seedJsPath, 'utf8');

const newOffices = [
  { name: 'Office #1', floor: '1st Floor', floorNumber: 1, room: '1', description: '9,330 Sft (Rented)', category: 'office', directions: [] },
  { name: 'Office #2', floor: '1st Floor', floorNumber: 1, room: '2', description: '5,214 Sft (Rented)', category: 'office', directions: [] },
  { name: 'Office #3', floor: '1st Floor', floorNumber: 1, room: '3', description: '5,199 Sft (Rented)', category: 'office', directions: [] },
  { name: 'Office #4', floor: '1st Floor', floorNumber: 1, room: '4', description: '8,917 Sft (Rented)', category: 'office', directions: [] },
  { name: 'Office #1', floor: '2nd Floor', floorNumber: 2, room: '1', description: '11,239 Sft (Available)', category: 'office', directions: [] },
  { name: 'Office #2', floor: '2nd Floor', floorNumber: 2, room: '2', description: '12,011 Sft (Available)', category: 'office', directions: [] },
  { name: 'Office #1', floor: '3rd Floor', floorNumber: 3, room: '1', description: '11,242 Sft (Rented)', category: 'office', directions: [] },
  { name: 'Office #2', floor: '3rd Floor', floorNumber: 3, room: '2', description: '12,006 Sft (Rented)', category: 'office', directions: [] },
  { name: 'Office #1', floor: '4th Floor', floorNumber: 4, room: '1', description: '7,340 Sft (Rented)', category: 'office', directions: [] },
  { name: 'Office #2', floor: '4th Floor', floorNumber: 4, room: '2', description: '5,237 Sft (Rented)', category: 'office', directions: [] },
  { name: 'Office #3', floor: '4th Floor', floorNumber: 4, room: '3', description: '5,230 Sft (Rented)', category: 'office', directions: [] },
  { name: 'Office #4', floor: '4th Floor', floorNumber: 4, room: '4', description: '8,541 Sft (Rented)', category: 'office', directions: [] },
  { name: 'Office #1', floor: '5th Floor', floorNumber: 5, room: '1', description: '8,730 Sft (Rented)', category: 'office', directions: [] },
  { name: 'Marketing Office', floor: '5th Floor', floorNumber: 5, room: 'Marketing', description: '8,662 Sft (Available)', category: 'department', directions: [] },
  { name: 'Cafeteria', floor: '5th Floor', floorNumber: 5, room: 'Cafeteria', description: '8,321 Sft', category: 'utility', directions: [] },
  { name: 'Office #1', floor: '6th Floor', floorNumber: 6, room: '1', description: '5,631 Sft (Rented)', category: 'office', directions: [] },
  { name: 'Office #2', floor: '6th Floor', floorNumber: 6, room: '2', description: '4,490 Sft (Available)', category: 'office', directions: [] },
  { name: 'Office #3', floor: '6th Floor', floorNumber: 6, room: '3', description: '4,477 Sft (Rented)', category: 'office', directions: [] },
  { name: 'Office #4', floor: '6th Floor', floorNumber: 6, room: '4', description: '3,995 Sft (Rented)', category: 'office', directions: [] },
  { name: 'Office #5', floor: '6th Floor', floorNumber: 6, room: '5', description: '3,128 Sft (Rented)', category: 'office', directions: [] },
  { name: 'Office #6', floor: '6th Floor', floorNumber: 6, room: '6', description: '3,268 Sft (Available)', category: 'office', directions: [] },
  { name: 'Office #1', floor: '7th Floor', floorNumber: 7, room: '1', description: '5,631 Sft (Rented)', category: 'office', directions: [] },
  { name: 'Office #2', floor: '7th Floor', floorNumber: 7, room: '2', description: '4,362 Sft (Rented)', category: 'office', directions: [] },
  { name: 'Office #3', floor: '7th Floor', floorNumber: 7, room: '3', description: '4,477 Sft (Available)', category: 'office', directions: [] },
  { name: 'Office #4', floor: '7th Floor', floorNumber: 7, room: '4', description: '3,995 Sft (Rented)', category: 'office', directions: [] },
  { name: 'Office #5', floor: '7th Floor', floorNumber: 7, room: '5', description: '3,128 Sft (Rented)', category: 'office', directions: [] },
  { name: 'Office #6', floor: '7th Floor', floorNumber: 7, room: '6', description: '3,268 Sft (Rented)', category: 'office', directions: [] },
  { name: 'Office #1', floor: '8th Floor', floorNumber: 8, room: '1', description: '5,460 Sft (Rented)', category: 'office', directions: [] },
  { name: 'Office #2', floor: '8th Floor', floorNumber: 8, room: '2', description: '4,490 Sft (Rented)', category: 'office', directions: [] },
  { name: 'Office #3', floor: '8th Floor', floorNumber: 8, room: '3', description: '4,477 Sft (Rented)', category: 'office', directions: [] },
  { name: 'Office #4', floor: '8th Floor', floorNumber: 8, room: '4', description: '3,941 Sft (Rented)', category: 'office', directions: [] },
  { name: 'Office #5', floor: '8th Floor', floorNumber: 8, room: '5', description: '3,128 Sft (Rented)', category: 'office', directions: [] },
  { name: 'Office #6', floor: '8th Floor', floorNumber: 8, room: '6', description: '3,254 Sft (Rented)', category: 'office', directions: [] },
  { name: 'Office #1', floor: '9th Floor', floorNumber: 9, room: '1', description: '7,341 Sft (Rented)', category: 'office', directions: [] },
  { name: 'Office #2', floor: '9th Floor', floorNumber: 9, room: '2', description: '5,232 Sft (Rented)', category: 'office', directions: [] },
  { name: 'Office #3', floor: '9th Floor', floorNumber: 9, room: '3', description: '5,231 Sft (Rented)', category: 'office', directions: [] },
  { name: 'Office #4', floor: '9th Floor', floorNumber: 9, room: '4', description: '8,540 Sft (Rented)', category: 'office', directions: [] },
  { name: 'Office #1', floor: '10th Floor', floorNumber: 10, room: '1', description: '7,341 Sft (Rented)', category: 'office', directions: [] },
  { name: 'Office #2', floor: '10th Floor', floorNumber: 10, room: '2', description: '5,232 Sft (Rented)', category: 'office', directions: [] },
  { name: 'Office #3', floor: '10th Floor', floorNumber: 10, room: '3', description: '5,231 Sft (Rented)', category: 'office', directions: [] },
  { name: 'Office #4', floor: '10th Floor', floorNumber: 10, room: '4', description: '8,562 Sft (Rented)', category: 'office', directions: [] },
  { name: 'Office #1', floor: '11th Floor', floorNumber: 11, room: '1', description: '7,341 Sft (Rented)', category: 'office', directions: [] },
  { name: 'Office #2', floor: '11th Floor', floorNumber: 11, room: '2', description: '5,039 Sft (Rented)', category: 'office', directions: [] },
  { name: 'Office #3', floor: '11th Floor', floorNumber: 11, room: '3', description: '5,039 Sft (Rented)', category: 'office', directions: [] },
  { name: 'Office #4', floor: '11th Floor', floorNumber: 11, room: '4', description: '8,563 Sft (Rented)', category: 'office', directions: [] },
  { name: 'Office #1 & 2', floor: '12th Floor', floorNumber: 12, room: '1-2', description: '22,252 Sft (Rented)', category: 'office', directions: [] },
  { name: 'Office #1', floor: '13th Floor', floorNumber: 13, room: '1', description: '6,666 Sft (Rented)', category: 'office', directions: [] },
  { name: 'Office #2', floor: '13th Floor', floorNumber: 13, room: '2', description: '8,129 Sft (Rented)', category: 'office', directions: [] },
  { name: 'Gymnasium', floor: 'Ground Floor', floorNumber: 0, room: 'G-02', description: 'Fitness Center for Tenants', category: 'utility', directions: [] },
  { name: 'Main Reception', floor: 'Ground Floor', floorNumber: 0, room: 'G-01', description: 'Help Desk', category: 'utility', directions: [] },
];

const officesStr = `const OFFICES = [\n  ${newOffices.map(o => JSON.stringify(o)).join(',\n  ')}\n];`;

seedJs = seedJs.replace(/const OFFICES = \[[\s\S]*?\];/, officesStr);
fs.writeFileSync(seedJsPath, seedJs);

console.log('Successfully updated OFFICES array in seed.js');
