import { useEffect, useState } from 'react';
import { explainAvailability } from '../lib/explainAvailability';
import type { ExplainOutput } from '../lib/explainAvailability';
import type { CheckResult } from '../lib/types';

interface Props {
  roomLabel: string;
  start: number;
  end: number;
  result: CheckResult;
}

export function ExplanationPanel({ roomLabel, start, end, result }: Props) {
  const [text, setText] = useState<ExplainOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [run, setRun] = useState(0);

  // When the checked request changes or the panel unmounts, ignore pending responses.
  useEffect(() => {
    if (run === 0) return;
    let active = true;
    setLoading(true);
    setText(null);
    void explainAvailability({ roomLabel, start, end, result }).then(value => {
      if (!active) return;
      setText(value);
      setLoading(false);
    });
    return () => { active = false; };
  }, [run, roomLabel, start, end, result]);

  return (
    <section className="rounded-lg border border-sky-200 bg-white p-3 text-slate-800" aria-label="Optional availability explanation">
      <button type="button" onClick={() => setRun(n => n + 1)}
        disabled={loading}
        className="rounded bg-sky-600 px-3 py-2 text-sm font-semibold text-white disabled:opacity-60">
        {loading ? 'Preparing explanation…' : 'Explain availability (mock AI)'}
      </button>
      {text && (
        <div className="mt-2" role="status" aria-live="polite">
          <p className="text-xs font-semibold text-slate-500">
            {text.source === 'mock' ? 'Mock AI explanation — not the booking decision' : 'Safe fallback — not AI-generated'}
          </p>
          <p className="mt-1 text-sm">{text.explanation}</p>
        </div>
      )}
      <p className="mt-2 text-xs text-slate-500">
        The confirmed availability status above comes only from the booking rules.
        No API key, external service, or booking change is involved.
      </p>
    </section>
  );
}
