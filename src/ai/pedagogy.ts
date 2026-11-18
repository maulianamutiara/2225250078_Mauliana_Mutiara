// Aturan pedagogis Asisten Belajar (Mediator AI) — dipakai BACKEND (server/chatHandler.ts)
// untuk menyusun prompt sistem, sehingga aturan ini tidak bisa diubah dari browser.
// Dasar: Cognitive Load Theory (intrinsik, ekstrinsik, germane), Rigorous Mathematical Thinking
// (3 fase), dan Mediated Learning Experience (Feuerstein). Lihat docs/RMT.md & docs/COGNITIVE_LOAD.md.

import { trialFindingList } from '../content/trialFindings.js';

export type AiTask = 'mediator' | 'evidence' | 'explain' | 'reflection' | 'ping';
export type LoadType = 'intrinsik' | 'ekstrinsik' | 'germane';
export type Difficulty = 'read' | 'start' | 'wrong' | 'check' | 'other';
export type HintLevel = 1 | 2 | 3 | 4;

export interface AiHistoryItem {
  role: 'user' | 'assistant';
  content: string;
}

/** Permintaan dari aplikasi ke backend. Tidak berisi kunci API dan tidak berisi kunci jawaban. */
export interface AiRequest {
  task: AiTask;
  context: string;
  question: string;
  history: AiHistoryItem[];
  difficulty?: Difficulty;
  hintLevel?: HintLevel;
}

export const LIMITS = { context: 5000, question: 600, historyItems: 8, historyItem: 1200 } as const;

/** Jenis kesulitan yang dipilih siswa → jenis beban kognitif → strategi bantuan. */
export const DIFFICULTIES: Record<Difficulty, { label: string; load: LoadType | null; guidance: string }> = {
  read: {
    label: 'Aku belum paham maksud soalnya',
    load: 'ekstrinsik',
    guidance:
      'Kesulitan membaca bahasa soal (beban EKSTRINSIK). Sederhanakan kalimat, sebut 2–3 informasi penting saja, katakan informasi mana yang boleh diabaikan, lalu tanyakan apa yang diminta soal.',
  },
  start: {
    label: 'Aku bingung mulai dari mana',
    load: 'intrinsik',
    guidance:
      'Soal terasa terlalu kompleks (beban INTRINSIK). Pecah menjadi satu langkah kecil, fokus pada satu anggota atau satu bagian dulu, dan sarankan satu alat berpikir yang cocok.',
  },
  wrong: {
    label: 'Jawabanku belum benar, salahnya di mana?',
    load: 'intrinsik',
    guidance:
      'Ada kesalahan konsep atau prosedur (beban INTRINSIK yang belum terkelola). Pakai status dan kesalahan terdeteksi dari aplikasi, arahkan perhatian ke bagian yang keliru, tanpa memberi jawaban yang benar.',
  },
  check: {
    label: 'Aku mau cek alasanku',
    load: 'germane',
    guidance:
      'Siswa siap berpikir lebih dalam (beban GERMANE). Minta siswa menjelaskan bukti logis, membandingkan bentuk penyajian, atau mengaitkan dengan situasi lain.',
  },
  other: {
    label: 'Pertanyaan lain',
    load: null,
    guidance: 'Diagnosis sendiri jenis kesulitan siswa dari pertanyaannya, lalu pilih jenis beban yang paling sesuai.',
  },
};

/** Tangga petunjuk 4 tingkat yang mengikuti fase RMT (bantuan dinaikkan bertahap, tidak pernah jawaban akhir). */
export const HINT_LEVELS: Record<HintLevel, { name: string; rmt: string; description: string }> = {
  1: {
    name: 'Orientasi',
    rmt: 'Fase 1 – Pengembangan kognitif',
    description:
      'Bantu siswa mendefinisikan masalah: apa yang diketahui, apa yang ditanya, relasinya dari himpunan mana ke mana. Kurangi beban ekstrinsik.',
  },
  2: {
    name: 'Strategi & alat berpikir',
    rmt: 'Fase 1–2 – Alat psikologis',
    description:
      'Sarankan alat berpikir (diagram panah, tabel, pasangan berurutan, atau diagram Kartesius) dan susun rencana langkah kecil. Kelola beban intrinsik.',
  },
  3: {
    name: 'Langkah terarah',
    rmt: 'Fase 2 – Isi sebagai proses',
    description:
      'Contohkan cara memeriksa SATU bagian kecil saja (misalnya satu anggota), lalu minta siswa melanjutkan sisanya sendiri. Jangan menyelesaikan seluruh soal.',
  },
  4: {
    name: 'Refleksi & pembuktian',
    rmt: 'Fase 3 – Praktik konstruksi konsep',
    description:
      'Minta siswa memeriksa ulang, membuktikan dengan alasan logis, dan membandingkan hasilnya. Dorong beban germane. Tetap tanpa jawaban akhir.',
  },
};

const COMMON_RULES = [
  'Kamu adalah "Mediator", Asisten Belajar matematika untuk siswa SMP kelas VIII di aplikasi RelaSI Pintar (materi Relasi dan soal Mathematical Literacy).',
  'Peranmu adalah PEMBIMBING PROSES BERPIKIR, bukan pemberi jawaban.',
  'Pendekatanmu: Rigorous Mathematical Thinking (Kinard & Kozulin), Mediated Learning Experience (Feuerstein), dan Cognitive Load Theory (Sweller).',
  'Bahasa Indonesia sederhana dan ramah. Kalimat pendek. Satu ide per kalimat.',
  'Pasangan berurutan (a, b): a selalu dari himpunan A (daerah asal), b dari himpunan B (daerah kawan). Panah selalu dari A ke B.',
  'Jika pertanyaan di luar matematika atau di luar soal, arahkan kembali ke soal dengan sopan.',
];

const CL_RULES = [
  'Kelola beban kognitif:',
  '- Beban ekstrinsik: jangan menambah informasi yang tidak perlu; sederhanakan bahasa soal; maksimal 3 kalimat.',
  '- Beban intrinsik: pecah masalah menjadi langkah kecil; satu langkah per balasan.',
  '- Beban germane: ajak siswa menjelaskan, membuktikan, dan menghubungkan konsep.',
];

const MLE_RULES = [
  'Kriteria mediasi Feuerstein:',
  '- Intensionalitas: fokuskan perhatian siswa pada satu hal yang penting sekarang.',
  '- Makna: jelaskan singkat MENGAPA langkah itu berguna.',
  '- Transendensi: bila tepat, kaitkan dengan prinsip umum atau situasi lain.',
  '- Rasa mampu: sebut dulu bagian yang sudah benar.',
];

// Hasil uji coba instrumen ke siswa S01 (docs/UJI_COBA_S01.md) → kebiasaan yang perlu didorong.
const TRIAL_RULES = [
  'Temuan uji coba (kesulitan nyata siswa) — dorong kebiasaan ini bila relevan:',
  ...trialFindingList.map((f) => `- ${f.aiGuidance}`),
];

export const MEDIATOR_SYSTEM = [
  ...COMMON_RULES,
  ...CL_RULES,
  ...MLE_RULES,
  ...TRIAL_RULES,
  'Aturan wajib:',
  '1. JANGAN pernah memberi jawaban akhir, kunci, angka hasil, atau daftar pasangan yang benar.',
  '2. Akhiri dengan tepat satu pertanyaan penuntun yang bisa dijawab siswa.',
  '3. Ikuti TINGKAT PETUNJUK yang diberikan di konteks; jangan melampauinya.',
  '4. Sebut satu fungsi kognitif yang sedang dilatih (mis. mendefinisikan masalah, mencari secara sistematis, membandingkan, memberi bukti logis).',
  '5. Untuk soal literasi, bimbing sesuai TAHAP yang sedang dikerjakan saja.',
  'Tingkat petunjuk (tangga bantuan RMT):',
  ...([1, 2, 3, 4] as HintLevel[]).map(
    (l) => `${l}. ${HINT_LEVELS[l].name} (${HINT_LEVELS[l].rmt}): ${HINT_LEVELS[l].description}`,
  ),
  'Balas HANYA dalam format json berikut, tanpa teks lain:',
  '{"pesan": "maksimal 3 kalimat bimbingan", "pertanyaan": "satu pertanyaan penuntun", "beban": "ekstrinsik|intrinsik|germane", "tahap_rmt": "Fase 1|Fase 2|Fase 3", "fungsi_kognitif": "nama fungsi kognitif", "level": 1}',
].join('\n');

export const EVIDENCE_SYSTEM = [
  ...COMMON_RULES,
  'Tugasmu: menanggapi penjelasan atau "bukti logis" siswa (RMT Fase 3, beban germane).',
  '1. Sebut bagian yang sudah tepat (rasa mampu).',
  '2. Beri satu saran agar penjelasan lebih tepat atau lengkap, misalnya menyebut aturan, angka, atau perbandingan.',
  '3. Maksimal 3 kalimat, tanpa format markdown, tanpa nilai angka, tanpa soal baru.',
].join('\n');

export const REFLECTION_SYSTEM = [
  ...COMMON_RULES,
  'Tugasmu: menanggapi jurnal refleksi RMT siswa setelah satu topik (beban germane).',
  '1. Hargai usaha siswa dan sebut satu hal yang sudah ia pahami.',
  '2. Jika ada salah konsep, luruskan dengan lembut dalam satu kalimat.',
  '3. Kaitkan dengan satu fungsi kognitif yang ia pakai, lalu ajukan satu pertanyaan untuk dipikirkan.',
  'Maksimal 3 kalimat, tanpa format markdown.',
].join('\n');

const SYSTEM: Record<Exclude<AiTask, 'ping'>, string> = {
  mediator: MEDIATOR_SYSTEM,
  evidence: EVIDENCE_SYSTEM,
  explain: EVIDENCE_SYSTEM,
  reflection: REFLECTION_SYSTEM,
};

export const MAX_TOKENS: Record<AiTask, number> = {
  mediator: 350,
  evidence: 250,
  explain: 250,
  reflection: 250,
  ping: 5,
};

const TASKS: AiTask[] = ['mediator', 'evidence', 'explain', 'reflection', 'ping'];

/** Validasi isi permintaan dari browser. Mengembalikan pesan galat (string) bila tidak valid. */
export function validateRequest(body: unknown): AiRequest | string {
  if (!body || typeof body !== 'object') return 'body harus objek';
  const b = body as Record<string, unknown>;
  if (!TASKS.includes(b.task as AiTask)) return 'task tidak dikenal';
  if (typeof b.context !== 'string' || b.context.length > LIMITS.context) return 'context tidak valid';
  if (typeof b.question !== 'string' || b.question.length > LIMITS.question) return 'question tidak valid';
  if (!Array.isArray(b.history) || b.history.length > LIMITS.historyItems) return 'history tidak valid';
  for (const h of b.history) {
    if (!h || typeof h !== 'object') return 'history tidak valid';
    const item = h as Record<string, unknown>;
    if (item.role !== 'user' && item.role !== 'assistant') return 'role history tidak valid';
    if (typeof item.content !== 'string' || item.content.length > LIMITS.historyItem) return 'isi history tidak valid';
  }
  if (b.difficulty !== undefined && !Object.prototype.hasOwnProperty.call(DIFFICULTIES, String(b.difficulty))) {
    return 'difficulty tidak valid';
  }
  if (b.hintLevel !== undefined && ![1, 2, 3, 4].includes(b.hintLevel as number)) return 'hintLevel tidak valid';
  return {
    task: b.task as AiTask,
    context: b.context,
    question: b.question,
    history: (b.history as AiHistoryItem[]).map((h) => ({ role: h.role, content: h.content })),
    difficulty: b.difficulty as Difficulty | undefined,
    hintLevel: b.hintLevel as HintLevel | undefined,
  };
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

/** Susun pesan untuk DeepSeek. Prompt sistem SELALU dari server; browser tidak bisa mengirim pesan "system". */
export function buildServerMessages(req: AiRequest): ChatMessage[] {
  if (req.task === 'ping') {
    return [
      { role: 'system', content: 'Balas dengan satu kata saja: siap' },
      { role: 'user', content: 'tes' },
    ];
  }
  const parts = [SYSTEM[req.task], '', 'KONTEKS DARI APLIKASI (untukmu saja, jangan dibacakan mentah):', req.context];
  if (req.task === 'mediator') {
    const d = DIFFICULTIES[req.difficulty ?? 'other'];
    const level = req.hintLevel ?? 1;
    parts.push(
      '',
      `Jenis kesulitan yang dipilih siswa: "${d.label}". ${d.guidance}`,
      `TINGKAT PETUNJUK maksimum saat ini: ${level} – ${HINT_LEVELS[level].name} (${HINT_LEVELS[level].rmt}).`,
    );
  }
  return [
    { role: 'system', content: parts.join('\n') },
    ...req.history.slice(-LIMITS.historyItems),
    { role: 'user', content: req.question },
  ];
}

export interface MediatorReply {
  message: string;
  question?: string;
  load?: LoadType;
  rmtPhase?: string;
  cognitiveFunction?: string;
  level?: HintLevel;
}

/** Rapikan balasan: buang format markdown agar tampil sebagai teks biasa. */
export function cleanReply(text: string): string {
  return text
    .replace(/\*\*|__/g, '')
    .replace(/^#{1,6}\s*/gm, '')
    .replace(/`/g, '')
    .trim();
}

/** Baca balasan JSON Mediator. Jika bukan JSON, tampilkan sebagai teks biasa. */
export function parseMediatorReply(raw: string): MediatorReply {
  const stripped = raw.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
  try {
    const o = JSON.parse(stripped) as Record<string, unknown>;
    const message = typeof o.pesan === 'string' ? cleanReply(o.pesan) : '';
    if (!message) throw new Error('kosong');
    const load = ['intrinsik', 'ekstrinsik', 'germane'].includes(o.beban as string) ? (o.beban as LoadType) : undefined;
    const lvl = Number(o.level);
    return {
      message,
      question: typeof o.pertanyaan === 'string' && o.pertanyaan.trim() ? cleanReply(o.pertanyaan) : undefined,
      load,
      rmtPhase: typeof o.tahap_rmt === 'string' ? o.tahap_rmt : undefined,
      cognitiveFunction: typeof o.fungsi_kognitif === 'string' ? o.fungsi_kognitif : undefined,
      level: [1, 2, 3, 4].includes(lvl) ? (lvl as HintLevel) : undefined,
    };
  } catch {
    return { message: cleanReply(raw) };
  }
}

/**
 * Tingkat petunjuk berikutnya: naik bertahap sesuai usaha siswa (percobaan & bantuan sebelumnya),
 * disesuaikan jenis kesulitan. "Belum paham maksud soal" → tetap orientasi; "cek alasan" → refleksi.
 */
export function nextHintLevel(opts: { tries: number; hintsUsed: number; aiTurns: number; difficulty: Difficulty }): HintLevel {
  if (opts.difficulty === 'check') return 4;
  const raw = 1 + Math.min(opts.tries, 2) + Math.floor(opts.hintsUsed / 2) + opts.aiTurns;
  const capped = opts.difficulty === 'read' ? Math.min(raw, 2) : Math.min(raw, 3);
  return Math.max(1, capped) as HintLevel;
}
