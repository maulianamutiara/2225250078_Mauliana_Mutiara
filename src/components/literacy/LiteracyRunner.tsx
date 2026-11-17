import { useState } from 'react';
import { isRelationProblem, type LiteracyTask } from '../../content/types';
import { stageScore } from '../../domain/literacy';
import { ProblemView, type ProblemOutcome } from '../practice/ProblemView';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { ExplainStageView } from './ExplainStageView';

export interface StageResult {
  taskId: string;
  stageId: string;
  tahap: string;
  score: number;
  max: number;
}

interface LiteracyRunnerProps {
  tasks: LiteracyTask[];
  onRecord: (problemId: string, outcome: ProblemOutcome) => void;
  onComplete: (results: StageResult[]) => void;
}

/** Menjalankan soal literasi: bacaan → tahap demi tahap (berskor) → ringkasan skor per soal. */
export function LiteracyRunner({ tasks, onRecord, onComplete }: LiteracyRunnerProps) {
  const [ti, setTi] = useState(0);
  const [si, setSi] = useState(0);
  const [results, setResults] = useState<StageResult[]>([]);
  const [summary, setSummary] = useState(false);
  const [storyOpen, setStoryOpen] = useState(true);

  const task = tasks[ti];
  const stage = task.stages[si];
  const context = [...task.story, `Pertanyaan: ${task.question}`].join('\n');
  const maxScore = task.stages.reduce((s, st) => s + st.score, 0);

  const finishStage = (score: number) => {
    const next = [...results, { taskId: task.id, stageId: stage.item.id, tahap: stage.tahap, score, max: stage.score }];
    setResults(next);
    if (si + 1 < task.stages.length) setSi(si + 1);
    else setSummary(true);
  };

  const onProblemDone = (o: ProblemOutcome) => {
    onRecord(stage.item.id, o);
    const item = stage.item;
    const key = item.type !== 'explain' && isRelationProblem(item) ? item.relation : undefined;
    finishStage(stageScore(stage.score, o.correct, stage.scoring, o.answer, key));
  };

  if (summary) {
    const mine = results.filter((r) => r.taskId === task.id);
    const total = mine.reduce((s, r) => s + r.score, 0);
    const last = ti + 1 >= tasks.length;
    return (
      <div className="space-y-4">
        <Card className="space-y-3">
          <p className="text-sm font-bold uppercase tracking-wide text-brand">Hasil soal {ti + 1}</p>
          <p className="text-xl font-bold">{task.title}</p>
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="text-sm text-muted">
                <th className="border-b-2 border-line py-1">Tahap</th>
                <th className="border-b-2 border-line py-1 text-right">Skor</th>
              </tr>
            </thead>
            <tbody>
              {mine.map((r) => (
                <tr key={r.stageId}>
                  <td className="border-b border-line py-1">Tahap {r.tahap}</td>
                  <td className="border-b border-line py-1 text-right font-bold">
                    {r.score} / {r.max} {r.score === r.max ? '✓' : ''}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td className="py-1 font-bold">Total</td>
                <td className="py-1 text-right text-xl font-bold text-brand">
                  {total} / {maxScore}
                </td>
              </tr>
            </tfoot>
          </table>
        </Card>
        <Button
          block
          onClick={() => {
            if (last) {
              onComplete(results);
              return;
            }
            setTi(ti + 1);
            setSi(0);
            setSummary(false);
            setStoryOpen(true);
          }}
        >
          {last ? 'Lihat hasil akhir →' : 'Soal berikutnya →'}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm font-bold text-muted">
          Soal {ti + 1} / {tasks.length} • {task.indicator}
        </p>
        <h2 className="text-xl font-bold">{task.title}</h2>
      </div>

      <Card className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <p className="font-bold text-brand">📄 Bacaan soal</p>
          <Button variant="ghost" className="text-sm" onClick={() => setStoryOpen((o) => !o)} aria-expanded={storyOpen}>
            {storyOpen ? 'Sembunyikan' : 'Tampilkan'}
          </Button>
        </div>
        {storyOpen && (
          <>
            {task.story.map((line) => (
              <p key={line}>{line}</p>
            ))}
            <p className="font-bold">{task.question}</p>
          </>
        )}
      </Card>

      <div>
        <div className="flex items-center justify-between gap-2">
          <p className="font-bold">
            Tahap {stage.tahap}{' '}
            <span className="text-sm font-normal text-muted">
              ({si + 1} dari {task.stages.length})
            </span>
          </p>
          <span className="rounded-full bg-brand-soft px-3 py-1 text-sm font-bold text-brand">
            Skor maks {stage.score}
          </span>
        </div>
        <div className="mt-2 flex gap-1" aria-hidden>
          {task.stages.map((s, i) => (
            <span key={s.item.id} className={`h-2 flex-1 rounded-full ${i < si ? 'bg-brand' : i === si ? 'bg-brand/50' : 'bg-line'}`} />
          ))}
        </div>
      </div>

      {stage.item.type === 'explain' ? (
        <ExplainStageView
          key={stage.item.id}
          stage={stage.item}
          context={context}
          onDone={(r) => {
            onRecord(stage.item.id, {
              correct: r.allChecked,
              tries: 1,
              hintsUsed: 0,
              misconceptions: [],
              durationMs: r.durationMs,
              evidence: r.text,
            });
            finishStage(r.allChecked ? stage.score : 0);
          }}
        />
      ) : (
        <ProblemView key={stage.item.id} problem={stage.item} context={context} onDone={onProblemDone} />
      )}
    </div>
  );
}
