// Prompt Mediator AI berbasis RMT + Mediated Learning Experience (docs/RMT.md §3).
// PENTING: kunci jawaban (relation.pairs / answer) TIDAK pernah dimasukkan ke prompt,
// sehingga AI tidak mungkin membocorkannya. AI hanya menerima soal, jawaban siswa,
// dan status hasil pemeriksaan aplikasi.
import { misconceptionMessages } from '../content/feedback';
import { cognitiveFunctions, functionsFor, type CognitiveFunctionId } from '../content/rmt';
import type { Problem } from '../content/types';
import { detectMisconceptions, gradePairs } from '../domain/grading';
import { formatPairs } from '../domain/relation';
import type { Pair } from '../domain/types';
import type { ChatMessage } from './client';

const COMMON_RULES = [
  'Kamu adalah "Mediator", pendamping belajar matematika siswa SMP kelas VIII di aplikasi RelaSI Pintar (materi Relasi).',
  'Pendekatanmu: Rigorous Mathematical Thinking (Kinard & Kozulin) dan Mediated Learning Experience (Feuerstein).',
  'Selalu pakai Bahasa Indonesia sederhana, ramah, maksimal 3 kalimat pendek, tanpa format markdown.',
  'Pasangan berurutan (a, b): a selalu dari himpunan A, b dari himpunan B. Panah selalu dari A ke B.',
  'Jika pertanyaan di luar materi relasi, arahkan kembali ke soal dengan sopan.',
];

export const MEDIATOR_SYSTEM = [
  ...COMMON_RULES,
  'Aturan mediasi:',
  '1. JANGAN pernah memberi jawaban akhir, kunci, atau menyebutkan pasangan yang benar.',
  '2. Ajukan tepat satu pertanyaan penuntun agar siswa berpikir sendiri.',
  '3. Sebut satu fungsi kognitif yang sedang dipakai, misalnya "mencari secara sistematis" atau "memberi bukti logis".',
  '4. Jika ada bagian yang sudah benar, sebutkan dulu agar siswa merasa mampu.',
  '5. Kaitkan dengan alat berpikir: diagram panah, pasangan berurutan, tabel, atau diagram Kartesius.',
  '6. Jika status jawaban BENAR, minta siswa menjelaskan bukti logisnya.',
].join('\n');

export const EVIDENCE_SYSTEM = [
  ...COMMON_RULES,
  'Tugasmu: menanggapi "bukti logis" yang ditulis siswa untuk jawaban yang SUDAH BENAR.',
  '1. Sebutkan bagian bukti yang sudah tepat (mediasi rasa mampu).',
  '2. Beri satu saran agar bukti lebih tepat atau lengkap, misalnya menyebut aturan atau menghitung.',
  '3. Jangan memberi soal baru dan jangan menilai dengan angka.',
].join('\n');

export const REFLECTION_SYSTEM = [
  ...COMMON_RULES,
  'Tugasmu: menanggapi jurnal refleksi siswa setelah satu topik.',
  '1. Hargai usaha siswa dan sebut satu hal yang sudah ia pahami.',
  '2. Jika ada salah konsep, luruskan dengan lembut dalam satu kalimat.',
  '3. Hubungkan dengan satu fungsi kognitif yang ia pakai, lalu ajukan satu pertanyaan untuk dipikirkan.',
].join('\n');

const answerForm: Record<Exclude<Problem['type'], 'mcq'>, string> = {
  arrow: 'diagram panah (menarik panah dari A ke B)',
  pairs: 'himpunan pasangan berurutan',
  cartesian: 'noktah pada diagram Kartesius',
};

const LETTERS = 'ABCDEFG';

export function functionNames(ids: readonly CognitiveFunctionId[]): string {
  return ids.map((id) => cognitiveFunctions[id].name.toLowerCase()).join(', ');
}

/** Deskripsi soal untuk AI — tanpa kunci jawaban. */
export function describeProblem(problem: Problem): string {
  const lines = [`Soal (${problem.id}, level ${problem.level}): ${problem.prompt}`];
  if (problem.type === 'mcq') {
    lines.push(`Pilihan: ${problem.options.map((o, i) => `${LETTERS[i]}. ${o}`).join(' | ')}`);
  } else {
    if (problem.story) lines.push(`Cerita: ${problem.story}`);
    const { setA, setB, rule } = problem.relation;
    lines.push(`Himpunan A = {${setA.join(', ')}}`);
    lines.push(`Himpunan B = {${setB.join(', ')}}`);
    lines.push(`Aturan relasi: "${rule}"`);
    lines.push(`Bentuk jawaban: ${answerForm[problem.type]}`);
  }
  lines.push(`Fungsi kognitif yang dilatih: ${functionNames(functionsFor(problem))}`);
  return lines.join('\n');
}

/** Status jawaban siswa saat ini menurut pemeriksa aplikasi — tanpa menyebut pasangan kunci. */
export function describeAttempt(problem: Problem, pairs: readonly Pair[], choice: number | null): string {
  if (problem.type === 'mcq') {
    if (choice === null) return 'Siswa belum memilih jawaban.';
    return `Siswa memilih ${LETTERS[choice]}. Status: ${choice === problem.answer ? 'BENAR' : 'belum benar'}.`;
  }
  if (pairs.length === 0) return 'Siswa belum membuat pasangan apa pun.';
  const result = gradePairs(pairs, problem.relation);
  const lines = [`Jawaban siswa saat ini: ${formatPairs(pairs)}`];
  if (result.correct) {
    lines.push('Status: BENAR.');
  } else {
    lines.push(
      `Status: belum benar. Banyak pasangan yang masih kurang: ${result.missing.length}. ` +
        `Banyak pasangan yang tidak sesuai aturan: ${result.extra.length}. ` +
        `Banyak pasangan yang urutannya terbalik: ${result.reversed.length}.`,
    );
    for (const code of detectMisconceptions(result, pairs, problem.relation, problem.type)) {
      lines.push(`Kesalahan terdeteksi: ${misconceptionMessages[code]}`);
    }
  }
  return lines.join('\n');
}

/** Pesan untuk "🤖 Tanya Mediator" di dalam soal. */
export function buildMediatorMessages(
  problem: Problem,
  pairs: readonly Pair[],
  choice: number | null,
  history: readonly ChatMessage[],
  question: string,
): ChatMessage[] {
  const context = `KONTEKS (untukmu saja):\n${describeProblem(problem)}\n${describeAttempt(problem, pairs, choice)}`;
  return [
    { role: 'system', content: `${MEDIATOR_SYSTEM}\n\n${context}` },
    ...history.slice(-8),
    { role: 'user', content: question },
  ];
}

/** Pesan untuk menanggapi bukti logis siswa (jawaban sudah benar, pembahasan boleh dipakai). */
export function buildEvidenceMessages(problem: Problem, answerText: string, evidence: string): ChatMessage[] {
  const context = [
    'KONTEKS (untukmu saja):',
    describeProblem(problem),
    `Jawaban siswa (sudah BENAR): ${answerText}`,
    `Pembahasan resmi sebagai acuan: ${problem.explanation.join(' ')}`,
  ].join('\n');
  return [
    { role: 'system', content: `${EVIDENCE_SYSTEM}\n\n${context}` },
    { role: 'user', content: `Bukti logisku: ${evidence}` },
  ];
}

export interface ReflectionInput {
  topicTitle: string;
  summary: string[];
  functionsUsed: CognitiveFunctionId[];
  effort: number | null;
  text: string;
}

/** Pesan untuk menanggapi jurnal refleksi RMT. */
export function buildReflectionMessages(input: ReflectionInput): ChatMessage[] {
  const context = [
    'KONTEKS (untukmu saja):',
    `Topik: ${input.topicTitle}`,
    `Inti materi: ${input.summary.join(' ')}`,
    `Fungsi kognitif yang menurut siswa ia pakai: ${
      input.functionsUsed.length ? functionNames(input.functionsUsed) : '(belum dipilih)'
    }`,
    `Usaha berpikir (1–9): ${input.effort ?? '(belum dipilih)'}`,
  ].join('\n');
  return [
    { role: 'system', content: `${REFLECTION_SYSTEM}\n\n${context}` },
    { role: 'user', content: `Jurnal refleksiku: ${input.text}` },
  ];
}
