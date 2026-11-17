// Penilaian soal literasi bertahap (Topik 7) — fungsi murni, wajib dites.
import { PASS_RATIO } from './grading';
import { uniquePairs } from './relation';
import type { Pair, Relation, StarCount } from './types';

/** Isian angka: benar jika semua isian sama dengan kunci. */
export function gradeNumbers(values: readonly (number | null)[], answers: readonly number[]) {
  const wrong = answers.flatMap((a, i) => (values[i] === a ? [] : [i]));
  return { correct: wrong.length === 0, wrong };
}

/** Pilih semua yang benar: benar jika pilihan sama persis dengan kunci. */
export function gradeMulti(selected: readonly number[], answers: readonly number[]) {
  const s = new Set(selected);
  const a = new Set(answers);
  const missing = [...a].filter((i) => !s.has(i));
  const extra = [...s].filter((i) => !a.has(i));
  return { correct: missing.length === 0 && extra.length === 0, missing, extra };
}

/** Banyak anggota A yang semua pasangannya tepat (tidak kurang, tidak lebih). */
export function membersCorrect(answer: readonly Pair[], key: Relation): number {
  const given = uniquePairs(answer);
  return key.setA.filter((a) => {
    const want = key.pairs.filter((p) => p[0] === a).map((p) => p[1]).sort();
    const got = given.filter((p) => p[0] === a).map((p) => p[1]).sort();
    return want.length === got.length && want.every((b, i) => b === got[i]);
  }).length;
}

/** Skor satu tahap: penuh jika benar; "perMember" memberi skor sebagian per anggota A yang tepat. */
export function stageScore(
  max: number,
  correct: boolean,
  scoring: 'all' | 'perMember' = 'all',
  answer?: readonly Pair[],
  key?: Relation,
): number {
  if (correct) return max;
  if (scoring === 'perMember' && answer && key && key.setA.length > 0) {
    return Math.floor((max * membersCorrect(answer, key)) / key.setA.length);
  }
  return 0;
}

/** Bintang dari skor literasi: < 70% → 0; ≥ 90% → 3; ≥ 80% → 2; selebihnya 1. */
export function starsForScore(score: number, max: number): StarCount {
  if (max <= 0) return 0;
  const r = score / max;
  if (r < PASS_RATIO) return 0;
  if (r >= 0.9) return 3;
  if (r >= 0.8) return 2;
  return 1;
}
