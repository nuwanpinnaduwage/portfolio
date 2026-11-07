import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

function apiDevMiddleware() {
  return {
    name: 'api-contact-middleware',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url && req.url.startsWith('/api/contact')) {
          try {
            // Read body if POST
            let body = {};
            if (req.method === 'POST') {
              const buffers = [];
              for await (const chunk of req) {
                buffers.push(chunk);
              }
              const data = Buffer.concat(buffers).toString();
              if (data) {
                try {
                  body = JSON.parse(data);
                } catch {
                  body = {};
                }
              }
            }
            req.body = body;

            // Polyfill standard Vercel res.status / res.json helper methods
            if (!res.status) {
              res.status = function (code) {
                this.statusCode = code;
                return this;
              };
            }
            if (!res.json) {
              res.json = function (obj) {
                this.setHeader('Content-Type', 'application/json');
                this.end(JSON.stringify(obj));
                return this;
              };
            }

            const { default: handler } = await import('./api/contact.js');
            await handler(req, res);
            return;
          } catch (err) {
            console.error('[API Middleware Error]:', err);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: false, error: err.message }));
            return;
          }
        }
        next();
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  // Populate process.env for local API route execution
  Object.assign(process.env, env);

  return {
    envPrefix: ['VITE_', 'NEXT_PUBLIC_'],
    plugins: [react(), apiDevMiddleware()],
    server: {
      port: 3000,
      open: false,
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom', 'react-router-dom'],
            supabase: ['@supabase/supabase-js'],
            icons: ['lucide-react'],
            motion: ['motion'],
          },
        },
      },
    },
  };
});
