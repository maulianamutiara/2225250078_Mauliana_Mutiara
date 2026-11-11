import { useId, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { hasPair, outDegree } from '../../domain/relation';
import type { Member, Pair, Relation } from '../../domain/types';

export interface PairMarks {
  /** true setelah tombol Cek ditekan — pasangan yang tidak salah diberi warna hijau. */
  checked?: boolean;
  wrong?: readonly Pair[];
  /** Pasangan kunci yang belum dibuat siswa (ditampilkan setelah gagal 3 kali). */
  missing?: readonly Pair[];
}

interface ArrowDiagramProps {
  relation: Relation;
  pairs: readonly Pair[];
  locked?: readonly Pair[];
  interactive?: boolean;
  onAdd?: (p: Pair) => void;
  onRemove?: (p: Pair) => void;
  onMessage?: (msg: string) => void;
  marks?: PairMarks;
  /** Animasikan panah mulai dari indeks ini (untuk materi langkah demi langkah). */
  animateFrom?: number;
}

const W = 360;
const X_A = 128;
const X_B = 232;
const ROW = 52;
const TOP = 46;
const SNAP = 34;

const COLORS = {
  a: '#2563EB',
  b: '#EA580C',
  arrow: '#44403C',
  ok: '#16A34A',
  fix: '#B91C1C',
  missing: '#A8A29E',
};

/**
 * Diagram panah (F1, F2). Panah dibuat dengan menyeret dari titik A ke titik B,
 * atau mengetuk anggota A lalu anggota B. Ketuk panah untuk menghapusnya.
 * Label diletakkan di luar titik sehingga garis tidak menembus tulisan (temuan T02).
 */
export function ArrowDiagram({
  relation,
  pairs,
  locked = [],
  interactive = false,
  onAdd,
  onRemove,
  onMessage,
  marks,
  animateFrom,
}: ArrowDiagramProps) {
  const uid = useId().replace(/:/g, '');
  const svgRef = useRef<SVGSVGElement>(null);
  const [selected, setSelected] = useState<Member | null>(null);
  const [drag, setDrag] = useState<{ a: Member; x0: number; y0: number; x: number; y: number } | null>(
    null,
  );

  const { setA, setB } = relation;
  const n = Math.max(setA.length, setB.length, 1);
  const H = TOP + n * ROW + 14;
  const yOf = (i: number, count: number) => TOP + ((n - count) * ROW) / 2 + i * ROW + ROW / 2;
  const posA = (a: Member) => ({ x: X_A, y: yOf(setA.indexOf(a), setA.length) });
  const posB = (b: Member) => ({ x: X_B, y: yOf(setB.indexOf(b), setB.length) });

  const toSvg = (e: { clientX: number; clientY: number }) => {
    const svg = svgRef.current;
    const m = svg?.getScreenCTM?.();
    if (!svg || !m || !svg.createSVGPoint) return { x: 0, y: 0 };
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const p = pt.matrixTransform(m.inverse());
    return { x: p.x, y: p.y };
  };

  const nearestB = (x: number, y: number): Member | null => {
    let best: Member | null = null;
    let bestD = Infinity;
    for (const b of setB) {
      const p = posB(b);
      const d = Math.hypot(p.x - x, p.y - y);
      if (d < bestD) {
        bestD = d;
        best = b;
      }
    }
    // Lepas di area kanan (label B) juga dihitung, asal sejajar baris anggota tersebut.
    if (best && (bestD <= SNAP || (x > X_B - 20 && Math.abs(posB(best).y - y) <= ROW / 2))) return best;
    return null;
  };

  const add = (a: Member, b: Member) => {
    if (!hasPair(pairs, [a, b])) onAdd?.([a, b]);
  };

  const startA = (a: Member, e: ReactPointerEvent) => {
    if (!interactive) return;
    e.preventDefault();
    const p = toSvg(e);
    setDrag({ a, x0: p.x, y0: p.y, x: p.x, y: p.y });
    svgRef.current?.setPointerCapture?.(e.pointerId);
  };

  const pressB = (b: Member) => {
    if (!interactive) return;
    if (selected) {
      add(selected, b);
      setSelected(null);
    } else {
      onMessage?.('Mulai dari anggota himpunan A (kiri), lalu pilih pasangannya di B.');
    }
  };

  const onMove = (e: ReactPointerEvent) => {
    if (!drag) return;
    const p = toSvg(e);
    setDrag({ ...drag, x: p.x, y: p.y });
  };

  const onUp = (e: ReactPointerEvent) => {
    if (!drag) return;
    const p = toSvg(e);
    const moved = Math.hypot(p.x - drag.x0, p.y - drag.y0);
    const target = moved > 10 ? nearestB(p.x, p.y) : null;
    if (target) {
      add(drag.a, target);
      setSelected(null);
    } else if (moved <= 10) {
      // Ketukan: pilih anggota A (mode ketuk-ketuk).
      setSelected((cur) => (cur === drag.a ? null : drag.a));
    }
    setDrag(null);
  };

  const wrong = marks?.wrong ?? [];
  const missing = marks?.missing ?? [];

  const arrowStyle = (p: Pair) => {
    if (hasPair(wrong, p)) return { color: COLORS.fix, dash: '6 4', marker: 'fix' };
    if (marks?.checked) return { color: COLORS.ok, dash: undefined, marker: 'ok' };
    return { color: COLORS.arrow, dash: undefined, marker: 'arrow' };
  };

  const line = (p: Pair) => {
    const s = posA(p[0]);
    const t = posB(p[1]);
    return { x1: s.x + 10, y1: s.y, x2: t.x - 13, y2: t.y };
  };

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${W} ${H}`}
      className="w-full select-none"
      style={{ touchAction: interactive ? 'none' : 'auto', maxWidth: 480 }}
      role="img"
      aria-label={`Diagram panah relasi "${relation.rule}" dengan ${pairs.length} panah`}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={() => setDrag(null)}
    >
      <defs>
        {(Object.entries({ arrow: COLORS.arrow, ok: COLORS.ok, fix: COLORS.fix, missing: COLORS.missing }) as [
          string,
          string,
        ][]).map(([k, c]) => (
          <marker
            key={k}
            id={`${uid}-${k}`}
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="7"
            markerHeight="7"
            orient="auto-start-reverse"
          >
            <path d="M0,0 L10,5 L0,10 z" fill={c} />
          </marker>
        ))}
      </defs>

      {/* Bingkai himpunan */}
      <rect x={6} y={TOP - 4} width={X_A + 20} height={n * ROW + 10} rx={26} fill="#2563EB14" stroke={COLORS.a} strokeWidth={2} />
      <rect x={X_B - 18} y={TOP - 4} width={W - X_B + 12} height={n * ROW + 10} rx={26} fill="#EA580C14" stroke={COLORS.b} strokeWidth={2} />
      <text x={(6 + X_A + 26) / 2} y={TOP - 14} textAnchor="middle" fontWeight={700} fontSize={16} fill={COLORS.a}>
        A
      </text>
      <text x={(X_B - 18 + W - 6) / 2} y={TOP - 14} textAnchor="middle" fontWeight={700} fontSize={16} fill={COLORS.b}>
        B
      </text>
      <text x={W / 2} y={TOP - 14} textAnchor="middle" fontSize={12} fill="#57534E">
        {relation.rule}
      </text>

      {/* Panah yang belum dibuat (ditunjukkan setelah 3 kali salah) */}
      {missing.map((p) => (
        <line
          key={`m-${p.join('|')}`}
          {...line(p)}
          stroke={COLORS.missing}
          strokeWidth={2.5}
          strokeDasharray="3 5"
          markerEnd={`url(#${uid}-missing)`}
        />
      ))}

      {/* Panah */}
      {pairs.map((p, i) => {
        const st = arrowStyle(p);
        const isLocked = hasPair(locked, p);
        const animate = animateFrom !== undefined && i >= animateFrom;
        const delay = animate ? `${(i - animateFrom!) * 0.6}s` : undefined;
        return (
          <g key={p.join('|')} className={animate ? 'arrow-appear' : undefined} style={{ animationDelay: delay }}>
            <line
              {...line(p)}
              stroke={st.color}
              strokeWidth={2.5}
              strokeDasharray={st.dash}
              markerEnd={`url(#${uid}-${st.marker})`}
              className={animate ? 'arrow-draw' : undefined}
              style={{ animationDelay: delay }}
            />
            {interactive && !isLocked && (
              <line
                {...line(p)}
                stroke="transparent"
                strokeWidth={18}
                style={{ cursor: 'pointer' }}
                onClick={() => onRemove?.(p)}
              >
                <title>Ketuk untuk menghapus panah</title>
              </line>
            )}
          </g>
        );
      })}

      {/* Garis bantu saat menyeret */}
      {drag && (
        <line
          x1={posA(drag.a).x}
          y1={posA(drag.a).y}
          x2={drag.x}
          y2={drag.y}
          stroke={COLORS.a}
          strokeWidth={2}
          strokeDasharray="4 4"
          pointerEvents="none"
        />
      )}

      {/* Anggota A */}
      {setA.map((a) => {
        const { x, y } = posA(a);
        const done = outDegree(pairs, a) > 0;
        const isSel = selected === a || drag?.a === a;
        return (
          <g key={`A-${a}`} onPointerDown={(e) => startA(a, e)} style={{ cursor: interactive ? 'pointer' : 'default' }}>
            <rect x={10} y={y - 21} width={X_A + 12} height={42} fill="transparent" />
            <text x={x - 14} y={y + 5} textAnchor="end" fontSize={14} fontWeight={isSel ? 700 : 400} fill="#292524">
              {a}
            </text>
            {isSel && <circle cx={x} cy={y} r={14} fill="none" stroke={COLORS.a} strokeWidth={2} />}
            <circle cx={x} cy={y} r={7} fill={done ? COLORS.a : '#FFFFFF'} stroke={COLORS.a} strokeWidth={2.5} />
            {interactive && done && (
              <text x={x + 2} y={y - 12} fontSize={12} fontWeight={700} fill={COLORS.ok} aria-label="sudah dipasangkan">
                ✓
              </text>
            )}
          </g>
        );
      })}

      {/* Anggota B */}
      {setB.map((b) => {
        const { x, y } = posB(b);
        return (
          <g key={`B-${b}`} onPointerDown={() => pressB(b)} style={{ cursor: interactive ? 'pointer' : 'default' }}>
            <rect x={X_B - 14} y={y - 21} width={W - X_B + 6} height={42} fill="transparent" />
            <circle cx={x} cy={y} r={7} fill="#FFFFFF" stroke={COLORS.b} strokeWidth={2.5} />
            <text x={x + 14} y={y + 5} fontSize={14} fill="#292524">
              {b}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
