// BACKEND Mediator AI — perantara aman antara aplikasi dan DeepSeek.
// - Kunci API dibaca dari variabel lingkungan (.env lokal / Environment Variables di Vercel),
//   tidak pernah dikirim ke browser dan tidak pernah masuk GitHub.
// - Prompt sistem (aturan pedagogis) disusun DI SINI, bukan di browser.
// Dipakai oleh: api/chat.ts (Vercel) dan middleware dev di vite.config.ts (npm run dev).
import { buildServerMessages, MAX_TOKENS, validateRequest } from '../src/ai/pedagogy.js';

export interface ProxyEnv {
  DEEPSEEK_API_KEY?: string;
  DEEPSEEK_MODEL?: string;
  DEEPSEEK_BASE_URL?: string;
  /** Opsional: kode akses kelas; jika diisi, aplikasi harus mengirim header x-access-code yang sama. */
  AI_ACCESS_CODE?: string;
  /** Opsional: daftar origin lain yang boleh memanggil (dipisah koma), mis. https://xxx.github.io */
  ALLOWED_ORIGINS?: string;
}

const RATE = { max: 40, windowMs: 10 * 60 * 1000 };
const buckets = new Map<string, number[]>();

/** Untuk tes. */
export function resetRateLimit() {
  buckets.clear();
}

function allowRequest(id: string, now = Date.now()): boolean {
  const recent = (buckets.get(id) ?? []).filter((t) => now - t < RATE.windowMs);
  if (recent.length >= RATE.max) {
    buckets.set(id, recent);
    return false;
  }
  recent.push(now);
  buckets.set(id, recent);
  return true;
}

function originAllowed(req: Request, origin: string | null, allowed: string[]): boolean {
  if (!origin) return true; // permintaan non-browser / same-origin tanpa Origin
  try {
    if (new URL(origin).host === new URL(req.url).host) return true;
  } catch {
    return false;
  }
  return allowed.includes(origin);
}

function corsHeaders(origin: string | null, ok: boolean): Record<string, string> {
  const h: Record<string, string> = { 'Content-Type': 'application/json; charset=utf-8', Vary: 'Origin' };
  if (origin && ok) {
    h['Access-Control-Allow-Origin'] = origin;
    h['Access-Control-Allow-Methods'] = 'POST, OPTIONS';
    h['Access-Control-Allow-Headers'] = 'content-type, x-access-code';
  }
  return h;
}

function json(status: number, body: unknown, headers: Record<string, string>): Response {
  return new Response(JSON.stringify(body), { status, headers });
}

export async function handleChat(req: Request, env: ProxyEnv, fetchImpl: typeof fetch = fetch): Promise<Response> {
  const origin = req.headers.get('origin');
  const allowed = (env.ALLOWED_ORIGINS ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  const ok = originAllowed(req, origin, allowed);
  const headers = corsHeaders(origin, ok);

  if (req.method === 'OPTIONS') return new Response(null, { status: ok ? 204 : 403, headers });
  if (!ok) return json(403, { error: 'origin' }, headers);
  if (req.method !== 'POST') return json(405, { error: 'method' }, headers);

  const apiKey = env.DEEPSEEK_API_KEY?.trim();
  if (!apiKey) return json(503, { error: 'not-configured' }, headers);

  const code = env.AI_ACCESS_CODE?.trim();
  if (code && req.headers.get('x-access-code')?.trim() !== code) return json(401, { error: 'access' }, headers);

  const clientId = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'lokal';
  if (!allowRequest(clientId)) return json(429, { error: 'rate' }, headers);

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return json(400, { error: 'bad-request' }, headers);
  }
  const parsed = validateRequest(body);
  if (typeof parsed === 'string') return json(400, { error: 'bad-request', detail: parsed }, headers);

  const base = (env.DEEPSEEK_BASE_URL?.trim() || 'https://api.deepseek.com').replace(/\/+$/, '');
  const models = (env.DEEPSEEK_MODEL ?? '')
    .split(',')
    .map((m) => m.trim())
    .filter(Boolean);
  if (models.length === 0) models.push('deepseek-chat');
  let openRouter = false;
  try {
    openRouter = new URL(base).host.endsWith('openrouter.ai');
  } catch {
    /* alamat tidak sah → ditangani saat fetch */
  }
  let upstream: Response;
  try {
    upstream = await fetchImpl(`${base}/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: models[0],
        // OpenRouter: DEEPSEEK_MODEL boleh berisi beberapa model dipisah koma → cadangan otomatis
        // bila model pertama sibuk (429) atau gagal.
        ...(openRouter && models.length > 1 ? { models } : {}),
        messages: buildServerMessages(parsed),
        // Model "berpikir" di OpenRouter memakai sebagian jatah token untuk berpikir → beri ruang lebih,
        // minta berpikir singkat, dan jangan kirim isi pikirannya (hanya jawaban akhir yang dipakai).
        max_tokens: openRouter ? MAX_TOKENS[parsed.task] + 3000 : MAX_TOKENS[parsed.task],
        ...(openRouter ? { reasoning: { effort: 'low', exclude: true } } : {}),
        temperature: 0.4,
        stream: false,
        ...(parsed.task === 'mediator' ? { response_format: { type: 'json_object' } } : {}),
      }),
    });
  } catch {
    // Gagal terhubung: tunjukkan apakah DEEPSEEK_BASE_URL berupa alamat yang sah (tanpa kunci).
    let provider = 'alamat-tidak-sah';
    try {
      provider = new URL(base).host || provider;
    } catch {
      /* DEEPSEEK_BASE_URL bukan URL lengkap (harus diawali https://) */
    }
    return json(502, { error: 'upstream', provider, reason: 'connect' }, headers);
  }

  if (!upstream.ok) {
    // Keterangan diagnosis untuk guru: layanan yang dihubungi + kode status. Tanpa kunci, tanpa isi galat.
    const diag = { provider: new URL(base).host, status: upstream.status };
    // Isi galat dari layanan AI hanya dicatat di log server (Vercel → Logs), tidak dikirim ke browser.
    const detail = (await upstream.text().catch(() => '')).slice(0, 300).split(apiKey).join('[kunci]');
    console.error(`[chat] layanan AI menolak (${diag.provider} ${diag.status}): ${detail}`);
    if (upstream.status === 402) return json(402, { error: 'balance', ...diag }, headers);
    if (upstream.status === 429) return json(429, { error: 'rate', ...diag }, headers);
    if (upstream.status === 401 || upstream.status === 403) return json(502, { error: 'upstream-auth', ...diag }, headers);
    return json(502, { error: 'upstream', ...diag }, headers);
  }

  const data = (await upstream.json().catch(() => null)) as
    | { model?: string; choices?: { finish_reason?: string; message?: { content?: unknown } }[] }
    | null;
  const text = data?.choices?.[0]?.message?.content;
  if (typeof text !== 'string' || !text.trim()) {
    const diag = { model: data?.model, finish: data?.choices?.[0]?.finish_reason };
    console.error('[chat] balasan kosong', diag);
    return json(502, { error: 'empty', ...diag }, headers);
  }
  return json(200, { reply: text.trim() }, headers);
}
