import type { MisconceptionCode } from '../domain/types';

/** Pesan umpan balik untuk kesalahan umum — docs/KONTEN_MATERI.md bagian 8. */
export const misconceptionMessages: Record<MisconceptionCode, string> = {
  M1: 'Arah panah terbalik. Panah selalu berangkat dari himpunan A menuju himpunan B.',
  M2: 'Urutan tertukar. Anggota pertama dari himpunan A, anggota kedua dari himpunan B.',
  M3: 'Kumpulan pasangan ditulis di dalam { }. Tiap pasangan memakai ( ).',
  M4: 'Masih ada anggota A yang belum dicek. Periksa satu per satu dari atas.',
  M5: 'Ingat, satu anggota A boleh punya lebih dari satu pasangan.',
  M6: 'Ada pasangan yang tidak memenuhi aturan. Cek lagi dengan menghitung.',
  M7: 'Sumbu tertukar. Anggota A di sumbu mendatar, anggota B di sumbu tegak.',
};

export const praise = ['Tepat sekali!', 'Hebat, jawabanmu benar!', 'Benar! Kamu teliti.'];
