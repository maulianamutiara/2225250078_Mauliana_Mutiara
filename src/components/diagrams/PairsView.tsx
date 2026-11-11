import { hasPair } from '../../domain/relation';
import type { Pair } from '../../domain/types';
import type { PairMarks } from './ArrowDiagram';

interface PairsViewProps {
  pairs: readonly Pair[];
  name?: string;
  /** Jika diisi, setiap pasangan bisa diketuk untuk dihapus. */
  onRemove?: (p: Pair) => void;
  locked?: readonly Pair[];
  marks?: PairMarks;
}

/** Notasi himpunan pasangan berurutan: R = {(a, b), ...}. a biru (dari A), b oranye (dari B). */
export function PairsView({ pairs, name = 'R', onRemove, locked = [], marks }: PairsViewProps) {
  const wrong = marks?.wrong ?? [];
  return (
    <div className="flex flex-wrap items-center gap-x-1 gap-y-2 text-lg" aria-label="Himpunan pasangan berurutan">
      <span className="font-bold">{name} = {'{'}</span>
      {pairs.length === 0 && <span className="px-2 text-muted">…</span>}
      {pairs.map((p, i) => {
        const isWrong = hasPair(wrong, p);
        const ok = marks?.checked && !isWrong;
        const removable = onRemove && !hasPair(locked, p);
        const body = (
          <>
            ( <span className="font-bold text-set-a">{p[0]}</span>,{' '}
            <span className="font-bold text-set-b">{p[1]}</span> )
            {isWrong && <span className="ml-1 text-fix">✕</span>}
            {ok && <span className="ml-1 text-ok">✓</span>}
          </>
        );
        const cls = [
          'inline-flex items-center rounded-lg border-2 px-2 py-1 whitespace-nowrap',
          isWrong ? 'border-fix bg-red-50' : ok ? 'border-ok bg-green-50' : 'border-line bg-surface',
        ].join(' ');
        return (
          <span key={p.join('|')} className="inline-flex items-center">
            {removable ? (
              <button type="button" className={`${cls} min-h-touch`} onClick={() => onRemove(p)} aria-label={`Hapus pasangan (${p[0]}, ${p[1]})`}>
                {body}
                <span className="ml-1 text-sm text-muted">✕</span>
              </button>
            ) : (
              <span className={cls}>{body}</span>
            )}
            {i < pairs.length - 1 && <span>,</span>}
          </span>
        );
      })}
      <span className="font-bold">{'}'}</span>
    </div>
  );
}
