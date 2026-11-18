import { useCallback, useEffect, useState } from 'react';

export interface StepPlayer {
  shown: number;
  playing: boolean;
  done: boolean;
  play: () => void;
  pause: () => void;
  step: () => void;
  restart: () => void;
}

/**
 * Pemutar animasi langkah demi langkah (F6): ▶ putar, ⏸ jeda, ⏭ satu langkah, ↺ ulang.
 * `shown` = banyak pasangan yang sudah tampil. Siswa mengatur kecepatannya sendiri (EL05).
 */
export function useStepPlayer(start: number, total: number, stepMs: number, autoplay = true): StepPlayer {
  const [shown, setShown] = useState(start);
  const [playing, setPlaying] = useState(autoplay && start < total);
  const done = shown >= total;

  useEffect(() => {
    if (!playing) return;
    if (shown >= total) {
      setPlaying(false);
      return;
    }
    const t = setTimeout(() => setShown((s) => Math.min(s + 1, total)), shown === start ? 300 : stepMs);
    return () => clearTimeout(t);
  }, [playing, shown, start, total, stepMs]);

  const play = useCallback(() => {
    if (shown >= total) setShown(start);
    setPlaying(true);
  }, [shown, start, total]);
  const pause = useCallback(() => setPlaying(false), []);
  const step = useCallback(() => {
    setPlaying(false);
    setShown((s) => Math.min(s + 1, total));
  }, [total]);
  const restart = useCallback(() => {
    setShown(start);
    setPlaying(true);
  }, [start]);

  return { shown, playing, done, play, pause, step, restart };
}
