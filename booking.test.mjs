import { test } from 'node:test';
import assert from 'node:assert/strict';
import { checkAvailability } from './src/lib/checkAvailability.ts';

function freshRoom(bookings = [{ id: 'b1', start: 600, end: 660, bookedBy: 'Sample', purpose: 'Class' }], blocked = false) {
  return { id: 'test-room', name: 'Sample Room', building: 'Demo', capacity: 20, blocked,
    bookings: structuredClone(bookings) };
}

function evaluate(req, expected, testId) {
  const result = checkAvailability(req);
  assert.equal(result.available, expected, `${testId}: expected ${expected}, got ${JSON.stringify(result)}`);
  assert.ok(Array.isArray(result.reasons), `${testId}: result reasons must be an array`);
  if (expected) assert.equal(result.reasons.length, 0, `${testId}: available result cannot list failures`);
  else assert.ok(result.reasons.length > 0, `${testId}: rejection requires an explanation`);
  return result;
}

test('T01 AC4: Touching after existing booking', () => {
  const room = freshRoom(undefined, false);
  const req = { start: 660, end: 720, now: 540, room };
  evaluate(req, true, 'T01');
});

test('T02 AC1: Starts at current time', () => {
  const room = freshRoom(undefined, false);
  const req = { start: 540, end: 570, now: 540, room };
  evaluate(req, false, 'T02');
});

test('T03 AC1: Zero duration', () => {
  const room = freshRoom(undefined, false);
  const req = { start: 720, end: 720, now: 540, room };
  evaluate(req, false, 'T03');
});

test('T04 AC1: Reversed time interval', () => {
  const room = freshRoom(undefined, false);
  const req = { start: 750, end: 720, now: 540, room };
  evaluate(req, false, 'T04');
});

test('T05 AC1: End exceeds the day', () => {
  const room = freshRoom(undefined, false);
  const req = { start: 1380, end: 1441, now: 540, room };
  evaluate(req, false, 'T05');
});

test('T06 AC2: Exactly 120 minutes', () => {
  const room = freshRoom(undefined, false);
  const req = { start: 720, end: 840, now: 540, room };
  evaluate(req, true, 'T06');
});

test('T07 AC2: 121 minutes', () => {
  const room = freshRoom(undefined, false);
  const req = { start: 720, end: 841, now: 540, room };
  evaluate(req, false, 'T07');
});

test('T08 AC4: Touching before existing booking', () => {
  const room = freshRoom(undefined, false);
  const req = { start: 570, end: 600, now: 540, room };
  evaluate(req, true, 'T08');
});

test('T09 AC4: Partial overlap', () => {
  const room = freshRoom(undefined, false);
  const req = { start: 630, end: 690, now: 540, room };
  evaluate(req, false, 'T09');
});

test('T10 AC4: Candidate contains existing booking', () => {
  const room = freshRoom(undefined, false);
  const req = { start: 570, end: 690, now: 540, room };
  evaluate(req, false, 'T10');
});

test('T11 AC4: Candidate inside existing booking', () => {
  const room = freshRoom(undefined, false);
  const req = { start: 615, end: 645, now: 540, room };
  evaluate(req, false, 'T11');
});

test('T12 AC4: Identical interval', () => {
  const room = freshRoom(undefined, false);
  const req = { start: 600, end: 660, now: 540, room };
  evaluate(req, false, 'T12');
});

test('T13 AC3: Blocked room', () => {
  const room = freshRoom(undefined, true);
  const req = { start: 660, end: 720, now: 540, room };
  evaluate(req, false, 'T13');
});

test('T14 AC4: No bookings', () => {
  const room = freshRoom([], false);
  const req = { start: 630, end: 690, now: 540, room };
  evaluate(req, true, 'T14');
});

test('T15 AC5: request does not mutate bookings or any input data', () => {
  const room = freshRoom();
  const req = { start: 660, end: 720, now: 540, room };
  const before = structuredClone(req);
  evaluate(req, true, 'T15 first call');
  evaluate(req, true, 'T15 second call');
  assert.deepEqual(req, before, 'Original request and bookings must remain unchanged');
});

test('T16 AC4: Overlap with second of several bookings', () => {
  const room = freshRoom([{"id": "b1", "start": 600, "end": 660, "bookedBy": "Sample", "purpose": "Class"}, {"id": "b2", "start": 900, "end": 960, "bookedBy": "Sample", "purpose": "Class"}], false);
  const req = { start: 930, end: 990, now: 540, room };
  evaluate(req, false, 'T16');
});

test('T17 AC1: Fractional minute must be rejected', () => {
  const room = freshRoom(undefined, false);
  const req = { start: 660.5, end: 720, now: 540, room };
  evaluate(req, false, 'T17');
});

test('T18 AC1: Day end exactly at 1440 allowed', () => {
  const room = freshRoom(undefined, false);
  const req = { start: 1380, end: 1440, now: 540, room };
  evaluate(req, true, 'T18');
});



test('T19 AC5: bookings keep original order after a check', () => {
  const bookings = [
    { id: 'later', start: 900, end: 960, bookedBy: 'Sample', purpose: 'Study' },
    { id: 'earlier', start: 600, end: 660, bookedBy: 'Sample', purpose: 'Class' },
  ];
  const room = freshRoom(bookings, false);
  const before = structuredClone(room.bookings);
  const req = { start: 660, end: 720, now: 540, room };
  evaluate(req, true, 'T19');
  assert.deepEqual(room.bookings, before, 'The original bookings order and data must not change');
});
