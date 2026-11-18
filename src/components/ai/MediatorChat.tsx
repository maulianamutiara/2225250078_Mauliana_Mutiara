import { useState, type FormEvent } from 'react';
import { AiError, askAi } from '../../ai/client';
import {
  DIFFICULTIES,
  HINT_LEVELS,
  nextHintLevel,
  parseMediatorReply,
  type AiHistoryItem,
  type AiRequest,
  type Difficulty,
  type HintLevel,
  type LoadType,
  type MediatorReply,
} from '../../ai/pedagogy';
import { currentAccessCode } from '../../store/aiSettings';
import { Button } from '../ui/Button';

export interface AiTurn {
  difficulty: Difficulty;
  level: HintLevel;
  load?: LoadType;
  at: string;
}

interface MediatorChatProps {
  /** Susun permintaan untuk backend (konteks terbaru + riwayat + pertanyaan + kesulitan + tingkat petunjuk). */
  build: (history: AiHistoryItem[], question: string, difficulty: Difficulty, hintLevel: HintLevel) => AiRequest;
  /** Usaha siswa di soal ini — dipakai menaikkan tingkat petunjuk secara bertahap. */
  effort: { tries: number; hintsUsed: number };
  onTurn?: (turn: AiTurn) => void;
  /** Batas pertanyaan per soal — menjaga fokus (beban kognitif) dan biaya. */
  maxTurns?: number;
}

const LOAD_LABEL: Record<LoadType, string> = {
  ekstrinsik: '📉 Mengurangi beban ekstrinsik',
  intrinsik: '🧩 Mengelola beban intrinsik',
  germane: '🌱 Mendorong beban germane',
};

const QUICK: Exclude<Difficulty, 'other'>[] = ['read', 'start', 'wrong', 'check'];

interface Turn {
  question: string;
  difficulty: Difficulty;
  level: HintLevel;
  reply: MediatorReply;
}

/**
 * Asisten Belajar (Mediator AI): siswa memilih JENIS KESULITAN → backend memberi bimbingan sesuai
 * jenis beban kognitif dan TINGKAT PETUNJUK (tangga RMT 1–4) yang naik bertahap. Tidak memberi jawaban.
 */
export function MediatorChat({ build, effort, onTurn, maxTurns = 6 }: MediatorChatProps) {
  const [turns, setTurns] = useState<Turn[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const limitReached = turns.length >= maxTurns;

  const ask = async (raw: string, difficulty: Difficulty) => {
    const question = raw.trim();
    if (!question || loading || limitReached) return;
    const level = nextHintLevel({ ...effort, aiTurns: turns.length, difficulty });
    const history: AiHistoryItem[] = turns
      .flatMap((t): AiHistoryItem[] => [
        { role: 'user', content: t.question },
        { role: 'assistant', content: [t.reply.message, t.reply.question].filter(Boolean).join(' ') },
      ])
      .slice(-8);
    setError(null);
    setLoading(true);
    setInput('');
    try {
      const reply = parseMediatorReply(
        await askAi(build(history, question, difficulty, level), { accessCode: currentAccessCode() }),
      );
      const shownLevel = Math.min(reply.level ?? level, level) as HintLevel;
      setTurns((t) => [...t, { question, difficulty, level: shownLevel, reply }]);
      onTurn?.({
        difficulty,
        level: shownLevel,
        load: reply.load ?? DIFFICULTIES[difficulty].load ?? undefined,
        at: new Date().toISOString(),
      });
    } catch (e) {
      setError(e instanceof AiError ? e.message : 'Terjadi kesalahan. Coba lagi.');
      if (difficulty === 'other') setInput(question);
    } finally {
      setLoading(false);
    }
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    void ask(input, 'other');
  };

  return (
    <div className="space-y-3 rounded-xl border-2 border-brand/40 bg-brand-soft p-3" aria-live="polite">
      <p className="font-bold text-brand">🤖 Asisten Belajar</p>

      {turns.map((t, i) => (
        <div key={i} className="space-y-1">
          <p className="ml-8 rounded-xl bg-white p-2 text-right">{t.question}</p>
          <div className="mr-4 space-y-2 rounded-xl border border-line bg-surface p-2">
            <p>
              <span className="font-bold text-brand">Mediator: </span>
              {t.reply.message}
            </p>
            {t.reply.question && <p className="font-bold">🤔 {t.reply.question}</p>}
            <div className="flex flex-wrap gap-1 text-xs">
              {(t.reply.load ?? DIFFICULTIES[t.difficulty].load) && (
                <span className="rounded-full bg-amber-100 px-2 py-0.5 font-bold text-ink">
                  {LOAD_LABEL[(t.reply.load ?? DIFFICULTIES[t.difficulty].load) as LoadType]}
                </span>
              )}
              <span className="rounded-full bg-brand-soft px-2 py-0.5 font-bold text-brand">
                🪜 Petunjuk {t.level}/4: {HINT_LEVELS[t.level].name}
              </span>
              <span className="rounded-full bg-line/60 px-2 py-0.5 font-bold text-muted">{HINT_LEVELS[t.level].rmt}</span>
              {t.reply.cognitiveFunction && (
                <span className="rounded-full bg-line/60 px-2 py-0.5 font-bold text-muted">
                  🧠 {t.reply.cognitiveFunction}
                </span>
              )}
            </div>
          </div>
        </div>
      ))}

      {loading && <p className="text-sm text-muted">Mediator sedang berpikir…</p>}
      {error && (
        <p role="alert" className="text-sm font-bold text-fix">
          ✕ {error}
        </p>
      )}

      {limitReached ? (
        <p className="text-sm text-muted">Batas pertanyaan untuk soal ini tercapai. Coba pakai hint, ya.</p>
      ) : (
        <>
          <p className="text-sm font-bold">
            {turns.length === 0 ? 'Apa yang membuatmu kesulitan?' : 'Masih ada yang sulit?'}
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            {QUICK.map((d) => (
              <Button
                key={d}
                variant="secondary"
                className="text-left text-sm"
                onClick={() => void ask(DIFFICULTIES[d].label, d)}
                disabled={loading}
              >
                {DIFFICULTIES[d].label}
              </Button>
            ))}
          </div>
          <form onSubmit={submit} className="flex gap-2">
            <label htmlFor="tanya-mediator" className="sr-only">
              Pertanyaan lain untuk Mediator
            </label>
            <input
              id="tanya-mediator"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              maxLength={300}
              placeholder="Atau tulis pertanyaanmu…"
              className="min-h-touch flex-1 rounded-xl border-2 border-line bg-white px-3 focus:border-brand focus:outline-none"
            />
            <Button type="submit" disabled={loading || !input.trim()}>
              Kirim
            </Button>
          </form>
        </>
      )}
      <p className="text-xs text-muted">Mediator membimbing, tidak memberi jawaban. Mediator AI bisa keliru.</p>
    </div>
  );
}
