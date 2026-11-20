import type { AvailabilityRequest, CheckResult } from './types';

const MINUTES_PER_DAY = 1440;
const MAX_DURATION = 120;

export function checkAvailability(req: AvailabilityRequest): CheckResult {
  const { room, start, end, now } = req;
  const reasons: string[] = [];

  if (!Number.isInteger(start) || !Number.isInteger(end)) {
    reasons.push('Start and end times must be in whole minutes.');
  }

  if (!Number.isInteger(now) || now < 0 || now >= MINUTES_PER_DAY) {
    reasons.push('Current time must be a whole minute between 00:00 and 23:59.');
  }

  if (!(0 <= start && start < end && end <= MINUTES_PER_DAY)) {
    reasons.push(
      `Times must satisfy 0 <= start < end <= ${MINUTES_PER_DAY} (a full day is 1440 minutes).`
    );
  }

  if (Number.isInteger(start) && Number.isInteger(end) && start < end) {
    if (start <= now) {
      reasons.push(
        `Start time must be strictly later than the current time (${fmt(now)}).`
      );
    }
    const duration = end - start;
    if (duration > MAX_DURATION) {
      reasons.push(
        `Duration is ${duration} minutes; the maximum allowed is ${MAX_DURATION} minutes.`
      );
    }
  }

  if (room.blocked) {
    reasons.push(
      `Room ${room.name} is blocked${room.blockedReason ? ` (${room.blockedReason})` : ''}.`
    );
  }

  if (!room.blocked) {
    const overlap = room.bookings.find((b) => start < b.end && b.start < end);
    if (overlap) {
      reasons.push(
        `Overlaps an existing booking: ${fmt(overlap.start)}–${fmt(overlap.end)} (${overlap.purpose}). Touching endpoints are allowed.`
      );
    }
  }

  return { available: reasons.length === 0, reasons };
}

function fmt(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}
