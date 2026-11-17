import type { AnswerMode } from '../domain/grading';
import type { Pair, Relation } from '../domain/types';
import type { CognitiveFunctionId, ToolId } from './rmt';

/** Gambar pendamping di layar materi. `reveal` = banyak pasangan yang sudah ditampilkan. */
export type Visual =
  | { kind: 'set'; name: string; members: string[]; color: 'A' | 'B' }
  | { kind: 'arrow'; relation: Relation; reveal?: number; animate?: boolean }
  | { kind: 'pairs'; relation: Relation; reveal?: number }
  | { kind: 'cartesian'; relation: Relation; reveal?: number }
  | { kind: 'table'; relation: Relation; reveal?: number }
  /** Kartu "Alat Berpikir" RMT: struktur & fungsi sebuah alat psikologis. */
  | { kind: 'tool'; tool: ToolId };

export interface LessonStep {
  /** Maks 3 kalimat, tiap kalimat ≤ 20 kata (diuji otomatis). */
  text: string[];
  visual?: Visual;
}

interface ProblemBase {
  id: string;
  level: 1 | 2 | 3 | 4;
  /** Fungsi kognitif RMT yang dilatih. Jika kosong, diturunkan otomatis (rmt.ts). */
  functions?: CognitiveFunctionId[];
  /** Perintah soal — maks 3 kalimat. */
  prompt: string;
  /** Minimal 2 hint, dari umum ke spesifik. */
  hints: string[];
  /** Pembahasan langkah demi langkah. */
  explanation: string[];
}

export interface McqProblem extends ProblemBase {
  type: 'mcq';
  options: string[];
  answer: number;
  /** Penjelasan khusus jika siswa memilih opsi tertentu yang salah. */
  optionFeedback?: Record<number, string>;
}

export interface RelationProblem extends ProblemBase {
  type: AnswerMode;
  relation: Relation;
  /** Pasangan yang sudah diisikan (contoh sebagian / fading). */
  given?: Pair[];
  /** Tampilkan relasi kunci dalam bentuk lain sebagai bahan soal (Topik 5). */
  show?: AnswerMode;
  /** Teks soal cerita (Topik 6) — anggota himpunan akan disorot otomatis. */
  story?: string;
}

/** Isian angka, mis. "banyak anggota yang hadir hari Rabu". */
export interface NumbersProblem extends ProblemBase {
  type: 'numbers';
  fields: { label: string; answer: number }[];
  /** Diagram panah coretan (tidak dinilai) untuk membantu menghitung. */
  helper?: Relation;
}

/** Pilih semua jawaban yang benar. */
export interface MultiProblem extends ProblemBase {
  type: 'multi';
  options: string[];
  answers: number[];
  optionFeedback?: Record<number, string>;
}

export type Problem = McqProblem | RelationProblem | NumbersProblem | MultiProblem;

export function isRelationProblem(p: Problem): p is RelationProblem {
  return p.type === 'arrow' || p.type === 'pairs' || p.type === 'cartesian';
}

/** Tahap "jelaskan alasanmu": dibandingkan dengan contoh jawaban + daftar periksa (penilaian diri). */
export interface ExplainStage {
  id: string;
  type: 'explain';
  prompt: string;
  model: string;
  checklist: string[];
  functions?: CognitiveFunctionId[];
}

/** Satu tahap soal literasi, mengikuti kisi-kisi penskoran. */
export interface LiteracyStage {
  /** Label tahap sesuai kisi-kisi, mis. "1", "3a", "2–4". */
  tahap: string;
  score: number;
  /** "perMember": skor sebagian menurut banyak anggota A yang pasangannya tepat. */
  scoring?: 'all' | 'perMember';
  item: Problem | ExplainStage;
}

/** Soal literasi matematika: konteks + beberapa tahap berskor. */
export interface LiteracyTask {
  id: string;
  title: string;
  indicator: string;
  indicatorDescription: string;
  /** Bacaan soal; tiap kalimat ≤ 20 kata. */
  story: string[];
  question: string;
  stages: LiteracyStage[];
}

export interface TopicContent {
  topicId: number;
  lesson: LessonStep[];
  problems: Problem[];
  /** Soal literasi bertahap (Topik 7). */
  literacy?: LiteracyTask[];
  /** Kartu ringkasan — maks 3 poin. */
  summary: string[];
}
