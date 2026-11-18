// Temuan uji coba instrumen Literasi Matematika (subjek S01, 18 Nov 2026) — lihat docs/UJI_COBA_S01.md.
// Setiap temuan menjadi dasar dua fitur:
//   1. `habit`      → kalimat "Kebiasaan baik" di tahap soal literasi yang terkait (LiteracyRunner).
//   2. `aiGuidance` → aturan tambahan prompt Asisten Belajar (src/ai/pedagogy.ts, disusun di server).
// File ini murni data (tanpa React) karena juga dipakai backend.

export type TrialFindingId = 'UC1' | 'UC2' | 'UC3' | 'UC4' | 'UC5';

export interface TrialFinding {
  id: TrialFindingId;
  difficulty: string;
  /** Bukti di lembar jawaban S01. */
  evidence: string;
  load: 'ekstrinsik' | 'intrinsik' | 'germane';
  /** Kode wawancara terkait (docs/ANALISIS_KEBUTUHAN.md). */
  interview: string[];
  /** Satu kalimat (≤ 20 kata) yang tampil di tahap soal. Tidak boleh membocorkan jawaban. */
  habit: string;
  /** Aturan untuk Asisten Belajar. */
  aiGuidance: string;
}

export const trialFindings: Record<TrialFindingId, TrialFinding> = {
  UC1: {
    id: 'UC1',
    difficulty: 'Memilah informasi penting dan tidak penting',
    evidence: 'Soal 2 Tahap 1 tidak dikerjakan.',
    load: 'ekstrinsik',
    interview: ['EL01', 'EL02'],
    habit: 'Sebelum menjawab, pisahkan informasi yang dipakai dan yang tidak dipakai.',
    aiGuidance: 'Bila siswa belum mulai, minta ia menyebut informasi yang dipakai dan yang tidak dipakai.',
  },
  UC2: {
    id: 'UC2',
    difficulty: 'Menuliskan himpunan daerah asal dan daerah kawan',
    evidence: 'Soal 2 Tahap 2–3: himpunan A dan B tidak ditulis, langsung menulis pasangan.',
    load: 'intrinsik',
    interview: ['IL05', 'IL06'],
    habit: 'Tulis dulu himpunan A dan himpunan B sebelum membuat pasangan.',
    aiGuidance: 'Sebelum membahas pasangan, minta siswa menyebut himpunan asal A dan himpunan kawan B.',
  },
  UC3: {
    id: 'UC3',
    difficulty: 'Menggambar diagram Cartesius',
    evidence: 'Soal 3 Tahap 3: pasangan benar, tetapi diagram Cartesius tidak digambar.',
    load: 'intrinsik',
    interview: ['IL03', 'IL04'],
    habit: 'Satu pasangan (a, b) menjadi satu noktah: a di sumbu mendatar, b di sumbu tegak.',
    aiGuidance: 'Dorong siswa mengubah pasangan ke bentuk lain (diagram panah atau Cartesius) dan menjelaskan hubungannya.',
  },
  UC4: {
    id: 'UC4',
    difficulty: 'Menuliskan proses dan syarat relasi',
    evidence: 'Soal 3 dan 4: perhitungan dan syarat tidak ditulis, walaupun hasil akhir benar.',
    load: 'germane',
    interview: ['GL04', 'GL06'],
    habit: 'Tuliskan perhitungan atau syarat yang kamu pakai, bukan hanya hasilnya.',
    aiGuidance: 'Minta siswa menuliskan perhitungan atau syarat yang ia pakai, bukan hanya hasilnya.',
  },
  UC5: {
    id: 'UC5',
    difficulty: 'Mengevaluasi jawaban orang lain',
    evidence: 'Soal 4: kesalahan tulisan siswa lain baru disebut belakangan.',
    load: 'germane',
    interview: ['GL05'],
    habit: 'Bandingkan setiap pasangan dengan aturan dan arah relasi, satu per satu.',
    aiGuidance: 'Setelah siswa selesai, ajak ia memeriksa ulang setiap pasangan terhadap aturan dan arah relasi.',
  },
};

export const trialFindingList: TrialFinding[] = Object.values(trialFindings);
