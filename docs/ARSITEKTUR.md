# Arsitektur Teknis

## 1. Keputusan Teknologi

| Lapisan | Pilihan | Alasan |
|---|---|---|
| Bahasa | **TypeScript** | Tipe data membantu mencegah bug pada logika penilaian |
| UI framework | **React 18** + **Vite** | Ekosistem besar, mudah dipelajari, build cepat |
| Styling | **Tailwind CSS** | Konsisten dengan token desain, cepat untuk mobile-first |
| Diagram interaktif | **SVG** + Pointer Events (tanpa library berat) | Ringan di HP murah; mendukung sentuh & mouse sekaligus |
| Animasi | **Framer Motion** | Animasi deklaratif, kontrol play/pause |
| State | **Zustand** | Sederhana, cukup untuk aplikasi tanpa server |
| Penyimpanan lokal | `localStorage` (progres) via wrapper; ekspor JSON/CSV | Offline, tanpa akun |
| Web/PWA | **vite-plugin-pwa** | Bisa diinstal & offline di browser |
| Android | **Capacitor** | Membungkus aplikasi web menjadi APK dari satu basis kode |
| Uji | **Vitest** (logika) + **Testing Library** (komponen) + **Playwright** (alur E2E, opsional) | |
| Hosting web | Netlify / Vercel / GitHub Pages (gratis) | |

> Alternatif yang dipertimbangkan: **Flutter** (performa native baik, tetapi Dart lebih jarang dan
> build web lebih berat) dan **Godot/Unity** (berlebihan untuk aplikasi materi). React + Capacitor
> dipilih karena satu kode untuk web & Android, ringan, dan mudah dibantu Claude Code.

## 2. Struktur Folder (rencana)
```
relasi-pintar/
├─ CLAUDE.md
├─ docs/                      # dokumen perencanaan (folder ini)
├─ public/                    # ikon, manifest PWA
├─ src/
│  ├─ main.tsx
│  ├─ App.tsx                 # router
│  ├─ content/                # KONTEN sebagai data (bukan di dalam komponen)
│  │  ├─ topics.ts            # daftar topik & urutan
│  │  ├─ lessons/             # layar materi per topik (*.ts)
│  │  ├─ examples/            # contoh langkah demi langkah
│  │  └─ problems/            # bank soal L1–L4 (*.json)
│  ├─ domain/                 # logika murni, tanpa React — WAJIB diuji
│  │  ├─ relation.ts          # tipe Relation, konversi panah↔pasangan↔kartesius
│  │  ├─ grading.ts           # penilaian jawaban
│  │  └─ misconceptions.ts    # deteksi kesalahan M1–M7
│  ├─ components/
│  │  ├─ ArrowDiagram/        # F1, F2
│  │  ├─ OrderedPairBuilder/  # F3
│  │  ├─ CartesianGrid/       # F12
│  │  ├─ StepByStep/          # F4
│  │  ├─ StoryProblem/        # F5
│  │  ├─ AnimationPlayer/     # F6
│  │  ├─ HintPanel/           # F8
│  │  └─ ui/                  # tombol, kartu, modal
│  ├─ screens/                # S1–S12
│  ├─ store/                  # Zustand: progress, settings
│  └─ lib/storage.ts          # wrapper localStorage aman (try/catch)
├─ tests/
├─ android/                   # dibuat oleh Capacitor
└─ package.json
```

## 3. Model Data Inti

```ts
// domain/relation.ts
export type Member = string;                 // "2", "Ani", "Matematika"
export type Pair = readonly [Member, Member]; // (a, b) — a ∈ A, b ∈ B

export interface Relation {
  setA: Member[];
  setB: Member[];
  rule: string;          // "dua kali dari"
  pairs: Pair[];
}

// content/problems/*.json
export interface Problem {
  id: string;                     // "L3-01"
  level: 1 | 2 | 3 | 4;
  topic: number;                  // 1–6
  type: "arrow" | "pairs" | "cartesian" | "multi-rep" | "story" | "mcq";
  prompt: string;                 // ≤ 3 kalimat
  story?: { text: string; highlights: { text: string; role: "A" | "B" | "rule" }[] };
  relation: Relation;             // kunci jawaban
  hints: [string, string, ...string[]]; // minimal 2
  explanation: string[];          // pembahasan langkah demi langkah
  feedback?: Partial<Record<MisconceptionCode, string>>; // override pesan M1–M7
}

export type MisconceptionCode = "M1"|"M2"|"M3"|"M4"|"M5"|"M6"|"M7";

// store/progress
export interface Attempt {
  problemId: string;
  correct: boolean;
  tries: number;
  hintsUsed: number;
  misconceptions: MisconceptionCode[];
  durationMs: number;
  at: string;                     // ISO time
}
export interface Progress {
  studentCode?: string;
  attempts: Attempt[];
  stars: Record<string, 0|1|2|3>; // per level id
  reflections: { topic: number; text: string; effort: number /*1–9*/; at: string }[];
}
```

## 4. Logika Penilaian (domain/grading.ts)
1. Bandingkan himpunan pasangan siswa dengan kunci (urutan pasangan tidak penting, urutan **di dalam** pasangan penting).
2. Hasil: `{ correct, missing: Pair[], extra: Pair[], reversed: Pair[] }`.
3. `misconceptions.ts` memetakan hasil ke kode M1–M7 (mis. `reversed` → M2, anggota A tanpa pasangan padahal kunci ada → M4).
4. Skor bintang: 3 = benar tanpa hint, 2 = benar dengan ≤ 1 hint atau 2 percobaan, 1 = benar setelahnya.

## 5. Platform & Build
| Target | Perintah (rencana) |
|---|---|
| Dev web | `npm run dev` |
| Uji | `npm test` |
| Build web/PWA | `npm run build` → folder `dist/` |
| Android | `npm run build && npx cap sync android && npx cap open android` (butuh Android Studio + JDK 17) |

Minimum Android: API 26 (Android 8.0). Orientasi utama potret.

## 6. Privasi & Data Penelitian
- Tidak ada server; tidak ada data pribadi wajib. Siswa memakai **kode** (mis. S01).
- Ekspor data (F15) menghasilkan file JSON/CSV yang dibagikan manual oleh guru/peneliti.
