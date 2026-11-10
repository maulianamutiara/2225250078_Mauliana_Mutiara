# Product Requirements Document (PRD) — RelaSI Pintar

| Item | Isi |
|---|---|
| Versi | 0.1 (draf) |
| Tanggal | 10 November 2026 |
| Pemilik | Mauliana Mutiara (2225250078) |
| Status | Perencanaan |

## 1. Latar Belakang
Wawancara dengan siswa SMP (S01) menunjukkan bahwa kesulitan materi Relasi bukan pada konsep
dasarnya, melainkan pada (a) **menyusun diagram panah** ketika anggota banyak, (b) **notasi**
pasangan berurutan dan arah panah, dan (c) **soal cerita** yang kalimatnya panjang. Siswa
terbantu oleh **gambar**, **contoh yang dibahas tuntas**, dan **menggambar sendiri**, serta
meminta **animasi**, **tarik garis dengan jari**, **umpan balik langsung**, **hint**, dan
**latihan bertahap**. Detail: [ANALISIS_KEBUTUHAN.md](ANALISIS_KEBUTUHAN.md).

## 2. Masalah yang Diselesaikan
1. Beban ekstrinsik tinggi dari penyajian (kalimat panjang, tempo guru cepat, diagram berantakan).
2. Beban intrinsik tidak dikelola (soal langsung kompleks, tanpa tahapan).
3. Kurangnya umpan balik segera saat siswa salah.

## 3. Tujuan Produk
| Tujuan | Ukuran keberhasilan |
|---|---|
| Siswa memahami relasi dan 3 cara penyajiannya | Rata-rata skor posttest ≥ KKTP (mis. 75) / N-gain ≥ 0,3 |
| Beban kognitif penyajian rendah | Skor *mental effort* (skala Paas 1–9) rendah–sedang |
| Aplikasi praktis digunakan | Skor kepraktisan (angket siswa/guru) kategori "praktis" ≥ 70% |
| Layak secara materi & media | Validasi ahli kategori "layak" ≥ 70% |

## 4. Pengguna
| Persona | Deskripsi | Kebutuhan utama |
|---|---|---|
| **Siswa SMP kelas VIII** (utama) | 13–14 tahun, memakai HP Android (sering spesifikasi rendah) atau laptop sekolah | Visual, interaktif, singkat, umpan balik |
| **Guru matematika** (sekunder, fase lanjut) | Menggunakan aplikasi di kelas | Melihat progres siswa (opsional, di luar MVP) |
| **Peneliti/validator** | Dosen, ahli materi, ahli media | Menilai kelayakan |

## 5. Ruang Lingkup

### 5.1 Dalam lingkup (MVP)
- Materi **Relasi**: pengertian, diagram panah, himpunan pasangan berurutan, diagram Kartesius.
- Modul prasyarat singkat: himpunan.
- Fitur F1–F12 (lihat bagian 6).
- Berjalan offline; progres tersimpan di perangkat.
- Platform: Web (PWA) + Android (APK).

### 5.2 Di luar lingkup (MVP)
- Materi Fungsi/pemetaan (kandidat versi 2 — tetapi struktur data disiapkan agar mudah ditambah).
- Login akun, server, dashboard guru, leaderboard online.
- iOS (secara teknis mungkin, tidak diprioritaskan).

## 6. Kebutuhan Fungsional

> Prioritas: **P0** = wajib MVP, **P1** = sebaiknya ada, **P2** = nanti.

| ID | Kebutuhan | Prioritas | Kriteria penerimaan |
|---|---|---|---|
| F1 | **Diagram panah interaktif** — siswa menarik garis dari anggota himpunan A ke B dengan jari/mouse | P0 | Panah dibuat dengan drag dari titik A ke titik B; bisa dihapus dengan ketuk panah; berfungsi di layar sentuh 360px |
| F2 | **Penanda kelengkapan** — anggota A yang sudah punya panah diberi tanda; tata letak anggota rapi, panah tidak menembus label | P0 | Anggota tanpa panah terlihat berbeda; label tidak tertutup garis |
| F3 | **Penyusun pasangan berurutan** — siswa memilih/menyeret anggota ke slot `( _ , _ )` dalam kurung kurawal `{ }` | P0 | Notasi otomatis benar; jika urutan terbalik, umpan balik menjelaskan "anggota pertama dari himpunan A" |
| F4 | **Contoh langkah demi langkah** dengan *fading*: contoh penuh → contoh sebagian (siswa melengkapi) → soal mandiri | P0 | Tiap topik punya ≥ 1 contoh penuh dan ≥ 1 contoh sebagian; tombol "Langkah berikutnya" |
| F5 | **Soal cerita disederhanakan** — kalimat pendek, kata kunci disorot, tombol "Pecah soal" | P0 | Kalimat ≤ 20 kata; info penting tersorot warna |
| F6 | **Animasi konsep** yang bisa diputar ulang, dijeda, dan dilangkahi | P0 | Kontrol play/pause/ulang; durasi tiap animasi ≤ 30 detik |
| F7 | **Latihan bertingkat** Level 1–4 (lihat KONTEN_MATERI) | P0 | Level berikutnya terbuka setelah ≥ 70% benar; level bisa diulang |
| F8 | **Umpan balik & hint** — langsung benar/salah, hint bertahap (maks 3), pembahasan kesalahan spesifik | P0 | Setiap soal punya ≥ 2 hint dan penjelasan untuk tiap jenis kesalahan umum |
| F9 | **Ingat Lagi: Himpunan** — pemanasan prasyarat | P1 | 3–5 soal singkat sebelum materi |
| F10 | **Kartu Ringkasan** yang bisa dibuka dari layar mana pun | P1 | Tombol ringkasan di setiap layar latihan |
| F11 | **Tampilan minimalis** — maks 3 kalimat per layar | P0 | Dicek di review konten |
| F12 | **Representasi ganda** — satu relasi ditampilkan sebagai diagram panah ↔ pasangan berurutan ↔ Kartesius, saling sinkron | P1 | Mengubah panah memperbarui pasangan & Kartesius |
| F13 | **Progres & bintang** — penyimpanan progres lokal, bintang per level | P1 | Progres tetap ada setelah aplikasi ditutup |
| F14 | **Refleksi singkat** — "Jelaskan dengan kata-katamu" + skala usaha mental (1–9) setelah level | P1 | Data tersimpan dan bisa diekspor (untuk penelitian) |
| F15 | **Ekspor data penelitian** (CSV/JSON) skor & waktu per soal | P2 | Tombol ekspor di menu tersembunyi/guru |
| F16 | Suara narasi pendek (opsional) | P2 | Bisa dimatikan |

## 7. Kebutuhan Non-Fungsional
| Aspek | Kebutuhan |
|---|---|
| Platform | Web modern (Chrome/Edge/Firefox) + Android 8.0 (API 26) ke atas |
| Performa | Berjalan lancar di HP RAM 2–3 GB; ukuran APK < 20 MB; muat awal web < 3 detik di 4G |
| Offline | Seluruh materi & latihan bisa dipakai tanpa internet setelah dibuka sekali/terinstal |
| Bahasa | Bahasa Indonesia baku sederhana, ramah siswa SMP |
| Aksesibilitas | Target sentuh ≥ 44×44 px, kontras warna WCAG AA, tidak mengandalkan warna saja (pakai ikon/teks) |
| Privasi | Tidak mengumpulkan data pribadi; data tersimpan lokal; nama siswa opsional (pakai kode) |
| Orientasi | Utama potret (portrait); diagram tetap bisa dipakai di lanskap |

## 8. Alur Pengguna Utama
```
Buka aplikasi → Beranda (peta belajar)
  → [Ingat Lagi: Himpunan] (opsional)
  → Topik 1: Apa itu Relasi?  (animasi → contoh → latihan L1)
  → Topik 2: Diagram Panah    (animasi → contoh bertahap → latihan L1–L2)
  → Topik 3: Pasangan Berurutan (animasi → contoh → latihan L2)
  → Topik 4: Diagram Kartesius (animasi → contoh → latihan L2–L3)
  → Topik 5: Satu Relasi, Tiga Wajah (representasi ganda, L3)
  → Tantangan: Soal Cerita (L4)
  → Refleksi + Rekap bintang
```

## 9. Asumsi & Risiko
| Risiko | Mitigasi |
|---|---|
| Interaksi drag tidak nyaman di layar kecil | Alternatif "ketuk A lalu ketuk B" untuk membuat panah |
| HP siswa lambat | SVG ringan, tanpa library 3D, animasi CSS/SVG sederhana |
| Data wawancara hanya 1 siswa | Wawancara tambahan sebelum validasi |
| Kurikulum sekolah berbeda | Konfirmasi ke guru; konten dibuat modular |

## 10. Pertanyaan Terbuka
1. Kurikulum yang dipakai sekolah mitra: Merdeka atau 2013?
2. Apakah perlu dashboard guru di versi penelitian?
3. Model penelitian pengembangan yang dipakai (ADDIE / 4D / Plomp)? — memengaruhi `EVALUASI.md`.
4. Apakah materi Fungsi akan ikut diteliti?
