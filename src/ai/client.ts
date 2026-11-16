// Klien DeepSeek (API kompatibel OpenAI: POST {baseUrl}/chat/completions).
// Kunci API TIDAK pernah ditulis di kode — diisi guru di layar Pengaturan dan disimpan di perangkat.

export interface AiSettings {
  apiKey: string;
  model: string;
  baseUrl: string;
}

export const DEFAULT_AI_SETTINGS: AiSettings = {
  apiKey: '',
  model: 'deepseek-chat',
  baseUrl: 'https://api.deepseek.com',
};

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export type AiErrorKind = 'no-key' | 'auth' | 'balance' | 'rate' | 'timeout' | 'network' | 'server';

export class AiError extends Error {
  constructor(
    public kind: AiErrorKind,
    message: string,
  ) {
    super(message);
    this.name = 'AiError';
  }
}

interface ChatOptions {
  maxTokens?: number;
  temperature?: number;
  timeoutMs?: number;
  fetchImpl?: typeof fetch;
}

function errorFromStatus(status: number): AiError {
  if (status === 401 || status === 403)
    return new AiError('auth', 'Kunci API tidak valid. Periksa lagi di ⚙️ Pengaturan.');
  if (status === 402)
    return new AiError('balance', 'Saldo DeepSeek habis. Isi saldo di platform.deepseek.com.');
  if (status === 429) return new AiError('rate', 'Terlalu banyak permintaan. Tunggu sebentar, lalu coba lagi.');
  return new AiError('server', 'Server Mediator sedang bermasalah. Coba lagi nanti.');
}

export function isAiReady(settings: Pick<AiSettings, 'apiKey'>): boolean {
  return settings.apiKey.trim().length > 0;
}

/** Kirim percakapan ke DeepSeek dan kembalikan teks balasan. */
export async function chat(
  settings: AiSettings,
  messages: ChatMessage[],
  options: ChatOptions = {},
): Promise<string> {
  if (!isAiReady(settings)) {
    throw new AiError('no-key', 'Mediator AI belum aktif. Minta guru mengisi kunci di ⚙️ Pengaturan.');
  }
  const doFetch = options.fetchImpl ?? globalThis.fetch.bind(globalThis);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), options.timeoutMs ?? 25000);
  try {
    const res = await doFetch(`${settings.baseUrl.replace(/\/+$/, '')}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${settings.apiKey.trim()}`,
      },
      body: JSON.stringify({
        model: settings.model.trim() || DEFAULT_AI_SETTINGS.model,
        messages,
        max_tokens: options.maxTokens ?? 220,
        temperature: options.temperature ?? 0.4,
        stream: false,
      }),
      signal: controller.signal,
    });
    if (!res.ok) throw errorFromStatus(res.status);
    const data = await res.json();
    const text: unknown = data?.choices?.[0]?.message?.content;
    if (typeof text !== 'string' || !text.trim()) {
      throw new AiError('server', 'Mediator tidak memberi jawaban. Coba lagi.');
    }
    return text.trim();
  } catch (e) {
    if (e instanceof AiError) throw e;
    if ((e as Error)?.name === 'AbortError') {
      throw new AiError('timeout', 'Mediator terlalu lama menjawab. Periksa internet, lalu coba lagi.');
    }
    throw new AiError('network', 'Tidak bisa terhubung ke Mediator. Periksa koneksi internet.');
  } finally {
    clearTimeout(timer);
  }
}

/** Rapikan balasan: buang format markdown agar tampil sebagai teks biasa yang bersih. */
export function cleanReply(text: string): string {
  return text
    .replace(/\*\*|__/g, '')
    .replace(/^#{1,6}\s*/gm, '')
    .replace(/`/g, '')
    .trim();
}
