# Pengelolaan Beban Kognitif oleh Asisten Belajar (Mediator AI)

Dokumen ini menjelaskan bagaimana **hasil wawancara siswa S01** (kode IL/EL/GL/K di
`ANALISIS_KEBUTUHAN.md`) menjadi dasar fitur aplikasi dan perilaku **Asisten Belajar** (Mediator AI DeepSeek).
Prinsip utama: *AI berperan sebagai pembimbing proses berpikir matematis siswa, bukan pemberi jawaban.*

## 1. Alur Asisten Belajar

1. Siswa menekan **🤖 Tanya Mediator** di soal (termasuk tiap tahap soal Literasi Matematika).
2. Siswa memilih **jenis kesulitan** (atau menulis pertanyaan sendiri).
3. Aplikasi menghitung **tingkat petunjuk** (1–4) dari usaha siswa: banyaknya cek jawaban,
   hint yang dibuka, dan pertanyaan ke Mediator sebelumnya (`nextHintLevel()` di `src/ai/pedagogy.ts`).
4. Backend menyusun prompt sistem (aturan beban kognitif + RMT + Feuerstein), lalu memanggil DeepSeek.
5. Balasan tampil singkat: pesan (≤ 3 kalimat) + **satu pertanyaan penuntun**, beserta label
   jenis beban, tingkat petunjuk, fase RMT, dan fungsi kognitif.
6. Setiap bantuan dicatat (`Attempt.aiHelp`: jenis kesulitan, tingkat, jenis beban) sebagai data penelitian.

## 2. Jenis kesulitan → jenis beban → bimbingan

| Tombol siswa | Beban yang dikelola | Bimbingan AI | Dasar wawancara |
|---|---|---|---|
| "Aku belum paham maksud soalnya" | **Ekstrinsik** (mengurangi) | Memecah kalimat soal: apa yang diketahui, apa yang ditanya. Tidak masuk ke penyelesaian. | EL01, EL02 (soal cerita berbelit, dibaca 2–3 kali) |
| "Aku bingung mulai dari mana" | **Intrinsik** (mengelola) | Mulai dari satu anggota/satu langkah kecil; mengingatkan alat berpikir yang cocok. | IL02, IL03, IL04 (cek satu-satu, anggota banyak) |
| "Jawabanku belum benar, salahnya di mana?" | **Intrinsik** | Menunjuk *jenis* kesalahan (kode M1–M7 dari aplikasi), bukan jawaban benarnya. | IL05, K06, K08 (notasi/arah terbalik; ingin tahu bagian yang keliru) |
| "Aku mau cek alasanku" | **Germane** (mendorong) | Meminta bukti logis dan transfer: "Mengapa?", "Bagaimana jika…?". | GL04, GL05, GL06 (menjelaskan ke teman, transfer lemah) |

## 3. Tangga petunjuk (mengikuti fase RMT)

| Tingkat | Nama | Fase RMT | Contoh bentuk bantuan |
|---|---|---|---|
| 1 | Orientasi | Fase 1 – Pengembangan kognitif | "Apa saja anggota himpunan A?" |
| 2 | Strategi & alat berpikir | Fase 1–2 – Alat psikologis | "Diagram panah bisa membantu. Mulai dari anggota pertama." |
| 3 | Langkah terarah | Fase 2 – Isi sebagai proses | "Coba periksa anggota 4: angka mana di B yang memenuhi aturan?" |
| 4 | Refleksi & pembuktian | Fase 3 – Praktik konstruksi konsep | "Bagaimana kamu yakin semua pasangan sudah ditemukan?" |

- Bantuan naik **bertahap** (prinsip *fading* — GL06, K07). AI dilarang melompati tingkat.
- "Belum paham maksud soal" dibatasi tingkat 2 agar fokus tetap pada pemahaman bacaan.
- Bahkan di tingkat 3, AI **tidak** menyebut jawaban akhir, angka hasil, atau daftar pasangan.
- Maks 6 pertanyaan per soal, agar siswa tetap berpikir sendiri dan beban tidak bertambah.

## 3b. Penyesuaian dari hasil uji coba S01

Uji coba instrumen Literasi Matematika ke S01 (skor 20/24, lihat `UJI_COBA_S01.md`) menunjukkan
semua hasil akhir benar, tetapi **langkah dan representasi tidak dituliskan**. Setiap temuan menjadi dua fitur
(data di `src/content/trialFindings.ts`):

| Kode | Kesulitan S01 | Beban | "💡 Kebiasaan baik" muncul di | Aturan tambahan Asisten Belajar |
|---|---|---|---|---|
| UC1 | Memilah informasi penting | Ekstrinsik | L2 Tahap 1 | Minta siswa menyebut informasi yang dipakai dan tidak dipakai |
| UC2 | Menulis himpunan A dan B | Intrinsik | L2 Tahap 2–3 | Minta himpunan asal dan kawan sebelum membahas pasangan |
| UC3 | Menggambar diagram Cartesius | Intrinsik | L3 Tahap 3b | Dorong mengubah pasangan ke bentuk lain |
| UC4 | Menuliskan proses/syarat | Germane | L1 Tahap 5, L3 Tahap 2, L4 Tahap 1 | Minta perhitungan atau syarat, bukan hanya hasil |
| UC5 | Mengevaluasi jawaban orang lain | Germane | L4 Tahap 5 | Ajak memeriksa ulang tiap pasangan terhadap aturan dan arah |

- Kalimat kebiasaan baik hanya satu kalimat (≤ 20 kata) dan tidak membocorkan jawaban (dijaga tes).
- Aturan tambahan disusun di server, bersama aturan beban kognitif dan RMT.

## 4. Pengaman kebenaran dan keamanan

- **Kunci jawaban tidak pernah dikirim ke AI.** AI hanya menerima soal, jawaban siswa, dan status
  dari pemeriksa aplikasi (`src/ai/prompts.ts`). Dijaga oleh tes otomatis.
- Prompt sistem disusun di **server**; browser tidak bisa mengirim pesan "system" (dijaga tes).
- Kunci DeepSeek hanya ada di **variabel lingkungan backend** (`.env` / Vercel), tidak di kode atau GitHub.
- Aplikasi tetap berfungsi penuh tanpa AI: hint bertahap, umpan balik M1–M7, dan pembahasan tetap ada.

## 5. Yang perlu dicek pada uji coba
- Apakah balasan AI benar-benar tidak memberi jawaban (tinjau sampel percakapan bersama dosen).
- Jenis kesulitan mana yang paling sering dipilih siswa → bandingkan dengan hasil wawancara.
- Hubungan tingkat petunjuk yang dipakai dengan skor literasi (rubrik) dan skala usaha (1–9).
