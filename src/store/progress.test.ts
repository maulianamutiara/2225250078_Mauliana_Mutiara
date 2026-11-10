import { useProgress } from './progress';
import { loadJSON } from '../lib/storage';

describe('useProgress', () => {
  beforeEach(() => {
    useProgress.getState().reset();
    window.localStorage.clear();
  });

  it('menyimpan kode siswa dalam huruf besar tanpa spasi', () => {
    useProgress.getState().setStudentCode('  s01 ');
    expect(useProgress.getState().studentCode).toBe('S01');
  });

  it('kode kosong dianggap tidak diisi', () => {
    useProgress.getState().setStudentCode('   ');
    expect(useProgress.getState().studentCode).toBeUndefined();
  });

  it('menyimpan bintang terbaik dan menuliskannya ke penyimpanan', () => {
    useProgress.getState().setStars('1', 2);
    useProgress.getState().setStars('1', 1);
    expect(useProgress.getState().stars).toEqual({ '1': 2 });
    expect(loadJSON<{ stars: unknown }>('progress-v1', { stars: null }).stars).toEqual({ '1': 2 });
  });

  it('mencatat percobaan menjawab', () => {
    useProgress.getState().recordAttempt({
      problemId: 'L1-01',
      correct: true,
      tries: 1,
      hintsUsed: 0,
      misconceptions: [],
      durationMs: 12000,
      at: '2026-11-10T08:00:00.000Z',
    });
    expect(useProgress.getState().attempts).toHaveLength(1);
  });

  it('reset menghapus semua progres', () => {
    useProgress.getState().setStars('1', 3);
    useProgress.getState().reset();
    expect(useProgress.getState().stars).toEqual({});
    expect(loadJSON('progress-v1', null)).toBeNull();
  });
});
