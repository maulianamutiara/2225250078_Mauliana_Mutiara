// Rencana animasi materi (F6). Murni data/fungsi — diuji otomatis agar setiap animasi ≤ 30 detik.
import { sortPairs } from '../domain/relation';
import type { Pair } from '../domain/types';
import type { Visual } from './types';

/** Jeda antar langkah animasi (ms). Cukup pelan untuk diikuti, bisa dijeda/dilangkahi siswa. */
export const STEP_MS = 1800;
/** Batas durasi animasi menurut prinsip beban kognitif (CLAUDE.md, UI_UX §6). */
export const MAX_ANIMATION_MS = 30_000;

export interface AnimationPlan {
  /** Banyak pasangan yang sudah tampil saat animasi mulai. */
  start: number;
  /** Banyak pasangan saat animasi selesai. */
  total: number;
  /** Urutan pasangan yang ditampilkan. */
  pairs: Pair[];
}

/** Rencana animasi untuk satu gambar materi, atau null bila gambar tidak dianimasikan. */
export function animationPlan(v: Visual): AnimationPlan | null {
  if (v.kind !== 'arrow' && v.kind !== 'pairs' && v.kind !== 'cartesian' && v.kind !== 'convert') return null;
  if (!v.animate) return null;
  // Panah memakai urutan aslinya; bentuk lain diurutkan menurut A lalu B agar rapi.
  const pairs =
    v.kind === 'arrow' ? [...v.relation.pairs] : sortPairs(v.relation.pairs, v.relation.setA, v.relation.setB);
  const reveal = 'reveal' in v ? v.reveal : undefined;
  const total = Math.min(reveal ?? pairs.length, pairs.length);
  // Dengan `reveal`, materi dibuka per layar: animasikan hanya pasangan terbaru.
  const start = reveal !== undefined ? Math.max(0, total - 1) : 0;
  return { start, total, pairs };
}

export function animationDurationMs(plan: AnimationPlan): number {
  return (plan.total - plan.start) * STEP_MS;
}

/** Keterangan singkat di dekat gambar (hindari split attention): apa yang sedang berubah. */
export function conversionCaption(from: 'arrow' | 'pairs', to: 'pairs' | 'cartesian', [a, b]: Pair): string {
  const source = from === 'arrow' ? `Panah ${a} → ${b}` : `Pasangan (${a}, ${b})`;
  return to === 'pairs'
    ? `${source} ditulis (${a}, ${b}).`
    : `${source} menjadi noktah di atas ${a}, sejajar ${b}.`;
}
