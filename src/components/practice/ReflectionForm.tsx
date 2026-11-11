import { useState } from 'react';
import { Button } from '../ui/Button';

interface ReflectionFormProps {
  onSubmit: (data: { effort: number; text: string }) => void;
  onSkip: () => void;
}

/** Refleksi (F14): skala usaha mental Paas 1–9 + "Jelaskan dengan kata-katamu". */
export function ReflectionForm({ onSubmit, onSkip }: ReflectionFormProps) {
  const [effort, setEffort] = useState<number | null>(null);
  const [text, setText] = useState('');

  return (
    <div className="space-y-5">
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

      <div>
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
          className="mt-2 w-full rounded-xl border-2 border-line bg-surface p-3 focus:border-brand focus:outline-none"
        />
      </div>

      <div className="flex gap-2">
        <Button variant="ghost" onClick={onSkip}>
          Lewati
        </Button>
        <Button className="flex-1" disabled={effort === null} onClick={() => onSubmit({ effort: effort!, text: text.trim() })}>
          Simpan & Selesai
        </Button>
      </div>
    </div>
  );
}
