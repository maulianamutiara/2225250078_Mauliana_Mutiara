import { useState } from 'react';
import type { LessonStep, Visual } from '../../content/types';
import { sortPairs } from '../../domain/relation';
import { ArrowDiagram } from '../diagrams/ArrowDiagram';
import { CartesianGrid } from '../diagrams/CartesianGrid';
import { PairsView } from '../diagrams/PairsView';
import { SetView } from '../diagrams/SetView';
import { Button } from '../ui/Button';

interface LessonViewProps {
  step: LessonStep;
  index: number;
  total: number;
  onBack: () => void;
  onNext: () => void;
}

/** Satu layar materi: gambar + maks 3 kalimat + tombol Lanjut (segmenting, self-paced). */
export function LessonView({ step, index, total, onBack, onNext }: LessonViewProps) {
  const [replay, setReplay] = useState(0);
  const v = step.visual;
  const animated = v?.kind === 'arrow' && v.animate;

  return (
    <div className="space-y-4">
      <p className="text-sm font-bold text-muted" aria-live="polite">
        Materi {index + 1} / {total}
      </p>

      {v && (
        <div className="rounded-2xl border border-line bg-surface p-3">
          <VisualView key={replay} visual={v} />
          {animated && (
            <div className="mt-2 flex justify-center">
              <Button variant="ghost" onClick={() => setReplay((r) => r + 1)}>
                ↺ Ulangi animasi
              </Button>
            </div>
          )}
        </div>
      )}

      <div className="space-y-2 text-lg">
        {step.text.map((t) => (
          <p key={t}>{t}</p>
        ))}
      </div>

      <div className="flex gap-2">
        <Button variant="secondary" onClick={onBack} disabled={index === 0}>
          ← Kembali
        </Button>
        <Button className="flex-1" onClick={onNext}>
          {index === total - 1 ? 'Mulai Latihan →' : 'Lanjut →'}
        </Button>
      </div>
    </div>
  );
}

function VisualView({ visual: v }: { visual: Visual }) {
  switch (v.kind) {
    case 'set':
      return <SetView name={v.name} members={v.members} color={v.color} />;
    case 'arrow': {
      const pairs = v.relation.pairs.slice(0, v.reveal ?? v.relation.pairs.length);
      // Animasikan hanya panah terbaru (langkah ini), atau semua jika tidak ada reveal.
      const from = v.animate ? (v.reveal !== undefined ? Math.max(0, v.reveal - 1) : 0) : undefined;
      return <ArrowDiagram relation={v.relation} pairs={pairs} animateFrom={from} />;
    }
    case 'pairs': {
      const sorted = sortPairs(v.relation.pairs, v.relation.setA, v.relation.setB);
      return <PairsView pairs={sorted.slice(0, v.reveal ?? sorted.length)} />;
    }
    case 'cartesian':
      return (
        <CartesianGrid relation={v.relation} points={v.relation.pairs.slice(0, v.reveal ?? v.relation.pairs.length)} />
      );
  }
}
