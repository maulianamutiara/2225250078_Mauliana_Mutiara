import { act, fireEvent, render, renderHook, screen } from '@testing-library/react';
import { topic3 } from '../../content/topic3';
import { LessonView } from './LessonView';
import { useStepPlayer } from './useStepPlayer';

describe('useStepPlayer (▶ ⏸ ⏭ ↺)', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('berjalan sendiri sampai selesai, lalu berhenti', () => {
    const { result } = renderHook(() => useStepPlayer(0, 3, 1000));
    expect(result.current.shown).toBe(0);
    act(() => vi.advanceTimersByTime(300));
    expect(result.current.shown).toBe(1);
    act(() => vi.advanceTimersByTime(1000));
    act(() => vi.advanceTimersByTime(1000));
    expect(result.current.shown).toBe(3);
    act(() => vi.advanceTimersByTime(1000));
    expect(result.current.done).toBe(true);
    expect(result.current.playing).toBe(false);
  });

  it('jeda menghentikan, langkah maju satu, ulang kembali ke awal', () => {
    const { result } = renderHook(() => useStepPlayer(0, 3, 1000));
    act(() => result.current.pause());
    act(() => vi.advanceTimersByTime(5000));
    expect(result.current.shown).toBe(0);
    act(() => result.current.step());
    expect(result.current.shown).toBe(1);
    act(() => result.current.restart());
    expect(result.current.shown).toBe(0);
    expect(result.current.playing).toBe(true);
  });
});

describe('LessonView: animasi panah → pasangan', () => {
  it('kontrol animasi tampil dan ⏭ menampilkan pasangan pertama dengan keterangannya', () => {
    const step = topic3.lesson[1];
    expect(step.visual?.kind).toBe('convert');
    render(<LessonView step={step} index={1} total={topic3.lesson.length} onBack={() => {}} onNext={() => {}} />);
    expect(screen.getByRole('group', { name: 'Kontrol animasi' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Jeda/ }));
    fireEvent.click(screen.getByRole('button', { name: /Langkah/ }));
    expect(screen.getByText(/Panah 2 → 1 ditulis \(2, 1\)\./)).toBeInTheDocument();
    expect(screen.getByText('Langkah 1/3')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Putar/ })).toBeInTheDocument();
  });
});
