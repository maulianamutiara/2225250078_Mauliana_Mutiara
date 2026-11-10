import { loadJSON, removeKey, saveJSON } from './storage';

describe('storage', () => {
  beforeEach(() => window.localStorage.clear());
  afterEach(() => vi.restoreAllMocks());

  it('mengembalikan nilai cadangan jika kunci belum ada', () => {
    expect(loadJSON('kosong', { a: 1 })).toEqual({ a: 1 });
  });

  it('menyimpan lalu membaca kembali data yang sama', () => {
    expect(saveJSON('data', { skor: 3 })).toBe(true);
    expect(loadJSON('data', null)).toEqual({ skor: 3 });
  });

  it('memakai awalan relasi-pintar: pada kunci', () => {
    saveJSON('x', 1);
    expect(window.localStorage.getItem('relasi-pintar:x')).toBe('1');
  });

  it('mengembalikan nilai cadangan jika data rusak', () => {
    window.localStorage.setItem('relasi-pintar:rusak', '{bukan json');
    expect(loadJSON('rusak', 'cadangan')).toBe('cadangan');
  });

  it('tidak error jika localStorage melempar galat', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('diblokir');
    });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('penuh');
    });
    expect(loadJSON('a', 'cadangan')).toBe('cadangan');
    expect(saveJSON('a', 1)).toBe(false);
  });

  it('menghapus kunci', () => {
    saveJSON('hapus', 1);
    removeKey('hapus');
    expect(loadJSON('hapus', null)).toBeNull();
  });
});
