import { FACTOR, R, TWICE } from './helpers';
import type { TopicContent } from './types';

/** Topik 5 — Satu Relasi, Tiga Wajah (representasi ganda). */
export const topic5: TopicContent = {
  topicId: 5,
  lesson: [
    {
      text: ['Satu relasi bisa disajikan dengan tiga cara.', 'Pertama: diagram panah.'],
      visual: { kind: 'arrow', relation: TWICE },
    },
    {
      text: ['Kedua: himpunan pasangan berurutan.', 'Relasinya tetap sama.'],
      visual: { kind: 'pairs', relation: TWICE },
    },
    {
      text: ['Ketiga: diagram Kartesius.', 'Satu panah = satu pasangan = satu noktah.'],
      visual: { kind: 'cartesian', relation: TWICE },
    },
    {
      text: ['Contoh lain: relasi "faktor dari".', '1 adalah faktor dari 2, 4, dan 6.', 'Jadi, 1 punya tiga panah.'],
      visual: { kind: 'arrow', relation: FACTOR, animate: true },
    },
  ],
  problems: [
    {
      id: 'P5-1',
      type: 'pairs',
      level: 3,
      show: 'cartesian',
      prompt: 'Diagram Kartesius di atas menunjukkan relasi "faktor dari". Tulis himpunan pasangan berurutannya.',
      relation: FACTOR,
      hints: ['Satu noktah = satu pasangan. Hitung noktahnya.', 'Ada 7 noktah. Mulai dari kolom 1: (1, 2), (1, 4), (1, 6).'],
      explanation: [
        '1 faktor dari 2, 4, 6. 2 faktor dari 2, 4, 6. 3 faktor dari 6.',
        '{(1, 2), (1, 4), (1, 6), (2, 2), (2, 4), (2, 6), (3, 6)}.',
      ],
    },
    {
      id: 'P5-2',
      type: 'arrow',
      level: 3,
      show: 'pairs',
      prompt: 'Gambar himpunan pasangan berurutan di atas sebagai diagram panah.',
      relation: R([2, 3, 4], [4, 6, 8, 9], 'faktor dari', [
        [2, 4],
        [2, 6],
        [2, 8],
        [3, 6],
        [3, 9],
        [4, 4],
        [4, 8],
      ]),
      hints: ['Satu pasangan = satu panah. Ada 7 pasangan.', 'Anggota 2 punya tiga panah: ke 4, 6, dan 8.'],
      explanation: ['2 → 4, 6, 8.', '3 → 6, 9.', '4 → 4, 8.'],
    },
    {
      id: 'P5-3',
      type: 'cartesian',
      level: 3,
      show: 'arrow',
      prompt: 'Gambar diagram panah di atas sebagai diagram Kartesius.',
      relation: R([1, 2, 3], [1, 2, 3], 'sama dengan', [
        [1, 1],
        [2, 2],
        [3, 3],
      ]),
      hints: ['Ubah dulu setiap panah menjadi pasangan.', 'Panah 1 → 1 menjadi noktah (1, 1).'],
      explanation: ['Pasangannya: (1, 1), (2, 2), (3, 3).', 'Noktahnya membentuk garis miring.'],
    },
    {
      id: 'P5-4',
      type: 'arrow',
      level: 3,
      prompt: 'Buat diagram panah relasi "faktor dari".',
      relation: R([2, 3, 5], [4, 6, 9, 10], 'faktor dari', [
        [2, 4],
        [2, 6],
        [2, 10],
        [3, 6],
        [3, 9],
        [5, 10],
      ]),
      hints: [
        'a faktor dari b jika b habis dibagi a.',
        'Cek 2: 4, 6, dan 10 habis dibagi 2.',
        '9 tidak habis dibagi 2. 10 tidak habis dibagi 3.',
      ],
      explanation: ['2 → 4, 6, 10.', '3 → 6, 9.', '5 → 10.'],
    },
    {
      id: 'P5-5',
      type: 'pairs',
      level: 3,
      show: 'arrow',
      prompt: 'Diagram panah di atas menunjukkan relasi "lebih dari". Tulis himpunan pasangan berurutannya.',
      relation: R([3, 4, 5], [2, 3, 4], 'lebih dari', [
        [3, 2],
        [4, 2],
        [4, 3],
        [5, 2],
        [5, 3],
        [5, 4],
      ]),
      hints: ['Satu panah = satu pasangan. Ada 6 panah.', '5 lebih dari 2, 3, dan 4.'],
      explanation: ['3 → 2. 4 → 2, 3. 5 → 2, 3, 4.', '{(3, 2), (4, 2), (4, 3), (5, 2), (5, 3), (5, 4)}.'],
    },
  ],
  summary: [
    'Satu relasi bisa disajikan tiga cara.',
    'Satu panah = satu pasangan = satu noktah.',
    'Pada relasi, satu anggota A boleh punya banyak pasangan.',
  ],
};
