import { useState } from 'react';
import { AiError, askAi } from '../../ai/client';
import { cleanReply, type AiRequest } from '../../ai/pedagogy';
import { currentAccessCode } from '../../store/aiSettings';
import { Button } from '../ui/Button';

interface FeedbackButtonProps {
  build: () => AiRequest;
  disabled?: boolean;
  label?: string;
}

/** Tombol "minta tanggapan Mediator" untuk bukti logis, penjelasan, atau refleksi. */
export function FeedbackButton({ build, disabled, label = '🤖 Minta tanggapan Mediator' }: FeedbackButtonProps) {
  const [reply, setReply] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const run = async () => {
    setLoading(true);
    setError(null);
    try {
      setReply(cleanReply(await askAi(build(), { accessCode: currentAccessCode() })));
    } catch (e) {
      setError(e instanceof AiError ? e.message : 'Terjadi kesalahan. Coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2" aria-live="polite">
      <Button variant="secondary" onClick={() => void run()} disabled={disabled || loading}>
        {loading ? 'Mediator sedang membaca…' : label}
      </Button>
      {reply && (
        <p className="rounded-xl border-2 border-brand/40 bg-brand-soft p-3">
          <span className="font-bold text-brand">🤖 Mediator: </span>
          {reply}
        </p>
      )}
      {error && (
        <p role="alert" className="text-sm font-bold text-fix">
          ✕ {error}
        </p>
      )}
    </div>
  );
}
