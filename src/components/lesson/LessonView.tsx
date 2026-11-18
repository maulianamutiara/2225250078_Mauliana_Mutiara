import { animationPlan, conversionCaption, STEP_MS, type AnimationPlan } from '../../content/animation';
import type { LessonStep, Visual } from '../../content/types';
import { sortPairs } from '../../domain/relation';
import { ArrowDiagram } from '../diagrams/ArrowDiagram';
import { CartesianGrid } from '../diagrams/CartesianGrid';
import { PairsView } from '../diagrams/PairsView';
import { SetView } from '../diagrams/SetView';
import { TableView } from '../diagrams/TableView';
import { ToolCard } from '../rmt/ToolCard';
import { Button } from '../ui/Button';
import { useStepPlayer } from './useStepPlayer';

interface LessonViewProps {
  step: LessonStep;
  index: number;
  total: number;
  onBack: () => void;
  onNext: () => void;
}

/** Satu layar materi: gambar + maks 3 kalimat + tombol Lanjut (segmenting, self-paced). */
export function LessonView({ step, index, total, onBack, onNext }: LessonViewProps) {
  const v = step.visual;
  const plan = v ? animationPlan(v) : null;

  return (
    <div className="space-y-4">
      <p className="text-sm font-bold text-muted" aria-live="polite">
        Materi {index + 1} / {total}
      </p>

      {v && (
        <div className="rounded-2xl border border-line bg-surface p-3">
          {plan ? <AnimatedVisual key={index} visual={v} plan={plan} /> : <VisualView visual={v} />}
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

/**
 * Animasi konsep (F6): pasangan muncul satu per satu. Siswa bisa ▶ memutar, ⏸ menjeda,
 * ⏭ maju satu langkah, dan ↺ mengulang. Durasi ≤ 30 detik (dijaga tes konten).
 */
function AnimatedVisual({ visual: v, plan }: { visual: Visual; plan: AnimationPlan }) {
  const player = useStepPlayer(plan.start, plan.total, STEP_MS);
  const { shown } = player;
  const moving = shown > plan.start;
  const current = moving ? plan.pairs[shown - 1] : undefined;
  const visible = plan.pairs.slice(0, shown);
  const steps = plan.total - plan.start;

  let body: JSX.Element | null = null;
  if (v.kind === 'arrow') {
    body = <ArrowDiagram relation={v.relation} pairs={visible} animateFrom={moving ? shown - 1 : undefined} />;
  } else if (v.kind === 'pairs') {
    body = <PairsView pairs={visible} highlight={current} animateLast={moving} />;
  } else if (v.kind === 'cartesian') {
    body = <CartesianGrid relation={v.relation} points={visible} highlight={current} />;
  } else if (v.kind === 'convert') {
    body = (
      <div className="space-y-2">
        {v.from === 'arrow' ? (
          <ArrowDiagram relation={v.relation} pairs={plan.pairs} highlight={current} />
        ) : (
          <PairsView pairs={plan.pairs} highlight={current} />
        )}
        <p className="rounded-xl bg-brand-soft px-3 py-2 text-center font-bold text-brand" aria-live="polite">
          {current ? `⬇ ${conversionCaption(v.from, v.to, current)}` : '⬇ Tekan ▶ Putar untuk melihat perubahannya.'}
        </p>
        {v.to === 'pairs' ? (
          <PairsView pairs={visible} highlight={current} animateLast={moving} />
        ) : (
          <CartesianGrid relation={v.relation} points={visible} highlight={current} />
        )}
      </div>
    );
  }

  return (
    <div>
      {body}
      <div className="mt-2 flex flex-wrap items-center justify-center gap-2" role="group" aria-label="Kontrol animasi">
        {player.playing ? (
          <Button variant="secondary" onClick={player.pause}>
            ⏸ Jeda
          </Button>
        ) : (
          <Button variant="secondary" onClick={player.play}>
            ▶ Putar
          </Button>
        )}
        <Button variant="ghost" onClick={player.step} disabled={player.done}>
          ⏭ Langkah
        </Button>
        <Button variant="ghost" onClick={player.restart}>
          ↺ Ulang
        </Button>
        <span className="text-sm text-muted" aria-live="polite">
          Langkah {shown - plan.start}/{steps}
        </span>
      </div>
    </div>
  );
}

function VisualView({ visual: v }: { visual: Visual }) {
  switch (v.kind) {
    case 'set':
      return <SetView name={v.name} members={v.members} color={v.color} />;
    case 'arrow':
      return <ArrowDiagram relation={v.relation} pairs={v.relation.pairs.slice(0, v.reveal ?? v.relation.pairs.length)} />;
    case 'pairs': {
      const sorted = sortPairs(v.relation.pairs, v.relation.setA, v.relation.setB);
      return <PairsView pairs={sorted.slice(0, v.reveal ?? sorted.length)} />;
    }
    case 'cartesian':
      return (
        <CartesianGrid relation={v.relation} points={v.relation.pairs.slice(0, v.reveal ?? v.relation.pairs.length)} />
      );
    case 'table':
      return <TableView relation={v.relation} reveal={v.reveal} />;
    case 'convert':
      return (
        <div className="space-y-2">
          {v.from === 'arrow' ? <ArrowDiagram relation={v.relation} pairs={v.relation.pairs} /> : <PairsView pairs={v.relation.pairs} />}
          {v.to === 'pairs' ? <PairsView pairs={v.relation.pairs} /> : <CartesianGrid relation={v.relation} points={v.relation.pairs} />}
        </div>
      );
    case 'tool':
      return <ToolCard id={v.tool} />;
  }
}
