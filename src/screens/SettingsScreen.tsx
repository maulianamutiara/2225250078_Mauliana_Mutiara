import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { AiError, chat, DEFAULT_AI_SETTINGS, isAiReady } from '../ai/client';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { currentAiSettings, useAiSettings } from '../store/aiSettings';

/** S13 — Pengaturan guru: kunci API DeepSeek untuk Mediator AI (hanya tersimpan di perangkat ini). */
export function SettingsScreen() {
  const saved = useAiSettings();
  const [apiKey, setApiKey] = useState(saved.apiKey);
  const [model, setModel] = useState(saved.model);
  const [show, setShow] = useState(false);
  const [status, setStatus] = useState<{ ok: boolean; text: string } | null>(null);
  const [testing, setTesting] = useState(false);

  const save = (e: FormEvent) => {
    e.preventDefault();
    saved.save({ apiKey, model: model.trim() || DEFAULT_AI_SETTINGS.model });
    setStatus({ ok: true, text: 'Tersimpan di perangkat ini.' });
  };

  const test = async () => {
    saved.save({ apiKey, model: model.trim() || DEFAULT_AI_SETTINGS.model });
    setTesting(true);
    setStatus(null);
    try {
      await chat(currentAiSettings(), [{ role: 'user', content: 'Balas satu kata: siap' }], { maxTokens: 5 });
      setStatus({ ok: true, text: 'Terhubung! Mediator AI siap dipakai.' });
    } catch (e) {
      setStatus({ ok: false, text: e instanceof AiError ? e.message : 'Gagal terhubung.' });
    } finally {
      setTesting(false);
    }
  };

  const remove = () => {
    saved.clearKey();
    setApiKey('');
    setStatus({ ok: true, text: 'Kunci dihapus dari perangkat ini.' });
  };

  return (
    <main className="mx-auto max-w-xl space-y-4 px-4 py-4">
      <Link to="/beranda" className="inline-flex min-h-touch items-center font-bold text-brand hover:underline">
        ← Peta Belajar
      </Link>
      <h1 className="text-2xl font-bold">⚙️ Pengaturan Guru</h1>

      <Card className="space-y-2">
        <p className="font-bold">🤖 Mediator AI (DeepSeek)</p>
        <p className="text-sm text-muted">
          Status: {isAiReady(saved) ? '✓ aktif di perangkat ini' : '✕ belum aktif'}
        </p>
        <p>Kunci hanya disimpan di perangkat ini, tidak ikut ke GitHub atau ke perangkat lain.</p>
        <p className="text-sm font-bold text-fix">Jangan bagikan kunci kepada siswa atau di grup chat.</p>
      </Card>

      <Card>
        <form onSubmit={save} className="space-y-3">
          <div>
            <label htmlFor="api-key" className="font-bold">
              Kunci API DeepSeek
            </label>
            <div className="mt-1 flex gap-2">
              <input
                id="api-key"
                type={show ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                autoComplete="off"
                placeholder="sk-…"
                className="min-h-touch flex-1 rounded-xl border-2 border-line bg-white px-3 focus:border-brand focus:outline-none"
              />
              <Button variant="ghost" onClick={() => setShow((s) => !s)}>
                {show ? 'Sembunyikan' : 'Lihat'}
              </Button>
            </div>
          </div>
          <div>
            <label htmlFor="model" className="font-bold">
              Model
            </label>
            <input
              id="model"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="mt-1 min-h-touch w-full rounded-xl border-2 border-line bg-white px-3 focus:border-brand focus:outline-none"
            />
            <p className="text-xs text-muted">Biarkan "{DEFAULT_AI_SETTINGS.model}" kecuali tahu model lain.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="submit">Simpan</Button>
            <Button variant="secondary" onClick={() => void test()} disabled={!apiKey.trim() || testing}>
              {testing ? 'Menguji…' : 'Uji koneksi'}
            </Button>
            <Button variant="ghost" onClick={remove} disabled={!saved.apiKey}>
              🗑 Hapus kunci
            </Button>
          </div>
          {status && (
            <p role="status" className={`font-bold ${status.ok ? 'text-ok' : 'text-fix'}`}>
              {status.ok ? '✓' : '✕'} {status.text}
            </p>
          )}
        </form>
      </Card>

      <Card className="space-y-1">
        <p className="font-bold">Cara mendapatkan kunci</p>
        <ol className="list-decimal space-y-1 pl-5">
          <li>Buka platform.deepseek.com dan masuk/daftar.</li>
          <li>Isi saldo (Top up) jika saldo masih nol.</li>
          <li>Buka menu API Keys → Create new API key.</li>
          <li>Salin kunci (diawali "sk-"), lalu tempel di atas.</li>
        </ol>
      </Card>
    </main>
  );
}
