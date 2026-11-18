import { defineConfig } from 'vitest/config';
import { loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
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

export default defineConfig(({ mode }) => ({
  plugins: [react(), devApi(loadEnv(mode, process.cwd(), '') as ProxyEnv)],
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
