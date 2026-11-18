# Roadmap Pengembangan

Perkiraan total: **±10 minggu** kerja paruh waktu. Sesuaikan dengan jadwal skripsi/tugas.

## Fase 0 — Perencanaan (minggu 1) ✅ sedang berjalan
- [x] Wawancara siswa S01
- [x] Dokumen perencanaan (README, CLAUDE.md, docs/*)
- [ ] Wawancara tambahan (2–4 siswa, 1 guru) — opsional tetapi disarankan
- [ ] Konfirmasi kurikulum & CP/TP dengan guru
- [ ] Review dokumen oleh dosen pembimbing

## Fase 1 — Fondasi Proyek (minggu 2) ✅ selesai 10 Nov 2026
- [x] Inisialisasi Vite + React + TypeScript + Tailwind
- [x] Konfigurasi Vitest, ESLint, Prettier
- [x] Token desain & komponen UI dasar (Button, Card, Modal, Stars)
- [x] Router & kerangka layar S1–S2 (Beranda/Peta Belajar) + penampung layar topik
- [x] `lib/storage.ts` + store progres
- [ ] Dicoba langsung di layar HP 360px (perlu dicek manual oleh pemilik proyek)

## Fase 2 — Logika Domain (minggu 3) ✅ selesai 11 Nov 2026
- [x] `domain/relation.ts` (bantuan pasangan: toggle, urut, format notasi)
- [x] `domain/grading.ts` — penilaian + deteksi kesalahan M1–M7 + bintang soal/topik
- [x] Unit test lengkap untuk semua fungsi domain

## Fase 3 — Komponen Interaktif Inti (minggu 4–5) — versi dasar selesai 11 Nov 2026
- [x] **ArrowDiagram** (F1, F2): seret + ketuk-ketuk, snap, ketuk panah untuk hapus, penanda ✓, label di luar titik
- [x] **PairBuilder** (F3): pilih anggota A lalu B, notasi { ( , ) } otomatis
- [x] **CartesianGrid**: ketuk titik temu untuk menaruh noktah
- [x] Alur umpan balik (F8): pesan khusus M1–M7, hint bertahap, pembahasan setelah 3 kali salah
- [ ] Representasi ganda tersinkron dalam satu layar (F12) — Topik 5 saat ini memakai soal "ubah bentuk"
- [ ] Uji di HP Android nyata (layar 360px)

## Fase 4 — Konten & Alur Belajar (minggu 6–7) — sebagian besar selesai 11 Nov 2026
- [x] Materi langkah demi langkah (F4) dengan animasi panah + tombol "Ulangi animasi" (F6)
- [x] Kontrol animasi ▶ Putar · ⏸ Jeda · ⏭ Langkah · ↺ Ulang (F6 lengkap)
- [x] Animasi perubahan bentuk: panah → pasangan (Topik 3), pasangan → noktah (Topik 4), panah → noktah (Topik 5)
- [x] Tanda ✓/✕ muncul dengan "pop" saat jawaban dicek
- [x] Konten Topik 0–6 di `src/content/topic0.ts` … `topic6.ts`
- [x] Bank soal: 34 soal (L1–L4) dengan hint & pembahasan; kebenaran soal bilangan dicek otomatis
- [ ] Soal pretest/posttest (10 soal paralel)
- [x] Soal cerita + tombol "Pecah Soal" (F5)
- [x] Kartu Ringkasan (F10), layar Hasil + bintang, Refleksi skala usaha 1–9 (F14)
- [ ] Validasi konten oleh pemilik proyek / ahli materi

## Fase 4b — Model RMT & Mediator AI ✅ selesai 16 Nov 2026
- [x] Ringkasan RMT & pemetaan ke fitur (`docs/RMT.md`)
- [x] Katalog 14 fungsi kognitif & 5 alat berpikir (`src/content/rmt.ts`)
- [x] Kartu Alat Berpikir, label fungsi kognitif, penanda fase, bukti logis, jurnal RMT
- [x] Mediator AI DeepSeek (tanya di soal, tanggapan bukti & jurnal) + layar ⚙️ Pengaturan
- [ ] Uji Mediator AI dengan kunci asli dan siswa sungguhan; tinjau kualitas balasan bersama dosen

## Fase 4c — Soal Literasi Matematika ✅ selesai 17 Nov 2026
- [x] Topik 7: 4 soal literasi (L1–L4) dari dokumen pemilik, 19 tahap berskor (maks 24)
- [x] Bentuk soal baru: isian angka, pilih-semua, jelaskan alasan + daftar periksa, coretan diagram panah
- [x] Skor sebagian per anggota (perMember) untuk tahap diagram panah
- [ ] Tinjau ulang kalimat tahap-tahap dengan dosen

## Fase 4d — Asisten Belajar pedagogis & backend aman ✅ selesai 18 Nov 2026
- [x] Backend `api/chat.ts` (Vercel) — kunci DeepSeek dari `.env`, tidak di frontend/GitHub
- [x] Prompt sistem disusun di server; validasi isi, batas permintaan, kode akses kelas opsional
- [x] Pilihan jenis kesulitan → jenis beban (ekstrinsik/intrinsik/germane) → bimbingan
- [x] Tangga petunjuk 1–4 mengikuti fase RMT, naik bertahap sesuai usaha siswa
- [x] Catatan bantuan AI per soal (`aiHelp`) untuk data penelitian; `docs/COGNITIVE_LOAD.md`
- [x] Deploy ke Vercel + isi variabel lingkungan
- [x] Analisis lembar jawaban uji coba S01 (`docs/UJI_COBA_S01.md`)
- [x] Skoring S01 dengan Pedoman Penskoran resmi (20/24, nilai 83,3)
- [x] Temuan S01 (UC1–UC5) → "Kebiasaan baik" per tahap + aturan Asisten Belajar
- [x] Mediator AI aktif di Vercel (OpenRouter gratis; bisa diganti DeepSeek resmi lewat env)
- [ ] Konfirmasi dosen: model gratis vs DeepSeek resmi

## Fase 5 — Platform (minggu 8)
- [ ] PWA (manifest, ikon, offline)
- [ ] Capacitor Android → APK debug
- [ ] Deploy web (Netlify/Vercel)
- [ ] Ekspor data penelitian (F15)

## Fase 6 — Validasi & Revisi (minggu 9–10)
- [ ] Validasi ahli materi & ahli media (lihat `EVALUASI.md`)
- [ ] Revisi berdasarkan masukan
- [ ] Uji coba terbatas (one-to-one / kelompok kecil)
- [ ] Revisi akhir → rilis v1.0

## Definisi "Selesai" untuk setiap fitur
1. Memenuhi kriteria penerimaan di `PRD.md`.
2. Logika domain punya unit test yang lulus.
3. Dicoba di Chrome desktop **dan** layar HP 360px.
4. Teks sesuai aturan penulisan konten (≤ 3 kalimat/layar).
