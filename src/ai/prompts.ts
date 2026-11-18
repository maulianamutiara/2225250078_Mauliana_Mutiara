// Penyusun KONTEKS untuk Mediator AI (di browser). Aturan pedagogis/prompt sistem ada di
// pedagogy.ts dan disusun oleh BACKEND. File ini hanya merangkum soal & keadaan jawaban siswa.
// PENTING: kunci jawaban (relation.pairs / answer / answers / fields[].answer) TIDAK pernah
// dikirim; AI hanya menerima soal, jawaban siswa, dan status hasil pemeriksaan aplikasi.
import { misconceptionMessages } from '../content/feedback';
import { cognitiveFunctions, functionsFor, type CognitiveFunctionId } from '../content/rmt';
import type { ExplainStage, Problem } from '../content/types';
import { detectMisconceptions, gradePairs } from '../domain/grading';
import { gradeMulti } from '../domain/literacy';
import { formatPairs } from '../domain/relation';
import type { Pair } from '../domain/types';
import { LIMITS, type AiHistoryItem, type AiRequest, type Difficulty, type HintLevel } from './pedagogy';

const answerForm: Record<'arrow' | 'pairs' | 'cartesian', string> = {
  arrow: 'diagram panah (menarik panah dari A ke B)',
  pairs: 'himpunan pasangan berurutan',
  cartesian: 'noktah pada diagram Kartesius',
};

const LETTERS = 'ABCDEFG';

export function functionNames(ids: readonly CognitiveFunctionId[]): string {
  return ids.map((id) => cognitiveFunctions[id].name.toLowerCase()).join(', ');
}

/** Keadaan jawaban siswa saat ini (bagian yang relevan dengan jenis soal). */
export interface AttemptState {
  pairs?: readonly Pair[];
  choice?: number | null;
  values?: readonly (number | null)[];
  selected?: readonly number[];
  tries?: number;
  hintsUsed?: number;
}

/** Deskripsi soal untuk AI — tanpa kunci jawaban. */
export function describeProblem(problem: Problem): string {
  const lines = [`Soal (${problem.id}, level ${problem.level}): ${problem.prompt}`];
  if (problem.type === 'mcq' || problem.type === 'multi') {
    lines.push(`Pilihan: ${problem.options.map((o, i) => `${LETTERS[i]}. ${o}`).join(' | ')}`);
    if (problem.type === 'multi') lines.push('Siswa boleh memilih lebih dari satu.');
  } else if (problem.type === 'numbers') {
    lines.push(`Isian angka yang diminta: ${problem.fields.map((f) => f.label).join('; ')}`);
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

/** Status jawaban siswa saat ini menurut pemeriksa aplikasi — tanpa menyebut kunci. */
export function describeAttempt(problem: Problem, state: AttemptState): string {
  const effort =
    state.tries !== undefined
      ? `\nUsaha siswa: ${state.tries} kali cek jawaban, ${state.hintsUsed ?? 0} hint dibuka.`
      : '';
  return describeAnswer(problem, state) + effort;
}

function describeAnswer(problem: Problem, state: AttemptState): string {
  if (problem.type === 'mcq') {
    const choice = state.choice ?? null;
    if (choice === null) return 'Siswa belum memilih jawaban.';
    return `Siswa memilih ${LETTERS[choice]}. Status: ${choice === problem.answer ? 'BENAR' : 'belum benar'}.`;
  }
  if (problem.type === 'multi') {
    const selected = state.selected ?? [];
    if (selected.length === 0) return 'Siswa belum memilih apa pun.';
    const r = gradeMulti(selected, problem.answers);
    const chosen = [...selected].sort().map((i) => LETTERS[i]).join(', ');
    return r.correct
      ? `Siswa memilih ${chosen}. Status: BENAR.`
      : `Siswa memilih ${chosen}. Status: belum benar. Pilihan benar yang belum dipilih: ${r.missing.length}. Pilihan yang seharusnya tidak dipilih: ${r.extra.length}.`;
  }
  if (problem.type === 'numbers') {
    const values = state.values ?? [];
    if (values.every((v) => v === null || v === undefined)) return 'Siswa belum mengisi angka apa pun.';
    const lines = problem.fields.map((f, i) => {
      const v = values[i];
      if (v === null || v === undefined) return `${f.label}: belum diisi`;
      return `${f.label}: ${v} (${v === f.answer ? 'tepat' : 'belum tepat'})`;
    });
    return `Isian siswa:\n${lines.join('\n')}`;
  }
  const pairs = state.pairs ?? [];
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

function limit(text: string): string {
  return text.slice(0, LIMITS.context);
}

/** Permintaan "🤖 Tanya Mediator" di dalam soal. `context` = bacaan & tahap soal literasi (opsional). */
export function buildMediatorRequest(
  problem: Problem,
  state: AttemptState,
  history: AiHistoryItem[],
  question: string,
  opts: { context?: string; difficulty: Difficulty; hintLevel: HintLevel },
): AiRequest {
  const parts: string[] = [];
  if (opts.context) parts.push(opts.context);
  parts.push(describeProblem(problem), describeAttempt(problem, state));
  return {
    task: 'mediator',
    context: limit(parts.join('\n')),
    question,
    history,
    difficulty: opts.difficulty,
    hintLevel: opts.hintLevel,
  };
}

/** Permintaan tanggapan bukti logis (jawaban sudah benar, pembahasan boleh dipakai sebagai acuan). */
export function buildEvidenceRequest(
  problem: Problem,
  answerText: string,
  evidence: string,
  context?: string,
): AiRequest {
  const parts: string[] = [];
  if (context) parts.push(context);
  parts.push(
    describeProblem(problem),
    `Jawaban siswa (sudah BENAR): ${answerText}`,
    `Pembahasan resmi sebagai acuan: ${problem.explanation.join(' ')}`,
  );
  return { task: 'evidence', context: limit(parts.join('\n')), question: `Bukti logisku: ${evidence}`, history: [] };
}

/** Permintaan tanggapan tahap "jelaskan alasanmu" pada soal literasi. */
export function buildExplainRequest(stage: ExplainStage, context: string, text: string): AiRequest {
  const parts = [
    context,
    `Perintah: ${stage.prompt}`,
    `Contoh jawaban acuan: ${stage.model}`,
    `Kriteria: ${stage.checklist.join(' ')}`,
  ];
  return { task: 'explain', context: limit(parts.join('\n')), question: `Penjelasanku: ${text}`, history: [] };
}

export interface ReflectionInput {
  topicTitle: string;
  summary: string[];
  functionsUsed: CognitiveFunctionId[];
  effort: number | null;
  text: string;
}

/** Permintaan tanggapan jurnal refleksi RMT. */
export function buildReflectionRequest(input: ReflectionInput): AiRequest {
  const context = [
    `Topik: ${input.topicTitle}`,
    `Inti materi: ${input.summary.join(' ')}`,
    `Fungsi kognitif yang menurut siswa ia pakai: ${
      input.functionsUsed.length ? functionNames(input.functionsUsed) : '(belum dipilih)'
    }`,
    `Usaha berpikir (1–9): ${input.effort ?? '(belum dipilih)'}`,
  ].join('\n');
  return { task: 'reflection', context: limit(context), question: `Jurnal refleksiku: ${input.text}`, history: [] };
}
