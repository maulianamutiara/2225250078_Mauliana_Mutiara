import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { LessonView } from '../components/lesson/LessonView';
import { ProblemView, type ProblemOutcome } from '../components/practice/ProblemView';
import { ReflectionForm } from '../components/practice/ReflectionForm';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Modal } from '../components/ui/Modal';
import { Stars } from '../components/ui/Stars';
import { findTopicContent } from '../content';
import { findTopic } from '../content/topics';
import type { TopicContent } from '../content/types';
import { starsForProblem, starsForTopic } from '../domain/grading';
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
          <TopicRunner key={topicId} content={content} />
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

/** Alur satu topik: materi → latihan → hasil & ringkasan → refleksi (docs/DESAIN_PEMBELAJARAN.md §4). */
function TopicRunner({ content }: { content: TopicContent }) {
  const navigate = useNavigate();
  const recordAttempt = useProgress((s) => s.recordAttempt);
  const setStars = useProgress((s) => s.setStars);
  const addReflection = useProgress((s) => s.addReflection);

  const [phase, setPhase] = useState<Phase>('lesson');
  const [step, setStep] = useState(0);
  const [qi, setQi] = useState(0);
  const [results, setResults] = useState<StarCount[]>([]);
  const [summaryOpen, setSummaryOpen] = useState(false);

  const problems = content.problems;
  const problem = problems[qi];

  const onProblemDone = (o: ProblemOutcome) => {
    recordAttempt({
      problemId: problem.id,
      correct: o.correct,
      tries: o.tries,
      hintsUsed: o.hintsUsed,
      misconceptions: o.misconceptions,
      durationMs: o.durationMs,
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
    setQi(0);
    setPhase('practice');
  };

  if (phase === 'lesson') {
    return (
      <LessonView
        step={content.lesson[step]}
        index={step}
        total={content.lesson.length}
        onBack={() => setStep((s) => Math.max(0, s - 1))}
        onNext={() => (step + 1 < content.lesson.length ? setStep(step + 1) : setPhase('practice'))}
      />
    );
  }

  if (phase === 'practice') {
    return (
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
  }

  if (phase === 'result') {
    const correct = results.filter((s) => s > 0).length;
    const topicStars = starsForTopic(results);
    const passed = topicStars > 0;
    return (
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
            Lanjut →
          </Button>
        </div>
      </div>
    );
  }

  return (
    <ReflectionForm
      onSkip={() => navigate('/beranda')}
      onSubmit={({ effort, text }) => {
        addReflection({ topic: content.topicId, effort, text, at: new Date().toISOString() });
        navigate('/beranda');
      }}
    />
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
