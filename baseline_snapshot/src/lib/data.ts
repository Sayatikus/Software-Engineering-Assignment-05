import type { Room } from './types';

export const rooms: Room[] = [
  {
    id: 'r1',
    name: 'Athena 101',
    building: 'Athena Hall',
    capacity: 30,
    blocked: false,
    bookings: [
      { id: 'b1', start: 540, end: 600, bookedBy: 'M. Chen', purpose: 'Calculus II' },
      { id: 'b2', start: 720, end: 780, bookedBy: 'J. Patel', purpose: 'Study Group' },
      { id: 'b3', start: 900, end: 960, bookedBy: 'K. Reyes', purpose: 'Faculty Review' },
    ],
  },
  {
    id: 'r2',
    name: 'Curie 204',
    building: 'Curie Wing',
    capacity: 18,
    blocked: false,
    bookings: [
      { id: 'b4', start: 600, end: 660, bookedBy: 'A. Novak', purpose: 'Lab Recap' },
      { id: 'b5', start: 840, end: 900, bookedBy: 'S. Lin', purpose: 'Office Hours' },
    ],
  },
  {
    id: 'r3',
    name: 'Turing 310',
    building: 'Turing Center',
    capacity: 40,
    blocked: true,
    blockedReason: 'Under maintenance until 6:00 PM',
    bookings: [],
  },
];
