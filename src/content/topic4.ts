import { R, TWICE } from './helpers';
import type { TopicContent } from './types';

/** Topik 4 — Diagram Kartesius. */
export const topic4: TopicContent = {
  topicId: 4,
  lesson: [
    {
      text: ['Diagram Kartesius memakai dua sumbu.', 'Anggota A di sumbu mendatar.', 'Anggota B di sumbu tegak.'],
      visual: { kind: 'cartesian', relation: TWICE, reveal: 0 },
    },
    {
      text: ['Pasangan (2, 1) digambar sebagai noktah.', 'Letaknya tepat di atas 2 dan sejajar dengan 1.'],
      visual: { kind: 'cartesian', relation: TWICE, reveal: 1 },
    },
    {
      text: ['Gambar semua pasangan dengan cara yang sama.', 'Relasi "dua kali dari" punya tiga noktah.'],
      visual: { kind: 'cartesian', relation: TWICE },
    },
  ],
  problems: [
    {
      id: 'P4-1',
      type: 'mcq',
      level: 1,
      prompt: 'Pada diagram Kartesius, anggota himpunan A diletakkan di ...',
      options: ['sumbu mendatar', 'sumbu tegak', 'dalam lingkaran'],
      answer: 0,
      optionFeedback: { 1: 'Sumbu tegak untuk anggota himpunan B.' },
      hints: ['Pasangan (a, b): a ditulis lebih dulu.', 'Seperti koordinat: yang pertama mendatar.'],
      explanation: ['Anggota A di sumbu mendatar, anggota B di sumbu tegak.'],
    },
    {
      id: 'P4-2',
      type: 'cartesian',
      level: 2,
      prompt: 'Gambar relasi "kurang satu dari" pada diagram Kartesius. Ketuk titik untuk menaruh noktah.',
      relation: R([1, 2, 3], [2, 3, 4], 'kurang satu dari', [
        [1, 2],
        [2, 3],
        [3, 4],
      ]),
      hints: ['Cari pasangannya dulu: 1 kurang satu dari 2.', 'Noktah pertama di atas 1, sejajar 2.'],
      explanation: ['Pasangannya: (1, 2), (2, 3), (3, 4).', 'Taruh noktah di setiap titik temu.'],
    },
    {
      id: 'P4-3',
      type: 'cartesian',
      level: 2,
      prompt: 'Gambar relasi "dua kali dari" pada diagram Kartesius.',
      relation: R([2, 4, 6], [1, 2, 3], 'dua kali dari', [
        [2, 1],
        [4, 2],
        [6, 3],
      ]),
      hints: ['2 dua kali dari 1, jadi pasangan (2, 1).', 'Noktah di atas 2, sejajar 1.'],
      explanation: ['Pasangannya: (2, 1), (4, 2), (6, 3).', 'Taruh noktah di tiga titik temu itu.'],
    },
    {
      id: 'P4-4',
      type: 'cartesian',
      level: 3,
      show: 'pairs',
      prompt: 'Gambar himpunan pasangan berurutan di atas pada diagram Kartesius.',
      relation: R(
        ['Jawa Barat', 'Jawa Tengah', 'Sumatra Utara'],
        ['Bandung', 'Medan', 'Semarang'],
        'beribu kota',
        [
          ['Jawa Barat', 'Bandung'],
          ['Jawa Tengah', 'Semarang'],
          ['Sumatra Utara', 'Medan'],
        ],
      ),
      hints: ['Provinsi di sumbu mendatar, kota di sumbu tegak.', 'Jawa Barat → Bandung: noktah di atas Jawa Barat, sejajar Bandung.'],
      explanation: ['Setiap pasangan menjadi satu noktah.', 'Ada tiga noktah: Jawa Barat–Bandung, Jawa Tengah–Semarang, Sumatra Utara–Medan.'],
    },
    {
      id: 'P4-5',
      type: 'cartesian',
      level: 3,
      prompt: 'Gambar relasi "kurang dari" pada diagram Kartesius.',
      relation: R([1, 2, 3], [1, 2, 3], 'kurang dari', [
        [1, 2],
        [1, 3],
        [2, 3],
      ]),
      hints: ['1 kurang dari 2 dan 3. Jadi 1 punya dua noktah.', '3 tidak kurang dari 1, 2, atau 3.'],
      explanation: ['Pasangannya: (1, 2), (1, 3), (2, 3).', 'Anggota 3 tidak punya noktah.'],
    },
  ],
  summary: [
    'Anggota A di sumbu mendatar, anggota B di sumbu tegak.',
    'Satu pasangan (a, b) = satu noktah.',
    'Noktah tepat di atas a dan sejajar dengan b.',
  ],
};
