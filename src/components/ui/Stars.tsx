import type { StarCount } from '../../domain/types';

/** Menampilkan 0–3 bintang, dengan teks untuk pembaca layar. */
export function Stars({ value }: { value: StarCount }) {
  return (
    <span aria-label={`${value} dari 3 bintang`} className="whitespace-nowrap text-amber-500">
      {'★'.repeat(value)}
      <span className="text-stone-300">{'★'.repeat(3 - value)}</span>
    </span>
  );
}
