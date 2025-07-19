import { ViteBuilder } from '@storybook/builder-vite';
import { dev } from 'astro';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { createProxyMiddleware } from 'http-proxy-middleware';

export const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);


type ServerApp = Parameters<ViteBuilder['start']>[0]['router'];

export type AstroDevServerOptions = {
  storybookPort?: number;
  storybookHost?: string;
}

export default async function startAstroDevServer(app: ServerApp, host: AstroDevServerOptions) {
    const handleRender = createProxyMiddleware({
      target: `http://127.0.0.1:${host.storybookPort || 4321}`,
      changeOrigin: true,
    });
  const astro = await dev({
      root: join(__dirname, '../../docs'),
      vite: {
        server: {
          watch: {
            ignored: ['!**/node_modules/@componentview/**']
          }
        },
        plugins: [
          {
            name: 'astro-story-doc',
            enforce: 'pre',
            configureServer(server) {
              server.middlewares.use((req, res, next) => {
                if (req.url?.startsWith('/__storybook')) {
                  console.log('Proxying request to Astro dev server', req.url);
                  req.url = req.url.replace('/__storybook', '');
                  handleRender(req, res);
                  return;
                }
                next();
              });
            }
          }
        ]
      },
      configFile: false,
    });
    const handle = createProxyMiddleware({
      target: "http://localhost:4321/docs",
      changeOrigin: true,
    });
  
    const handle2 = createProxyMiddleware({
      target: "http://localhost:4321/",
      changeOrigin: true,
      ws: true,
    });
    app.server?.on('upgrade', handle2.upgrade);
    app.use(
      '/docs',
      handle
    );
  return astro;
}