# Acceptance criteria — Assignment #05

The behavior below must remain true in the final repository.

- **AC1 — Time validation.** `checkAvailability` rejects fractional times, invalid day boundaries, start >= end, start <= now, and invalid simulated current time. The interval must stay within one day.
- **AC2 — Duration.** A request lasting exactly 120 minutes can pass; a request lasting 121 minutes is rejected.
- **AC3 — Room status.** A blocked room is never available, even with an otherwise free interval.
- **AC4 — Overlap and immutability.** Conflicting bookings are rejected, touching endpoints are allowed, and original input booking data/order is unchanged.
- **AC5 — UI result freshness.** A previously displayed availability result is not presented as current after changing room, start, end or simulated current time; a fresh check is required.

This project is a fictional checker only, not a booking creation service.
