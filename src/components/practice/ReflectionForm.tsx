import { useState } from 'react';
import { buildReflectionMessages } from '../../ai/prompts';
import { cognitiveFunctions, type CognitiveFunctionId } from '../../content/rmt';
import { FeedbackButton } from '../ai/FeedbackButton';
import { Button } from '../ui/Button';

export interface ReflectionData {
  effort: number;
  text: string;
  functionsUsed: CognitiveFunctionId[];
}

interface ReflectionFormProps {
  topicTitle: string;
  summary: string[];
  /** Fungsi kognitif yang dilatih di topik ini (pilihan jurnal RMT). */
  functionOptions: CognitiveFunctionId[];
  onSubmit: (data: ReflectionData) => void;
  onSkip: () => void;
}

/**
 * Refleksi = jurnal RMT: fungsi kognitif yang dipakai, "jelaskan dengan kata-katamu",
 * dan skala usaha mental Paas 1–9 (F14). Mediator AI boleh menanggapi.
 */
export function ReflectionForm({ topicTitle, summary, functionOptions, onSubmit, onSkip }: ReflectionFormProps) {
  const [effort, setEffort] = useState<number | null>(null);
  const [text, setText] = useState('');
  const [used, setUsed] = useState<CognitiveFunctionId[]>([]);

  const toggle = (id: CognitiveFunctionId) =>
    setUsed((u) => (u.includes(id) ? u.filter((x) => x !== id) : [...u, id]));

  return (
    <div className="space-y-5">
      <p className="text-sm font-bold uppercase tracking-wide text-brand">📓 Jurnal berpikir</p>

      <div>
        <p className="text-lg font-bold">Fungsi kognitif apa yang kamu pakai tadi?</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {functionOptions.map((id) => (
            <button
              key={id}
              type="button"
              aria-pressed={used.includes(id)}
              onClick={() => toggle(id)}
              className={`min-h-touch rounded-full border-2 px-3 text-sm font-bold ${
                used.includes(id) ? 'border-brand bg-brand text-white' : 'border-line bg-surface text-ink'
              }`}
            >
              {used.includes(id) ? '✓ ' : ''}
              {cognitiveFunctions[id].name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-lg font-bold">Seberapa berat usaha berpikirmu di topik ini?</p>
        <div className="mt-3 grid grid-cols-9 gap-1" role="radiogroup" aria-label="Skala usaha 1 sampai 9">
          {Array.from({ length: 9 }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={effort === n}
              onClick={() => setEffort(n)}
              className={`min-h-touch rounded-lg border-2 font-bold ${
                effort === n ? 'border-brand bg-brand text-white' : 'border-line bg-surface'
              }`}
            >
              {n}
            </button>
          ))}
        </div>
        <div className="mt-1 flex justify-between text-xs text-muted">
          <span>1 = sangat ringan</span>
          <span>9 = sangat berat</span>
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="refleksi" className="text-lg font-bold">
          Jelaskan dengan kata-katamu: apa yang kamu pelajari?
        </label>
        <textarea
          id="refleksi"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={3}
          maxLength={500}
          placeholder="Boleh singkat saja."
          className="w-full rounded-xl border-2 border-line bg-surface p-3 focus:border-brand focus:outline-none"
        />
        <FeedbackButton
          disabled={text.trim().length < 10}
          build={() =>
            buildReflectionMessages({ topicTitle, summary, functionsUsed: used, effort, text: text.trim() })
          }
        />
      </div>

      <div className="flex gap-2">
        <Button variant="ghost" onClick={onSkip}>
          Lewati
        </Button>
        <Button
          className="flex-1"
          disabled={effort === null}
          onClick={() => onSubmit({ effort: effort!, text: text.trim(), functionsUsed: used })}
        >
          Simpan & Selesai
        </Button>
      </div>
    </div>
  );
}
