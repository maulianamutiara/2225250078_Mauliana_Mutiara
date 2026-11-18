import { defineConfig } from 'vitest/config';
import { loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { handleChat, type ProxyEnv } from './server/chatHandler';

/**
 * Backend Mediator AI saat `npm run dev`: melayani POST /api/chat memakai server/chatHandler.ts
 * dan membaca DEEPSEEK_API_KEY dari file .env (tanpa awalan VITE_, jadi TIDAK masuk ke browser).
 * Di produksi (Vercel), peran ini dijalankan oleh api/chat.ts.
 */
function devApi(env: ProxyEnv): Plugin {
  return {
    name: 'dev-api-chat',
    configureServer(server) {
      server.middlewares.use('/api/chat', async (req, res) => {
        try {
          const chunks: Uint8Array[] = [];
          for await (const chunk of req) chunks.push(chunk as Uint8Array);
          const headers = new Headers();
          for (const [k, v] of Object.entries(req.headers)) if (typeof v === 'string') headers.set(k, v);
          const method = req.method ?? 'GET';
          const request = new Request(`http://${req.headers.host}/api/chat`, {
            method,
            headers,
            body: method === 'GET' || method === 'HEAD' ? undefined : Buffer.concat(chunks),
          });
          const response = await handleChat(request, env);
          res.statusCode = response.status;
          response.headers.forEach((value, key) => res.setHeader(key, value));
          res.end(await response.text());
        } catch {
          res.statusCode = 500;
          res.end(JSON.stringify({ error: 'dev-server' }));
        }
      });
    },
  };
}

/**
 * PWA: aplikasi bisa dipasang di HP (ikon di layar utama, layar penuh) dan materi + soal
 * tetap jalan tanpa internet. Mediator AI (/api/chat) tetap butuh internet dan tidak disimpan.
 */
const pwa = VitePWA({
  registerType: 'autoUpdate',
  includeAssets: ['favicon.png', 'apple-touch-icon.png'],
  manifest: {
    id: './',
    name: 'RelaSI Pintar — Belajar Relasi',
    short_name: 'RelaSI Pintar',
    description: 'Belajar materi Relasi kelas VIII lewat gambar, latihan, dan Asisten Belajar.',
    lang: 'id',
    start_url: './',
    scope: './',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#FEF6E4',
    theme_color: '#0F766E',
    icons: [
      { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
      { src: 'icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  },
  workbox: {
    globPatterns: ['**/*.{js,css,html,png,svg,woff,woff2}'],
    navigateFallback: 'index.html',
    // Permintaan ke Mediator AI selalu lewat internet, tidak pernah dari cache.
    navigateFallbackDenylist: [/^\/api\//],
    cleanupOutdatedCaches: true,
  },
});

export default defineConfig(({ mode }) => ({
  plugins: [react(), devApi(loadEnv(mode, process.cwd(), '') as ProxyEnv), pwa],
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
}));
