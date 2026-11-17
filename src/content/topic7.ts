import { R } from './helpers';
import type { LiteracyTask, TopicContent } from './types';

/**
 * Topik 7 — Tantangan Literasi Matematika.
 * Sumber soal & kisi-kisi: Mauliana Mutiara, "Soal Mathematical Literacy Materi Relasi Kelas 8".
 * Setiap soal skor maksimum 6, dipecah per tahap sesuai kisi-kisi.
 */

export const DAYS = R(
  ['Ana', 'Beni', 'Cici', 'Dodi', 'Eva'],
  ['Senin', 'Rabu', 'Kamis', 'Jumat'],
  'bisa hadir pada hari',
  [
    ['Ana', 'Senin'],
    ['Ana', 'Rabu'],
    ['Beni', 'Rabu'],
    ['Beni', 'Kamis'],
    ['Cici', 'Senin'],
    ['Cici', 'Rabu'],
    ['Cici', 'Jumat'],
    ['Dodi', 'Kamis'],
    ['Dodi', 'Jumat'],
    ['Eva', 'Rabu'],
    ['Eva', 'Jumat'],
  ],
);

export const DRINKS = R(
  ['Rina', 'Sandi', 'Tono', 'Uli', 'Wati'],
  ['es teh', 'jus jeruk', 'air mineral'],
  'memesan',
  [
    ['Rina', 'es teh'],
    ['Rina', 'jus jeruk'],
    ['Sandi', 'es teh'],
    ['Tono', 'air mineral'],
    ['Tono', 'es teh'],
    ['Uli', 'jus jeruk'],
    ['Wati', 'air mineral'],
  ],
);

export const CAKE = R([2, 3, 4, 5], [12, 15, 20], 'faktor dari', [
  [2, 12],
  [2, 20],
  [3, 12],
  [3, 15],
  [4, 12],
  [4, 20],
  [5, 15],
  [5, 20],
]);

export const RIDES = R(
  ['Bayu', 'Caca', 'Dimas'],
  ['komidi putar', 'kereta luncur', 'roller coaster'],
  'boleh naik',
  [
    ['Bayu', 'komidi putar'],
    ['Caca', 'komidi putar'],
    ['Caca', 'kereta luncur'],
    ['Dimas', 'komidi putar'],
    ['Dimas', 'kereta luncur'],
    ['Dimas', 'roller coaster'],
  ],
);

const L1: LiteracyTask = {
  id: 'L1',
  title: 'Memilih Hari Latihan',
  indicator: 'Mathematical Reasoning',
  indicatorDescription:
    'Mengidentifikasi hubungan matematis, membandingkan alternatif, memberi alasan, dan menentukan keputusan.',
  story: [
    'Tim paduan suara punya 5 anggota. Mereka bisa hadir pada hari berikut.',
    'Ana: Senin dan Rabu.',
    'Beni: Rabu dan Kamis.',
    'Cici: Senin, Rabu, dan Jumat.',
    'Dodi: Kamis dan Jumat.',
    'Eva: Rabu dan Jumat.',
    'Relasinya "bisa hadir pada hari" dari himpunan anggota ke himpunan hari {Senin, Rabu, Kamis, Jumat}.',
    'Pelatih ingin memilih satu hari yang dihadiri paling banyak anggota.',
  ],
  question: 'Hari apa yang sebaiknya dipilih pelatih? Jelaskan alasan matematismu.',
  stages: [
    {
      tahap: '1',
      score: 1,
      item: {
        id: 'L1-T1',
        type: 'mcq',
        level: 4,
        functions: ['define', 'multi', 'evidence'],
        prompt: 'Untuk memilih hari, apa yang harus dihitung?',
        options: [
          'Banyak panah yang menuju setiap hari',
          'Banyak hari yang dipilih setiap anggota',
          'Banyak anggota tim',
        ],
        answer: 0,
        optionFeedback: {
          1: 'Itu menghitung dari sisi anggota. Pelatih memilih hari, jadi lihat dari sisi hari.',
          2: 'Banyak anggota tim selalu 5, tidak membantu memilih hari.',
        },
        hints: ['Pelatih ingin tahu hari mana yang paling ramai.', 'Lihat panah yang datang ke setiap hari.'],
        explanation: [
          'Relasinya dari anggota ke hari.',
          'Untuk memilih hari, hitung banyak panah yang menuju setiap hari.',
        ],
      },
    },
    {
      tahap: '2',
      score: 2,
      item: {
        id: 'L1-T2',
        type: 'numbers',
        level: 4,
        functions: ['search', 'analyze', 'evidence'],
        prompt: 'Hitung banyak anggota yang bisa hadir pada setiap hari.',
        helper: DAYS,
        fields: [
          { label: 'Senin', answer: 2 },
          { label: 'Rabu', answer: 4 },
          { label: 'Kamis', answer: 2 },
          { label: 'Jumat', answer: 3 },
        ],
        hints: ['Gambar dulu diagram panahnya di kotak coretan.', 'Rabu: Ana, Beni, Cici, dan Eva.'],
        explanation: [
          'Senin ← Ana, Cici = 2. Rabu ← Ana, Beni, Cici, Eva = 4.',
          'Kamis ← Beni, Dodi = 2. Jumat ← Cici, Dodi, Eva = 3.',
          'Cek: 2 + 4 + 2 + 3 = 11 panah, sama dengan 2 + 2 + 3 + 2 + 2 = 11 dari sisi anggota.',
        ],
      },
    },
    {
      tahap: '3',
      score: 1,
      item: {
        id: 'L1-T3',
        type: 'mcq',
        level: 4,
        functions: ['compare', 'precise', 'evidence'],
        prompt: 'Bandingkan banyak anggota setiap hari. Urutan yang benar adalah ...',
        options: ['Rabu > Jumat > Senin = Kamis', 'Jumat > Rabu > Senin = Kamis', 'Rabu > Senin > Jumat > Kamis'],
        answer: 0,
        hints: ['Pakai hasil hitunganmu di tahap 2.', '4 > 3 > 2 = 2.'],
        explanation: ['Rabu 4, Jumat 3, Senin 2, Kamis 2.', 'Jadi Rabu > Jumat > Senin = Kamis.'],
      },
    },
    {
      tahap: '4',
      score: 1,
      item: {
        id: 'L1-T4',
        type: 'mcq',
        level: 4,
        functions: ['hypo', 'evidence'],
        prompt: 'Hari apa yang sebaiknya dipilih pelatih?',
        options: ['Senin', 'Rabu', 'Kamis', 'Jumat'],
        answer: 1,
        hints: ['Pilih hari dengan anggota terbanyak.', 'Lihat urutan di tahap 3.'],
        explanation: ['Rabu dihadiri anggota paling banyak, yaitu 4 anggota.'],
      },
    },
    {
      tahap: '5',
      score: 1,
      item: {
        id: 'L1-T5',
        type: 'explain',
        functions: ['evidence', 'compare'],
        prompt: 'Jelaskan alasan matematismu memilih hari itu.',
        model:
          'Rabu menerima panah terbanyak, yaitu 4 dari 5 anggota (hanya Dodi yang tidak bisa). Jumat hanya 3 anggota, sedangkan Senin dan Kamis hanya 2 anggota.',
        checklist: [
          'Aku menyebut hari yang dipilih (Rabu).',
          'Aku menyebut banyak anggotanya (4 dari 5).',
          'Aku membandingkan dengan hari lain (Jumat 3, Senin 2, Kamis 2).',
        ],
      },
    },
  ],
};

const L2: LiteracyTask = {
  id: 'L2',
  title: 'Pesanan Minuman Acara Kelas',
  indicator: 'Formulating Situations Mathematically',
  indicatorDescription:
    'Mengidentifikasi informasi relevan, menentukan besaran, dan menerjemahkan situasi nyata menjadi model matematika.',
  story: [
    'Acara kelas diadakan hari Sabtu pukul 09.00 di aula.',
    'Ketua kelas mencatat pesanan minuman.',
    'Rina memesan es teh dan jus jeruk.',
    'Sandi memesan es teh.',
    'Tono memesan air mineral dan es teh.',
    'Uli memesan jus jeruk.',
    'Wati memesan air mineral.',
    'Setiap minuman yang dipesan disiapkan 1 gelas.',
  ],
  question:
    'Ubah situasi menjadi relasi "memesan" dalam bentuk himpunan pasangan berurutan. Lalu tentukan banyak gelas setiap minuman dan seluruhnya.',
  stages: [
    {
      tahap: '1',
      score: 1,
      item: {
        id: 'L2-T1',
        type: 'multi',
        level: 4,
        functions: ['define', 'multi', 'evidence'],
        prompt: 'Pilih semua informasi yang PENTING untuk soal ini.',
        options: ['Nama siswa', 'Minuman yang dipesan', '1 pesanan = 1 gelas', 'Hari Sabtu', 'Pukul 09.00', 'Di aula'],
        answers: [0, 1, 2],
        optionFeedback: {
          3: 'Hari acara tidak dipakai untuk membuat relasi atau menghitung gelas.',
          4: 'Jam acara tidak dipakai untuk membuat relasi atau menghitung gelas.',
          5: 'Tempat acara tidak dipakai untuk membuat relasi atau menghitung gelas.',
        },
        hints: [
          'Informasi penting adalah yang dipakai untuk membuat relasi dan menghitung gelas.',
          'Hari, jam, dan tempat tidak mengubah banyak gelas.',
        ],
        explanation: [
          'Penting: nama siswa, minuman yang dipesan, dan 1 pesanan = 1 gelas.',
          'Hari, jam, dan tempat acara tidak diperlukan.',
        ],
      },
    },
    {
      tahap: '2',
      score: 1,
      item: {
        id: 'L2-T2',
        type: 'mcq',
        level: 4,
        functions: ['label', 'search', 'evidence'],
        prompt: 'Himpunan siswa (daerah asal) adalah ...',
        options: ['A = {Rina, Sandi, Tono, Uli, Wati}', 'A = {Rina, Sandi, Tono, Uli}', 'A = {es teh, jus jeruk, air mineral}'],
        answer: 0,
        optionFeedback: {
          1: 'Ada satu siswa yang terlewat. Cek lagi semua nama.',
          2: 'Itu himpunan minuman, bukan himpunan siswa.',
        },
        hints: ['Daerah asal berisi siswa yang memesan.', 'Ada 5 siswa.'],
        explanation: ['Siswa yang memesan: Rina, Sandi, Tono, Uli, Wati.', 'A = {Rina, Sandi, Tono, Uli, Wati}.'],
      },
    },
    {
      tahap: '3',
      score: 1,
      item: {
        id: 'L2-T3',
        type: 'mcq',
        level: 4,
        functions: ['label', 'precise', 'evidence'],
        prompt: 'Himpunan minuman (daerah kawan) adalah ...',
        options: [
          'B = {es teh, jus jeruk, air mineral}',
          'B = {es teh, jus jeruk}',
          'B = {es teh, es teh, jus jeruk, air mineral}',
        ],
        answer: 0,
        optionFeedback: {
          1: 'Air mineral juga dipesan.',
          2: 'Anggota himpunan tidak ditulis dua kali.',
        },
        hints: ['Tulis setiap jenis minuman satu kali.', 'Ada 3 jenis minuman.'],
        explanation: ['Jenis minuman yang dipesan: es teh, jus jeruk, air mineral.', 'B = {es teh, jus jeruk, air mineral}.'],
      },
    },
    {
      tahap: '4',
      score: 1,
      item: {
        id: 'L2-T4',
        type: 'mcq',
        level: 4,
        functions: ['code', 'precise', 'evidence'],
        prompt: 'Bagaimana cara menulis relasi "memesan" dari A ke B?',
        options: [
          'Setiap pasangan ditulis (nama siswa, minuman), lalu dikumpulkan dalam { }',
          'Setiap pasangan ditulis (minuman, nama siswa), lalu dikumpulkan dalam { }',
          'Setiap pasangan ditulis {nama siswa, minuman}, lalu dikumpulkan dalam ( )',
        ],
        answer: 0,
        optionFeedback: {
          1: 'Urutan terbalik. Relasi dari siswa ke minuman, jadi nama siswa ditulis lebih dulu.',
          2: 'Kurungnya tertukar. Pasangan memakai ( ), kumpulannya memakai { }.',
        },
        hints: ['Relasi dari A ke B: anggota A ditulis lebih dulu.', 'Pasangan memakai kurung biasa, kumpulan memakai kurung kurawal.'],
        explanation: ['Pasangan ditulis (nama siswa, minuman) dengan kurung biasa.', 'Seluruh pasangan dikumpulkan dalam kurung kurawal { }.'],
      },
    },
    {
      tahap: '5',
      score: 1,
      item: {
        id: 'L2-T5',
        type: 'pairs',
        level: 4,
        prompt: 'Susun himpunan pasangan berurutan relasi "memesan".',
        relation: DRINKS,
        hints: ['Baca satu kalimat pesanan, lalu buat pasangannya.', 'Rina dan Tono masing-masing punya dua pasangan.'],
        explanation: [
          'R = {(Rina, es teh), (Rina, jus jeruk), (Sandi, es teh), (Tono, air mineral), (Tono, es teh), (Uli, jus jeruk), (Wati, air mineral)}.',
          'Banyak pasangan = 7.',
        ],
      },
    },
    {
      tahap: '6',
      score: 1,
      item: {
        id: 'L2-T6',
        type: 'numbers',
        level: 4,
        functions: ['analyze', 'relate', 'evidence'],
        prompt: 'Tentukan banyak gelas setiap minuman dan seluruhnya.',
        fields: [
          { label: 'Es teh (gelas)', answer: 3 },
          { label: 'Jus jeruk (gelas)', answer: 2 },
          { label: 'Air mineral (gelas)', answer: 2 },
          { label: 'Seluruhnya (gelas)', answer: 7 },
        ],
        hints: ['Hitung pasangan yang memuat setiap minuman.', 'Total gelas sama dengan banyak pasangan berurutan.'],
        explanation: [
          'Es teh: Rina, Sandi, Tono = 3 gelas.',
          'Jus jeruk: Rina, Uli = 2 gelas. Air mineral: Tono, Wati = 2 gelas.',
          'Seluruhnya 3 + 2 + 2 = 7 gelas, sama dengan banyak pasangan berurutan.',
        ],
      },
    },
  ],
};

const L3: LiteracyTask = {
  id: 'L3',
  title: 'Kotak Kue',
  indicator: 'Employing Mathematical Concepts, Facts, and Procedures',
  indicatorDescription: 'Memilih serta menggunakan konsep, operasi, prosedur, dan strategi matematika untuk memperoleh solusi.',
  story: [
    'Bu Sari menerima tiga pesanan kue: 12 kue, 15 kue, dan 20 kue.',
    'Ia punya kotak yang berisi 2, 3, 4, atau 5 kue.',
    'Satu jenis kotak cocok untuk sebuah pesanan jika semua kue masuk kotak tanpa sisa.',
    'Relasinya "faktor dari", dari P = {2, 3, 4, 5} (isi kotak) ke Q = {12, 15, 20} (banyak kue).',
  ],
  question:
    'Tuliskan himpunan pasangan berurutan relasi tersebut, gambar diagram Kartesiusnya, lalu tentukan banyak pasangan berurutannya.',
  stages: [
    {
      tahap: '1',
      score: 1,
      item: {
        id: 'L3-T1',
        type: 'mcq',
        level: 4,
        functions: ['prior', 'define', 'evidence'],
        prompt: 'Apa arti "a faktor dari b"?',
        options: ['b habis dibagi a', 'a habis dibagi b', 'a lebih kecil dari b'],
        answer: 0,
        optionFeedback: {
          1: 'Terbalik. Isi kotak (a) membagi banyak kue (b).',
          2: 'Lebih kecil saja belum cukup. 4 < 15, tetapi 15 tidak habis dibagi 4.',
        },
        hints: ['Kotak cocok jika semua kue masuk tanpa sisa.', 'Tanpa sisa artinya habis dibagi.'],
        explanation: ['a faktor dari b jika b habis dibagi a.', 'Relasi dari P ke Q, jadi pasangan ditulis (isi kotak, banyak kue).'],
      },
    },
    {
      tahap: '2',
      score: 2,
      scoring: 'perMember',
      item: {
        id: 'L3-T2',
        type: 'arrow',
        level: 4,
        functions: ['search', 'hypo', 'evidence'],
        prompt: 'Periksa setiap isi kotak. Tarik panah ke pesanan yang habis dibagi.',
        relation: CAKE,
        hints: ['Mulai dari 2: apakah 12, 15, dan 20 habis dibagi 2?', '15 : 2 bersisa, 20 : 3 bersisa, 15 : 4 bersisa, 12 : 5 bersisa.'],
        explanation: ['2 → 12 dan 20.', '3 → 12 dan 15.', '4 → 12 dan 20.', '5 → 15 dan 20.'],
      },
    },
    {
      tahap: '3a',
      score: 1,
      item: {
        id: 'L3-T3a',
        type: 'pairs',
        level: 4,
        prompt: 'Tulis himpunan pasangan berurutannya.',
        relation: CAKE,
        hints: ['Satu panah = satu pasangan (isi kotak, banyak kue).', 'Ada 8 pasangan.'],
        explanation: ['R = {(2, 12), (2, 20), (3, 12), (3, 15), (4, 12), (4, 20), (5, 15), (5, 20)}.'],
      },
    },
    {
      tahap: '3b',
      score: 1,
      item: {
        id: 'L3-T3b',
        type: 'cartesian',
        level: 4,
        prompt: 'Gambar diagram Kartesiusnya.',
        relation: CAKE,
        hints: ['Sumbu mendatar: isi kotak (P). Sumbu tegak: banyak kue (Q).', 'Satu pasangan = satu noktah. Ada 8 noktah.'],
        explanation: ['Sumbu mendatar memuat 2, 3, 4, 5. Sumbu tegak memuat 12, 15, 20.', 'Gambar 8 noktah pada pasangan di atas.'],
      },
    },
    {
      tahap: '4',
      score: 1,
      item: {
        id: 'L3-T4',
        type: 'numbers',
        level: 4,
        functions: ['analyze', 'relate', 'evidence'],
        prompt: 'Tentukan banyak pasangan dan banyak jenis kotak yang cocok untuk setiap pesanan.',
        fields: [
          { label: 'Banyak pasangan berurutan', answer: 8 },
          { label: 'Jenis kotak cocok untuk 12 kue', answer: 3 },
          { label: 'Jenis kotak cocok untuk 15 kue', answer: 2 },
          { label: 'Jenis kotak cocok untuk 20 kue', answer: 3 },
        ],
        hints: ['Hitung noktah atau pasangan berurutan.', 'Untuk 12 kue: kotak isi 2, 3, dan 4.'],
        explanation: [
          'Ada 8 pasangan berurutan.',
          '12 kue cocok dengan kotak isi 2, 3, 4. 15 kue cocok dengan kotak isi 3, 5.',
          '20 kue cocok dengan kotak isi 2, 4, 5.',
        ],
      },
    },
  ],
};

const L4: LiteracyTask = {
  id: 'L4',
  title: 'Wahana Permainan',
  indicator: 'Interpreting, Applying, and Evaluating Mathematical Outcomes',
  indicatorDescription:
    'Menafsirkan hasil matematika dalam konteks, menilai kewajaran hasil, dan mengambil keputusan berdasarkan perhitungan.',
  story: [
    'Anak boleh naik wahana jika tinggi badannya sama dengan atau lebih dari batas minimal.',
    'Batas tinggi: komidi putar 100 cm, kereta luncur 120 cm, roller coaster 135 cm.',
    'Tinggi anak: Bayu 115 cm, Caca 128 cm, Dimas 140 cm.',
    'Seorang siswa menulis relasi "boleh naik" dari himpunan anak ke himpunan wahana:',
    '{(komidi putar, Bayu), (kereta luncur, Caca), (roller coaster, Dimas)}',
    'Ia menyimpulkan bahwa setiap anak hanya boleh naik satu wahana.',
  ],
  question: 'Apakah kamu setuju dengan tulisan dan kesimpulan tersebut? Tentukan relasi yang benar dan jelaskan alasanmu.',
  stages: [
    {
      tahap: '1',
      score: 1,
      item: {
        id: 'L4-T1',
        type: 'mcq',
        level: 4,
        functions: ['define', 'compare', 'evidence'],
        prompt: 'Kapan seorang anak dipasangkan dengan sebuah wahana?',
        options: [
          'Jika tinggi anak ≥ batas wahana',
          'Jika tinggi anak tepat sama dengan batas wahana',
          'Jika tinggi anak < batas wahana',
        ],
        answer: 0,
        optionFeedback: {
          1: '"Sama dengan atau lebih dari" berarti anak yang lebih tinggi juga boleh.',
          2: 'Terbalik. Anak yang lebih pendek dari batas tidak boleh naik.',
        },
        hints: ['Baca lagi aturan "sama dengan atau lebih dari".', 'Setiap anak harus dibandingkan dengan ketiga batas.'],
        explanation: ['Anak dipasangkan dengan wahana jika tinggi anak ≥ batas wahana.', 'Jadi setiap anak dibandingkan dengan ketiga batas.'],
      },
    },
    {
      tahap: '2–4',
      score: 3,
      scoring: 'perMember',
      item: {
        id: 'L4-T2',
        type: 'arrow',
        level: 4,
        functions: ['compare', 'search', 'evidence'],
        prompt: 'Bandingkan tinggi setiap anak dengan ketiga batas. Buat diagram panah "boleh naik".',
        relation: RIDES,
        hints: ['Bayu 115 cm: 115 ≥ 100, tetapi 115 < 120 dan 115 < 135.', 'Caca boleh naik dua wahana. Dimas boleh naik tiga wahana.'],
        explanation: [
          'Bayu 115 cm → komidi putar saja.',
          'Caca 128 cm → komidi putar dan kereta luncur (128 < 135).',
          'Dimas 140 cm → komidi putar, kereta luncur, dan roller coaster.',
        ],
      },
    },
    {
      tahap: '5',
      score: 1,
      item: {
        id: 'L4-T5',
        type: 'multi',
        level: 4,
        functions: ['compare', 'hypo', 'evidence'],
        prompt: 'Apa saja kesalahan tulisan dan kesimpulan siswa tersebut? Pilih semua yang benar.',
        options: [
          'Urutan pasangan terbalik',
          'Ada pasangan yang terlewat',
          'Kesimpulan "hanya satu wahana" tidak wajar',
          'Kurung kurawalnya salah',
        ],
        answers: [0, 1, 2],
        optionFeedback: { 3: 'Kurung kurawal { } untuk kumpulan pasangan sudah benar.' },
        hints: ['Relasi dari anak ke wahana: siapa yang ditulis lebih dulu?', 'Bandingkan dengan diagram panahmu di tahap sebelumnya.'],
        explanation: [
          'Urutan terbalik: relasi dari anak ke wahana, jadi nama anak ditulis lebih dulu.',
          'Ada pasangan yang terlewat, sehingga kesimpulan "hanya satu wahana" tidak wajar.',
        ],
      },
    },
    {
      tahap: '6',
      score: 1,
      item: {
        id: 'L4-T6',
        type: 'pairs',
        level: 4,
        prompt: 'Tulis relasi "boleh naik" yang benar.',
        relation: RIDES,
        hints: ['Nama anak ditulis lebih dulu, lalu wahana.', 'Ada 6 pasangan.'],
        explanation: [
          'R = {(Bayu, komidi putar), (Caca, komidi putar), (Caca, kereta luncur), (Dimas, komidi putar), (Dimas, kereta luncur), (Dimas, roller coaster)}.',
          'Ada 6 pasangan. Hanya Bayu yang boleh naik satu wahana.',
        ],
      },
    },
  ],
};

export const literacyTasks: LiteracyTask[] = [L1, L2, L3, L4];

export const topic7: TopicContent = {
  topicId: 7,
  lesson: [
    {
      text: [
        'Soal literasi memakai cerita dari kehidupan sehari-hari.',
        'Kerjakan tahap demi tahap.',
        'Setiap tahap punya skor, totalnya 6 per soal.',
      ],
    },
    {
      text: [
        'Mulai dengan mendefinisikan masalah: relasinya dari himpunan mana ke mana?',
        'Lalu susun, hitung, dan bandingkan.',
        'Tutup dengan alasan dan bukti logis.',
      ],
    },
    {
      text: [
        'Pilih alat berpikir yang paling membantu.',
        'Diagram panah, pasangan berurutan, tabel, atau diagram Kartesius.',
      ],
      visual: { kind: 'tool', tool: 'arrow' },
    },
  ],
  problems: [],
  literacy: literacyTasks,
  summary: [
    'Tentukan dulu arah relasi: dari himpunan mana ke mana.',
    'Periksa setiap anggota satu per satu, lalu hitung.',
    'Tutup dengan alasan dan bukti yang masuk akal.',
  ],
};
