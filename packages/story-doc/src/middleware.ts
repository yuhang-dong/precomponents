import { dev } from 'astro';
import type { Polka } from 'polka';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { createProxyMiddleware, RequestHandler } from 'http-proxy-middleware';
export const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);
 


export default (option: any) => {

  return async (app: Polka) => {
    const astro = await dev({
        root: join(__dirname, '../docs'),
        devToolbar: {
          enabled: true,
        },
        vite: {
          server: {
            watch: {
              ignored: ['!**/node_modules/@componentview/**']
            }
          },
          base: '/docs',
        },
        configFile: false,
    });

    // // @ts-ignore
    // const handle: RequestHandler = (req, res) => {
    //   console.log(req.headers.upgrade)
    //   // @ts-ignore
    //   req.url = req.originalUrl;
    //   astro.handle(req, res);
    // }
    // handle.upgrade = (req: any, socket: any, head: any) => {
    //   console.log('upgrade', req.url);
    // };

    // app.use('/docs', handle);
    const handle = createProxyMiddleware({
      target: "http://localhost:4321/docs",
      changeOrigin: true,
      ws: true,
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
  }
}