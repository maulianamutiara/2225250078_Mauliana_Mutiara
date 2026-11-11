import { useRef, useState, type ReactNode } from 'react';
import { misconceptionMessages, praise } from '../../content/feedback';
import type { Problem, RelationProblem } from '../../content/types';
import { detectMisconceptions, gradePairs } from '../../domain/grading';
import { hasPair, samePair, sortPairs } from '../../domain/relation';
import type { MisconceptionCode, Pair } from '../../domain/types';
import { ArrowDiagram, type PairMarks } from '../diagrams/ArrowDiagram';
import { CartesianGrid } from '../diagrams/CartesianGrid';
import { PairBuilder } from '../diagrams/PairBuilder';
import { PairsView } from '../diagrams/PairsView';
import { Button } from '../ui/Button';
import { StoryText } from './StoryText';

export interface ProblemOutcome {
  correct: boolean;
  tries: number;
  hintsUsed: number;
  misconceptions: MisconceptionCode[];
  durationMs: number;
}

interface ProblemViewProps {
  problem: Problem;
  onDone: (outcome: ProblemOutcome) => void;
}

/** Setelah 3 kali salah, pembahasan ditampilkan dan siswa boleh lanjut. */
const MAX_TRIES = 3;

const instructions: Record<RelationProblem['type'], string> = {
  arrow: 'Seret dari titik A ke titik B, atau ketuk A lalu ketuk B. Ketuk panah untuk menghapus.',
  pairs: 'Pilih anggota dari A, lalu dari B. Ketuk pasangan untuk menghapus.',
  cartesian: 'Ketuk titik temu untuk menaruh noktah. Ketuk lagi untuk menghapus.',
};

export function ProblemView({ problem, onDone }: ProblemViewProps) {
  const isRel = problem.type !== 'mcq';
  const given = isRel ? (problem.given ?? []) : [];
  const [pairs, setPairs] = useState<Pair[]>([...given]);
  const [choice, setChoice] = useState<number | null>(null);
  const [tries, setTries] = useState(0);
  const [hintsShown, setHintsShown] = useState(0);
  const [status, setStatus] = useState<'answering' | 'correct' | 'failed'>('answering');
  const [feedback, setFeedback] = useState<string[]>([]);
  const [marks, setMarks] = useState<PairMarks | undefined>();
  const [codes, setCodes] = useState<MisconceptionCode[]>([]);
  const [showExplanation, setShowExplanation] = useState(false);
  const started = useRef(Date.now());

  const finished = status !== 'answering';

  const edit = (next: Pair[]) => {
    setPairs(next);
    setMarks(undefined); // jawaban berubah → tanda lama dihapus
    setFeedback([]);
  };
  const add = (p: Pair) => edit([...pairs, p]);
  const remove = (p: Pair) => edit(pairs.filter((q) => !samePair(p, q)));
  const toggle = (p: Pair) => (hasPair(pairs, p) ? remove(p) : add(p));

  const check = () => {
    const attempt = tries + 1;
    setTries(attempt);
    let correct: boolean;
    let messages: string[] = [];

    if (problem.type === 'mcq') {
      correct = choice === problem.answer;
      if (!correct && choice !== null) {
        messages = [problem.optionFeedback?.[choice] ?? 'Belum tepat. Baca lagi soalnya pelan-pelan.'];
      }
    } else {
      const result = gradePairs(pairs, problem.relation);
      const found = detectMisconceptions(result, pairs, problem.relation, problem.type);
      correct = result.correct;
      messages = found.map((c) => misconceptionMessages[c]);
      setCodes((prev) => [...new Set([...prev, ...found])]);
      setMarks({
        checked: true,
        wrong: [...result.extra, ...result.reversed],
        missing: !correct && attempt >= MAX_TRIES ? result.missing : undefined,
      });
    }

    if (correct) {
      setStatus('correct');
      setFeedback([praise[problem.id.length % praise.length]]);
      return;
    }
    // Salah: buka hint sesuai banyaknya percobaan (hint bertahap).
    setHintsShown((h) => Math.max(h, Math.min(attempt, problem.hints.length)));
    setFeedback(messages.length ? messages : ['Belum tepat. Coba periksa lagi.']);
    if (attempt >= MAX_TRIES) {
      setStatus('failed');
      setShowExplanation(true);
    }
  };

  const finish = () =>
    onDone({
      correct: status === 'correct',
      tries,
      hintsUsed: hintsShown,
      misconceptions: codes,
      durationMs: Date.now() - started.current,
    });

  const canCheck = problem.type === 'mcq' ? choice !== null : pairs.length > 0;

  return (
    <div className="space-y-4">
      {isRel && problem.story && <StoryText problem={problem} />}
      {isRel && problem.show && <ShownRepresentation problem={problem} />}

      <p className="text-lg font-bold">{problem.prompt}</p>

      {/* Area jawaban */}
      {problem.type === 'mcq' && (
        <div className="space-y-2" role="radiogroup" aria-label="Pilihan jawaban">
          {problem.options.map((opt, i) => {
            const picked = choice === i;
            const showRight = finished && i === problem.answer;
            const showWrong = picked && feedback.length > 0 && i !== problem.answer;
            return (
              <button
                key={opt}
                type="button"
                role="radio"
                aria-checked={picked}
                disabled={finished}
                onClick={() => {
                  setChoice(i);
                  setFeedback([]);
                }}
                className={[
                  'flex min-h-touch w-full items-center gap-3 rounded-xl border-2 px-4 py-2 text-left',
                  showRight
                    ? 'border-ok bg-green-50'
                    : showWrong
                      ? 'border-fix bg-red-50'
                      : picked
                        ? 'border-brand bg-brand-soft'
                        : 'border-line bg-surface',
                ].join(' ')}
              >
                <span className="font-bold text-brand">{String.fromCharCode(65 + i)}.</span>
                <span className="flex-1">{opt}</span>
                {showRight && <span className="font-bold text-ok">✓</span>}
                {showWrong && <span className="font-bold text-fix">✕</span>}
              </button>
            );
          })}
        </div>
      )}

      {isRel && (
        <>
          <p className="text-sm text-muted">{instructions[problem.type]}</p>
          <div className={finished ? 'pointer-events-none' : undefined}>
            {problem.type === 'arrow' && (
              <ArrowDiagram
                relation={problem.relation}
                pairs={pairs}
                locked={given}
                interactive={!finished}
                onAdd={add}
                onRemove={remove}
                onMessage={(m) => setFeedback([m])}
                marks={marks}
              />
            )}
            {problem.type === 'pairs' && (
              <PairBuilder
                relation={problem.relation}
                pairs={sortPairs(pairs, problem.relation.setA, problem.relation.setB)}
                locked={given}
                onAdd={add}
                onRemove={remove}
                marks={marks}
              />
            )}
            {problem.type === 'cartesian' && (
              <CartesianGrid relation={problem.relation} points={pairs} interactive={!finished} onToggle={toggle} marks={marks} />
            )}
          </div>
        </>
      )}

      {/* Umpan balik — selalu disertai ikon dan teks */}
      {feedback.length > 0 && (
        <Feedback tone={status === 'correct' ? 'ok' : 'fix'}>
          {feedback.map((f) => (
            <p key={f}>{f}</p>
          ))}
        </Feedback>
      )}

      {/* Hint bertahap */}
      {hintsShown > 0 && (
        <div className="space-y-1 rounded-xl border-2 border-amber-300 bg-amber-50 p-3" aria-live="polite">
          {problem.hints.slice(0, hintsShown).map((h, i) => (
            <p key={h}>
              💡 <span className="font-bold">Hint {i + 1}:</span> {h}
            </p>
          ))}
        </div>
      )}

      {/* Pembahasan */}
      {showExplanation && (
        <div className="rounded-xl border-2 border-brand bg-brand-soft p-3">
          <p className="font-bold text-brand">📖 Pembahasan</p>
          <ol className="mt-1 list-decimal space-y-1 pl-5">
            {problem.explanation.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ol>
        </div>
      )}

      {/* Tombol */}
      {!finished ? (
        <div className="flex flex-wrap gap-2">
          <Button
            variant="secondary"
            onClick={() => setHintsShown((h) => Math.min(h + 1, problem.hints.length))}
            disabled={hintsShown >= problem.hints.length}
          >
            💡 Hint
          </Button>
          {isRel && (
            <Button variant="ghost" onClick={() => edit([...given])} disabled={pairs.length === given.length}>
              🗑 Hapus semua
            </Button>
          )}
          <Button className="flex-1" onClick={check} disabled={!canCheck}>
            ✔ Cek Jawaban
          </Button>
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {status === 'correct' && !showExplanation && (
            <Button variant="secondary" onClick={() => setShowExplanation(true)}>
              📖 Lihat pembahasan
            </Button>
          )}
          <Button className="flex-1" onClick={finish}>
            Lanjut →
          </Button>
        </div>
      )}
    </div>
  );
}

function Feedback({ tone, children }: { tone: 'ok' | 'fix'; children: ReactNode }) {
  const ok = tone === 'ok';
  return (
    <div
      role="status"
      className={`flex gap-3 rounded-xl border-2 p-3 ${ok ? 'border-ok bg-green-50' : 'border-fix bg-red-50'}`}
    >
      <span className={`text-xl font-bold ${ok ? 'text-ok' : 'text-fix'}`} aria-hidden>
        {ok ? '✓' : '✕'}
      </span>
      <div className="space-y-1">
        <p className={`font-bold ${ok ? 'text-ok' : 'text-fix'}`}>{ok ? 'Benar' : 'Belum tepat'}</p>
        {children}
      </div>
    </div>
  );
}

/** Relasi kunci ditampilkan dalam bentuk lain sebagai bahan soal (Topik 5 & soal "ubah bentuk"). */
function ShownRepresentation({ problem }: { problem: RelationProblem }) {
  const { relation } = problem;
  return (
    <div className="rounded-xl border border-line bg-surface p-3">
      {problem.show === 'arrow' && <ArrowDiagram relation={relation} pairs={relation.pairs} />}
      {problem.show === 'pairs' && (
        <PairsView pairs={sortPairs(relation.pairs, relation.setA, relation.setB)} />
      )}
      {problem.show === 'cartesian' && <CartesianGrid relation={relation} points={relation.pairs} />}
    </div>
  );
}
