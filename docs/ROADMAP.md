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

## Fase 2 — Logika Domain (minggu 3)
- [ ] `domain/relation.ts` (konversi antarrepresentasi)
- [ ] `domain/grading.ts` + `misconceptions.ts` (M1–M7)
- [ ] Unit test lengkap untuk semua fungsi domain

## Fase 3 — Komponen Interaktif Inti (minggu 4–5)
- [ ] **ArrowDiagram** (F1, F2): drag + ketuk-ketuk, snap, hapus, penanda ✓, tata letak anti-ruwet
- [ ] **OrderedPairBuilder** (F3)
- [ ] **CartesianGrid** (F12)
- [ ] **HintPanel** + alur umpan balik (F8)
- [ ] Uji di HP Android nyata (layar 360px) sejak fase ini

## Fase 4 — Konten & Alur Belajar (minggu 6–7)
- [ ] StepByStep (F4) + AnimationPlayer (F6)
- [ ] Input konten Topik 0–6 dari `KONTEN_MATERI.md`
- [ ] Bank soal L1–L4 (target 30 soal) + pretest/posttest
- [ ] StoryProblem / Pecah Soal (F5)
- [ ] Kartu Ringkasan (F10), Hasil Level, Refleksi (F14)

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
