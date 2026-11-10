import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // './' agar aset tetap jalan saat dibungkus Capacitor (Android) atau di-hosting di subfolder
  base: './',
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    // Node.js 25+ punya localStorage bawaan yang menimpa localStorage milik jsdom saat tes.
    // Matikan agar tes memakai localStorage jsdom (seperti di browser).
    poolOptions: {
      forks: { execArgv: ['--no-experimental-webstorage'] },
      threads: { execArgv: ['--no-experimental-webstorage'] },
    },
  },
});
