import { useRef, useState } from 'react';
import { buildExplainMessages } from '../../ai/prompts';
import type { ExplainStage } from '../../content/types';
import { FeedbackButton } from '../ai/FeedbackButton';
import { FunctionChips } from '../rmt/FunctionChips';
import { Button } from '../ui/Button';

export interface ExplainResult {
  allChecked: boolean;
  checkedCount: number;
  text: string;
  durationMs: number;
}

interface ExplainStageViewProps {
  stage: ExplainStage;
  context: string;
  onDone: (result: ExplainResult) => void;
}

/**
 * Tahap "jelaskan alasanmu": siswa menulis dulu, lalu membandingkan dengan contoh jawaban
 * dan menilai diri dengan daftar periksa (bukti logis RMT). Mediator AI boleh menanggapi.
 */
export function ExplainStageView({ stage, context, onDone }: ExplainStageViewProps) {
  const [text, setText] = useState('');
  const [compared, setCompared] = useState(false);
  const [checks, setChecks] = useState<boolean[]>(() => stage.checklist.map(() => false));
  const started = useRef(Date.now());

  return (
    <div className="space-y-4">
      <p className="text-lg font-bold">{stage.prompt}</p>
      <FunctionChips ids={stage.functions ?? ['evidence']} />

      <label htmlFor={`jelaskan-${stage.id}`} className="sr-only">
        Penjelasanmu
      </label>
      <textarea
        id={`jelaskan-${stage.id}`}
        value={text}
        onChange={(e) => setText(e.target.value)}
        readOnly={compared}
        rows={4}
        maxLength={600}
        placeholder="Tulis alasanmu dengan kalimatmu sendiri. Sebutkan angka dan perbandingannya."
        className="w-full rounded-xl border-2 border-line bg-white p-3 focus:border-brand focus:outline-none read-only:bg-surface"
      />

      {!compared ? (
        <Button block onClick={() => setCompared(true)} disabled={text.trim().length < 15}>
          Bandingkan dengan contoh jawaban →
        </Button>
      ) : (
        <div className="space-y-3">
          <div className="rounded-xl border-2 border-brand bg-brand-soft p-3">
            <p className="font-bold text-brand">📖 Contoh jawaban</p>
            <p>{stage.model}</p>
          </div>

          <div className="space-y-2">
            <p className="font-bold">Periksa penjelasanmu sendiri:</p>
            {stage.checklist.map((c, i) => (
              <button
                key={c}
                type="button"
                role="checkbox"
                aria-checked={checks[i]}
                onClick={() => setChecks((s) => s.map((v, j) => (j === i ? !v : v)))}
                className={`flex min-h-touch w-full items-center gap-3 rounded-xl border-2 px-3 py-2 text-left ${
                  checks[i] ? 'border-ok bg-green-50' : 'border-line bg-surface'
                }`}
              >
                <span aria-hidden className="font-bold text-brand">
                  {checks[i] ? '☑' : '☐'}
                </span>
                <span>{c}</span>
              </button>
            ))}
          </div>

          <FeedbackButton build={() => buildExplainMessages(stage, context, text.trim())} />

          <Button
            block
            onClick={() =>
              onDone({
                allChecked: checks.every(Boolean),
                checkedCount: checks.filter(Boolean).length,
                text: text.trim(),
                durationMs: Date.now() - started.current,
              })
            }
          >
            Lanjut →
          </Button>
        </div>
      )}
    </div>
  );
}
