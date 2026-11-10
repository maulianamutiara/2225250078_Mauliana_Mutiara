# CLAUDE.md — Panduan untuk Claude Code

Proyek: **RelaSI Pintar**, aplikasi belajar materi **Relasi** untuk siswa SMP kelas VIII,
dibangun berdasarkan **Teori Beban Kognitif**. Pemilik: Mauliana Mutiara (mahasiswa S1 Pendidikan
Matematika). Target: **Web (PWA)** dan **Android (Capacitor)** dari satu basis kode.

## Sumber kebenaran
Baca sebelum mengerjakan fitur:
- `docs/PRD.md` — fitur (F1–F16), prioritas, kriteria penerimaan
- `docs/KONTEN_MATERI.md` — teks materi, soal, hint, katalog kesalahan M1–M7
- `docs/UI_UX.md` — layar, wireframe, spesifikasi interaksi diagram panah
- `docs/ARSITEKTUR.md` — stack, struktur folder, model data
- `docs/ROADMAP.md` — urutan kerja; centang item yang selesai

Jika kode dan dokumen bertentangan, **tanyakan** dulu — jangan diam-diam mengubah salah satunya.

## Stack
TypeScript · React 18 · Vite · Tailwind CSS · Zustand · Framer Motion · SVG + Pointer Events ·
vite-plugin-pwa · Capacitor (Android) · Vitest + Testing Library.

## Perintah
```
npm install
npm run dev          # server pengembangan
npm test             # unit test (Vitest)
npm run build        # build produksi ke dist/
npm run lint
npx cap sync android # setelah build, untuk Android
```

## Aturan Kode
1. **Logika matematika di `src/domain/` saja** — fungsi murni, tanpa React, dan **wajib** punya unit test
   (penilaian jawaban, konversi panah↔pasangan↔Kartesius, deteksi miskonsepsi).
2. **Konten adalah data**: teks materi dan soal disimpan di `src/content/`, bukan ditulis langsung di komponen.
3. Pasangan berurutan selalu `(a, b)` dengan **a ∈ A (asal)** dan **b ∈ B (tujuan)**. Jangan pernah membalik urutan.
4. Interaksi memakai **Pointer Events** (bukan hanya mouse/touch) agar jalan di HP dan desktop.
   Sediakan alternatif "ketuk A lalu ketuk B" untuk membuat panah.
5. **Mobile-first**: uji di lebar 360px. Target sentuh ≥ 44×44 px.
6. Akses `localStorage` hanya lewat `src/lib/storage.ts` (dibungkus try/catch).
7. Tanpa backend, tanpa data pribadi, tanpa SDK analitik pihak ketiga.
8. Jaga ringan: hindari library besar baru tanpa alasan kuat — sasaran HP Android RAM 2–3 GB.

## Aturan Konten & Tampilan (prinsip beban kognitif — jangan dilanggar)
- Maks **3 kalimat** per layar, tiap kalimat ≤ 20 kata, Bahasa Indonesia sederhana.
- Satu layar = satu ide. Tidak ada dekorasi/animasi yang tidak terkait konsep.
- Label/penjelasan diletakkan **dekat** objek yang dijelaskan (hindari *split attention*).
- Warna bermakna: biru = himpunan A, oranye = himpunan B; benar/salah selalu disertai ikon + teks.
- Setiap soal: minimal 2 hint bertahap + pembahasan langkah demi langkah.
- Umpan balik salah harus **spesifik** (pakai kode M1–M7 dari `KONTEN_MATERI.md`), bukan sekadar "Salah".
- Animasi ≤ 30 detik, bisa dijeda/diulang, hormati `prefers-reduced-motion`.
- Kebenaran matematika diutamakan: bila ragu tentang konsep/istilah, tanyakan ke pemilik proyek.

## Bahasa
- Semua teks yang tampil ke pengguna: **Bahasa Indonesia**.
- Nama variabel/fungsi/kode: Bahasa Inggris (mis. `setA`, `gradeAnswer`). Komentar boleh Indonesia.
- Jelaskan perubahan kepada pemilik proyek dalam Bahasa Indonesia yang mudah dipahami
  (pemilik adalah calon guru matematika, bukan programmer profesional).

## Alur Kerja
1. Kerjakan sesuai urutan `docs/ROADMAP.md`, satu fitur per langkah.
2. Sebelum fitur besar: ringkas rencana singkat, lalu kerjakan.
3. Setelah selesai: jalankan `npm test` dan `npm run build`; laporkan hasilnya apa adanya.
4. Centang item di `ROADMAP.md` yang sudah memenuhi "Definisi Selesai".
