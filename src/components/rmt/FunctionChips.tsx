import { useState } from 'react';
import { cognitiveFunctions, type CognitiveFunctionId } from '../../content/rmt';
import { Modal } from '../ui/Modal';

interface FunctionChipsProps {
  ids: readonly CognitiveFunctionId[];
  label?: string;
}

/** Label fungsi kognitif RMT. Diketuk → definisi + pertanyaan untuk diri sendiri. */
export function FunctionChips({ ids, label = '🧠 Fungsi kognitif' }: FunctionChipsProps) {
  const [open, setOpen] = useState<CognitiveFunctionId | null>(null);
  const f = open ? cognitiveFunctions[open] : null;

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="text-xs font-bold text-muted">{label}:</span>
      {ids.map((id) => (
        <button
          key={id}
          type="button"
          onClick={() => setOpen(id)}
          className="min-h-touch rounded-full border border-brand/40 bg-brand-soft px-3 text-sm font-bold text-brand"
        >
          {cognitiveFunctions[id].name}
        </button>
      ))}
      <Modal open={f !== null} title={f ? `🧠 ${f.name}` : ''} onClose={() => setOpen(null)}>
        {f && (
          <div className="space-y-2">
            <p>{f.definition}</p>
            <p>
              <span className="font-bold">Tanya dirimu:</span> <span className="italic">"{f.question}"</span>
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
}
