import type { Pair, Relation } from '../domain/types';

type Item = string | number;

/** Penulisan relasi yang ringkas: R([2,4,6], [1,2,3], 'dua kali dari', [[2,1],[4,2],[6,3]]). */
export function R(setA: Item[], setB: Item[], rule: string, pairs: [Item, Item][]): Relation {
  return {
    setA: setA.map(String),
    setB: setB.map(String),
    rule,
    pairs: pairs.map(([a, b]) => [String(a), String(b)] as Pair),
  };
}

/** Relasi contoh yang dipakai berulang di materi. */
export const TWICE = R([2, 4, 6], [1, 2, 3, 4, 5], 'dua kali dari', [
  [2, 1],
  [4, 2],
  [6, 3],
]);

export const FAVORITE_SUBJECT = R(
  ['Ani', 'Budi', 'Candra'],
  ['Matematika', 'IPA', 'Seni Budaya'],
  'suka',
  [
    ['Ani', 'Matematika'],
    ['Budi', 'IPA'],
    ['Candra', 'Seni Budaya'],
  ],
);

export const FACTOR = R([1, 2, 3], [2, 4, 6], 'faktor dari', [
  [1, 2],
  [1, 4],
  [1, 6],
  [2, 2],
  [2, 4],
  [2, 6],
  [3, 6],
]);
