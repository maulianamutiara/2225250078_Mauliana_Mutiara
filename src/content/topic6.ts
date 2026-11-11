import { R } from './helpers';
import type { TopicContent } from './types';

/** Topik 6 — Soal Cerita (strategi "Pecah Soal"). */
export const topic6: TopicContent = {
  topicId: 6,
  lesson: [
    {
      text: ['Soal cerita kadang terasa panjang.', 'Jangan panik, pecah soal menjadi tiga langkah.'],
    },
    {
      text: ['Langkah 1: cari anggota himpunan A.', 'Langkah 2: cari anggota himpunan B.', 'Langkah 3: cari kata aturannya.'],
    },
    {
      text: [
        'Contoh: Ani memilih futsal dan pramuka.',
        'A berisi Ani, B berisi Futsal dan Pramuka.',
        'Aturannya "memilih", jadi Ani punya dua panah.',
      ],
      visual: {
        kind: 'arrow',
        relation: R(['Ani'], ['Futsal', 'Pramuka'], 'memilih', [
          ['Ani', 'Futsal'],
          ['Ani', 'Pramuka'],
        ]),
        animate: true,
      },
    },
  ],
  problems: [
    {
      id: 'P6-1',
      type: 'arrow',
      level: 4,
      story: 'Ani memilih futsal dan pramuka. Budi memilih pramuka. Candra memilih paduan suara.',
      prompt: 'Buat diagram panah relasi "memilih".',
      relation: R(['Ani', 'Budi', 'Candra'], ['Futsal', 'Pramuka', 'Paduan Suara'], 'memilih', [
        ['Ani', 'Futsal'],
        ['Ani', 'Pramuka'],
        ['Budi', 'Pramuka'],
        ['Candra', 'Paduan Suara'],
      ]),
      hints: ['Baca satu kalimat, buat panahnya, lalu lanjut.', 'Ani memilih dua kegiatan, jadi Ani punya dua panah.'],
      explanation: ['Ani → Futsal, Ani → Pramuka.', 'Budi → Pramuka.', 'Candra → Paduan Suara.'],
    },
    {
      id: 'P6-2',
      type: 'pairs',
      level: 4,
      story: 'Dika lahir bulan Maret. Eli dan Fani lahir bulan Mei. Gita lahir bulan Juli.',
      prompt: 'Tulis himpunan pasangan berurutan relasi "lahir pada bulan".',
      relation: R(['Dika', 'Eli', 'Fani', 'Gita'], ['Maret', 'Mei', 'Juli', 'Agustus'], 'lahir pada bulan', [
        ['Dika', 'Maret'],
        ['Eli', 'Mei'],
        ['Fani', 'Mei'],
        ['Gita', 'Juli'],
      ]),
      hints: ['Eli dan Fani lahir di bulan yang sama.', 'Agustus tidak disebut, jadi tidak punya pasangan.'],
      explanation: ['{(Dika, Maret), (Eli, Mei), (Fani, Mei), (Gita, Juli)}.', 'Dua anggota A boleh punya pasangan yang sama.'],
    },
    {
      id: 'P6-3',
      type: 'arrow',
      level: 4,
      story: 'Ibu membeli apel di pasar dan supermarket. Jeruk dibeli di pasar. Mangga dibeli di toko buah.',
      prompt: 'Buat diagram panah relasi "dibeli di".',
      relation: R(['Apel', 'Jeruk', 'Mangga'], ['Pasar', 'Toko Buah', 'Supermarket'], 'dibeli di', [
        ['Apel', 'Pasar'],
        ['Apel', 'Supermarket'],
        ['Jeruk', 'Pasar'],
        ['Mangga', 'Toko Buah'],
      ]),
      hints: ['Himpunan A berisi buah, himpunan B berisi tempat.', 'Apel dibeli di dua tempat.'],
      explanation: ['Apel → Pasar, Apel → Supermarket.', 'Jeruk → Pasar.', 'Mangga → Toko Buah.'],
    },
    {
      id: 'P6-4',
      type: 'cartesian',
      level: 4,
      story: 'Hasil ulangan: Hana mendapat nilai 80. Indra dan Joko mendapat 90. Kiki mendapat 70.',
      prompt: 'Gambar relasi "mendapat nilai" pada diagram Kartesius.',
      relation: R(['Hana', 'Indra', 'Joko', 'Kiki'], [70, 80, 90], 'mendapat nilai', [
        ['Hana', 80],
        ['Indra', 90],
        ['Joko', 90],
        ['Kiki', 70],
      ]),
      hints: ['Nama siswa di sumbu mendatar, nilai di sumbu tegak.', 'Indra dan Joko sama-sama sejajar dengan 90.'],
      explanation: ['Pasangannya: (Hana, 80), (Indra, 90), (Joko, 90), (Kiki, 70).', 'Taruh empat noktah.'],
    },
    {
      id: 'P6-5',
      type: 'pairs',
      level: 4,
      story: 'Rumah Lina berjarak 2 km dari sekolah. Rumah Mila berjarak 3 km. Rumah Nia berjarak 2 km.',
      prompt: 'Tulis himpunan pasangan berurutan relasi "jarak rumahnya (km)".',
      relation: R(['Lina', 'Mila', 'Nia'], [1, 2, 3], 'jarak rumahnya (km)', [
        ['Lina', 2],
        ['Mila', 3],
        ['Nia', 2],
      ]),
      hints: ['Himpunan A berisi nama, himpunan B berisi jarak.', 'Lina 2 km, jadi pasangannya (Lina, 2).'],
      explanation: ['{(Lina, 2), (Mila, 3), (Nia, 2)}.', 'Angka 1 tidak punya pasangan.'],
    },
  ],
  summary: [
    'Pecah soal: cari A, cari B, cari aturan.',
    'Baca satu kalimat, lalu buat pasangannya.',
    'Cek lagi apakah semua kalimat sudah dipakai.',
  ],
};
