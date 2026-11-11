import { R, TWICE } from './helpers';
import type { TopicContent } from './types';

/** Topik 3 — Himpunan Pasangan Berurutan. */
export const topic3: TopicContent = {
  topicId: 3,
  lesson: [
    {
      text: [
        'Setiap panah bisa ditulis sebagai pasangan berurutan (a, b).',
        'a dari himpunan A, b dari himpunan B.',
      ],
      visual: { kind: 'arrow', relation: TWICE },
    },
    {
      text: ['Panah 2 → 1 ditulis (2, 1).', 'Urutannya tidak boleh ditukar.', '(1, 2) artinya panah dari 1 ke 2.'],
      visual: { kind: 'pairs', relation: TWICE, reveal: 1 },
    },
    {
      text: [
        'Semua pasangan dikumpulkan dalam kurung kurawal { }.',
        'Setiap pasangan memakai kurung biasa ( ).',
      ],
      visual: { kind: 'pairs', relation: TWICE },
    },
  ],
  problems: [
    {
      id: 'P3-1',
      type: 'mcq',
      level: 1,
      prompt: 'Panah dari 2 ke 1 ditulis sebagai pasangan berurutan ...',
      options: ['(2, 1)', '(1, 2)', '{2, 1}'],
      answer: 0,
      optionFeedback: {
        1: 'Urutannya terbalik. Anggota pertama dari himpunan A (asal panah).',
        2: 'Pasangan berurutan memakai kurung biasa ( ), bukan { }.',
      },
      hints: ['Anggota pertama adalah asal panah.', 'Panah berangkat dari 2.'],
      explanation: ['Panah berangkat dari 2 menuju 1.', 'Ditulis (2, 1).'],
    },
    {
      id: 'P3-2',
      type: 'pairs',
      level: 2,
      show: 'arrow',
      prompt: 'Tulis diagram panah di atas sebagai himpunan pasangan berurutan.',
      relation: R([1, 2, 3], [2, 3, 4], 'kurang satu dari', [
        [1, 2],
        [2, 3],
        [3, 4],
      ]),
      hints: ['Satu panah = satu pasangan.', 'Panah 1 → 2 ditulis (1, 2).'],
      explanation: ['Ada tiga panah: 1 → 2, 2 → 3, 3 → 4.', 'Jadi: {(1, 2), (2, 3), (3, 4)}.'],
    },
    {
      id: 'P3-3',
      type: 'pairs',
      level: 2,
      prompt: 'Tulis himpunan pasangan berurutan relasi "ibu kota dari".',
      relation: R(
        ['Bandung', 'Semarang', 'Surabaya'],
        ['Jawa Barat', 'Jawa Tengah', 'Jawa Timur'],
        'ibu kota dari',
        [
          ['Bandung', 'Jawa Barat'],
          ['Semarang', 'Jawa Tengah'],
          ['Surabaya', 'Jawa Timur'],
        ],
      ),
      hints: ['Bandung ibu kota provinsi apa?', 'Anggota pertama nama kota, anggota kedua nama provinsi.'],
      explanation: [
        'Bandung ibu kota Jawa Barat.',
        'Semarang ibu kota Jawa Tengah, Surabaya ibu kota Jawa Timur.',
        '{(Bandung, Jawa Barat), (Semarang, Jawa Tengah), (Surabaya, Jawa Timur)}.',
      ],
    },
    {
      id: 'P3-4',
      type: 'pairs',
      level: 2,
      prompt: 'Tulis himpunan pasangan berurutan relasi "setengah dari".',
      relation: R([2, 3, 4], [4, 6, 8], 'setengah dari', [
        [2, 4],
        [3, 6],
        [4, 8],
      ]),
      hints: ['2 setengah dari berapa? Coba 2 × 2.', '2 × 2 = 4, jadi (2, 4).'],
      explanation: ['2 × 2 = 4, 3 × 2 = 6, 4 × 2 = 8.', 'Jadi: {(2, 4), (3, 6), (4, 8)}.'],
    },
    {
      id: 'P3-5',
      type: 'pairs',
      level: 2,
      prompt: 'Tulis himpunan pasangan berurutan relasi "dua lebihnya dari".',
      relation: R([5, 6, 7], [3, 4, 5], 'dua lebihnya dari', [
        [5, 3],
        [6, 4],
        [7, 5],
      ]),
      hints: ['5 dua lebihnya dari berapa?', '5 − 2 = 3, jadi (5, 3).'],
      explanation: ['5 − 2 = 3, 6 − 2 = 4, 7 − 2 = 5.', 'Jadi: {(5, 3), (6, 4), (7, 5)}.'],
    },
  ],
  summary: [
    'Satu panah = satu pasangan berurutan (a, b).',
    'a dari A, b dari B — urutan tidak boleh ditukar.',
    'Ditulis: { (a, b), (a, b), ... }.',
  ],
};
