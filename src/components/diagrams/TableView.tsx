import { sortPairs } from '../../domain/relation';
import type { Relation } from '../../domain/types';

/** Relasi sebagai tabel: kolom A (biru) dan kolom B (oranye); satu baris = satu pasangan. */
export function TableView({ relation, reveal }: { relation: Relation; reveal?: number }) {
  const pairs = sortPairs(relation.pairs, relation.setA, relation.setB).slice(
    0,
    reveal ?? relation.pairs.length,
  );
  return (
    <table className="mx-auto w-full max-w-xs border-collapse text-center text-lg">
      <caption className="pb-2 text-sm text-muted">Relasi "{relation.rule}"</caption>
      <thead>
        <tr>
          <th className="border-2 border-line bg-blue-50 py-1 text-set-a">A</th>
          <th className="border-2 border-line bg-orange-50 py-1 text-set-b">B</th>
        </tr>
      </thead>
      <tbody>
        {pairs.map(([a, b]) => (
          <tr key={`${a}|${b}`}>
            <td className="border-2 border-line bg-surface py-1 font-bold text-set-a">{a}</td>
            <td className="border-2 border-line bg-surface py-1 font-bold text-set-b">{b}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
