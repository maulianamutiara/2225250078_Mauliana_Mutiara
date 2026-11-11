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
- [ ] Kontrol jeda/putar animasi (F6 lengkap)
- [x] Konten Topik 0–6 di `src/content/topic0.ts` … `topic6.ts`
- [x] Bank soal: 34 soal (L1–L4) dengan hint & pembahasan; kebenaran soal bilangan dicek otomatis
- [ ] Soal pretest/posttest (10 soal paralel)
- [x] Soal cerita + tombol "Pecah Soal" (F5)
- [x] Kartu Ringkasan (F10), layar Hasil + bintang, Refleksi skala usaha 1–9 (F14)
- [ ] Validasi konten oleh pemilik proyek / ahli materi

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
