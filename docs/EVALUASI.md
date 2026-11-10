# Rencana Evaluasi & Validasi

> Model pengembangan yang disarankan: **ADDIE** (Analysis, Design, Development, Implementation,
> Evaluation). Jika dosen menetapkan **4D** atau **Plomp**, pemetaan tahap di bawah tinggal disesuaikan.

## 1. Pemetaan Tahap
| Tahap ADDIE | Kegiatan | Dokumen/produk |
|---|---|---|
| Analysis | Wawancara siswa (beban kognitif), analisis kurikulum | `ANALISIS_KEBUTUHAN.md` |
| Design | PRD, desain pembelajaran, konten, UI/UX | `PRD.md`, `DESAIN_PEMBELAJARAN.md`, `KONTEN_MATERI.md`, `UI_UX.md` |
| Development | Membangun aplikasi, validasi ahli, revisi | Kode, lembar validasi |
| Implementation | Uji coba ke siswa | Data pretest/posttest, angket |
| Evaluation | Analisis kevalidan, kepraktisan, keefektifan | Laporan |

## 2. Kevalidan (Validasi Ahli)
| Validator | Aspek yang dinilai |
|---|---|
| **Ahli materi** (dosen/guru matematika) | Kesesuaian dengan CP/TP, kebenaran konsep, kejelasan contoh, kualitas soal & hint, bahasa |
| **Ahli media** (dosen TI/media pembelajaran) | Tampilan, navigasi, interaksi, keterbacaan, kinerja di HP |
| *(opsional)* **Ahli beban kognitif / desain pembelajaran** | Penerapan prinsip CLT (segmenting, worked example, coherence, dst.) |

Instrumen: angket skala Likert 1–4/1–5. Kategori kelayakan berdasarkan persentase
(contoh: ≥ 81% sangat layak, 61–80% layak, 41–60% cukup, ≤ 40% kurang).

## 3. Kepraktisan
- Angket respons siswa dan guru (kemudahan, kemenarikan, kebermanfaatan).
- Opsional: **System Usability Scale (SUS)** — 10 butir, skor ≥ 68 dianggap di atas rata-rata.

## 4. Keefektifan
- **Pretest–posttest** (10 soal paralel, mencakup TP1–TP6) → N-gain.
- **Beban kognitif**: skala usaha mental Paas (1–9) dikumpulkan otomatis oleh aplikasi (F14),
  atau instrumen IL/EL/GL (mis. Leppink dkk., 2013) yang diadaptasi ke bahasa Indonesia.

## 5. Uji Coba
1. **One-to-one** (2–3 siswa): amati saat memakai, catat kebingungan (think-aloud).
2. **Kelompok kecil** (6–10 siswa): angket kepraktisan + data dari aplikasi.
3. **Lapangan/kelas** (jika cakupan penelitian menuntut).

## 6. Etika
- Persetujuan siswa dan orang tua/wali (seperti pada wawancara).
- Data memakai kode siswa, tanpa nama asli.
- Data ekspor disimpan aman dan hanya untuk penelitian.
