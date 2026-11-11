import { R, TWICE } from './helpers';
import type { TopicContent } from './types';

/** Topik 2 — Diagram Panah (contoh langkah demi langkah + fading). */
export const topic2: TopicContent = {
  topicId: 2,
  lesson: [
    {
      text: [
        'Diagram panah: himpunan A di kiri, himpunan B di kanan.',
        'Contoh relasi: "dua kali dari".',
      ],
      visual: { kind: 'arrow', relation: TWICE, reveal: 0 },
    },
    {
      text: ['Langkah 1: ambil anggota 2.', '2 dua kali dari 1.', 'Tarik panah dari 2 ke 1.'],
      visual: { kind: 'arrow', relation: TWICE, reveal: 1, animate: true },
    },
    {
      text: ['Langkah 2: ambil anggota 4.', '4 dua kali dari 2.', 'Tarik panah dari 4 ke 2.'],
      visual: { kind: 'arrow', relation: TWICE, reveal: 2, animate: true },
    },
    {
      text: ['Langkah 3: ambil anggota 6.', '6 dua kali dari 3.', 'Semua anggota A sudah dicek.'],
      visual: { kind: 'arrow', relation: TWICE, reveal: 3, animate: true },
    },
    {
      text: [
        'Anggota B boleh tidak punya panah, seperti 4 dan 5.',
        'Satu anggota A juga boleh punya lebih dari satu panah.',
      ],
      visual: { kind: 'arrow', relation: TWICE },
    },
  ],
  problems: [
    {
      id: 'P2-1',
      type: 'arrow',
      level: 1,
      prompt: 'Relasi "kurang satu dari". Dua panah sudah ada. Lengkapi panah yang kurang.',
      relation: R([1, 2, 3], [2, 3, 4], 'kurang satu dari', [
        [1, 2],
        [2, 3],
        [3, 4],
      ]),
      given: [
        ['1', '2'],
        ['2', '3'],
      ],
      hints: ['Anggota 3 belum punya panah.', '3 kurang satu dari 4.'],
      explanation: ['1 + 1 = 2, 2 + 1 = 3, 3 + 1 = 4.', 'Panah yang kurang: 3 → 4.'],
    },
    {
      id: 'P2-2',
      type: 'arrow',
      level: 1,
      prompt: 'Doni gemar catur. Eka gemar renang. Buat diagram panah relasi "gemar".',
      relation: R(['Doni', 'Eka'], ['Futsal', 'Renang', 'Catur'], 'gemar', [
        ['Doni', 'Catur'],
        ['Eka', 'Renang'],
      ]),
      hints: ['Futsal tidak disebut dalam kalimat.', 'Doni → Catur. Sekarang Eka?'],
      explanation: ['Doni gemar catur: Doni → Catur.', 'Eka gemar renang: Eka → Renang.', 'Futsal tidak punya panah.'],
    },
    {
      id: 'P2-3',
      type: 'arrow',
      level: 2,
      prompt: 'Buat diagram panah relasi "dua kali dari".',
      relation: R([4, 6, 8], [2, 3, 4, 5], 'dua kali dari', [
        [4, 2],
        [6, 3],
        [8, 4],
      ]),
      hints: ['4 dua kali dari berapa? Coba 4 : 2.', '4 : 2 = 2, 6 : 2 = 3, 8 : 2 = 4.'],
      explanation: ['4 = 2 × 2, jadi 4 → 2.', '6 = 2 × 3, jadi 6 → 3.', '8 = 2 × 4, jadi 8 → 4.'],
    },
    {
      id: 'P2-4',
      type: 'arrow',
      level: 2,
      prompt: 'Buat diagram panah relasi "dua kurangnya dari".',
      relation: R([1, 2, 3], [3, 4, 5, 6], 'dua kurangnya dari', [
        [1, 3],
        [2, 4],
        [3, 5],
      ]),
      hints: ['1 dua kurangnya dari berapa?', '1 + 2 = 3. Jadi panah dari 1 ke 3.'],
      explanation: ['1 + 2 = 3, jadi 1 → 3.', '2 + 2 = 4, jadi 2 → 4.', '3 + 2 = 5, jadi 3 → 5.'],
    },
    {
      id: 'P2-5',
      type: 'arrow',
      level: 2,
      prompt: 'Buat diagram panah relasi "satu lebihnya dari".',
      relation: R([3, 5, 7], [1, 2, 4, 6], 'satu lebihnya dari', [
        [3, 2],
        [5, 4],
        [7, 6],
      ]),
      hints: ['3 satu lebihnya dari berapa?', '3 − 1 = 2. Jadi panah dari 3 ke 2.'],
      explanation: ['3 − 1 = 2, jadi 3 → 2.', '5 − 1 = 4, jadi 5 → 4.', '7 − 1 = 6, jadi 7 → 6.'],
    },
    {
      id: 'P2-6',
      type: 'arrow',
      level: 2,
      prompt: 'Buat diagram panah relasi "setengah dari".',
      relation: R([1, 2, 3], [2, 4, 6, 8], 'setengah dari', [
        [1, 2],
        [2, 4],
        [3, 6],
      ]),
      hints: ['1 setengah dari berapa? Coba 1 × 2.', '1 × 2 = 2, 2 × 2 = 4, 3 × 2 = 6.'],
      explanation: ['1 setengah dari 2: 1 → 2.', '2 setengah dari 4: 2 → 4.', '3 setengah dari 6: 3 → 6.'],
    },
  ],
  summary: [
    'A di kiri, B di kanan, panah dari A ke B.',
    'Cek anggota A satu per satu terhadap aturan.',
    'Anggota B boleh tanpa panah; anggota A boleh punya banyak panah.',
  ],
};
