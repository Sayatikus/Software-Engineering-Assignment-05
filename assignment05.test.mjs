import { test } from 'node:test';
import assert from 'node:assert/strict';
import { checkAvailability } from './src/lib/checkAvailability.ts';
import { isResultCurrent } from './src/lib/resultFreshness.ts';
import { timeToMinutes } from './src/lib/time.ts';

function room() {
  return { id: 'demo', name: 'Demo room', capacity: 12, blocked: false,
    building: 'Fictional', bookings: [{id:'b1', start:600, end:660, bookedBy:'Demo', purpose:'Class'}] };
}

test('A5-01: rejects NaN clock', () => {
  assert.equal(checkAvailability({ room:room(), start:660, end:720, now:NaN }).available, false);
});
test('A5-02: rejects negative clock', () => {
  assert.equal(checkAvailability({ room:room(), start:660, end:720, now:-1 }).available, false);
});
test('A5-03: rejects fractional clock', () => {
  assert.equal(checkAvailability({ room:room(), start:660, end:720, now:540.5 }).available, false);
});
test('A5-04: rejects clock at or beyond day end', () => {
  assert.equal(checkAvailability({ room:room(), start:660, end:720, now:1440 }).available, false);
});
test('A5-05: accepts valid 10:00 clock and touching boundary', () => {
  assert.equal(checkAvailability({ room:room(), start:660, end:720, now:600 }).available, true);
});
test('A5-06: invalid current-time text does not silently become 10:00', () => {
  assert.equal(timeToMinutes(''), null);
  assert.equal(timeToMinutes('bad'), null);
});
test('A5-07: checked status hides after start-time change', () => {
  const checked = {roomId:'demo',startTime:'11:00',endTime:'12:00',nowTime:'10:00'};
  assert.equal(isResultCurrent(checked,{...checked,startTime:'11:30'}),false);
});
test('A5-08: checked status hides after end-time change', () => {
  const checked = {roomId:'demo',startTime:'11:00',endTime:'12:00',nowTime:'10:00'};
  assert.equal(isResultCurrent(checked,{...checked,endTime:'12:30'}),false);
});
test('A5-09: checked status hides after room change', () => {
  const checked = {roomId:'demo',startTime:'11:00',endTime:'12:00',nowTime:'10:00'};
  assert.equal(isResultCurrent(checked,{...checked,roomId:'other'}),false);
});
test('A5-10: checked status hides after current-time change', () => {
  const checked = {roomId:'demo',startTime:'11:00',endTime:'12:00',nowTime:'10:00'};
  assert.equal(isResultCurrent(checked,{...checked,nowTime:'10:15'}),false);
});
test('A5-11: unchanged selection preserves checked status', () => {
  const checked = {roomId:'demo',startTime:'11:00',endTime:'12:00',nowTime:'10:00'};
  assert.equal(isResultCurrent(checked,{...checked}),true);
});
