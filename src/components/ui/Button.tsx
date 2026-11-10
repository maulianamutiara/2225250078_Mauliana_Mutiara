import type { ButtonHTMLAttributes } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  block?: boolean;
}

const variantClass: Record<Variant, string> = {
  primary: 'bg-brand text-white shadow-sm hover:bg-brand-dark disabled:bg-stone-300',
  secondary:
    'bg-surface text-brand border-2 border-brand hover:bg-brand-soft disabled:border-stone-300 disabled:text-stone-400',
  ghost: 'bg-transparent text-ink hover:bg-line/40 disabled:text-stone-400',
};

/** Tombol dasar — tinggi minimal 44px agar mudah disentuh (docs/UI_UX.md). */
export function Button({
  variant = 'primary',
  block = false,
  className = '',
  type = 'button',
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={[
        'inline-flex min-h-touch min-w-touch items-center justify-center gap-2 rounded-xl px-4 py-2',
        'font-bold transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300',
        'disabled:cursor-not-allowed',
        variantClass[variant],
        block ? 'w-full' : '',
        className,
      ].join(' ')}
      {...rest}
    />
  );
}
