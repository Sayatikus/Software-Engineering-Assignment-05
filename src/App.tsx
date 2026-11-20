import { useMemo, useState } from 'react';
import {
  Clock,
  DoorClosed,
  CalendarCheck,
  CalendarX,
  CheckCircle2,
  AlertTriangle,
  Building2,
  Users,
  Timer,
  Info,
} from 'lucide-react';
import { rooms } from '@/lib/data';
import { checkAvailability } from '@/lib/checkAvailability';
import { isResultCurrent } from '@/lib/resultFreshness';
import { ExplanationPanel } from './components/ExplanationPanel';
import type { SelectionSnapshot } from '@/lib/resultFreshness';
import { minutesToTime, timeToMinutes } from '@/lib/time';
import type { CheckResult } from '@/lib/types';

const MAX_DURATION = 120;

interface ResultView {
  start: number;
  end: number;
  duration: number;
  result: CheckResult;
  selection: SelectionSnapshot;
}

function App() {
  const [roomId, setRoomId] = useState(rooms[0].id);
  const [startTime, setStartTime] = useState('11:00');
  const [endTime, setEndTime] = useState('12:00');
  const [nowTime, setNowTime] = useState('10:00');
  const [resultView, setResultView] = useState<ResultView | null>(null);
  const [checkNumber, setCheckNumber] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const room = useMemo(
    () => rooms.find((r) => r.id === roomId) ?? rooms[0],
    [roomId]
  );

  const nowMinutes = useMemo(() => {
    return timeToMinutes(nowTime);
  }, [nowTime]);

  // Live duration preview (null when inputs are invalid/unordered)
  const liveDuration = useMemo(() => {
    const s = timeToMinutes(startTime);
    const e = timeToMinutes(endTime);
    if (s === null || e === null) return null;
    if (e <= s) return null;
    return e - s;
  }, [startTime, endTime]);

  function handleCheck() {
    const start = timeToMinutes(startTime);
    const end = timeToMinutes(endTime);

    if (start === null || end === null || nowMinutes === null) {
      setResultView(null);
      setError('Please enter valid start, end and current times in HH:MM format (00:00–23:59).');
      return;
    }
    setError(null);
    setCheckNumber(n => n + 1);
    const result = checkAvailability({ room, start, end, now: nowMinutes });
    setResultView({
      start,
      end,
      duration: end - start,
      result,
      selection: { roomId, startTime, endTime, nowTime },
    });
  }

  function handleReset() {
    setStartTime('11:00');
    setEndTime('12:00');
    setNowTime('10:00');
    setResultView(null);
    setError(null);
  }

  const durationOverLimit = liveDuration !== null && liveDuration > MAX_DURATION;
  const showCheckedResult = resultView !== null && isResultCurrent(
    resultView.selection,
    { roomId, startTime, endTime, nowTime }
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto w-full max-w-5xl px-3 py-6 sm:px-4 sm:py-12">
        <header className="mb-6 sm:mb-8">
          <div className="flex items-center gap-3">
            <div className="shrink-0 rounded-xl bg-sky-600 p-2.5 text-white shadow-sm">
              <CalendarCheck size={26} />
            </div>
            <div className="min-w-0">
              <h1 className="text-xl font-bold leading-tight tracking-tight sm:text-3xl">
                Smart Campus Room Availability Checker
              </h1>
              <p className="text-sm text-slate-600 sm:text-base">
                Pick a room, choose a time window, and check whether it's free to book.
              </p>
            </div>
          </div>
        </header>

        {/* How to Use */}
        <section className="mb-6 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 sm:mb-8 sm:p-5">
          <h2 className="mb-3 flex items-center gap-2 text-base font-semibold sm:text-lg">
            <Info size={18} className="text-sky-600" /> How to use
          </h2>
          <ol className="grid gap-3 text-sm text-slate-700 sm:grid-cols-3">
            <li className="flex gap-2">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sky-100 text-xs font-bold text-sky-700">
                1
              </span>
              <span>Select a room and enter your desired start and end times.</span>
            </li>
            <li className="flex gap-2">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sky-100 text-xs font-bold text-sky-700">
                2
              </span>
              <span>
                Optionally set the simulated current time to test the "must be
                later than now" rule.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sky-100 text-xs font-bold text-sky-700">
                3
              </span>
              <span>
                Click <span className="font-medium">Check Availability</span> to see
                whether the room is free and why.
              </span>
            </li>
          </ol>
        </section>

        <div className="grid gap-4 sm:gap-6 lg:grid-cols-5">
          {/* Form */}
          <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 sm:col-span-3 sm:p-6 lg:col-span-3">
            <h2 className="mb-4 flex items-center gap-2 text-base font-semibold sm:text-lg">
              <DoorClosed size={20} className="text-sky-600" /> Booking request
            </h2>

            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Room
                </label>
                <select
                  value={roomId}
                  onChange={(e) => {
                    setRoomId(e.target.value);
                    setResultView(null);
                  }}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200"
                >
                  {rooms.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} — {r.building}
                      {r.blocked ? ' (blocked)' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Start time
                  </label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => { setStartTime(e.target.value); setResultView(null); setError(null); }}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    End time
                  </label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => { setEndTime(e.target.value); setResultView(null); setError(null); }}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200"
                  />
                </div>
              </div>

              {/* Booking duration display */}
              <div className="flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-2 text-sm ring-1 ring-slate-200">
                <Timer size={16} className="text-slate-600" />
                <span className="text-slate-700">Booking duration:</span>
                {liveDuration === null ? (
                  <span className="font-medium text-slate-500">
                    Enter a valid start and end time
                  </span>
                ) : (
                  <span
                    className={`font-semibold ${
                      durationOverLimit ? 'text-red-700' : 'text-slate-800'
                    }`}
                  >
                    {liveDuration} minute{liveDuration === 1 ? '' : 's'}
                    {durationOverLimit && ' (over the 120-minute limit)'}
                  </span>
                )}
              </div>

              <div className="rounded-lg bg-amber-50 p-3 ring-1 ring-amber-200">
                <label className="mb-1 flex items-center gap-1.5 text-sm font-medium text-amber-800">
                  <Clock size={16} /> Simulated current time (for testing)
                </label>
                <input
                  type="time"
                  value={nowTime}
                  onChange={(e) => { setNowTime(e.target.value); setResultView(null); setError(null); }}
                  className="w-full rounded-lg border border-amber-300 bg-white px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
                />
                <p className="mt-1 text-xs text-amber-700">
                  The start time must be strictly after this value.
                </p>
              </div>

              <div className="flex flex-col gap-3 pt-1 xs:flex-row">
                <button
                  onClick={handleCheck}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700 active:scale-[.98] xs:w-auto"
                >
                  <CalendarCheck size={18} /> Check Availability
                </button>
                <button
                  onClick={handleReset}
                  className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 xs:w-auto"
                >
                  Reset
                </button>
              </div>

              {error && (
                <div className="flex items-start gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-800 ring-1 ring-red-200">
                  <AlertTriangle size={18} className="mt-0.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {showCheckedResult && resultView && (
                <ResultPanel key={checkNumber} view={resultView} roomName={room.name} />
              )}
            </div>
          </section>

          {/* Room info */}
          <aside className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 sm:col-span-2 sm:p-6 lg:col-span-2">
            <h2 className="mb-4 flex items-center gap-2 text-base font-semibold sm:text-lg">
              <Building2 size={20} className="text-sky-600" /> Room details
            </h2>

            <div className="mb-4 space-y-1 text-sm">
              <p className="text-base font-semibold sm:text-lg">{room.name}</p>
              <p className="text-slate-600">{room.building}</p>
              <p className="flex items-center gap-1.5 text-slate-600">
                <Users size={15} /> Capacity: {room.capacity}
              </p>
              {room.blocked ? (
                <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-700">
                  Blocked — {room.blockedReason}
                </span>
              ) : (
                <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                  Open for booking
                </span>
              )}
            </div>

            <h3 className="mb-2 text-sm font-semibold text-slate-700">
              Existing bookings ({room.bookings.length})
            </h3>
            {room.bookings.length === 0 ? (
              <p className="text-sm text-slate-500">No existing bookings today.</p>
            ) : (
              <ul className="space-y-2">
                {room.bookings.map((b) => (
                  <li
                    key={b.id}
                    className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
                  >
                    <p className="font-medium text-slate-800">
                      {minutesToTime(b.start)} – {minutesToTime(b.end)}
                      <span className="ml-2 text-xs font-normal text-slate-500">
                        ({b.end - b.start} min)
                      </span>
                    </p>
                    <p className="text-slate-600">{b.purpose}</p>
                    <p className="text-xs text-slate-500">Booked by {b.bookedBy}</p>
                  </li>
                ))}
              </ul>
            )}
          </aside>
        </div>

        <footer className="mt-6 text-center text-xs text-slate-400 sm:mt-8">
          Fictional data for demonstration. Bookings are never modified by this tool.
        </footer>
      </div>
    </div>
  );
}

interface ResultPanelProps {
  view: ResultView;
  roomName: string;
}

function ResultPanel({ view, roomName }: ResultPanelProps) {
  const { start, end, duration, result } = view;
  const status = result.available ? 'Available' : 'Unavailable';

  return (
    <div
      className={`overflow-hidden rounded-lg ring-1 ${
        result.available
          ? 'bg-emerald-50 text-emerald-900 ring-emerald-200'
          : 'bg-red-50 text-red-900 ring-red-200'
      }`}
    >
      <div
        className={`flex items-center gap-2 px-3 py-2.5 text-sm font-semibold ${
          result.available ? 'bg-emerald-100/70' : 'bg-red-100/70'
        }`}
      >
        {result.available ? (
          <CheckCircle2 size={18} className="shrink-0" />
        ) : (
          <CalendarX size={18} className="shrink-0" />
        )}
        <span>{status}</span>
        <span className="ml-auto text-xs font-normal opacity-70">
          {roomName}
        </span>
      </div>

      <div className="space-y-3 px-3 py-3 text-sm">
        <dl className="grid grid-cols-3 gap-2 text-xs sm:text-sm">
          <div>
            <dt className="opacity-70">Requested</dt>
            <dd className="font-medium">
              {minutesToTime(start)}–{minutesToTime(end)}
            </dd>
          </div>
          <div>
            <dt className="opacity-70">Duration</dt>
            <dd className="font-medium">
              {duration < 0
                ? 'Invalid interval'
                : `${duration} min${
                    duration > MAX_DURATION ? ' (over limit)' : ''
                  }`}
            </dd>
          </div>
          <div>
            <dt className="opacity-70">Status</dt>
            <dd className="font-medium">{status}</dd>
          </div>
        </dl>

        <div className="border-t border-current/10 pt-2">
          {result.available ? (
            <p>
              This room is free for the requested window. The time is valid, within
              the 120-minute limit, later than the current time, and does not overlap
              any existing booking. Touching endpoints are allowed.
            </p>
          ) : (
            <div>
              <p className="mb-1 font-medium">Why it's unavailable:</p>
              <ul className="list-disc space-y-0.5 pl-5">
                {result.reasons.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div className="px-3 pb-3">
          <ExplanationPanel
            roomLabel={roomName}
            start={start}
            end={end}
            result={result}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
