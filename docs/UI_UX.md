# Pedoman UI/UX

## 1. Prinsip
1. **Sedikit teks, banyak visual** (K09) — maks 3 kalimat per layar.
2. **Satu layar, satu tugas** — tidak ada panel yang berebut perhatian.
3. **Pola tetap** — tombol "Lanjut", "Hint", "Ringkasan" selalu di posisi yang sama.
4. **Mobile-first** — dirancang untuk layar 360×640, lalu diperluas ke tablet/desktop.
5. **Tidak ada dekorasi yang tidak bermakna** (prinsip *coherence*).
6. **Warna bermakna konsisten**: biru = himpunan A, oranye = himpunan B, hijau = benar, merah-bata = perlu diperbaiki (selalu disertai ikon/teks, tidak warna saja).

## 2. Token Desain (awal, dapat disesuaikan)
| Token | Nilai | Pemakaian |
|---|---|---|
| `--set-a` | `#2563EB` (biru) | Himpunan A, slot pertama pasangan |
| `--set-b` | `#EA580C` (oranye) | Himpunan B, slot kedua pasangan |
| `--ok` | `#16A34A` | Umpan balik benar |
| `--fix` | `#B91C1C` | Umpan balik salah |
| `bg` | `#FEF6E4` (krem, gradasi lembut) | Latar halaman — tema **Hangat ceria** |
| `surface` | `#FFFCF5` | Kartu, jendela sembulan |
| `line` | `#F1DDB0` | Garis tepi hangat |
| `brand` | `#0F766E` (hijau toska) | Tombol utama, tautan, fokus |
| `ink` | `#292524` | Teks utama |
| `muted` | `#57534E` | Teks keterangan |

> Catatan: biru & oranye **khusus** untuk himpunan A dan B, bukan untuk tombol — agar makna warna
> tetap konsisten. Semua token ada di `tailwind.config.js`.
| Font | Nunito / Poppins (Google Fonts), 16px dasar | Ramah anak, mudah dibaca |
| Target sentuh | ≥ 44×44 px | Titik anggota himpunan, tombol |

## 3. Daftar Layar
| ID | Layar | Isi |
|---|---|---|
| S1 | Splash & pilih nama/kode | Input kode siswa opsional (mis. S01) |
| S2 | Beranda / Peta Belajar | Jalur topik 0–6, status terkunci/terbuka, bintang |
| S3 | Layar Materi | Ilustrasi/animasi + ≤ 3 kalimat + tombol Lanjut |
| S4 | Contoh Langkah demi Langkah | Diagram + penjelasan langkah aktif, tombol "Langkah berikutnya" |
| S5 | Latihan Diagram Panah | Kanvas interaktif + tombol Cek/Hint/Hapus/Ringkasan |
| S6 | Latihan Pasangan Berurutan | Template `{ ( _ , _ ) }` + kartu anggota yang bisa diseret/diketuk |
| S7 | Latihan Kartesius | Grid, ketuk titik untuk menaruh noktah |
| S8 | Tiga Wajah | Tiga panel tersinkron (tab di HP, berdampingan di desktop) |
| S9 | Soal Cerita | Teks dengan sorotan + tombol "Pecah Soal" |
| S10 | Hasil Level | Skor, bintang, ulasan kesalahan, tombol Ulang/Lanjut |
| S11 | Refleksi | Kolom "Jelaskan dengan kata-katamu" + skala usaha 1–9 |
| S12 | Kartu Ringkasan (modal) | Bisa dibuka dari mana saja |

## 4. Wireframe Kunci (HP, potret)

### S5 — Latihan Diagram Panah
```
┌──────────────────────────────┐
│ ← Level 2 • Soal 3/8    ⭐⭐☆ │
├──────────────────────────────┤
│ Relasi: "dua kali dari"      │
│                              │
│    A            B            │
│  ╭────╮      ╭────╮          │
│  │ ●2 ✓├─────▶│ 1● │          │
│  │ ●4  │      │ 2● │          │
│  │ ●6  │      │ 3● │          │
│  ╰────╯      │ 4● │          │
│              │ 5● │          │
│              ╰────╯          │
│ Tarik dari titik A ke titik B│
├──────────────────────────────┤
│ [💡 Hint] [🗑 Hapus] [📘]     │
│ [        ✔ CEK JAWABAN      ]│
└──────────────────────────────┘
```

### S9 — Soal Cerita dengan "Pecah Soal"
```
┌──────────────────────────────┐
│ Ani memilih futsal dan       │
│ pramuka. Budi memilih        │
│ pramuka. Candra memilih      │
│ paduan suara.                │
│ [🔍 Pecah Soal]               │
│ ① Himpunan A: [Ani][Budi]... │  ← biru
│ ② Himpunan B: [Futsal]...    │  ← oranye
│ ③ Aturan: "memilih"          │
│ [ Lanjut ke Diagram → ]      │
└──────────────────────────────┘
```

## 5. Spesifikasi Interaksi Diagram Panah (F1, F2)
- **Membuat panah**: (a) seret dari titik anggota A dan lepas di titik anggota B, **atau** (b) ketuk titik A lalu ketuk titik B (alternatif untuk layar kecil/motorik halus).
- **Garis bantu** mengikuti jari saat menyeret; titik B terdekat menyala (*snap* radius ±24px).
- **Menghapus panah**: ketuk panah → muncul tombol ✕.
- **Arah salah**: jika siswa menyeret dari B ke A, panah tidak dibuat dan muncul pesan M1 singkat.
- **Penanda kelengkapan (F2)**: anggota A yang sudah punya ≥ 1 panah mendapat ✓ kecil; pada soal yang menuntut semua anggota A dicek, tombol Cek menampilkan sisa anggota yang belum dicek.
- **Tata letak anti-ruwet (T02, IL03)**: label ditempatkan di luar titik (A di kiri titik, B di kanan titik) sehingga garis berakhir di titik dan **tidak menembus label**; panah digambar sebagai kurva halus ketika banyak panah keluar dari satu titik.
- **Umpan balik per panah** setelah Cek: panah benar hijau ✓, salah merah-bata ✕, panah yang kurang ditampilkan putus-putus setelah hint ke-3.

## 6. Animasi
- Durasi ≤ 30 detik; kontrol ▶ ⏸ ↺ dan "langkah" (maju per langkah).
- Gerakan bermakna saja: panah tumbuh dari A ke B, pasangan "terbang" dari panah ke notasi, noktah jatuh ke grid.
- Hormati pengaturan `prefers-reduced-motion`.

## 7. Aksesibilitas & Keterbacaan
- Kontras minimal 4.5:1; tidak mengandalkan warna saja.
- Ukuran teks dapat diperbesar (A− / A+).
- Semua tombol punya label teks (bukan ikon saja).
