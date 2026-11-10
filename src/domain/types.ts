// Tipe data inti — sesuai docs/ARSITEKTUR.md bagian 3.

export type Member = string; // contoh: "2", "Ani", "Matematika"

/** Pasangan berurutan (a, b): a ∈ A (asal), b ∈ B (tujuan). Urutan tidak boleh dibalik. */
export type Pair = readonly [Member, Member];

export interface Relation {
  setA: Member[];
  setB: Member[];
  rule: string; // contoh: "dua kali dari"
  pairs: Pair[];
}

/** Kode kesalahan umum — lihat docs/KONTEN_MATERI.md bagian 8. */
export type MisconceptionCode = 'M1' | 'M2' | 'M3' | 'M4' | 'M5' | 'M6' | 'M7';

export type StarCount = 0 | 1 | 2 | 3;

export interface Attempt {
  problemId: string;
  correct: boolean;
  tries: number;
  hintsUsed: number;
  misconceptions: MisconceptionCode[];
  durationMs: number;
  at: string; // waktu ISO
}

export interface Reflection {
  topic: number;
  text: string;
  effort: number; // skala usaha mental Paas 1–9
  at: string;
}

export interface Progress {
  studentCode?: string;
  attempts: Attempt[];
  /** Bintang terbaik per topik, kunci = id topik (mis. "1"). */
  stars: Record<string, StarCount>;
  reflections: Reflection[];
}
