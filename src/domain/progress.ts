import type { StarCount } from './types';

/**
 * Aturan buka-kunci topik:
 * - Topik 0 (Ingat Lagi: Himpunan) dan Topik 1 selalu terbuka.
 * - Topik n (n ≥ 2) terbuka jika topik n−1 sudah mendapat minimal 1 bintang.
 * Catatan: syarat ≥ 70% benar (PRD F7) diterjemahkan menjadi bintang saat Fase 4.
 */
export function isTopicUnlocked(topicId: number, stars: Record<string, StarCount>): boolean {
  if (topicId <= 1) return true;
  return (stars[String(topicId - 1)] ?? 0) > 0;
}

/** Simpan bintang terbaik: nilai baru yang lebih rendah tidak menimpa nilai lama. */
export function mergeStars(
  stars: Record<string, StarCount>,
  id: string,
  value: StarCount,
): Record<string, StarCount> {
  const current = stars[id] ?? 0;
  if (value <= current) return stars;
  return { ...stars, [id]: value };
}

export function totalStars(stars: Record<string, StarCount>): number {
  return Object.values(stars).reduce<number>((sum, n) => sum + n, 0);
}
