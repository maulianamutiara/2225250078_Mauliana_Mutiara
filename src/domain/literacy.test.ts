import { gradeMulti, gradeNumbers, membersCorrect, stageScore, starsForScore } from './literacy';
import type { Pair, Relation } from './types';

const rides: Relation = {
  setA: ['Bayu', 'Caca', 'Dimas'],
  setB: ['komidi putar', 'kereta luncur', 'roller coaster'],
  rule: 'boleh naik',
  pairs: [
    ['Bayu', 'komidi putar'],
    ['Caca', 'komidi putar'],
    ['Caca', 'kereta luncur'],
    ['Dimas', 'komidi putar'],
    ['Dimas', 'kereta luncur'],
    ['Dimas', 'roller coaster'],
  ],
};

describe('gradeNumbers', () => {
  it('benar jika semua isian tepat', () => {
    expect(gradeNumbers([2, 4, 2, 3], [2, 4, 2, 3]).correct).toBe(true);
  });
  it('menandai isian yang salah atau kosong', () => {
    expect(gradeNumbers([2, 3, null, 3], [2, 4, 2, 3])).toEqual({ correct: false, wrong: [1, 2] });
  });
});

describe('gradeMulti', () => {
  it('benar hanya jika pilihan sama persis', () => {
    expect(gradeMulti([2, 0, 1], [0, 1, 2]).correct).toBe(true);
  });
  it('mendeteksi pilihan yang kurang dan berlebih', () => {
    expect(gradeMulti([0, 3], [0, 1, 2])).toEqual({ correct: false, missing: [1, 2], extra: [3] });
  });
});

describe('membersCorrect & stageScore', () => {
  const partly: Pair[] = [
    ['Bayu', 'komidi putar'],
    ['Caca', 'komidi putar'],
    ['Dimas', 'komidi putar'],
  ];
  it('menghitung anggota A yang pasangannya tepat', () => {
    expect(membersCorrect(rides.pairs, rides)).toBe(3);
    expect(membersCorrect(partly, rides)).toBe(1); // hanya Bayu
  });
  it('skor penuh jika benar, sebagian jika perMember, nol jika tidak', () => {
    expect(stageScore(3, true)).toBe(3);
    expect(stageScore(3, false, 'perMember', partly, rides)).toBe(1);
    expect(stageScore(3, false, 'all', partly, rides)).toBe(0);
    expect(stageScore(2, false, 'perMember', partly, rides)).toBe(0); // floor(2 × 1/3)
  });
});

describe('starsForScore', () => {
  it('mengikuti ambang 70% / 80% / 90%', () => {
    expect(starsForScore(16, 24)).toBe(0);
    expect(starsForScore(17, 24)).toBe(1);
    expect(starsForScore(20, 24)).toBe(2);
    expect(starsForScore(22, 24)).toBe(3);
    expect(starsForScore(0, 0)).toBe(0);
  });
});
