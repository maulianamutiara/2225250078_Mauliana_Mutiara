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

## Link
- Aplikasi (bisa dibuka di Android & iPhone): https://maulianamutiara.github.io/2225250078_Mauliana_Mutiara/
- Kode di GitHub: https://github.com/maulianamutiara/2225250078_Mauliana_Mutiara

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
| [docs/RMT.md](docs/RMT.md) | Ringkasan Rigorous Mathematical Thinking & pemetaannya ke fitur | Dosen, pengembang |
| [docs/COGNITIVE_LOAD.md](docs/COGNITIVE_LOAD.md) | Wawancara → jenis beban → perilaku Asisten Belajar (AI) | Dosen, pengembang |

## Mediator AI (DeepSeek) — Asisten Belajar
Asisten Belajar membimbing proses berpikir siswa secara bertahap (beban kognitif + RMT), tanpa
memberi jawaban akhir. Penjelasan lengkap: [docs/COGNITIVE_LOAD.md](docs/COGNITIVE_LOAD.md).

**Keamanan kunci:** kunci DeepSeek **tidak** ada di kode frontend maupun GitHub. Kunci disimpan di
variabel lingkungan backend (`.env`), dibaca oleh `api/chat.ts` → `server/chatHandler.ts`.

### Menjalankan di laptop
1. Salin `.env.example` menjadi `.env` (file `.env` otomatis diabaikan Git).
2. Isi `DEEPSEEK_API_KEY=sk-...` di `.env`.
3. `npm run dev` → Mediator langsung aktif di `http://localhost:5173`.

### Online (Vercel, gratis)
1. Masuk ke vercel.com dengan akun GitHub → **Add New → Project** → pilih repo ini → **Deploy**.
2. Buka proyek → **Settings → Environment Variables** → tambahkan `DEEPSEEK_API_KEY`
   (opsional: `AI_ACCESS_CODE` sebagai kode akses kelas) → **Redeploy**.
3. Buka alamat `https://<nama-proyek>.vercel.app`. Uji di **⚙️ Pengaturan → Uji koneksi**.

Versi GitHub Pages tetap jalan untuk materi dan soal, tetapi tanpa Mediator (Pages tidak punya backend).

## Urutan membaca yang disarankan
1. `docs/ANALISIS_KEBUTUHAN.md` → 2. `docs/PRD.md` → 3. `docs/DESAIN_PEMBELAJARAN.md`
→ 4. `docs/KONTEN_MATERI.md` → 5. `docs/UI_UX.md` → 6. `docs/ARSITEKTUR.md` → 7. `docs/ROADMAP.md`
