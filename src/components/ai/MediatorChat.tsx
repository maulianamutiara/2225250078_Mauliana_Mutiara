import { useState, type FormEvent } from 'react';
import { AiError, chat, cleanReply, isAiReady, type ChatMessage } from '../../ai/client';
import { currentAiSettings, useAiSettings } from '../../store/aiSettings';
import { Button } from '../ui/Button';

interface MediatorChatProps {
  /** Susun pesan lengkap (sistem + konteks terbaru + riwayat + pertanyaan). */
  build: (history: ChatMessage[], question: string) => ChatMessage[];
  suggestions?: string[];
  /** Batas pertanyaan per soal — menjaga fokus (beban kognitif) dan biaya. */
  maxTurns?: number;
}

export function AiNotReady() {
  return (
    <p className="rounded-xl border-2 border-dashed border-line bg-surface p-3 text-sm">
      🤖 Mediator AI belum aktif. Minta guru mengisi kunci DeepSeek di{' '}
      <a href="#/pengaturan" className="font-bold text-brand underline">
        ⚙️ Pengaturan
      </a>
      .
    </p>
  );
}

/** Mediator AI (RMT/MLE): bertanya balik, tidak memberi jawaban. */
export function MediatorChat({ build, suggestions = [], maxTurns = 6 }: MediatorChatProps) {
  const apiKey = useAiSettings((s) => s.apiKey);
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isAiReady({ apiKey })) return <AiNotReady />;

  const turns = history.filter((m) => m.role === 'user').length;
  const limitReached = turns >= maxTurns;

  const ask = async (raw: string) => {
    const question = raw.trim();
    if (!question || loading || limitReached) return;
    setError(null);
    setLoading(true);
    setInput('');
    try {
      const reply = cleanReply(await chat(currentAiSettings(), build(history, question)));
      setHistory((h) => [...h, { role: 'user', content: question }, { role: 'assistant', content: reply }]);
    } catch (e) {
      setError(e instanceof AiError ? e.message : 'Terjadi kesalahan. Coba lagi.');
      setInput(question);
    } finally {
      setLoading(false);
    }
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    void ask(input);
  };

  return (
    <div className="space-y-2 rounded-xl border-2 border-brand/40 bg-brand-soft p-3" aria-live="polite">
      <p className="font-bold text-brand">🤖 Mediator</p>
      {history.length === 0 && (
        <p className="text-sm">Aku tidak akan memberi jawaban, tapi aku bantu kamu berpikir. Mau tanya apa?</p>
      )}
      {history.map((m, i) => (
        <p
          key={i}
          className={
            m.role === 'user'
              ? 'ml-8 rounded-xl bg-white p-2 text-right'
              : 'mr-8 rounded-xl border border-line bg-surface p-2'
          }
        >
          {m.role === 'assistant' && <span className="font-bold text-brand">Mediator: </span>}
          {m.content}
        </p>
      ))}
      {loading && <p className="text-sm text-muted">Mediator sedang berpikir…</p>}
      {error && (
        <p role="alert" className="text-sm font-bold text-fix">
          ✕ {error}
        </p>
      )}

      {history.length === 0 && suggestions.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {suggestions.map((s) => (
            <Button key={s} variant="secondary" className="text-sm" onClick={() => void ask(s)} disabled={loading}>
              {s}
            </Button>
          ))}
        </div>
      )}

      {limitReached ? (
        <p className="text-sm text-muted">Batas pertanyaan untuk soal ini tercapai. Coba pakai hint, ya.</p>
      ) : (
        <form onSubmit={submit} className="flex gap-2">
          <label htmlFor="tanya-mediator" className="sr-only">
            Pertanyaan untuk Mediator
          </label>
          <input
            id="tanya-mediator"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            maxLength={300}
            placeholder="Tulis pertanyaanmu…"
            className="min-h-touch flex-1 rounded-xl border-2 border-line bg-white px-3 focus:border-brand focus:outline-none"
          />
          <Button type="submit" disabled={loading || !input.trim()}>
            Kirim
          </Button>
        </form>
      )}
      <p className="text-xs text-muted">Mediator AI bisa keliru. Cek lagi dengan hint dan pembahasan.</p>
    </div>
  );
}
