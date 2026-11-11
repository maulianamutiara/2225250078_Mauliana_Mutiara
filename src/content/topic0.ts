import type { TopicContent } from './types';

/** Topik 0 — Ingat Lagi: Himpunan (prasyarat, opsional). */
export const topic0: TopicContent = {
  topicId: 0,
  lesson: [
    {
      text: [
        'Himpunan adalah kumpulan benda yang anggotanya jelas.',
        'Himpunan ditulis dengan kurung kurawal { }.',
      ],
      visual: { kind: 'set', name: 'A', members: ['Ani', 'Budi', 'Candra'], color: 'A' },
    },
    {
      text: ['Ani adalah anggota himpunan A.', 'Ditulis: Ani ∈ A.', 'Banyak anggota A ada 3.'],
      visual: { kind: 'set', name: 'A', members: ['Ani', 'Budi', 'Candra'], color: 'A' },
    },
    {
      text: ['Anggota himpunan juga bisa berupa bilangan.', 'Contoh: B = {1, 2, 3, 4, 5}.'],
      visual: { kind: 'set', name: 'B', members: ['1', '2', '3', '4', '5'], color: 'B' },
    },
  ],
  problems: [
    {
      id: 'H0-1',
      type: 'mcq',
      level: 1,
      prompt: 'A = {Ani, Budi, Candra}. Berapa banyak anggota A?',
      options: ['2', '3', '4'],
      answer: 1,
      hints: ['Hitung nama di dalam kurung kurawal.', 'Ada Ani, Budi, dan Candra.'],
      explanation: ['Anggota A: Ani, Budi, Candra.', 'Jadi, banyak anggota A adalah 3.'],
    },
    {
      id: 'H0-2',
      type: 'mcq',
      level: 1,
      prompt: 'Manakah penulisan himpunan yang benar?',
      options: ['{2, 4, 6}', '(2, 4, 6)', '[2, 4, 6]'],
      answer: 0,
      optionFeedback: { 1: 'Kurung biasa ( ) dipakai untuk pasangan berurutan, bukan himpunan.' },
      hints: ['Ingat bentuk kurung untuk himpunan.', 'Himpunan memakai kurung kurawal { }.'],
      explanation: ['Himpunan selalu ditulis dengan kurung kurawal.', 'Jawaban: {2, 4, 6}.'],
    },
    {
      id: 'H0-3',
      type: 'mcq',
      level: 1,
      prompt: 'B = {Matematika, IPA, IPS}. Manakah anggota B?',
      options: ['Seni Budaya', 'IPA', 'Olahraga'],
      answer: 1,
      hints: ['Lihat isi kurung kurawal B.', 'Cari pilihan yang tertulis di dalam B.'],
      explanation: ['Isi B: Matematika, IPA, IPS.', 'Hanya IPA yang ada di dalam B.'],
    },
    {
      id: 'H0-4',
      type: 'mcq',
      level: 1,
      prompt: 'Manakah himpunan bilangan genap antara 1 dan 7?',
      options: ['{2, 4, 6}', '{1, 3, 5, 7}', '{2, 4, 6, 8}'],
      answer: 0,
      optionFeedback: {
        1: 'Itu bilangan ganjil. Bilangan genap habis dibagi 2.',
        2: '8 lebih dari 7, jadi tidak termasuk.',
      },
      hints: ['Bilangan genap habis dibagi 2.', 'Cari bilangan genap yang lebih dari 1 dan kurang dari 7.'],
      explanation: ['Bilangan genap antara 1 dan 7: 2, 4, 6.', 'Jawaban: {2, 4, 6}.'],
    },
  ],
  summary: [
    'Himpunan = kumpulan yang anggotanya jelas.',
    'Himpunan ditulis dengan kurung kurawal { }.',
    'Tanda ∈ artinya "anggota dari".',
  ],
};
