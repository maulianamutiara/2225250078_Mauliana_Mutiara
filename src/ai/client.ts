// Klien Mediator AI di browser. Memanggil BACKEND aplikasi (/api/chat), BUKAN DeepSeek langsung.
// Kunci DeepSeek hanya ada di server (variabel lingkungan .env / Vercel) — tidak pernah di sini.
import type { AiRequest } from './pedagogy';

export type AiErrorKind =
  | 'unavailable'
  | 'not-configured'
  | 'access'
  | 'balance'
  | 'rate'
  | 'upstream-auth'
  | 'timeout'
  | 'network'
  | 'server';

const MESSAGES: Record<AiErrorKind, string> = {
  unavailable: 'Mediator AI tidak tersedia di alamat ini. Buka aplikasi lewat alamat utama (Vercel).',
  'not-configured': 'Mediator AI belum diaktifkan: guru perlu memasang kunci DeepSeek di server.',
  access: 'Kode akses kelas salah atau belum diisi. Minta kodenya ke guru, lalu isi di ⚙️ Pengaturan.',
  balance: 'Saldo DeepSeek habis. Guru perlu mengisi saldo di platform.deepseek.com.',
  rate: 'Terlalu banyak pertanyaan dalam waktu singkat. Tunggu sebentar, lalu coba lagi.',
  'upstream-auth': 'Kunci DeepSeek di server tidak valid. Hubungi guru.',
  timeout: 'Mediator terlalu lama menjawab. Periksa internet, lalu coba lagi.',
  network: 'Tidak bisa terhubung ke Mediator. Periksa koneksi internet.',
  server: 'Server Mediator sedang bermasalah. Coba lagi nanti.',
};

export class AiError extends Error {
  constructor(public kind: AiErrorKind) {
    super(MESSAGES[kind]);
    this.name = 'AiError';
  }
}

/** Alamat backend. Bisa diganti saat build lewat VITE_AI_ENDPOINT (mis. untuk versi GitHub Pages). */
export const AI_ENDPOINT: string = (import.meta.env.VITE_AI_ENDPOINT as string | undefined)?.trim() || '/api/chat';

interface AskOptions {
  accessCode?: string;
  endpoint?: string;
  fetchImpl?: typeof fetch;
  timeoutMs?: number;
}

function errorFromResponse(status: number, code?: string): AiError {
  if (code === 'upstream-auth') return new AiError('upstream-auth');
  if (status === 503) return new AiError('not-configured');
  if (status === 401) return new AiError('access');
  if (status === 402) return new AiError('balance');
  if (status === 429) return new AiError('rate');
  if (status === 403 || status === 404 || status === 405) return new AiError('unavailable');
  return new AiError('server');
}

/** Kirim permintaan ke backend Mediator dan kembalikan teks balasan mentah. */
export async function askAi(request: AiRequest, options: AskOptions = {}): Promise<string> {
  const doFetch = options.fetchImpl ?? globalThis.fetch.bind(globalThis);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), options.timeoutMs ?? 30000);
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (options.accessCode?.trim()) headers['x-access-code'] = options.accessCode.trim();
  try {
    const res = await doFetch(options.endpoint ?? AI_ENDPOINT, {
      method: 'POST',
      headers,
      body: JSON.stringify(request),
      signal: controller.signal,
    });
    const data = (await res.json().catch(() => null)) as { reply?: unknown; error?: string } | null;
    if (!res.ok) throw errorFromResponse(res.status, data?.error);
    if (typeof data?.reply !== 'string' || !data.reply.trim()) throw new AiError('server');
    return data.reply;
  } catch (e) {
    if (e instanceof AiError) throw e;
    if ((e as Error)?.name === 'AbortError') throw new AiError('timeout');
    throw new AiError('network');
  } finally {
    clearTimeout(timer);
  }
}
