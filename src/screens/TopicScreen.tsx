import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { LessonView } from '../components/lesson/LessonView';
import { LiteracyRunner, type StageResult } from '../components/literacy/LiteracyRunner';
import { ProblemView, type ProblemOutcome } from '../components/practice/ProblemView';
import { ReflectionForm } from '../components/practice/ReflectionForm';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Modal } from '../components/ui/Modal';
import { Stars } from '../components/ui/Stars';
import { findTopicContent } from '../content';
import { functionsFor, type CognitiveFunctionId } from '../content/rmt';
import { findTopic } from '../content/topics';
import type { TopicContent } from '../content/types';
import { starsForProblem, starsForTopic } from '../domain/grading';
import { starsForScore } from '../domain/literacy';
import type { StarCount } from '../domain/types';
import { useProgress } from '../store/progress';

export function TopicScreen() {
  const { id } = useParams();
  const topicId = Number(id);
  const topic = findTopic(topicId);
  const content = findTopicContent(topicId);

  return (
    <main className="mx-auto max-w-xl px-4 py-4">
      <Link to="/beranda" className="inline-flex min-h-touch items-center font-bold text-brand hover:underline">
        ← Peta Belajar
      </Link>
      {topic && content ? (
        <>
          <h1 className="mb-3 text-2xl font-bold">{topic.title}</h1>
          <TopicRunner key={topicId} content={content} title={topic.title} />
        </>
      ) : (
        <Card className="mt-4">
          <h1 className="text-xl font-bold">Topik tidak ditemukan.</h1>
        </Card>
      )}
    </main>
  );
}

type Phase = 'lesson' | 'practice' | 'result' | 'reflect';

/** Penanda fase RMT (docs/RMT.md): alat & konsep → latihan → refleksi. */
const PHASES: { id: Phase[]; label: string }[] = [
  { id: ['lesson'], label: '① Kenali alat & konsep' },
  { id: ['practice'], label: '② Latihan' },
  { id: ['result', 'reflect'], label: '③ Refleksi' },
];

function PhaseBar({ phase }: { phase: Phase }) {
  return (
    <ol className="mb-4 flex gap-1 text-xs font-bold" aria-label="Tahap belajar">
      {PHASES.map((p) => {
        const active = p.id.includes(phase);
        return (
          <li
            key={p.label}
            aria-current={active ? 'step' : undefined}
            className={`flex-1 rounded-full px-2 py-1 text-center ${
              active ? 'bg-brand text-white' : 'bg-line/60 text-muted'
            }`}
          >
            {p.label}
          </li>
        );
      })}
    </ol>
  );
}

/** Alur satu topik: materi → latihan → hasil & ringkasan → refleksi (docs/DESAIN_PEMBELAJARAN.md §4). */
function TopicRunner({ content, title }: { content: TopicContent; title: string }) {
  const navigate = useNavigate();
  const recordAttempt = useProgress((s) => s.recordAttempt);
  const setStars = useProgress((s) => s.setStars);
  const addReflection = useProgress((s) => s.addReflection);

  const [phase, setPhase] = useState<Phase>('lesson');
  const [step, setStep] = useState(0);
  const [qi, setQi] = useState(0);
  const [results, setResults] = useState<StarCount[]>([]);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [litResults, setLitResults] = useState<StageResult[] | null>(null);

  const problems = content.problems;
  const problem = problems[qi];
  const literacy = content.literacy;

  const topicFunctions = useMemo<CognitiveFunctionId[]>(
    () => [
      ...new Set([
        ...problems.flatMap(functionsFor),
        ...(literacy ?? []).flatMap((t) =>
          t.stages.flatMap((s) =>
            s.item.type === 'explain'
              ? (s.item.functions ?? (['evidence'] as CognitiveFunctionId[]))
              : functionsFor(s.item),
          ),
        ),
      ]),
    ],
    [problems, literacy],
  );

  const record = (problemId: string, o: ProblemOutcome) =>
    recordAttempt({
      problemId,
      correct: o.correct,
      tries: o.tries,
      hintsUsed: o.hintsUsed,
      misconceptions: o.misconceptions,
      durationMs: o.durationMs,
      evidence: o.evidence,
      at: new Date().toISOString(),
    });

  const onProblemDone = (o: ProblemOutcome) => {
    recordAttempt({
      problemId: problem.id,
      correct: o.correct,
      tries: o.tries,
      hintsUsed: o.hintsUsed,
      misconceptions: o.misconceptions,
      durationMs: o.durationMs,
      evidence: o.evidence,
      at: new Date().toISOString(),
    });
    const next = [...results, starsForProblem(o.correct, o.tries, o.hintsUsed)];
    setResults(next);
    if (qi + 1 < problems.length) {
      setQi(qi + 1);
    } else {
      setStars(String(content.topicId), starsForTopic(next));
      setPhase('result');
    }
  };

  const restartPractice = () => {
    setResults([]);
    setLitResults(null);
    setQi(0);
    setPhase('practice');
  };

  const litTotal = (litResults ?? []).reduce((s, r) => s + r.score, 0);
  const litMax = (literacy ?? []).reduce((s, t) => s + t.stages.reduce((a, st) => a + st.score, 0), 0);

  let body;
  if (phase === 'lesson') {
    body = (
      <LessonView
        step={content.lesson[step]}
        index={step}
        total={content.lesson.length}
        onBack={() => setStep((s) => Math.max(0, s - 1))}
        onNext={() => (step + 1 < content.lesson.length ? setStep(step + 1) : setPhase('practice'))}
      />
    );
  } else if (phase === 'practice' && literacy) {
    body = (
      <div className="space-y-3">
        <div className="flex justify-end">
          <Button variant="ghost" onClick={() => setSummaryOpen(true)}>
            📘 Ringkasan
          </Button>
        </div>
        <LiteracyRunner
          tasks={literacy}
          onRecord={record}
          onComplete={(r) => {
            const total = r.reduce((s, x) => s + x.score, 0);
            setLitResults(r);
            setStars(String(content.topicId), starsForScore(total, litMax));
            setPhase('result');
          }}
        />
        <Modal open={summaryOpen} title="Ringkasan" onClose={() => setSummaryOpen(false)}>
          <SummaryList items={content.summary} />
        </Modal>
      </div>
    );
  } else if (phase === 'result' && literacy) {
    const topicStars = starsForScore(litTotal, litMax);
    body = (
      <div className="space-y-4">
        <Card className="space-y-3 text-center">
          <p className="text-4xl">
            <Stars value={topicStars} />
          </p>
          <p className="text-xl font-bold">
            Skor literasi: {litTotal} / {litMax}
          </p>
          <table className="mx-auto w-full max-w-sm border-collapse text-left">
            <tbody>
              {literacy.map((t) => {
                const s = (litResults ?? []).filter((r) => r.taskId === t.id).reduce((a, r) => a + r.score, 0);
                const m = t.stages.reduce((a, st) => a + st.score, 0);
                return (
                  <tr key={t.id}>
                    <td className="border-b border-line py-1">{t.title}</td>
                    <td className="border-b border-line py-1 text-right font-bold">
                      {s} / {m}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <p className="text-muted">
            {topicStars > 0 ? 'Hebat! Kamu berpikir dengan teliti.' : 'Butuh minimal 70% skor. Yuk, coba lagi!'}
          </p>
        </Card>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={restartPractice}>
            ↺ Ulangi
          </Button>
          <Button className="flex-1" onClick={() => setPhase('reflect')}>
            Lanjut ke Jurnal →
          </Button>
        </div>
      </div>
    );
  } else if (phase === 'practice') {
    body = (
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-bold text-muted">
            Soal {qi + 1} / {problems.length} • Level {problem.level}
          </p>
          <Button variant="ghost" onClick={() => setSummaryOpen(true)}>
            📘 Ringkasan
          </Button>
        </div>
        <ProgressBar value={qi} total={problems.length} />
        <ProblemView key={problem.id} problem={problem} onDone={onProblemDone} />
        <Modal open={summaryOpen} title="Ringkasan" onClose={() => setSummaryOpen(false)}>
          <SummaryList items={content.summary} />
        </Modal>
      </div>
    );
  } else if (phase === 'result') {
    const correct = results.filter((s) => s > 0).length;
    const topicStars = starsForTopic(results);
    const passed = topicStars > 0;
    body = (
      <div className="space-y-4">
        <Card className="text-center">
          <p className="text-4xl">
            <Stars value={topicStars} />
          </p>
          <p className="mt-2 text-xl font-bold">
            {correct} dari {problems.length} soal benar
          </p>
          <p className="mt-1 text-muted">
            {passed
              ? 'Topik berikutnya sudah terbuka. Hebat!'
              : 'Butuh minimal 70% benar untuk membuka topik berikutnya. Yuk, coba lagi!'}
          </p>
        </Card>
        <Card>
          <p className="font-bold text-brand">📘 Ringkasan</p>
          <SummaryList items={content.summary} />
        </Card>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={restartPractice}>
            ↺ Ulangi latihan
          </Button>
          <Button className="flex-1" onClick={() => setPhase('reflect')}>
            Lanjut ke Jurnal →
          </Button>
        </div>
      </div>
    );
  } else {
    body = (
      <ReflectionForm
        topicTitle={title}
        summary={content.summary}
        functionOptions={topicFunctions}
        onSkip={() => navigate('/beranda')}
        onSubmit={({ effort, text, functionsUsed }) => {
          addReflection({
            topic: content.topicId,
            effort,
            text,
            functionsUsed,
            at: new Date().toISOString(),
          });
          navigate('/beranda');
        }}
      />
    );
  }

  return (
    <>
      <PhaseBar phase={phase} />
      {body}
    </>
  );
}

function SummaryList({ items }: { items: string[] }) {
  return (
    <ul className="mt-2 space-y-1 text-left">
      {items.map((s) => (
        <li key={s} className="flex gap-2">
          <span className="text-brand">•</span>
          <span>{s}</span>
        </li>
      ))}
    </ul>
  );
}

function ProgressBar({ value, total }: { value: number; total: number }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-line" aria-hidden>
      <div className="h-full rounded-full bg-brand transition-all" style={{ width: `${(value / total) * 100}%` }} />
    </div>
  );
}
