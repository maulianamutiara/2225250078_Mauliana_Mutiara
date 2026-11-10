import defaultTheme from 'tailwindcss/defaultTheme';

/** Token desain — lihat docs/UI_UX.md bagian 2 */
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'set-a': '#2563EB', // himpunan A / slot pertama pasangan
        'set-b': '#EA580C', // himpunan B / slot kedua pasangan
        ok: '#16A34A', // benar
        fix: '#B91C1C', // perlu diperbaiki
        // Tema "Hangat ceria": latar krem, aksen hijau toska
        bg: '#FEF6E4', // latar halaman (krem)
        surface: '#FFFCF5', // kartu & jendela
        line: '#F1DDB0', // garis tepi hangat
        brand: '#0F766E', // tombol utama (toska)
        'brand-dark': '#115E59',
        'brand-soft': '#E6F6F3',
        ink: '#292524', // teks utama
        muted: '#57534E', // teks keterangan
      },
      fontFamily: {
        sans: ['Nunito', ...defaultTheme.fontFamily.sans],
      },
      minHeight: { touch: '44px' },
      minWidth: { touch: '44px' },
    },
  },
  plugins: [],
};
