import { create } from 'zustand';
import { loadJSON, saveJSON } from '../lib/storage';

// Pengaturan Mediator AI di perangkat: HANYA kode akses kelas (opsional).
// Kunci DeepSeek TIDAK disimpan di perangkat — kunci ada di backend (.env / Vercel).
const STORAGE_KEY = 'ai-settings';

interface StoredSettings {
  accessCode?: string;
  /** Versi lama aplikasi menyimpan kunci di perangkat — dihapus otomatis. */
  apiKey?: string;
}

const stored = loadJSON<StoredSettings>(STORAGE_KEY, {});
if (stored.apiKey !== undefined) saveJSON(STORAGE_KEY, { accessCode: stored.accessCode ?? '' });

interface AiSettingsStore {
  accessCode: string;
  save: (accessCode: string) => void;
}

export const useAiSettings = create<AiSettingsStore>()((set) => ({
  accessCode: stored.accessCode ?? '',
  save: (accessCode) => {
    const clean = accessCode.trim();
    set({ accessCode: clean });
    saveJSON(STORAGE_KEY, { accessCode: clean });
  },
}));

export function currentAccessCode(): string {
  return useAiSettings.getState().accessCode;
}
