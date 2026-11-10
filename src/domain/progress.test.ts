import { isTopicUnlocked, mergeStars, totalStars } from './progress';

describe('isTopicUnlocked', () => {
  it('topik 0 dan 1 selalu terbuka', () => {
    expect(isTopicUnlocked(0, {})).toBe(true);
    expect(isTopicUnlocked(1, {})).toBe(true);
  });

  it('topik 2 terkunci sebelum topik 1 mendapat bintang', () => {
    expect(isTopicUnlocked(2, {})).toBe(false);
    expect(isTopicUnlocked(2, { '1': 0 })).toBe(false);
  });

  it('topik 2 terbuka setelah topik 1 mendapat bintang', () => {
    expect(isTopicUnlocked(2, { '1': 1 })).toBe(true);
  });

  it('bintang topik lain tidak membuka topik yang salah', () => {
    expect(isTopicUnlocked(4, { '1': 3, '2': 3 })).toBe(false);
  });
});

describe('mergeStars', () => {
  it('menyimpan bintang yang lebih tinggi', () => {
    expect(mergeStars({ '1': 1 }, '1', 3)).toEqual({ '1': 3 });
  });

  it('tidak menurunkan bintang terbaik', () => {
    const stars = { '1': 3 as const };
    expect(mergeStars(stars, '1', 1)).toBe(stars);
  });

  it('menambah topik baru', () => {
    expect(mergeStars({}, '2', 2)).toEqual({ '2': 2 });
  });
});

describe('totalStars', () => {
  it('menjumlahkan semua bintang', () => {
    expect(totalStars({})).toBe(0);
    expect(totalStars({ '1': 3, '2': 2 })).toBe(5);
  });
});
