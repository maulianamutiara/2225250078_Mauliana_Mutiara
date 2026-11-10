import type { HTMLAttributes } from 'react';

export function Card({ className = '', ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={['rounded-2xl border border-line bg-surface p-4 shadow-sm', className].join(
        ' ',
      )}
      {...rest}
    />
  );
}
