# Rigorous Mathematical Thinking (RMT) di RelaSI Pintar

Sumber: Kinard, J. T., & Kozulin, A. (2008). *Rigorous Mathematical Thinking: Conceptual
Formation in the Mathematics Classroom*. Cambridge University Press.

## 1. Ringkasan RMT

RMT adalah model pembelajaran matematika yang memadukan dua teori:
- **Alat psikologis (Vygotsky)** — simbol, tabel, diagram, garis bilangan, bidang koordinat, dan
  bahasa matematika adalah *alat* untuk berpikir, bukan sekadar isi pelajaran. Alat ini mula-mula
  dipakai di luar (di kertas/layar), lalu **diinternalisasi** menjadi alat berpikir di dalam kepala.
- **Pengalaman belajar termediasi / Mediated Learning Experience (Feuerstein)** — guru (mediator)
  berdiri di antara siswa dan tugas, dengan tiga kriteria utama:
  1. **Intensionalitas–resiprositas**: interaksi disengaja dan disesuaikan agar siswa ikut terlibat.
  2. **Transendensi**: pelajaran dibawa melampaui soal saat ini ke prinsip umum.
  3. **Mediasi makna**: siswa tahu *mengapa* sesuatu dipelajari.
  Ditambah **mediasi rasa mampu** (*feeling of competence*): menunjukkan bagian yang sudah benar.

Kesulitan matematika sering **bukan** karena kurang pengetahuan matematika, melainkan karena
**fungsi kognitif** prasyaratnya belum berkembang (mis. mencari sistematis, membandingkan,
memberi bukti logis).

### Fungsi kognitif (3 level, Tabel 4.1 buku)
- **Level 1 – berpikir kualitatif umum**: memberi label & membayangkan, membandingkan, mencari
  secara sistematis, memakai lebih dari satu sumber informasi, menyandikan & membaca sandi.
- **Level 2 – berpikir kuantitatif dengan tepat**: menjaga keajegan (*conserving constancy*),
  mengukur ruang & hubungan ruang, mengurai & menyatukan, menggeneralisasi, bersikap tepat.
- **Level 3 – berpikir relasional-abstrak matematis**: mengaktifkan pengetahuan awal, memberi bukti
  logis, mendefinisikan masalah, berpikir hipotesis, membentuk/menyusun ulang hubungan,
  hubungan proporsional, hubungan fungsional, berpikir induktif-deduktif, analogis, dll.

Setiap fungsi kognitif punya komponen **konseptual** (apa artinya), **tindakan** (apa yang
dilakukan), dan **motivasional** (mengapa berguna).

### Alat psikologis khusus matematika
Simbol & kode, sistem bilangan, garis bilangan, **tabel**, **bidang koordinat x-y (Kartesius)**,
rumus/persamaan, dan **bahasa matematika**. Setiap alat punya **struktur** (bentuknya) yang
menentukan **fungsinya** (kegunaannya).

### Proses RMT (3 fase, 6 langkah)
1. **Pengembangan kognitif** — (a) siswa menguasai model/alat sebagai alat psikologis umum
   berdasarkan struktur–fungsinya; (b) siswa mengerjakan tugas kognitif dengan alat itu.
2. **Isi sebagai proses** — (a) membangun konsep dasar dari pengalaman & bahasa sehari-hari;
   (b) menemukan pola & hubungan matematis; (c) menguasai alat khusus matematika.
3. **Praktik konstruksi konsep** — memakai alat untuk mengatur fungsi kognitif dan membangun
   pemahaman konsep.

Sepanjang proses: **rigor** (ketelitian, kejelasan definisi, bukti logis, kedalaman pemahaman),
**refleksi**, dan siswa menulis **jurnal RMT** tentang fungsi kognitif yang dipakai.

## 2. Pemetaan RMT → Fitur Aplikasi

| Unsur RMT | Wujud di aplikasi | Lokasi kode |
|---|---|---|
| Alat psikologis & struktur–fungsi | Kartu **🛠️ Alat Berpikir** di awal topik (himpunan, diagram panah, pasangan berurutan, tabel, Kartesius) | `src/content/rmt.ts` (`tools`), `ToolCard` |
| Fungsi kognitif eksplisit | Label **🧠 fungsi kognitif** di setiap soal; diketuk → definisi + pertanyaan untuk diri sendiri | `cognitiveFunctions`, `functionsFor()`, `FunctionChips` |
| Fase 1–3 RMT | Penanda alur topik: Kenali alat → Bangun konsep → Latihan → Refleksi | `TopicScreen` |
| Representasi ganda / transendensi | Topik 5: panah ↔ pasangan ↔ tabel ↔ Kartesius | `topic5.ts` |
| Memberi bukti logis (rigor) | Setelah benar: **✍️ Bukti logis** "Mengapa jawabanmu benar?" | `EvidenceBox` |
| Jurnal RMT & refleksi | Refleksi: pilih fungsi kognitif yang dipakai + tulis dengan kata-kata sendiri | `ReflectionForm` |
| Mediator (MLE) | **🤖 Mediator AI** (DeepSeek): bertanya balik, tidak memberi jawaban, menyebut fungsi kognitif, mediasi rasa mampu | `src/ai/` |
| Mediasi rasa mampu | Pujian spesifik + umpan balik Mediator AI atas bukti & refleksi | `feedback.ts`, `prompts.ts` |

## 3. Aturan Mediator AI (diterapkan di prompt sistem)
1. Tidak pernah memberi jawaban akhir/kunci — kunci jawaban **tidak dikirim** ke AI sama sekali;
   AI hanya menerima soal, jawaban siswa, dan status hasil pemeriksaan aplikasi.
2. Satu pertanyaan penuntun per balasan; maks 3 kalimat (selaras beban kognitif).
3. Menyebut fungsi kognitif yang sedang dipakai.
4. Menunjukkan bagian yang sudah benar sebelum memberi saran (rasa mampu).
5. Mengaitkan dengan alat berpikir (diagram panah, pasangan, tabel, Kartesius).
6. Mengarahkan kembali jika pertanyaan di luar materi.
