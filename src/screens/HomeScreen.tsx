import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Stars } from '../components/ui/Stars';
import { howToLearn, topics } from '../content/topics';
import { isTopicUnlocked, totalStars } from '../domain/progress';
import { useProgress } from '../store/progress';

/** S2 — Beranda / Peta Belajar. */
export function HomeScreen() {
  const stars = useProgress((s) => s.stars);
  const studentCode = useProgress((s) => s.studentCode);
  const [helpOpen, setHelpOpen] = useState(false);

  return (
    <main className="mx-auto max-w-md px-4 py-6">
      <header className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Peta Belajar</h1>
          <p className="text-sm text-muted">
            {studentCode ? `Kode: ${studentCode} • ` : ''}
            Total bintang: {totalStars(stars)}
          </p>
        </div>
        <Button variant="secondary" onClick={() => setHelpOpen(true)}>
          ❓ Cara Belajar
        </Button>
      </header>

      <ol className="mt-6 space-y-3">
        {topics.map((topic) => {
          const unlocked = isTopicUnlocked(topic.id, stars);
          const label = topic.id === 0 ? 'Pemanasan' : `Topik ${topic.id}`;
          const body = (
            <>
              <span className="text-xs font-bold uppercase tracking-wide text-brand">
                {label}
                {topic.optional ? ' • opsional' : ''}
              </span>
              <span className="mt-0.5 block text-lg font-bold">{topic.title}</span>
              <span className="mt-1 flex items-center justify-between gap-2 text-sm text-muted">
                <span>{topic.summary}</span>
                {unlocked ? (
                  <Stars value={stars[String(topic.id)] ?? 0} />
                ) : (
                  <span className="whitespace-nowrap font-bold">🔒 Terkunci</span>
                )}
              </span>
            </>
          );

          return (
            <li key={topic.id}>
              {unlocked ? (
                <Link
                  to={`/topik/${topic.id}`}
                  className="block min-h-touch rounded-2xl border-2 border-line bg-surface p-4 shadow-sm transition-colors hover:border-brand focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300"
                >
                  {body}
                </Link>
              ) : (
                <div
                  aria-disabled="true"
                  className="block rounded-2xl border-2 border-dashed border-line bg-surface/50 p-4 text-muted opacity-70"
                >
                  {body}
                </div>
              )}
            </li>
          );
        })}
      </ol>

      <Modal open={helpOpen} title="Cara Belajar" onClose={() => setHelpOpen(false)}>
        <ol className="list-decimal space-y-2 pl-5">
          {howToLearn.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ol>
      </Modal>
    </main>
  );
}
