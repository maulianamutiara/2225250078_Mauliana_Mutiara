import { allProblems, topicContents } from './index';
import { topics } from './topics';
import { hasPair } from '../domain/relation';
import type { Pair } from '../domain/types';
import { isRelationProblem, type NumbersProblem, type RelationProblem } from './types';
import { CAKE, DAYS, DRINKS, literacyTasks, RIDES } from './topic7';
import type { Relation } from '../domain/types';
import { cognitiveFunctions, functionsFor, tools } from './rmt';

const sentences = (text: string) =>
  text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
const words = (s: string) => s.split(/\s+/).filter(Boolean).length;

const relationProblems = allProblems.filter((p): p is RelationProblem => isRelationProblem(p));

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

describe('soal literasi matematika (Topik 7)', () => {
  const inDegree = (r: Relation, b: string) => r.pairs.filter((p) => p[1] === b).length;
  const fields = (id: string) =>
    (allProblems.find((p) => p.id === id) as NumbersProblem).fields.map((f) => f.answer);

  it('ada 4 soal, masing-masing skor maksimum 6 sesuai kisi-kisi', () => {
    expect(literacyTasks).toHaveLength(4);
    for (const t of literacyTasks) {
      expect(t.stages.reduce((s, st) => s + st.score, 0), t.id).toBe(6);
    }
  });

  it('banyak pasangan sesuai kisi-kisi', () => {
    expect(DAYS.pairs).toHaveLength(11);
    expect(DRINKS.pairs).toHaveLength(7);
    expect(CAKE.pairs).toHaveLength(8);
    expect(RIDES.pairs).toHaveLength(6);
  });

  it('isian angka konsisten dengan relasinya', () => {
    expect(fields('L1-T2')).toEqual(DAYS.setB.map((d) => inDegree(DAYS, d))); // 2, 4, 2, 3
    expect(fields('L2-T6')).toEqual([...DRINKS.setB.map((b) => inDegree(DRINKS, b)), DRINKS.pairs.length]);
    expect(fields('L3-T4')).toEqual([CAKE.pairs.length, ...CAKE.setB.map((b) => inDegree(CAKE, b))]);
  });

  it('relasi wahana sesuai aturan tinggi ≥ batas', () => {
    const height: Record<string, number> = { Bayu: 115, Caca: 128, Dimas: 140 };
    const limit: Record<string, number> = { 'komidi putar': 100, 'kereta luncur': 120, 'roller coaster': 135 };
    const expected = RIDES.setA.flatMap((a) => RIDES.setB.filter((b) => height[a] >= limit[b]).map((b) => `${a}|${b}`));
    expect(RIDES.pairs.map((p) => p.join('|')).sort()).toEqual(expected.sort());
  });

  it('kunci pilih-semua valid dan setiap tahap punya hint', () => {
    for (const t of literacyTasks) {
      for (const s of t.stages) {
        const item = s.item;
        if (item.type === 'multi') for (const a of item.answers) expect(a).toBeLessThan(item.options.length);
        if (item.type === 'explain') expect(item.checklist.length).toBeGreaterThanOrEqual(2);
        else expect(item.hints.length, item.id).toBeGreaterThanOrEqual(2);
      }
    }
  });

  it('kalimat bacaan soal ≤ 20 kata', () => {
    for (const t of literacyTasks) {
      for (const line of t.story) for (const s of sentences(line)) expect(words(s), `${t.id}: "${s}"`).toBeLessThanOrEqual(20);
    }
  });
});

describe('RMT: fungsi kognitif & alat berpikir', () => {
  it('setiap soal melatih 1–4 fungsi kognitif yang terdaftar, termasuk memberi bukti logis', () => {
    for (const p of allProblems) {
      const ids = functionsFor(p);
      expect(ids.length, p.id).toBeGreaterThanOrEqual(1);
      expect(ids.length, p.id).toBeLessThanOrEqual(4);
      for (const id of ids) expect(cognitiveFunctions[id], `${p.id}: ${id}`).toBeDefined();
      expect(ids, p.id).toContain('evidence');
    }
  });

  it('kartu alat berpikir di materi merujuk alat yang terdaftar', () => {
    const used = topicContents.flatMap((t) =>
      t.lesson.flatMap((s) => (s.visual?.kind === 'tool' ? [s.visual.tool] : [])),
    );
    expect(used.length).toBeGreaterThanOrEqual(5);
    for (const id of used) expect(tools[id]).toBeDefined();
  });

  it('definisi fungsi kognitif dan alat cukup singkat (≤ 20 kata)', () => {
    for (const f of Object.values(cognitiveFunctions)) expect(words(f.definition), f.id).toBeLessThanOrEqual(20);
    for (const t of Object.values(tools)) {
      expect(words(t.structure), t.id).toBeLessThanOrEqual(20);
      expect(words(t.purpose), t.id).toBeLessThanOrEqual(20);
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
