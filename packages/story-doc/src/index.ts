import OriginalViteBuilder from '@storybook/builder-vite';
export { withoutVitePlugins } from '@storybook/builder-vite';
export { hasVitePlugins } from '@storybook/builder-vite';
import type { ViteBuilder } from '@storybook/builder-vite';
import startAstroDevServer from './astro-server';
import { Options } from 'storybook/internal/types';
import type { PluginOption, ViteDevServer } from 'vite';
import { dev, build as astroBuild } from 'astro';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import waitOn from 'wait-on'
import {  readFile } from 'fs/promises';

export const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);


export async function bail(): Promise<void> {
  return OriginalViteBuilder.bail();
}

export const start: ViteBuilder['start'] = async (props) => {
  console.log('Using custom StoryDoc Vite builder');
  const { router: app, options } = props;
  const ret = await OriginalViteBuilder.start(props);
  const astro = await startAstroDevServer(app, {
    storybookPort: options.port,
  });
  console.log('Starting Astro dev server', options.port, options.host);
};

export const build: ViteBuilder['build'] = async (props) => {
  console.log('Using custom StoryDoc Vite builder for build');
  return OriginalViteBuilder.build(props)
};

const virtualModuleId = "virtual:storybook-index";
const resolvedVirtualModuleId = '\0' + virtualModuleId;
let runtimeEntries = {};
let astroInternalViteDevServer: ViteDevServer;
const astroVitePlugin = {
                name: "StoryBook-Index-Values",
                resolveId(id) {
                  if (id === virtualModuleId) return resolvedVirtualModuleId;
                },
                configureServer(server) {
                  // @ts-ignore
                  astroInternalViteDevServer = server;
                },
                load(id) {
                  if (id === resolvedVirtualModuleId) {
                    return `
                      export let value = ${JSON.stringify(runtimeEntries)};
                      export function updateValue(newVal) {
                        value = newVal;
                      }
                      if (import.meta.hot) {
                        import.meta.hot.accept((mod) => {
                        console.log("aha new hot", mod);
                          value = mod.value;
                        });
                      }
                    `;
                  }
                }
              }

export const StoryDocPlugin = (option: Options) => {
  let astroServer;
  return {
    name: 'storybook-docs',
    enforce: 'pre',
    async buildStart() {
      console.log('Starting StoryDoc Plugin build');
      // await rm(option.outputDir!, { recursive: true, force: true });
    },
    async configResolved(resolvedConfig) {
      console.log('Resolved Vite config outdir:', resolvedConfig.build.outDir);
      console.log('server port:', option.port);
      console.log('server host:', option.host);
      if (resolvedConfig.command === 'serve') {
        console.log('Using custom StoryDoc Vite builder for serve');
        const storybookEntriesEndpoint = `http://${option.host || '127.0.0.1'}:${option.port}/index.json`;
        waitOn({
          resources: [storybookEntriesEndpoint],
          delay: 1000,
          interval: 1000,
          timeout: 10_1000,
          tcpTimeout: 1000,
        }).then(async () => {
          try {
            const entries = await (await fetch(`http://${option.host || '127.0.0.1'}:${option.port}/index.json`)).json();
            runtimeEntries = entries;
          } catch (e) {
            console.warn('Failed to get the initial entries ', e);
          }

          astroServer = await dev({
            root: join(__dirname, '../docs'),
            vite: {
              server: {
                watch: {
                  ignored: ['!**/node_modules/@componentview/**']
                }
              },
              plugins: [astroVitePlugin]
            },
          });
        }).catch(() => {
          console.warn(`Failed to start story doc server`)
        })

      } else if (resolvedConfig.command === 'build') {
        console.log('Using custom StoryDoc Vite builder for build');
        if (!option.outputDir) {
          throw new Error('outputDir is not defined in options');
        }
        waitOn({
          resources:[`file://${option.outputDir}`]
        }).then(async () => {
          try {
            const entries = await readFile(join(option.outputDir!, './index.json'), {encoding: 'utf-8'});
            runtimeEntries = JSON.parse(entries);
          } catch (e) {
            console.warn('Failed to get the initial entries ', e);
          }

          astroServer = await astroBuild({
            root: join(__dirname, '../docs'),
            vite: {
              server: {
                watch: {
                  ignored: ['!**/node_modules/@componentview/**']
                }
              },
              plugins: [astroVitePlugin]
            },
            outDir: option.outputDir + '/ddocs',
          });
        })
      }
    },
    async handleHotUpdate(ctx) {
      const { file, server } = ctx;
      console.log('hot reload' + file)
      if (file === '\0virtual:/@storybook/builder-vite/storybook-stories.js') {
        if (!astroInternalViteDevServer) {
          console.warn(`astroInternalViteDevServer is null!!`);
          return;
        }
        try {
          const entries = await (await fetch(`http://${option.host || '127.0.0.1'}:${option.port}/index.json`)).json();
          runtimeEntries = entries;
        } catch (e) {
          console.warn('Failed to get the initial entries ', e);
        }
        const mod = astroInternalViteDevServer.moduleGraph.getModuleById(resolvedVirtualModuleId);
        if (mod) {
          astroInternalViteDevServer.moduleGraph.invalidateModule(
            mod
          );
        } else {
          console.warn(`resolvedVirtualModuleId is null!!`);
        }
        astroInternalViteDevServer.ws.send({
          type: 'full-reload',
        })

      } else {
        console.log('missing', file)
      }
    },
  } satisfies PluginOption;
}