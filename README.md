# RelaSI Pintar — Aplikasi Belajar Relasi untuk Siswa SMP

> Nama aplikasi: **RelaSI Pintar**. Tema tampilan: **Hangat ceria** (latar krem, aksen hijau toska).
> Pengembang: Mauliana Mutiara (NIM 2225250078) — S1 Pendidikan Matematika, Kelas 3A.

Aplikasi pembelajaran interaktif materi **Relasi** (Kelas VIII SMP, Fase D) yang dirancang
berdasarkan **Teori Beban Kognitif (Cognitive Load Theory)**: mengurangi beban ekstrinsik,
mengelola beban intrinsik, dan mendorong beban germane. Berjalan di **web (PWA)** dan
**Android** dari satu basis kode.

## Status
**Fase 1 selesai** (kerangka proyek): layar pembuka, Peta Belajar, penyimpanan progres.
Materi dan latihan dibangun pada fase berikutnya — lihat `docs/ROADMAP.md`.

## Menjalankan Aplikasi
Butuh **Node.js** (versi LTS). Buka terminal di folder ini, lalu:

```
npm install      # sekali saja, memasang paket
npm run dev      # buka alamat yang muncul (mis. http://localhost:5173) di browser
npm test         # menjalankan tes otomatis
npm run build    # membuat versi siap pakai di folder dist/
```

Tips: untuk melihat tampilan HP di laptop, tekan **F12** di Chrome → ikon HP (Toggle device
toolbar) → pilih lebar 360px.

## Peta Dokumen

| File | Isi | Dibaca oleh |
|---|---|---|
| [CLAUDE.md](CLAUDE.md) | Aturan kerja untuk Claude Code saat membangun aplikasi | Claude Code |
| [docs/PRD.md](docs/PRD.md) | Product Requirements Document — apa yang dibangun & mengapa | Semua |
| [docs/ANALISIS_KEBUTUHAN.md](docs/ANALISIS_KEBUTUHAN.md) | Analisis hasil wawancara (IL/EL/GL/K) → kebutuhan | Dosen, pengembang |
| [docs/DESAIN_PEMBELAJARAN.md](docs/DESAIN_PEMBELAJARAN.md) | Tujuan pembelajaran, alur, prinsip beban kognitif | Dosen, pengembang |
| [docs/KONTEN_MATERI.md](docs/KONTEN_MATERI.md) | Naskah materi, contoh bertahap, bank soal, hint | Pengembang, validator materi |
| [docs/UI_UX.md](docs/UI_UX.md) | Pedoman tampilan, wireframe, interaksi diagram panah | Pengembang, validator media |
| [docs/ARSITEKTUR.md](docs/ARSITEKTUR.md) | Teknologi, struktur folder, model data | Pengembang |
| [docs/ROADMAP.md](docs/ROADMAP.md) | Tahapan pengerjaan (milestone & checklist) | Semua |
| [docs/EVALUASI.md](docs/EVALUASI.md) | Rencana validasi ahli, uji kepraktisan, uji coba | Dosen, peneliti |

## Urutan membaca yang disarankan
1. `docs/ANALISIS_KEBUTUHAN.md` → 2. `docs/PRD.md` → 3. `docs/DESAIN_PEMBELAJARAN.md`
→ 4. `docs/KONTEN_MATERI.md` → 5. `docs/UI_UX.md` → 6. `docs/ARSITEKTUR.md` → 7. `docs/ROADMAP.md`
