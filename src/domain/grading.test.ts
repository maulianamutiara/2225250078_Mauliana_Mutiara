import {
  detectMisconceptions,
  gradePairs,
  starsForProblem,
  starsForTopic,
} from './grading';
import { formatPairs, sortPairs, togglePair } from './relation';
import type { Pair, Relation } from './types';

// A = {2, 4, 6}, B = {1, 2, 3, 4, 5}, relasi "dua kali dari"
const twice: Relation = {
  setA: ['2', '4', '6'],
  setB: ['1', '2', '3', '4', '5'],
  rule: 'dua kali dari',
  pairs: [
    ['2', '1'],
    ['4', '2'],
    ['6', '3'],
  ],
};

// A = {1, 2, 3}, B = {2, 4, 6}, relasi "faktor dari" — satu anggota bisa punya banyak pasangan
const factor: Relation = {
  setA: ['1', '2', '3'],
  setB: ['2', '4', '6'],
  rule: 'faktor dari',
  pairs: [
    ['1', '2'],
    ['1', '4'],
    ['1', '6'],
    ['2', '2'],
    ['2', '4'],
    ['2', '6'],
    ['3', '6'],
  ],
};

describe('gradePairs', () => {
  it('jawaban tepat dinilai benar, urutan antarpasangan bebas', () => {
    const answer: Pair[] = [
      ['6', '3'],
      ['2', '1'],
      ['4', '2'],
    ];
    expect(gradePairs(answer, twice).correct).toBe(true);
  });

  it('pasangan ganda tidak membuat salah', () => {
    const answer: Pair[] = [...twice.pairs, ['2', '1']];
    expect(gradePairs(answer, twice).correct).toBe(true);
  });

  it('mendeteksi pasangan yang kurang', () => {
    const r = gradePairs([['2', '1']], twice);
    expect(r.correct).toBe(false);
    expect(r.missing).toHaveLength(2);
  });

  it('mendeteksi pasangan berlebih', () => {
    const r = gradePairs([...twice.pairs, ['2', '2']], twice);
    expect(r.correct).toBe(false);
    expect(r.extra).toEqual([['2', '2']]);
  });

  it('mendeteksi pasangan terbalik dan tidak menghitungnya dua kali', () => {
    const r = gradePairs(
      [
        ['1', '2'],
        ['4', '2'],
        ['6', '3'],
      ],
      twice,
    );
    expect(r.correct).toBe(false);
    expect(r.reversed).toEqual([['1', '2']]);
    expect(r.missing).toEqual([]);
    expect(r.extra).toEqual([]);
  });
});

describe('detectMisconceptions', () => {
  const run = (answer: Pair[], key: Relation, mode: 'arrow' | 'pairs' | 'cartesian') =>
    detectMisconceptions(gradePairs(answer, key), answer, key, mode);

  it('jawaban benar tidak punya kesalahan', () => {
    expect(run([...twice.pairs], twice, 'pairs')).toEqual([]);
  });

  it('M2: urutan pasangan tertukar', () => {
    const answer: Pair[] = twice.pairs.map(([a, b]) => [b, a]);
    expect(run(answer, twice, 'pairs')).toEqual(['M2']);
  });

  it('M1: arah panah terbalik pada diagram panah', () => {
    expect(run([['1', '2']], twice, 'arrow')).toContain('M1');
  });

  it('M7: sumbu Kartesius tertukar', () => {
    expect(run([['1', '2']], twice, 'cartesian')).toContain('M7');
  });

  it('M4: ada anggota A yang terlewat', () => {
    expect(
      run(
        [
          ['2', '1'],
          ['4', '2'],
        ],
        twice,
        'arrow',
      ),
    ).toEqual(['M4']);
  });

  it('M5: mengira satu anggota hanya boleh punya satu pasangan', () => {
    const answer: Pair[] = [
      ['1', '2'],
      ['2', '4'],
      ['3', '6'],
    ];
    expect(run(answer, factor, 'arrow')).toContain('M5');
  });

  it('M6: ada pasangan yang tidak memenuhi aturan', () => {
    expect(run([...twice.pairs, ['6', '5']], twice, 'arrow')).toEqual(['M6']);
  });
});

describe('starsForProblem', () => {
  it('3 bintang jika langsung benar tanpa hint', () => {
    expect(starsForProblem(true, 1, 0)).toBe(3);
  });
  it('2 bintang dengan sedikit bantuan', () => {
    expect(starsForProblem(true, 2, 1)).toBe(2);
    expect(starsForProblem(true, 1, 1)).toBe(2);
  });
  it('1 bintang jika benar setelah banyak bantuan', () => {
    expect(starsForProblem(true, 3, 2)).toBe(1);
  });
  it('0 bintang jika tidak berhasil', () => {
    expect(starsForProblem(false, 3, 3)).toBe(0);
  });
});

describe('starsForTopic', () => {
  it('0 bintang jika kurang dari 70% benar', () => {
    expect(starsForTopic([3, 0, 0, 3])).toBe(0);
  });
  it('lulus tepat di 70% atau lebih', () => {
    expect(starsForTopic([3, 3, 3, 3, 3, 3, 3, 0, 0, 0])).toBeGreaterThan(0);
  });
  it('rata-rata bintang, minimal 1', () => {
    expect(starsForTopic([3, 3, 3])).toBe(3);
    expect(starsForTopic([1, 1, 1, 0])).toBe(1);
    expect(starsForTopic([3, 2, 2])).toBe(2);
  });
  it('topik tanpa soal bernilai 0', () => {
    expect(starsForTopic([])).toBe(0);
  });
});

describe('relation helpers', () => {
  it('togglePair menambah lalu menghapus', () => {
    const once = togglePair([], ['2', '1']);
    expect(once).toEqual([['2', '1']]);
    expect(togglePair(once, ['2', '1'])).toEqual([]);
  });

  it('sortPairs mengikuti urutan anggota himpunan', () => {
    const sorted = sortPairs(
      [
        ['6', '3'],
        ['2', '1'],
      ],
      twice.setA,
      twice.setB,
    );
    expect(sorted).toEqual([
      ['2', '1'],
      ['6', '3'],
    ]);
  });

  it('formatPairs menulis notasi himpunan pasangan berurutan', () => {
    expect(formatPairs(twice.pairs)).toBe('{(2, 1), (4, 2), (6, 3)}');
  });
});
