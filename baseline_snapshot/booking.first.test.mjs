import { test } from 'node:test';
import assert from 'node:assert/strict';
import { checkAvailability } from './src/lib/checkAvailability.ts';

function freshRoom(bookings = [{ id: 'b1', start: 600, end: 660, bookedBy: 'Sample', purpose: 'Class' }], blocked = false) {
  return { id: 'test-room', name: 'Sample Room', building: 'Demo', capacity: 20, blocked,
    bookings: structuredClone(bookings) };
}

test('T01 AC4: Touching after existing booking', () => {
  const room = freshRoom(undefined, false);
  const req = { start: 660, end: 720, now: 540, room };
  assert.equal(checkAvailability(req).available, true);
});

test('T02 AC1: Starts at current time', () => {
  const room = freshRoom(undefined, false);
  const req = { start: 540, end: 570, now: 540, room };
  assert.equal(checkAvailability(req).available, false);
});

test('T03 AC1: Zero duration', () => {
  const room = freshRoom(undefined, false);
  const req = { start: 720, end: 720, now: 540, room };
  assert.equal(checkAvailability(req).available, false);
});

test('T04 AC1: Reversed time interval', () => {
  const room = freshRoom(undefined, false);
  const req = { start: 750, end: 720, now: 540, room };
  assert.equal(checkAvailability(req).available, false);
});

test('T05 AC1: End exceeds the day', () => {
  const room = freshRoom(undefined, false);
  const req = { start: 1380, end: 1441, now: 540, room };
  assert.equal(checkAvailability(req).available, false);
});

test('T06 AC2: Exactly 120 minutes', () => {
  const room = freshRoom(undefined, false);
  const req = { start: 720, end: 840, now: 540, room };
  assert.equal(checkAvailability(req).available, true);
});

test('T07 AC2: 121 minutes', () => {
  const room = freshRoom(undefined, false);
  const req = { start: 720, end: 841, now: 540, room };
  assert.equal(checkAvailability(req).available, false);
});

test('T08 AC4: Touching before existing booking', () => {
  const room = freshRoom(undefined, false);
  const req = { start: 570, end: 600, now: 540, room };
  assert.equal(checkAvailability(req).available, true);
});

test('T09 AC4: Partial overlap', () => {
  const room = freshRoom(undefined, false);
  const req = { start: 630, end: 690, now: 540, room };
  assert.equal(checkAvailability(req).available, false);
});

test('T10 AC4: Candidate contains existing booking', () => {
  const room = freshRoom(undefined, false);
  const req = { start: 570, end: 690, now: 540, room };
  assert.equal(checkAvailability(req).available, false);
});

test('T11 AC4: Candidate inside existing booking', () => {
  const room = freshRoom(undefined, false);
  const req = { start: 615, end: 645, now: 540, room };
  assert.equal(checkAvailability(req).available, false);
});

test('T12 AC4: Identical interval', () => {
  const room = freshRoom(undefined, false);
  const req = { start: 600, end: 660, now: 540, room };
  assert.equal(checkAvailability(req).available, false);
});

test('T13 AC3: Blocked room', () => {
  const room = freshRoom(undefined, true);
  const req = { start: 660, end: 720, now: 540, room };
  assert.equal(checkAvailability(req).available, false);
});

test('T14 AC4: No bookings', () => {
  const room = freshRoom([], false);
  const req = { start: 630, end: 690, now: 540, room };
  assert.equal(checkAvailability(req).available, true);
});

