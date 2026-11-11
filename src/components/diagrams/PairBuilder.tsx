import { useState } from 'react';
import { hasPair } from '../../domain/relation';
import type { Member, Pair, Relation } from '../../domain/types';
import type { PairMarks } from './ArrowDiagram';
import { PairsView } from './PairsView';

interface PairBuilderProps {
  relation: Relation;
  pairs: readonly Pair[];
  locked?: readonly Pair[];
  onAdd: (p: Pair) => void;
  onRemove: (p: Pair) => void;
  marks?: PairMarks;
}

/**
 * Penyusun pasangan berurutan (F3). Siswa memilih anggota pertama dari A, lalu anggota kedua dari B,
 * sehingga notasi { ( , ) } selalu benar dan urutan a–b terlatih (temuan IL05).
 */
export function PairBuilder({ relation, pairs, locked, onAdd, onRemove, marks }: PairBuilderProps) {
  const [first, setFirst] = useState<Member | null>(null);

  const pickB = (b: Member) => {
    if (!first) return;
    if (!hasPair(pairs, [first, b])) onAdd([first, b]);
    setFirst(null);
  };

  return (
    <div className="space-y-4">
      <PairsView pairs={pairs} onRemove={onRemove} locked={locked} marks={marks} />

      <div className="rounded-xl border-2 border-dashed border-line bg-surface p-3">
        <p className="text-center text-xl" aria-live="polite">
          Pasangan baru: ({' '}
          <span className="inline-block min-w-[2ch] font-bold text-set-a">{first ?? '__'}</span>,{' '}
          <span className="inline-block min-w-[2ch] font-bold text-set-b">__</span> )
        </p>

        <p className="mt-3 text-sm font-bold text-set-a">① Pilih anggota pertama (dari A)</p>
        <div className="mt-1 flex flex-wrap gap-2">
          {relation.setA.map((a) => (
            <button
              key={a}
              type="button"
              onClick={() => setFirst(first === a ? null : a)}
              aria-pressed={first === a}
              className={`min-h-touch min-w-touch rounded-xl border-2 border-set-a px-3 font-bold ${
                first === a ? 'bg-set-a text-white' : 'bg-white text-set-a'
              }`}
            >
              {a}
            </button>
          ))}
        </div>

        <p className={`mt-3 text-sm font-bold ${first ? 'text-set-b' : 'text-muted'}`}>
          ② Pilih anggota kedua (dari B)
        </p>
        <div className="mt-1 flex flex-wrap gap-2">
          {relation.setB.map((b) => (
            <button
              key={b}
              type="button"
              disabled={!first}
              onClick={() => pickB(b)}
              className="min-h-touch min-w-touch rounded-xl border-2 border-set-b bg-white px-3 font-bold text-set-b disabled:border-stone-300 disabled:text-stone-400"
            >
              {b}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
