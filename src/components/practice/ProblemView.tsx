import { useRef, useState, type ReactNode } from 'react';
import { buildEvidenceRequest, buildMediatorRequest } from '../../ai/prompts';
import { misconceptionMessages, praise } from '../../content/feedback';
import { functionsFor } from '../../content/rmt';
import { isRelationProblem, type Problem, type RelationProblem } from '../../content/types';
import { detectMisconceptions, gradePairs } from '../../domain/grading';
import { gradeMulti, gradeNumbers } from '../../domain/literacy';
import { formatPairs, hasPair, samePair, sortPairs } from '../../domain/relation';
import type { MisconceptionCode, Pair, Relation } from '../../domain/types';
import { FeedbackButton } from '../ai/FeedbackButton';
import { MediatorChat, type AiTurn } from '../ai/MediatorChat';
import { ArrowDiagram, type PairMarks } from '../diagrams/ArrowDiagram';
import { CartesianGrid } from '../diagrams/CartesianGrid';
import { PairBuilder } from '../diagrams/PairBuilder';
import { PairsView } from '../diagrams/PairsView';
import { FunctionChips } from '../rmt/FunctionChips';
import { Button } from '../ui/Button';
import { StoryText } from './StoryText';

export interface ProblemOutcome {
  correct: boolean;
  tries: number;
  hintsUsed: number;
  misconceptions: MisconceptionCode[];
  durationMs: number;
  evidence?: string;
  /** Pasangan terakhir siswa (soal relasi) — untuk skor sebagian di soal literasi. */
  answer?: Pair[];
  /** Catatan bantuan Asisten Belajar (jenis kesulitan, tingkat petunjuk, jenis beban) — data penelitian. */
  aiHelp?: AiTurn[];
}

interface ProblemViewProps {
  problem: Problem;
  onDone: (outcome: ProblemOutcome) => void;
  /** Bacaan soal literasi, dikirim ke Mediator sebagai konteks. */
  context?: string;
}

/** Setelah 3 kali salah, pembahasan ditampilkan dan siswa boleh lanjut. */
const MAX_TRIES = 3;

const instructions: Record<RelationProblem['type'], string> = {
  arrow: 'Seret dari titik A ke titik B, atau ketuk A lalu ketuk B. Ketuk panah untuk menghapus.',
  pairs: 'Pilih anggota dari A, lalu dari B. Ketuk pasangan untuk menghapus.',
  cartesian: 'Ketuk titik temu untuk menaruh noktah. Ketuk lagi untuk menghapus.',
};

const LETTERS = 'ABCDEFG';

export function ProblemView({ problem, onDone, context }: ProblemViewProps) {
  const isRel = isRelationProblem(problem);
  const given = isRelationProblem(problem) ? (problem.given ?? []) : [];
  const [pairs, setPairs] = useState<Pair[]>([...given]);
  const [choice, setChoice] = useState<number | null>(null);
  const [values, setValues] = useState<string[]>(() =>
    problem.type === 'numbers' ? problem.fields.map(() => '') : [],
  );
  const [selected, setSelected] = useState<number[]>([]);
  const [numberWrong, setNumberWrong] = useState<number[] | null>(null);
  const [multiMarks, setMultiMarks] = useState<{ missing: number[]; extra: number[] } | null>(null);
  const [tries, setTries] = useState(0);
  const [hintsShown, setHintsShown] = useState(0);
  const [status, setStatus] = useState<'answering' | 'correct' | 'failed'>('answering');
  const [feedback, setFeedback] = useState<string[]>([]);
  const [marks, setMarks] = useState<PairMarks | undefined>();
  const [codes, setCodes] = useState<MisconceptionCode[]>([]);
  const [showExplanation, setShowExplanation] = useState(false);
  const [mediatorOpen, setMediatorOpen] = useState(false);
  const [evidence, setEvidence] = useState('');
  const [aiLog, setAiLog] = useState<AiTurn[]>([]);
  const started = useRef(Date.now());

  const finished = status !== 'answering';
  const parsedValues = values.map((v) => (v.trim() === '' ? null : Number(v)));

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
    } else if (problem.type === 'numbers') {
      const result = gradeNumbers(parsedValues, problem.fields.map((f) => f.answer));
      correct = result.correct;
      setNumberWrong(result.wrong);
      if (!correct) messages = [`Ada ${result.wrong.length} isian yang belum tepat. Periksa lagi yang bertanda ✕.`];
    } else if (problem.type === 'multi') {
      const result = gradeMulti(selected, problem.answers);
      correct = result.correct;
      setMultiMarks(result);
      messages = [
        ...result.extra.map(
          (i) => problem.optionFeedback?.[i] ?? `Pilihan "${problem.options[i]}" seharusnya tidak dipilih.`,
        ),
        ...(result.missing.length ? [`Masih ada ${result.missing.length} pilihan benar yang belum kamu pilih.`] : []),
      ];
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
      evidence: evidence.trim() || undefined,
      answer: isRel ? pairs : undefined,
      aiHelp: aiLog.length ? aiLog : undefined,
    });

  let canCheck: boolean;
  let answerText: string;
  if (problem.type === 'mcq') {
    canCheck = choice !== null;
    answerText = choice !== null ? problem.options[choice] : '';
  } else if (problem.type === 'numbers') {
    canCheck = values.every((v) => v.trim() !== '');
    answerText = problem.fields.map((f, i) => `${f.label} = ${values[i]}`).join(', ');
  } else if (problem.type === 'multi') {
    canCheck = selected.length > 0;
    answerText = [...selected].sort().map((i) => problem.options[i]).join('; ');
  } else {
    canCheck = pairs.length > 0;
    answerText = formatPairs(sortPairs(pairs, problem.relation.setA, problem.relation.setB));
  }

  return (
    <div className="space-y-4">
      {isRelationProblem(problem) && problem.story && <StoryText problem={problem} />}
      {isRelationProblem(problem) && problem.show && <ShownRepresentation problem={problem} />}

      <p className="text-lg font-bold">{problem.prompt}</p>
      <FunctionChips ids={functionsFor(problem)} />

      {/* Area jawaban: pilihan ganda */}
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
                className={optionClass(showRight, showWrong, picked)}
              >
                <span className="font-bold text-brand">{LETTERS[i]}.</span>
                <span className="flex-1">{opt}</span>
                {showRight && <span className="font-bold text-ok">✓</span>}
                {showWrong && <span className="font-bold text-fix">✕</span>}
              </button>
            );
          })}
        </div>
      )}

      {/* Area jawaban: pilih semua yang benar */}
      {problem.type === 'multi' && (
        <div className="space-y-2" role="group" aria-label="Pilih semua yang benar">
          <p className="text-sm text-muted">Boleh pilih lebih dari satu.</p>
          {problem.options.map((opt, i) => {
            const picked = selected.includes(i);
            const showRight = finished && problem.answers.includes(i);
            const showWrong = !!multiMarks?.extra.includes(i) && picked;
            return (
              <button
                key={opt}
                type="button"
                role="checkbox"
                aria-checked={picked}
                disabled={finished}
                onClick={() => {
                  setSelected((s) => (s.includes(i) ? s.filter((x) => x !== i) : [...s, i]));
                  setMultiMarks(null);
                  setFeedback([]);
                }}
                className={optionClass(showRight, showWrong, picked)}
              >
                <span className="font-bold text-brand" aria-hidden>
                  {picked ? '☑' : '☐'}
                </span>
                <span className="flex-1">{opt}</span>
                {showRight && <span className="font-bold text-ok">✓</span>}
                {showWrong && <span className="font-bold text-fix">✕</span>}
              </button>
            );
          })}
        </div>
      )}

      {/* Area jawaban: isian angka */}
      {problem.type === 'numbers' && (
        <div className="space-y-3">
          {problem.helper && !finished && <HelperDiagram relation={problem.helper} />}
          <div className="grid gap-2 sm:grid-cols-2">
            {problem.fields.map((f, i) => {
              const wrong = !!numberWrong?.includes(i);
              const ok = numberWrong !== null && !wrong;
              return (
                <div
                  key={f.label}
                  className={`flex items-center justify-between gap-2 rounded-xl border-2 px-3 py-1 ${
                    wrong ? 'border-fix bg-red-50' : ok ? 'border-ok bg-green-50' : 'border-line bg-surface'
                  }`}
                >
                  <label htmlFor={`isian-${problem.id}-${i}`} className="font-bold">
                    {f.label}
                  </label>
                  <span className="flex items-center gap-1">
                    <input
                      id={`isian-${problem.id}-${i}`}
                      type="number"
                      inputMode="numeric"
                      min={0}
                      value={values[i]}
                      disabled={finished}
                      onChange={(e) => {
                        const next = [...values];
                        next[i] = e.target.value;
                        setValues(next);
                        setNumberWrong(null);
                        setFeedback([]);
                      }}
                      className="min-h-touch w-20 rounded-lg border-2 border-line bg-white px-2 text-center text-lg focus:border-brand focus:outline-none"
                    />
                    {ok && <span className="font-bold text-ok">✓</span>}
                    {wrong && <span className="font-bold text-fix">✕</span>}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Area jawaban: relasi */}
      {isRelationProblem(problem) && (
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

      {/* Bukti logis (RMT) — setelah jawaban benar */}
      {status === 'correct' && (
        <div className="space-y-2 rounded-xl border-2 border-line bg-surface p-3">
          <label htmlFor={`bukti-${problem.id}`} className="font-bold">
            ✍️ Bukti logis: mengapa jawabanmu benar?
          </label>
          <textarea
            id={`bukti-${problem.id}`}
            value={evidence}
            onChange={(e) => setEvidence(e.target.value)}
            rows={2}
            maxLength={400}
            placeholder="Contoh: karena 6 = 2 × 3, jadi 6 dua kali dari 3."
            className="w-full rounded-xl border-2 border-line bg-white p-2 focus:border-brand focus:outline-none"
          />
          <FeedbackButton
            disabled={evidence.trim().length < 5}
            build={() => buildEvidenceRequest(problem, answerText, evidence.trim(), context)}
          />
        </div>
      )}

      {/* Mediator AI */}
      {mediatorOpen && !finished && (
        <MediatorChat
          effort={{ tries, hintsUsed: hintsShown }}
          onTurn={(turn) => setAiLog((log) => [...log, turn])}
          build={(history, question, difficulty, hintLevel) =>
            buildMediatorRequest(
              problem,
              { pairs, choice, values: parsedValues, selected, tries, hintsUsed: hintsShown },
              history,
              question,
              { context, difficulty, hintLevel },
            )
          }
        />
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
          <Button variant="secondary" onClick={() => setMediatorOpen((o) => !o)} aria-expanded={mediatorOpen}>
            🤖 Tanya Mediator
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

function optionClass(showRight: boolean, showWrong: boolean, picked: boolean): string {
  return [
    'flex min-h-touch w-full items-center gap-3 rounded-xl border-2 px-4 py-2 text-left',
    showRight
      ? 'border-ok bg-green-50'
      : showWrong
        ? 'border-fix bg-red-50'
        : picked
          ? 'border-brand bg-brand-soft'
          : 'border-line bg-surface',
  ].join(' ');
}

/** Kotak coretan: diagram panah bebas untuk membantu menghitung (tidak dinilai). */
function HelperDiagram({ relation }: { relation: Relation }) {
  const [scratch, setScratch] = useState<Pair[]>([]);
  return (
    <div className="space-y-1 rounded-xl border-2 border-dashed border-line bg-surface p-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-bold">✏️ Coretan diagram panah (tidak dinilai)</p>
        <Button variant="ghost" className="text-sm" onClick={() => setScratch([])} disabled={scratch.length === 0}>
          Bersihkan
        </Button>
      </div>
      <ArrowDiagram
        relation={{ ...relation, pairs: [] }}
        pairs={scratch}
        interactive
        onAdd={(p) => setScratch((s) => [...s, p])}
        onRemove={(p) => setScratch((s) => s.filter((q) => !samePair(p, q)))}
      />
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
