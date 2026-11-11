import { hasPair, outDegree, uniquePairs } from './relation';
import type { MisconceptionCode, Pair, Relation, StarCount } from './types';

export type AnswerMode = 'arrow' | 'pairs' | 'cartesian';

export interface GradeResult {
  correct: boolean;
  /** Pasangan di kunci yang tidak dijawab siswa. */
  missing: Pair[];
  /** Pasangan siswa yang tidak memenuhi aturan (bukan sekadar terbalik). */
  extra: Pair[];
  /** Pasangan siswa yang urutannya terbalik: (b, a) padahal kunci (a, b). */
  reversed: Pair[];
}

/** Menilai himpunan pasangan siswa terhadap kunci. Urutan antarpasangan tidak penting. */
export function gradePairs(answer: readonly Pair[], key: Relation): GradeResult {
  const given = uniquePairs(answer);
  const reversed: Pair[] = [];
  const extra: Pair[] = [];
  for (const p of given) {
    if (hasPair(key.pairs, p)) continue;
    if (hasPair(key.pairs, [p[1], p[0]])) reversed.push(p);
    else extra.push(p);
  }
  const missing = key.pairs.filter((p) => !hasPair(given, p) && !hasPair(reversed, [p[1], p[0]]));
  const missingAll = key.pairs.filter((p) => !hasPair(given, p));
  return {
    correct: missingAll.length === 0 && extra.length === 0 && reversed.length === 0,
    missing,
    extra,
    reversed,
  };
}

/**
 * Menerjemahkan hasil penilaian menjadi kode kesalahan umum (docs/KONTEN_MATERI.md bagian 8).
 * Urutan hasil = urutan prioritas pesan yang ditampilkan.
 */
export function detectMisconceptions(
  result: GradeResult,
  answer: readonly Pair[],
  key: Relation,
  mode: AnswerMode,
): MisconceptionCode[] {
  if (result.correct) return [];
  const codes: MisconceptionCode[] = [];

  if (result.reversed.length > 0) {
    codes.push(mode === 'cartesian' ? 'M7' : mode === 'arrow' ? 'M1' : 'M2');
  }

  // Pasangan terbalik sudah dilaporkan di atas; untuk cek berikutnya anggap sudah dibalik benar.
  const fixed: Pair[] = answer.map((p) => (hasPair(result.reversed, p) ? [p[1], p[0]] : p));

  // M5: kunci punya anggota A dengan >1 pasangan, tetapi siswa memberi tiap anggota paling banyak 1.
  const keyHasMulti = key.setA.some((a) => outDegree(key.pairs, a) > 1);
  const answerAllSingle = key.setA.every((a) => outDegree(fixed, a) <= 1);
  if (keyHasMulti && answerAllSingle && result.missing.length > 0) codes.push('M5');

  // M4: ada anggota A yang seharusnya punya pasangan tetapi sama sekali belum dipasangkan.
  const forgotten = key.setA.some(
    (a) => outDegree(key.pairs, a) > 0 && outDegree(fixed, a) === 0,
  );
  if (forgotten && !codes.includes('M5')) codes.push('M4');

  if (result.extra.length > 0) codes.push('M6');

  // Masih ada yang kurang tetapi tidak tertangkap kode lain.
  if (codes.length === 0 && result.missing.length > 0) codes.push('M4');
  return codes;
}

/** Bintang per soal: 3 = langsung benar tanpa hint, 2 = sedikit bantuan, 1 = benar setelahnya. */
export function starsForProblem(correct: boolean, tries: number, hintsUsed: number): StarCount {
  if (!correct) return 0;
  if (tries <= 1 && hintsUsed === 0) return 3;
  if (tries <= 2 && hintsUsed <= 1) return 2;
  return 1;
}

/** Ambang lulus topik (PRD F7): minimal 70% soal benar. */
export const PASS_RATIO = 0.7;

/** Bintang topik: 0 jika belum lulus; selain itu rata-rata bintang soal (minimal 1). */
export function starsForTopic(problemStars: readonly StarCount[]): StarCount {
  if (problemStars.length === 0) return 0;
  const passed = problemStars.filter((s) => s > 0).length;
  if (passed / problemStars.length < PASS_RATIO) return 0;
  const mean = problemStars.reduce<number>((s, n) => s + n, 0) / problemStars.length;
  return Math.min(3, Math.max(1, Math.round(mean))) as StarCount;
}
