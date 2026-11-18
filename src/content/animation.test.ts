import { animationDurationMs, animationPlan, conversionCaption, MAX_ANIMATION_MS } from './animation';
import { TWICE } from './helpers';
import { topicContents } from './index';

describe('animasi materi (F6)', () => {
  it('setiap animasi di materi ≤ 30 detik', () => {
    let count = 0;
    for (const t of topicContents) {
      t.lesson.forEach((step, i) => {
        const plan = step.visual && animationPlan(step.visual);
        if (!plan) return;
        count++;
        expect(animationDurationMs(plan), `topik ${t.topicId} layar ${i + 1}`).toBeLessThanOrEqual(MAX_ANIMATION_MS);
        expect(plan.total).toBeGreaterThan(plan.start);
      });
    }
    expect(count).toBeGreaterThanOrEqual(8);
  });

  it('materi memuat animasi panah → pasangan dan pasangan → noktah', () => {
    const targets = topicContents.flatMap((t) =>
      t.lesson.flatMap((s) => (s.visual?.kind === 'convert' && s.visual.animate ? [s.visual.to] : [])),
    );
    expect(targets).toContain('pairs');
    expect(targets).toContain('cartesian');
  });

  it('dengan reveal, hanya pasangan terbaru yang dianimasikan', () => {
    expect(animationPlan({ kind: 'arrow', relation: TWICE, reveal: 2, animate: true })).toMatchObject({ start: 1, total: 2 });
    expect(animationPlan({ kind: 'arrow', relation: TWICE, animate: true })).toMatchObject({ start: 0, total: 3 });
    expect(animationPlan({ kind: 'arrow', relation: TWICE })).toBeNull();
  });

  it('urutan pasangan animasi selalu (a, b) dengan a ∈ A dan b ∈ B', () => {
    const plan = animationPlan({ kind: 'convert', relation: TWICE, from: 'pairs', to: 'cartesian', animate: true })!;
    for (const [a, b] of plan.pairs) {
      expect(TWICE.setA).toContain(a);
      expect(TWICE.setB).toContain(b);
    }
  });

  it('keterangan perubahan bentuk menulis pasangan dengan urutan yang benar', () => {
    expect(conversionCaption('arrow', 'pairs', ['2', '1'])).toBe('Panah 2 → 1 ditulis (2, 1).');
    expect(conversionCaption('pairs', 'cartesian', ['4', '2'])).toBe('Pasangan (4, 2) menjadi noktah di atas 4, sejajar 2.');
  });
});
