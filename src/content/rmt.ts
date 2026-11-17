// Katalog Rigorous Mathematical Thinking (RMT) — lihat docs/RMT.md.
// Fungsi kognitif diadaptasi dari Kinard & Kozulin (2008), Tabel 4.1.
import { isRelationProblem, type Problem } from './types';

export type CognitiveFunctionId =
  | 'label'
  | 'compare'
  | 'search'
  | 'multi'
  | 'code'
  | 'constant'
  | 'space'
  | 'analyze'
  | 'precise'
  | 'prior'
  | 'evidence'
  | 'define'
  | 'hypo'
  | 'relate';

export interface CognitiveFunction {
  id: CognitiveFunctionId;
  name: string;
  level: 1 | 2 | 3;
  /** Definisi singkat ramah siswa SMP. */
  definition: string;
  /** Pertanyaan untuk diri sendiri (komponen tindakan). */
  question: string;
}

export const cognitiveFunctions: Record<CognitiveFunctionId, CognitiveFunction> = {
  label: {
    id: 'label',
    name: 'Memberi nama & membayangkan',
    level: 1,
    definition: 'Memberi nama berdasarkan ciri pentingnya, sambil membayangkan gambarnya di kepala.',
    question: 'Apa namanya, dan seperti apa gambarnya di kepalaku?',
  },
  compare: {
    id: 'compare',
    name: 'Membandingkan',
    level: 1,
    definition: 'Mencari persamaan dan perbedaan berdasarkan satu ciri yang dipilih.',
    question: 'Aku membandingkan berdasarkan apa? Apa yang sama dan apa yang beda?',
  },
  search: {
    id: 'search',
    name: 'Mencari secara sistematis',
    level: 1,
    definition: 'Memeriksa satu per satu dengan urutan yang jelas agar tidak ada yang terlewat.',
    question: 'Sudahkah semua anggota kuperiksa secara berurutan?',
  },
  multi: {
    id: 'multi',
    name: 'Memakai lebih dari satu informasi',
    level: 1,
    definition: 'Memperhatikan dua hal atau lebih sekaligus, misalnya himpunan A, himpunan B, dan aturannya.',
    question: 'Informasi apa saja yang harus kupakai bersamaan?',
  },
  code: {
    id: 'code',
    name: 'Menyandikan & membaca sandi',
    level: 1,
    definition: 'Menuliskan makna ke dalam simbol, atau membaca makna dari sebuah simbol.',
    question: 'Apa arti simbol ini, dan bagaimana menuliskannya dengan simbol?',
  },
  constant: {
    id: 'constant',
    name: 'Menjaga keajegan',
    level: 2,
    definition: 'Melihat apa yang tetap sama ketika hal lain berubah.',
    question: 'Apa yang tetap sama walaupun bentuk penyajiannya berubah?',
  },
  space: {
    id: 'space',
    name: 'Menentukan letak dengan acuan',
    level: 2,
    definition: 'Memakai acuan, seperti sumbu mendatar dan tegak, untuk menentukan letak dengan tepat.',
    question: 'Letaknya di atas apa, dan sejajar dengan apa?',
  },
  analyze: {
    id: 'analyze',
    name: 'Mengurai & menyatukan',
    level: 2,
    definition: 'Memecah keseluruhan menjadi bagian-bagian, lalu menyusunnya kembali.',
    question: 'Bagian-bagiannya apa saja, dan bagaimana bagian itu menyatu?',
  },
  precise: {
    id: 'precise',
    name: 'Bersikap tepat',
    level: 2,
    definition: 'Berusaha fokus dan tepat, termasuk urutan, tanda kurung, dan simbol.',
    question: 'Apakah urutan dan tanda yang kutulis sudah tepat?',
  },
  prior: {
    id: 'prior',
    name: 'Mengaktifkan pengetahuan awal',
    level: 3,
    definition: 'Mengingat hal yang pernah dipelajari untuk membantu soal sekarang.',
    question: 'Apa yang sudah kuketahui yang bisa membantu di sini?',
  },
  evidence: {
    id: 'evidence',
    name: 'Memberi bukti logis',
    level: 3,
    definition: 'Memberi alasan yang masuk akal untuk membuktikan bahwa jawaban benar.',
    question: 'Apa buktinya bahwa jawabanku benar?',
  },
  define: {
    id: 'define',
    name: 'Mendefinisikan masalah',
    level: 3,
    definition: 'Melihat lebih dalam untuk tahu dengan tepat apa yang harus dikerjakan.',
    question: 'Sebenarnya soal ini meminta aku melakukan apa?',
  },
  hypo: {
    id: 'hypo',
    name: 'Berpikir hipotesis',
    level: 3,
    definition: 'Membuat dugaan, lalu mengujinya dengan bukti.',
    question: 'Kalau dugaanku benar, apa akibatnya? Bagaimana mengujinya?',
  },
  relate: {
    id: 'relate',
    name: 'Membentuk hubungan',
    level: 3,
    definition: 'Menghubungkan hal yang tampak terpisah, atau menyusun ulang hubungan untuk soal baru.',
    question: 'Bagaimana bentuk ini berhubungan dengan bentuk yang lain?',
  },
};

export type ToolId = 'set' | 'arrow' | 'pairs' | 'table' | 'cartesian';

/** Alat psikologis: struktur (bentuknya) menentukan fungsi (kegunaannya). */
export interface PsychologicalTool {
  id: ToolId;
  name: string;
  structure: string;
  purpose: string;
  functions: CognitiveFunctionId[];
}

export const tools: Record<ToolId, PsychologicalTool> = {
  set: {
    id: 'set',
    name: 'Notasi himpunan { }',
    structure: 'Kurung kurawal berisi anggota yang dipisahkan tanda koma.',
    purpose: 'Mengumpulkan benda yang anggotanya jelas dalam satu nama.',
    functions: ['label', 'code'],
  },
  arrow: {
    id: 'arrow',
    name: 'Diagram panah',
    structure: 'Dua bingkai: himpunan A di kiri, himpunan B di kanan, dihubungkan panah.',
    purpose: 'Menunjukkan dengan jelas anggota mana dipasangkan dengan anggota mana.',
    functions: ['search', 'compare', 'multi'],
  },
  pairs: {
    id: 'pairs',
    name: 'Himpunan pasangan berurutan',
    structure: 'Kurung biasa (a, b) di dalam kurung kurawal. a dari A, b dari B.',
    purpose: 'Menuliskan setiap hubungan dengan singkat dan tepat.',
    functions: ['code', 'precise'],
  },
  table: {
    id: 'table',
    name: 'Tabel',
    structure: 'Kolom A dan kolom B. Satu baris berisi satu pasangan.',
    purpose: 'Mengatur pasangan supaya rapi, mudah dihitung, dan mudah diperiksa.',
    functions: ['analyze', 'search'],
  },
  cartesian: {
    id: 'cartesian',
    name: 'Diagram Kartesius',
    structure: 'Dua sumbu tegak lurus: anggota A di sumbu mendatar, anggota B di sumbu tegak.',
    purpose: 'Menunjukkan letak setiap pasangan sebagai satu noktah.',
    functions: ['space', 'code'],
  },
};

const baseByType: Record<Problem['type'], CognitiveFunctionId[]> = {
  mcq: ['define', 'compare'],
  arrow: ['search', 'compare'],
  pairs: ['code', 'precise'],
  cartesian: ['space', 'code'],
  numbers: ['analyze', 'precise'],
  multi: ['define', 'compare'],
};

/**
 * Fungsi kognitif yang dilatih sebuah soal. Bisa ditulis langsung di data soal (`functions`);
 * jika tidak, diturunkan dari bentuk soal. Maks 4 agar tidak membebani (beban kognitif),
 * dan "memberi bukti logis" selalu ada (inti rigor RMT).
 */
export function functionsFor(problem: Problem): CognitiveFunctionId[] {
  if (problem.functions?.length) return problem.functions;
  const list: CognitiveFunctionId[] = [];
  if (isRelationProblem(problem)) {
    if (problem.story) list.push('define', 'multi');
    if (problem.show) list.push('relate', 'constant');
    if (problem.given) list.push('prior');
  }
  list.push(...baseByType[problem.type]);
  const unique = [...new Set(list)].filter((id) => id !== 'evidence').slice(0, 3);
  return [...unique, 'evidence'];
}
