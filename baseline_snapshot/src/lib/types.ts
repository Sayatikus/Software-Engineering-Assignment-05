export interface Booking {
  id: string;
  start: number; // minutes from 00:00, 0..1440
  end: number; // minutes from 00:00, 0..1440
  bookedBy: string;
  purpose: string;
}

export interface Room {
  id: string;
  name: string;
  building: string;
  capacity: number;
  blocked: boolean;
  blockedReason?: string;
  bookings: Booking[];
}

export interface CheckResult {
  available: boolean;
  reasons: string[];
}

export interface AvailabilityRequest {
  room: Room;
  start: number;
  end: number;
  now: number; // simulated current time in minutes
}
