import type { Member, Pair } from './types';

/** Kunci unik untuk pasangan (a, b) — urutan di dalam pasangan penting. */
export function pairKey([a, b]: Pair): string {
  return `${a}\u0000${b}`;
}

export function samePair(p: Pair, q: Pair): boolean {
  return p[0] === q[0] && p[1] === q[1];
}

export function hasPair(pairs: readonly Pair[], p: Pair): boolean {
  return pairs.some((q) => samePair(p, q));
}

/** Tambah pasangan jika belum ada; hapus jika sudah ada. */
export function togglePair(pairs: readonly Pair[], p: Pair): Pair[] {
  return hasPair(pairs, p) ? pairs.filter((q) => !samePair(p, q)) : [...pairs, p];
}

/** Buang pasangan ganda, pertahankan urutan kemunculan pertama. */
export function uniquePairs(pairs: readonly Pair[]): Pair[] {
  const seen = new Set<string>();
  const out: Pair[] = [];
  for (const p of pairs) {
    const k = pairKey(p);
    if (!seen.has(k)) {
      seen.add(k);
      out.push(p);
    }
  }
  return out;
}

/** Banyak pasangan yang berangkat dari anggota a. */
export function outDegree(pairs: readonly Pair[], a: Member): number {
  return pairs.filter((p) => p[0] === a).length;
}

/** Urutkan pasangan mengikuti urutan anggota A lalu B (untuk tampilan yang rapi). */
export function sortPairs(pairs: readonly Pair[], setA: Member[], setB: Member[]): Pair[] {
  return [...pairs].sort(
    (p, q) =>
      setA.indexOf(p[0]) - setA.indexOf(q[0]) || setB.indexOf(p[1]) - setB.indexOf(q[1]),
  );
}

/** Tulis himpunan pasangan berurutan, mis. "{(2, 1), (4, 2)}". */
export function formatPairs(pairs: readonly Pair[]): string {
  return `{${pairs.map(([a, b]) => `(${a}, ${b})`).join(', ')}}`;
}
