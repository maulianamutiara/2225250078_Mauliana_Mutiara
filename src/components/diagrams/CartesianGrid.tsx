import { hasPair } from '../../domain/relation';
import type { Pair, Relation } from '../../domain/types';
import type { PairMarks } from './ArrowDiagram';

interface CartesianGridProps {
  relation: Relation;
  points: readonly Pair[];
  interactive?: boolean;
  onToggle?: (p: Pair) => void;
  marks?: PairMarks;
}

const W = 360;
const ROW = 44;
const TOP = 26;

/** Diagram Kartesius: anggota A di sumbu mendatar, anggota B di sumbu tegak. Ketuk titik temu untuk menaruh noktah. */
export function CartesianGrid({ relation, points, interactive = false, onToggle, marks }: CartesianGridProps) {
  const { setA, setB } = relation;
  const longestB = Math.max(...setB.map((b) => b.length), 1);
  const left = Math.min(110, Math.max(34, longestB * 7.5 + 16));
  const rotate = setA.some((a) => a.length > 5);
  const bottom = rotate ? 78 : 34;
  const plotW = W - left - 26;
  const plotH = setB.length * ROW;
  const H = TOP + plotH + bottom;
  const colGap = plotW / Math.max(setA.length, 1);
  const xOf = (i: number) => left + colGap * (i + 0.5);
  const yOf = (j: number) => TOP + plotH - ROW * (j + 0.5);
  const axisY = TOP + plotH;
  const hitR = Math.min(20, colGap / 2 - 2, ROW / 2 - 1);

  const wrong = marks?.wrong ?? [];
  const missing = marks?.missing ?? [];

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="w-full select-none"
      style={{ maxWidth: 480 }}
      role="img"
      aria-label={`Diagram Kartesius relasi "${relation.rule}" dengan ${points.length} noktah`}
    >
      {/* Garis bantu */}
      {setA.map((a, i) => (
        <line key={`gx-${a}`} x1={xOf(i)} y1={TOP - 6} x2={xOf(i)} y2={axisY} stroke="#E7D7B5" strokeDasharray="3 4" />
      ))}
      {setB.map((b, j) => (
        <line key={`gy-${b}`} x1={left} y1={yOf(j)} x2={W - 14} y2={yOf(j)} stroke="#E7D7B5" strokeDasharray="3 4" />
      ))}

      {/* Sumbu */}
      <line x1={left} y1={axisY} x2={W - 8} y2={axisY} stroke="#2563EB" strokeWidth={2.5} />
      <line x1={left} y1={axisY} x2={left} y2={TOP - 16} stroke="#EA580C" strokeWidth={2.5} />
      <text x={W - 8} y={axisY - 8} textAnchor="end" fontSize={13} fontWeight={700} fill="#2563EB">
        A
      </text>
      <text x={left + 8} y={TOP - 8} fontSize={13} fontWeight={700} fill="#EA580C">
        B
      </text>

      {/* Label sumbu mendatar (A) */}
      {setA.map((a, i) =>
        rotate ? (
          <text
            key={`la-${a}`}
            x={xOf(i)}
            y={axisY + 14}
            fontSize={12}
            fill="#1E40AF"
            textAnchor="end"
            transform={`rotate(-35 ${xOf(i)} ${axisY + 14})`}
          >
            {a}
          </text>
        ) : (
          <text key={`la-${a}`} x={xOf(i)} y={axisY + 20} fontSize={13} fill="#1E40AF" textAnchor="middle">
            {a}
          </text>
        ),
      )}
      {/* Label sumbu tegak (B) */}
      {setB.map((b, j) => (
        <text key={`lb-${b}`} x={left - 8} y={yOf(j) + 4} fontSize={13} fill="#9A3412" textAnchor="end">
          {b}
        </text>
      ))}

      {/* Titik temu */}
      {setA.map((a, i) =>
        setB.map((b, j) => {
          const p: Pair = [a, b];
          const on = hasPair(points, p);
          const isWrong = on && hasPair(wrong, p);
          const isMissing = !on && hasPair(missing, p);
          const fill = isWrong ? '#B91C1C' : on && marks?.checked ? '#16A34A' : '#292524';
          return (
            <g
              key={`${a}|${b}`}
              onClick={interactive ? () => onToggle?.(p) : undefined}
              style={{ cursor: interactive ? 'pointer' : 'default' }}
            >
              {interactive && <circle cx={xOf(i)} cy={yOf(j)} r={hitR} fill="transparent" />}
              {interactive && !on && <circle cx={xOf(i)} cy={yOf(j)} r={2.5} fill="#D6C29A" />}
              {isMissing && (
                <circle cx={xOf(i)} cy={yOf(j)} r={7} fill="none" stroke="#A8A29E" strokeWidth={2} strokeDasharray="3 3" />
              )}
              {on && <circle cx={xOf(i)} cy={yOf(j)} r={7} fill={fill} />}
              {isWrong && (
                <text x={xOf(i) + 9} y={yOf(j) - 7} fontSize={12} fontWeight={700} fill="#B91C1C">
                  ✕
                </text>
              )}
            </g>
          );
        }),
      )}
    </svg>
  );
}
