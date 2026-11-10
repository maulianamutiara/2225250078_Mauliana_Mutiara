# Analisis Kebutuhan (Hasil Wawancara)

Sumber: *Hasil Wawancara Algoritma Pemrograman — Mauliana Mutiara* (wawancara 06 November 2026,
informan S01, siswa kelas IX SMP, durasi 25 menit, dengan persetujuan siswa & orang tua).
Artefak pemicu: soal Relasi dengan diagram panah dan pasangan berurutan. Bukti: LKS, catatan siswa.

## 1. Kerangka Kode

| Kode | Makna | Fokus pertanyaan |
|---|---|---|
| **IL** | *Intrinsic Load* — beban dari kerumitan materi itu sendiri | Bagian materi yang sulit |
| **EL** | *Extraneous Load* — beban dari cara penyajian yang tidak efektif | Hambatan dari soal/penjelasan/media |
| **GL** | *Germane Load* — usaha mental yang membangun skema/pemahaman | Strategi yang membantu belajar |
| **K** | Kebutuhan / pengalaman / rekomendasi | Harapan terhadap aplikasi |
| **T** | Hasil pengerjaan soal pemicu (dikodekan IL) | Kinerja nyata siswa |

## 2. Ringkasan Temuan per Kategori

### Beban Intrinsik (IL) — dikelola, bukan dihilangkan
| Kode | Temuan | Implikasi |
|---|---|---|
| IL01 | Siswa bisa mendefinisikan relasi dengan bahasa sendiri | Konsep dasar ada → bangun dari situ (aktivasi pengetahuan awal) |
| IL02 | Sulit bila angka/kalimat rumit; harus cek satu-satu | Soal dipecah, mulai dari anggota sedikit |
| IL03, IL04, T02 | Diagram panah ruwet saat anggota banyak; panah tumpang tindih; takut ada yang terlewat | Diagram interaktif dengan tata letak otomatis + penanda anggota yang sudah/belum dipasangkan |
| IL05 | Lupa notasi `{ }` dan `( )`; arah panah terbalik | Template notasi, validasi urutan (a, b), penjelasan arah A → B |
| IL06 | Prasyarat: himpunan + membaca soal | Modul pemanasan "Ingat Lagi: Himpunan" |
| T01 | Bisa membuat pasangan dari aturan | Kemampuan menentukan pasangan sudah cukup baik |

### Beban Ekstrinsik (EL) — diminimalkan
| Kode | Temuan | Implikasi |
|---|---|---|
| EL01, EL02 | Soal cerita berbelit, kalimat panjang, perlu dibaca 2–3 kali | Kalimat pendek, penyorotan informasi penting, pecah soal per langkah |
| EL03, EL04 | Gambar sangat membantu; tidak "abstrak doang" | Setiap konsep disertai visual |
| EL05 | Guru menulis cepat saat waktu habis → tertinggal | Siswa mengatur kecepatan sendiri (*self-paced*), bisa ulang animasi |

### Beban Germane (GL) — didorong
| Kode | Temuan | Implikasi |
|---|---|---|
| GL01, GL02 | Contoh soal dibahas sampai tuntas + gambar | *Worked example* langkah demi langkah |
| GL03 | Menggambar sendiri lebih "nempel" | Siswa membuat panah sendiri (generatif) |
| GL04, GL05 | Bertanya teman, cek ulang coretan, menjelaskan ke teman | Fitur "Jelaskan dengan kata-katamu" / cek ulang jawaban |
| GL06 | Bisa bila soal mirip; transfer ke soal berbeda masih lemah | Variasi soal bertahap + *fading* (bantuan berkurang) |
| GL07 | Membaca ulang & melihat catatan sebelumnya | Tombol "Lihat contoh serupa" & ringkasan yang bisa dibuka kapan saja |

### Kebutuhan Aplikasi (K)
| Kode | Permintaan siswa |
|---|---|
| K04 | Animasi seru + latihan dengan umpan balik benar/salah langsung |
| K05 | Menarik garis panah dengan jari di HP |
| K06 | Penjelasan bagian mana yang keliru |
| K07 | Latihan dari mudah ke sulit (menaikkan percaya diri) |
| K08 | Hint kecil + pembahasan kenapa salah |
| K09 | Sedikit teori panjang, banyak gambar interaktif & contoh |

## 3. Matriks Temuan → Fitur (Traceability)

| ID Fitur | Fitur | Dasar temuan | Prinsip beban kognitif |
|---|---|---|---|
| F1 | Diagram panah interaktif (tarik-lepas dengan jari) | IL03, IL04, T02, K05, GL03 | Kelola IL, dorong GL (generatif) |
| F2 | Penanda anggota sudah/belum dipasangkan + tata letak rapi otomatis | IL04, T02 | Kurangi EL (*split attention*) |
| F3 | Penyusun pasangan berurutan (template notasi) | IL05 | Kelola IL, kurangi EL |
| F4 | Contoh langkah demi langkah (*worked example*) dengan fading | GL01, GL02, GL06 | *Worked example effect*, *fading* |
| F5 | Soal cerita disederhanakan + sorotan info penting | EL01, EL02, IL06 | Kurangi EL |
| F6 | Animasi konsep (bisa diputar ulang, diatur kecepatannya) | EL03, EL04, EL05, K04 | *Modality*, *self-pacing* |
| F7 | Latihan bertingkat (Level 1–4) | K07, GL06, IL02 | Urutan sederhana→kompleks |
| F8 | Umpan balik langsung + hint bertahap + penjelasan kesalahan | K04, K06, K08, GL04 | Kurangi EL, dorong GL |
| F9 | Modul prasyarat "Ingat Lagi: Himpunan" | IL06 | Pengetahuan awal |
| F10 | Ringkasan/kartu catatan yang selalu bisa dibuka | GL07 | Dukung pengulangan |
| F11 | Tampilan minimalis, teks ≤ 3 kalimat per layar | K09 | *Coherence*, kurangi EL |
| F12 | Representasi ganda: diagram panah ↔ pasangan berurutan ↔ diagram Kartesius | Catatan siswa (artefak 4–5), GL06 | Transfer antarrepresentasi |

## 4. Keterbatasan Data
- Hanya **1 informan** (S01). Disarankan menambah 2–4 siswa dan 1 guru matematika agar temuan
  lebih kuat (triangulasi) sebelum validasi ahli.
- Kurikulum yang dipakai sekolah (Merdeka/K13) perlu dikonfirmasi ke guru — memengaruhi istilah
  dan cakupan (lihat `DESAIN_PEMBELAJARAN.md`).
