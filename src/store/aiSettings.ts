import { create } from 'zustand';
import { DEFAULT_AI_SETTINGS, type AiSettings } from '../ai/client';
import { loadJSON, saveJSON } from '../lib/storage';

// Pengaturan Mediator AI — hanya tersimpan di perangkat ini (localStorage via storage.ts),
// tidak pernah dikirim ke mana pun selain ke DeepSeek saat Mediator dipakai.
const STORAGE_KEY = 'ai-settings';

interface AiSettingsStore extends AiSettings {
  save: (patch: Partial<AiSettings>) => void;
  clearKey: () => void;
}

function pick(s: AiSettings): AiSettings {
  return { apiKey: s.apiKey, model: s.model, baseUrl: s.baseUrl };
}

export const useAiSettings = create<AiSettingsStore>()((set, get) => ({
  ...DEFAULT_AI_SETTINGS,
  ...loadJSON<Partial<AiSettings>>(STORAGE_KEY, {}),
  save: (patch) => {
    set({
      ...patch,
      ...(patch.apiKey !== undefined ? { apiKey: patch.apiKey.trim() } : {}),
    });
    saveJSON(STORAGE_KEY, pick(get()));
  },
  clearKey: () => {
    set({ apiKey: '' });
    saveJSON(STORAGE_KEY, pick(get()));
  },
}));

/** Ambil pengaturan murni (tanpa fungsi) untuk dikirim ke klien AI. */
export function currentAiSettings(): AiSettings {
  return pick(useAiSettings.getState());
}
