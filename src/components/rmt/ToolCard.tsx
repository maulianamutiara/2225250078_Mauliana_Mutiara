import { tools, type ToolId } from '../../content/rmt';
import { FunctionChips } from './FunctionChips';

/** Kartu "Alat Berpikir" RMT: struktur (bentuk) menentukan fungsi (kegunaan) alat psikologis. */
export function ToolCard({ id }: { id: ToolId }) {
  const t = tools[id];
  return (
    <div className="space-y-3">
      <p className="text-sm font-bold uppercase tracking-wide text-brand">🛠️ Alat berpikir</p>
      <p className="text-2xl font-bold">{t.name}</p>
      <div className="grid gap-2 sm:grid-cols-2">
        <div className="rounded-xl border border-line bg-bg p-3">
          <p className="text-sm font-bold text-muted">Struktur (bentuknya)</p>
          <p>{t.structure}</p>
        </div>
        <div className="rounded-xl border border-line bg-bg p-3">
          <p className="text-sm font-bold text-muted">Fungsi (kegunaannya)</p>
          <p>{t.purpose}</p>
        </div>
      </div>
      <FunctionChips ids={t.functions} label="🧠 Melatih" />
    </div>
  );
}
