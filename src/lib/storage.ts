// Satu-satunya pintu akses localStorage (lihat CLAUDE.md, aturan kode no. 6).
// Semua akses dibungkus try/catch: localStorage bisa tidak tersedia (mode privat,
// penyimpanan penuh, data rusak), dan aplikasi harus tetap berjalan.

const PREFIX = 'relasi-pintar:';

export function loadJSON<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(PREFIX + key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

/** Mengembalikan true jika berhasil disimpan. */
export function saveJSON(key: string, value: unknown): boolean {
  try {
    window.localStorage.setItem(PREFIX + key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function removeKey(key: string): void {
  try {
    window.localStorage.removeItem(PREFIX + key);
  } catch {
    // diabaikan: tidak ada yang bisa dihapus
  }
}
