import { test } from 'node:test';
import assert from 'node:assert/strict';
import { checkAvailability } from './src/lib/checkAvailability.ts';
import { explainAvailability, mockLLMResponse, MOCK_SYSTEM_INSTRUCTION } from './src/lib/explainAvailability.ts';

const room = { id: 'demo', name: 'Athena 101', building: 'Demo', capacity: 30,
  blocked: false, bookings: [{ id: 'b1', start: 600, end: 660, bookedBy: 'Demo', purpose: 'Class' }] };
const blocked = { ...room, blocked: true, blockedReason: 'Maintenance', bookings: [] };
const check = (target, start, end, now = 540) => checkAvailability({ room: target, start, end, now });
const explain = async (result, roomLabel = 'Athena 101', start = 660, end = 720, producer) =>
  explainAvailability({ roomLabel, start, end, result }, producer);

test('P11-T01 available: mock agrees with checker', async () => {
  const result = check(room, 660, 720);
  assert.equal(result.available, true);
  const output = await explain(result);
  assert.equal(output.source, 'mock');
  assert.match(output.explanation, /^Available:/);
});
test('P11-T02 overlapping booking: unavailable', async () => {
  const result = check(room, 630, 690);
  const out = await explain(result, 'Athena 101', 630, 690);
  assert.equal(result.available, false);
  assert.match(out.explanation, /^Unavailable:.*overlaps/);
});
test('P11-T03 blocked room: unavailable', async () => {
  const result = check(blocked, 660, 720);
  const out = await explain(result);
  assert.match(out.explanation, /blocked/);
  assert.equal(out.source, 'mock');
});
test('P11-T04 invalid interval: checker rejects, explanation safely falls back', async () => {
  const result = check(room, 720, 700);
  assert.equal(result.available, false);
  const out = await explain(result, 'Athena 101', 720, 700);
  assert.equal(out.source, 'fallback');
  assert.match(out.explanation, /Unavailable/);
});
test('P11-T05 past time: deterministic status unchanged', async () => {
  const result = check(room, 480, 540, 540);
  const out = await explain(result, 'Athena 101', 480, 540);
  assert.equal(result.available, false);
  assert.match(out.explanation, /not later/);
});
test('P11-T06 empty room label: fallback', async () => {
  const out = await explain(check(room, 660, 720), '');
  assert.equal(out.source, 'fallback');
});
test('P11-T07 overly long room label: fallback', async () => {
  const out = await explain(check(room, 660, 720), 'A'.repeat(81));
  assert.equal(out.source, 'fallback');
});
test('P11-T08 API error: no status mutation', async () => {
  const result = check(room, 660, 720);
  const out = await explain(result, 'Athena 101', 660, 720, async () => { throw new Error('Mock provider down'); });
  assert.equal(out.source, 'fallback');
  assert.equal(result.available, true);
});
test('P11-T09 provider timeout: safe fallback', async () => {
  const result = check(room, 660, 720);
  const out = await explainAvailability({ roomLabel: 'Athena 101', start: 660, end: 720, result },
    async () => new Promise(() => {}), 5);
  assert.equal(out.source, 'fallback');
});
test('P11-T10 hallucinated contradictory output rejected', async () => {
  const result = check(room, 630, 690);
  const out = await explain(result, 'Athena 101', 630, 690, async () => ({ explanation: 'Available: any room can be booked.' }));
  assert.equal(out.source, 'fallback');
  assert.equal(result.available, false);
});
test('P11-T11 malformed provider output rejected', async () => {
  const out = await explain(check(room, 660, 720), 'Athena 101', 660, 720, async () => ({ answer: 123 }));
  assert.equal(out.source, 'fallback');
});
test('P11-T12 mock does not mutate booking records', async () => {
  const source = JSON.stringify(room);
  const result = check(room, 660, 720);
  await explain(result);
  assert.equal(JSON.stringify(room), source);
});
test('P11-T13 prompt guard: no invented facts / status changes', () => {
  assert.match(MOCK_SYSTEM_INSTRUCTION, /Never change availability/);
  assert.match(MOCK_SYSTEM_INSTRUCTION, /Never.*invent bookings/);
});
test('P11-T14 structured mock output is a string', () => {
  const raw = mockLLMResponse({ roomLabel: 'Athena 101', start: 660, end: 720, result: check(room, 660, 720) });
  assert.equal(typeof raw.explanation, 'string');
  assert.ok(raw.explanation.length <= 240);
});
