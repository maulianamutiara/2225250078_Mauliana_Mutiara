import { create } from 'zustand';
import { loadJSON, removeKey, saveJSON } from '../lib/storage';
import { mergeStars } from '../domain/progress';
import type { Attempt, Progress, Reflection, StarCount } from '../domain/types';

const STORAGE_KEY = 'progress-v1';

const emptyProgress: Progress = { attempts: [], stars: {}, reflections: [] };

interface ProgressActions {
  setStudentCode: (code: string | undefined) => void;
  recordAttempt: (attempt: Attempt) => void;
  setStars: (topicId: string, stars: StarCount) => void;
  addReflection: (reflection: Reflection) => void;
  reset: () => void;
}

export type ProgressStore = Progress & ProgressActions;

function pickData(state: ProgressStore): Progress {
  const { studentCode, attempts, stars, reflections } = state;
  return { studentCode, attempts, stars, reflections };
}

export const useProgress = create<ProgressStore>()((set, get) => {
  const persist = () => saveJSON(STORAGE_KEY, pickData(get()));

  return {
    ...emptyProgress,
    ...loadJSON<Progress>(STORAGE_KEY, emptyProgress),

    setStudentCode: (code) => {
      const clean = code?.trim().toUpperCase();
      set({ studentCode: clean ? clean : undefined });
      persist();
    },
    recordAttempt: (attempt) => {
      set((s) => ({ attempts: [...s.attempts, attempt] }));
      persist();
    },
    setStars: (topicId, stars) => {
      set((s) => ({ stars: mergeStars(s.stars, topicId, stars) }));
      persist();
    },
    addReflection: (reflection) => {
      set((s) => ({ reflections: [...s.reflections, reflection] }));
      persist();
    },
    reset: () => {
      set({ ...emptyProgress, studentCode: undefined });
      removeKey(STORAGE_KEY);
    },
  };
});
