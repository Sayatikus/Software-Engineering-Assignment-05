import { test } from 'node:test';
import assert from 'node:assert/strict';
import { checkAvailability } from '../baseline_snapshot/src/lib/checkAvailability.ts';

const room = { id: 'demo', name: 'Demo', building: 'Fictional', capacity: 10, blocked: false, bookings: [] };

test('R02 current time must be a valid integer minute', () => {
  const result = checkAvailability({room, start: 660, end: 720, now: Number.NaN});
  assert.equal(result.available, false, 'Invalid current time must not produce Available');
});
