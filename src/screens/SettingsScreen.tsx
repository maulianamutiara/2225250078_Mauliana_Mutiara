import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { AiError, askAi } from '../ai/client';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { useInstallPrompt } from '../lib/installPrompt';
import { useAiSettings } from '../store/aiSettings';

/**
 * S13 — Pengaturan: kode akses kelas (opsional) dan uji koneksi Mediator AI.
 * Kunci DeepSeek TIDAK diisi di sini — kunci disimpan guru di backend (variabel lingkungan).
 */
export function SettingsScreen() {
  const saved = useAiSettings();
  const [code, setCode] = useState(saved.accessCode);
  const [status, setStatus] = useState<{ ok: boolean; text: string } | null>(null);
  const [testing, setTesting] = useState(false);

  const save = (e: FormEvent) => {
    e.preventDefault();
    saved.save(code);
    setStatus({ ok: true, text: 'Kode akses tersimpan di perangkat ini.' });
  };

  const test = async () => {
    saved.save(code);
    setTesting(true);
    setStatus(null);
    try {
      await askAi({ task: 'ping', context: '', question: 'siap?', history: [] }, { accessCode: code });
      setStatus({ ok: true, text: 'Terhubung! Mediator AI siap dipakai.' });
    } catch (e) {
      setStatus({ ok: false, text: e instanceof AiError ? e.message : 'Gagal terhubung.' });
    } finally {
      setTesting(false);
    }
  };

  return (
    <main className="mx-auto max-w-xl space-y-4 px-4 py-4">
      <Link to="/beranda" className="inline-flex min-h-touch items-center font-bold text-brand hover:underline">
        ← Peta Belajar
      </Link>
      <h1 className="text-2xl font-bold">⚙️ Pengaturan</h1>

      <InstallCard />

      <Card className="space-y-2">
        <p className="font-bold">🤖 Mediator AI (DeepSeek)</p>
        <p>Kunci DeepSeek disimpan aman di server, bukan di HP atau di GitHub.</p>
        <p className="text-sm text-muted">Jika guru memberi kode akses kelas, isi di bawah.</p>
      </Card>

      <Card>
        <form onSubmit={save} className="space-y-3">
          <div>
            <label htmlFor="access-code" className="font-bold">
              Kode akses kelas (opsional)
            </label>
            <input
              id="access-code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              autoComplete="off"
              maxLength={64}
              placeholder="Contoh: RELASI8A"
              className="mt-1 min-h-touch w-full rounded-xl border-2 border-line bg-white px-3 focus:border-brand focus:outline-none"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="submit">Simpan</Button>
            <Button variant="secondary" onClick={() => void test()} disabled={testing}>
              {testing ? 'Menguji…' : 'Uji koneksi'}
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
        <p className="font-bold">Untuk guru: cara mengaktifkan Mediator</p>
        <ol className="list-decimal space-y-1 pl-5">
          <li>Buat kunci di platform.deepseek.com (menu API Keys), lalu isi saldo.</li>
          <li>Di Vercel, buka proyek → Settings → Environment Variables.</li>
          <li>Tambahkan DEEPSEEK_API_KEY berisi kunci itu, lalu Redeploy.</li>
        </ol>
        <p className="text-sm text-muted">Tanpa Mediator, semua materi dan soal tetap bisa dipakai.</p>
      </Card>
    </main>
  );
}

/** Kartu "Pasang di HP" (PWA): ikon di layar utama, layar penuh, materi & soal jalan tanpa internet. */
function InstallCard() {
  const { canInstall, installed, ios, install } = useInstallPrompt();
  return (
    <Card className="space-y-2">
      <p className="font-bold">📲 Pasang di HP</p>
      {installed ? (
        <p className="font-bold text-ok">✓ Aplikasi sudah terpasang di perangkat ini.</p>
      ) : canInstall ? (
        <>
          <p>Pasang agar muncul ikon di layar HP dan bisa dibuka tanpa internet.</p>
          <Button onClick={() => void install()}>📲 Pasang aplikasi</Button>
        </>
      ) : ios ? (
        <ol className="list-decimal space-y-1 pl-5">
          <li>Buka aplikasi ini di Safari.</li>
          <li>Ketuk tombol Bagikan (kotak dengan panah ke atas).</li>
          <li>Pilih "Tambahkan ke Layar Utama".</li>
        </ol>
      ) : (
        <p>Di Chrome, ketuk menu ⋮ lalu pilih "Instal aplikasi" atau "Tambahkan ke layar utama".</p>
      )}
      <p className="text-sm text-muted">Materi dan soal tetap jalan tanpa internet. Mediator AI butuh internet.</p>
    </Card>
  );
}
