import { useState, type ReactNode } from 'react';
import type { RelationProblem } from '../../content/types';
import { Button } from '../ui/Button';

/** Soal cerita dengan tombol "Pecah Soal" (F5): menyorot anggota A (biru), B (oranye), dan aturan. */
export function StoryText({ problem }: { problem: RelationProblem }) {
  const [split, setSplit] = useState(false);
  const { setA, setB, rule } = problem.relation;
  const story = problem.story ?? '';

  return (
    <div className="space-y-3 rounded-xl border border-line bg-surface p-3">
      <p className="text-lg leading-relaxed">{split ? highlight(story, setA, setB) : story}</p>
      {!split ? (
        <Button variant="secondary" onClick={() => setSplit(true)}>
          🔍 Pecah Soal
        </Button>
      ) : (
        <ol className="space-y-1">
          <li>
            <span className="font-bold text-set-a">① Himpunan A:</span> {setA.join(', ')}
          </li>
          <li>
            <span className="font-bold text-set-b">② Himpunan B:</span> {setB.join(', ')}
          </li>
          <li>
            <span className="font-bold">③ Aturan:</span> <span className="underline decoration-2">"{rule}"</span>
          </li>
        </ol>
      )}
    </div>
  );
}

function escape(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Sorot setiap kemunculan anggota A dan B di dalam teks cerita (tidak peka huruf besar/kecil). */
function highlight(text: string, setA: string[], setB: string[]): ReactNode[] {
  const terms = [...setA.map((t) => ({ t, c: 'A' })), ...setB.map((t) => ({ t, c: 'B' }))].sort(
    (x, y) => y.t.length - x.t.length,
  );
  const re = new RegExp(`(${terms.map((x) => `\\b${escape(x.t)}\\b`).join('|')})`, 'gi');
  return text.split(re).map((part, i) => {
    const hit = terms.find((x) => x.t.toLowerCase() === part.toLowerCase());
    if (!hit) return <span key={i}>{part}</span>;
    return (
      <mark
        key={i}
        className={`rounded px-1 font-bold ${hit.c === 'A' ? 'bg-blue-100 text-set-a' : 'bg-orange-100 text-set-b'}`}
      >
        {part}
      </mark>
    );
  });
}
