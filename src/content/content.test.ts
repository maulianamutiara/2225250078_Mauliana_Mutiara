import { allProblems, topicContents } from './index';
import { topics } from './topics';
import { hasPair } from '../domain/relation';
import type { Pair } from '../domain/types';
import type { RelationProblem } from './types';

const sentences = (text: string) =>
  text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
const words = (s: string) => s.split(/\s+/).filter(Boolean).length;

const relationProblems = allProblems.filter((p): p is RelationProblem => p.type !== 'mcq');

describe('struktur konten', () => {
  it('setiap topik di Peta Belajar punya konten', () => {
    for (const t of topics) {
      expect(topicContents.find((c) => c.topicId === t.id), `topik ${t.id}`).toBeDefined();
    }
  });

  it('id soal unik', () => {
    const ids = allProblems.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('bank soal minimal 30 soal', () => {
    expect(allProblems.length).toBeGreaterThanOrEqual(30);
  });

  it('setiap soal punya minimal 2 hint dan pembahasan', () => {
    for (const p of allProblems) {
      expect(p.hints.length, p.id).toBeGreaterThanOrEqual(2);
      expect(p.explanation.length, p.id).toBeGreaterThanOrEqual(1);
    }
  });

  it('kunci pilihan ganda valid', () => {
    for (const p of allProblems) {
      if (p.type !== 'mcq') continue;
      expect(p.answer, p.id).toBeGreaterThanOrEqual(0);
      expect(p.answer, p.id).toBeLessThan(p.options.length);
      for (const k of Object.keys(p.optionFeedback ?? {})) {
        expect(Number(k), `${p.id} umpan balik opsi ${k}`).not.toBe(p.answer);
      }
    }
  });

  it('pasangan kunci berasal dari A × B, dan tidak ganda', () => {
    for (const p of relationProblems) {
      const { setA, setB, pairs } = p.relation;
      for (const [a, b] of pairs) {
        expect(setA, `${p.id}: ${a} ∈ A`).toContain(a);
        expect(setB, `${p.id}: ${b} ∈ B`).toContain(b);
      }
      expect(new Set(pairs.map((x) => x.join('|'))).size, p.id).toBe(pairs.length);
    }
  });

  it('pasangan "given" (contoh sebagian) bagian dari kunci dan tidak lengkap', () => {
    for (const p of relationProblems) {
      if (!p.given) continue;
      for (const g of p.given) expect(hasPair(p.relation.pairs, g), p.id).toBe(true);
      expect(p.given.length, p.id).toBeLessThan(p.relation.pairs.length);
    }
  });
});

describe('aturan penulisan (beban kognitif)', () => {
  it('layar materi maks 3 kalimat, tiap kalimat ≤ 20 kata', () => {
    for (const t of topicContents) {
      t.lesson.forEach((step, i) => {
        const all = step.text.flatMap(sentences);
        expect(all.length, `topik ${t.topicId} layar ${i + 1}`).toBeLessThanOrEqual(3);
        for (const s of all) expect(words(s), `"${s}"`).toBeLessThanOrEqual(20);
      });
    }
  });

  it('perintah soal dan cerita: kalimat ≤ 20 kata, perintah maks 3 kalimat', () => {
    for (const p of allProblems) {
      expect(sentences(p.prompt).length, p.id).toBeLessThanOrEqual(3);
      for (const s of [...sentences(p.prompt), ...sentences(('story' in p && p.story) || '')]) {
        expect(words(s), `${p.id}: "${s}"`).toBeLessThanOrEqual(20);
      }
    }
  });

  it('kartu ringkasan maks 3 poin', () => {
    for (const t of topicContents) expect(t.summary.length).toBeLessThanOrEqual(3);
  });
});

/**
 * Kebenaran matematika: untuk relasi bilangan, kunci harus SAMA PERSIS dengan
 * semua pasangan (a, b) ∈ A × B yang memenuhi aturan.
 */
const numericRules: Record<string, (a: number, b: number) => boolean> = {
  'kurang satu dari': (a, b) => a + 1 === b,
  'dua kali dari': (a, b) => a === 2 * b,
  'dua kurangnya dari': (a, b) => a + 2 === b,
  'satu lebihnya dari': (a, b) => a === b + 1,
  'dua lebihnya dari': (a, b) => a === b + 2,
  'setengah dari': (a, b) => 2 * a === b,
  'kurang dari': (a, b) => a < b,
  'lebih dari': (a, b) => a > b,
  'faktor dari': (a, b) => b % a === 0,
  'sama dengan': (a, b) => a === b,
};

describe('kebenaran matematika soal bilangan', () => {
  const numeric = relationProblems.filter((p) =>
    [...p.relation.setA, ...p.relation.setB].every((m) => /^\d+$/.test(m)),
  );

  it('ada soal bilangan yang diperiksa', () => {
    expect(numeric.length).toBeGreaterThanOrEqual(10);
  });

  for (const p of numeric) {
    it(`${p.id}: "${p.relation.rule}"`, () => {
      const rule = numericRules[p.relation.rule];
      expect(rule, `aturan "${p.relation.rule}" belum didefinisikan di tes`).toBeDefined();
      const expected: Pair[] = [];
      for (const a of p.relation.setA)
        for (const b of p.relation.setB) if (rule(Number(a), Number(b))) expected.push([a, b]);
      const sort = (xs: readonly Pair[]) => xs.map((x) => x.join('|')).sort();
      expect(sort(p.relation.pairs)).toEqual(sort(expected));
    });
  }
});
