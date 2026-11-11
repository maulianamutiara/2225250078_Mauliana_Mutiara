import type { AnswerMode } from '../domain/grading';
import type { Pair, Relation } from '../domain/types';

/** Gambar pendamping di layar materi. `reveal` = banyak pasangan yang sudah ditampilkan. */
export type Visual =
  | { kind: 'set'; name: string; members: string[]; color: 'A' | 'B' }
  | { kind: 'arrow'; relation: Relation; reveal?: number; animate?: boolean }
  | { kind: 'pairs'; relation: Relation; reveal?: number }
  | { kind: 'cartesian'; relation: Relation; reveal?: number };

export interface LessonStep {
  /** Maks 3 kalimat, tiap kalimat ≤ 20 kata (diuji otomatis). */
  text: string[];
  visual?: Visual;
}

interface ProblemBase {
  id: string;
  level: 1 | 2 | 3 | 4;
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

export type Problem = McqProblem | RelationProblem;

export interface TopicContent {
  topicId: number;
  lesson: LessonStep[];
  problems: Problem[];
  /** Kartu ringkasan — maks 3 poin. */
  summary: string[];
}
