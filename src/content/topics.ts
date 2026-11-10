// Daftar topik — urutan dan judul mengikuti docs/KONTEN_MATERI.md.
// Konten adalah data: ubah teks di sini, bukan di komponen.

export interface Topic {
  id: number;
  title: string;
  /** Satu kalimat pendek untuk kartu di Peta Belajar. */
  summary: string;
  optional?: boolean;
}

export const topics: Topic[] = [
  {
    id: 0,
    title: 'Ingat Lagi: Himpunan',
    summary: 'Pemanasan singkat sebelum mulai.',
    optional: true,
  },
  { id: 1, title: 'Apa itu Relasi?', summary: 'Aturan yang memasangkan dua himpunan.' },
  { id: 2, title: 'Diagram Panah', summary: 'Tarik panah dari himpunan A ke B.' },
  { id: 3, title: 'Pasangan Berurutan', summary: 'Tulis setiap panah sebagai (a, b).' },
  { id: 4, title: 'Diagram Kartesius', summary: 'Gambar pasangan sebagai noktah.' },
  { id: 5, title: 'Satu Relasi, Tiga Wajah', summary: 'Ubah dari satu bentuk ke bentuk lain.' },
  { id: 6, title: 'Soal Cerita', summary: 'Pecah soal, lalu selesaikan.' },
];

export function findTopic(id: number): Topic | undefined {
  return topics.find((t) => t.id === id);
}

/** Teks modal "Cara Belajar" di Beranda (maks 3 poin). */
export const howToLearn: string[] = [
  'Tonton animasi singkat. Boleh diulang kapan saja.',
  'Ikuti contoh langkah demi langkah.',
  'Kerjakan latihan. Pakai tombol Hint jika bingung.',
];
