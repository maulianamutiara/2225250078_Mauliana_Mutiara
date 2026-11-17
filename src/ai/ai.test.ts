import { allProblems } from '../content';
import { isRelationProblem, type Problem, type RelationProblem } from '../content/types';
import { functionsFor, cognitiveFunctions } from '../content/rmt';
import type { Pair } from '../domain/types';
import { AiError, chat, cleanReply, DEFAULT_AI_SETTINGS } from './client';
import {
  buildEvidenceMessages,
  buildMediatorMessages,
  buildReflectionMessages,
  describeAttempt,
  MEDIATOR_SYSTEM,
} from './prompts';

const byId = (id: string) => allProblems.find((p) => p.id === id) as Problem;
const settings = { ...DEFAULT_AI_SETTINGS, apiKey: 'sk-test' };

function fakeFetch(status: number, body: unknown) {
  return vi.fn(async () => new Response(JSON.stringify(body), { status })) as unknown as typeof fetch;
}

describe('klien DeepSeek', () => {
  it('menolak tanpa kunci dan tidak memanggil jaringan', async () => {
    const f = fakeFetch(200, {});
    await expect(chat({ ...settings, apiKey: '  ' }, [], { fetchImpl: f })).rejects.toMatchObject({ kind: 'no-key' });
    expect(f).not.toHaveBeenCalled();
  });

  it('mengirim permintaan yang benar dan mengembalikan teks balasan', async () => {
    const f = fakeFetch(200, { choices: [{ message: { content: '  Coba cek anggota 6.  ' } }] });
    const reply = await chat(settings, [{ role: 'user', content: 'halo' }], { fetchImpl: f });
    expect(reply).toBe('Coba cek anggota 6.');
    const [url, init] = (f as unknown as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(url).toBe('https://api.deepseek.com/chat/completions');
    expect(init.headers.Authorization).toBe('Bearer sk-test');
    expect(JSON.parse(init.body).model).toBe('deepseek-chat');
  });

  it('menerjemahkan status error menjadi pesan yang jelas', async () => {
    await expect(chat(settings, [], { fetchImpl: fakeFetch(401, {}) })).rejects.toMatchObject({ kind: 'auth' });
    await expect(chat(settings, [], { fetchImpl: fakeFetch(402, {}) })).rejects.toMatchObject({ kind: 'balance' });
    await expect(chat(settings, [], { fetchImpl: fakeFetch(429, {}) })).rejects.toMatchObject({ kind: 'rate' });
  });

  it('gangguan jaringan menjadi AiError network', async () => {
    const f = vi.fn(async () => {
      throw new TypeError('Failed to fetch');
    }) as unknown as typeof fetch;
    await expect(chat(settings, [], { fetchImpl: f })).rejects.toBeInstanceOf(AiError);
  });

  it('cleanReply membuang format markdown', () => {
    expect(cleanReply('## Judul\n**Hebat!** Coba `cek` lagi.')).toBe('Judul\nHebat! Coba cek lagi.');
  });
});

describe('prompt Mediator (RMT)', () => {
  it('aturan sistem melarang memberi jawaban', () => {
    expect(MEDIATOR_SYSTEM).toContain('JANGAN pernah memberi jawaban');
  });

  it('kunci jawaban tidak pernah ikut dikirim ke AI', () => {
    for (const p of allProblems) {
      if (!isRelationProblem(p)) continue;
      const text = buildMediatorMessages(p, {}, [], 'Aku bingung')
        .map((m) => m.content)
        .join('\n');
      for (const [a, b] of p.relation.pairs) {
        expect(text, `${p.id} membocorkan (${a}, ${b})`).not.toContain(`(${a}, ${b})`);
      }
    }
  });

  it('pilihan ganda: indeks kunci tidak disebut sebelum siswa memilih', () => {
    const p = byId('P3-1');
    expect(describeAttempt(p, {})).toBe('Siswa belum memilih jawaban.');
    expect(describeAttempt(p, { choice: 1 })).toContain('belum benar');
  });

  it('status menyertakan pesan kesalahan khusus (M1–M7)', () => {
    const p = byId('P5-4') as RelationProblem;
    const answer: Pair[] = [
      ['2', '4'],
      ['3', '6'],
      ['5', '10'],
    ];
    expect(describeAttempt(p, { pairs: answer })).toContain('lebih dari satu pasangan');
  });

  it('menyebut fungsi kognitif yang dilatih soal', () => {
    const p = byId('P6-1');
    const text = buildMediatorMessages(p, {}, [], 'hai')[0].content;
    for (const id of functionsFor(p)) expect(text).toContain(cognitiveFunctions[id].name.toLowerCase());
  });

  it('bukti logis dan refleksi menyertakan konteks yang tepat', () => {
    const p = byId('P2-3');
    expect(buildEvidenceMessages(p, '{(4, 2)}', 'karena 4 = 2 × 2')[1].content).toContain('4 = 2 × 2');
    const r = buildReflectionMessages({
      topicTitle: 'Diagram Panah',
      summary: ['Panah dari A ke B.'],
      functionsUsed: ['search'],
      effort: 4,
      text: 'Aku belajar memeriksa satu per satu.',
    });
    expect(r[0].content).toContain('mencari secara sistematis');
  });
});
