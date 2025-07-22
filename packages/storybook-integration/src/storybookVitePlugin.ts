import type { Options } from 'storybook/internal/types';
import type { PluginOption, ViteDevServer } from 'vite';
import { dev, build as astroBuild } from 'astro';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import waitOn from 'wait-on'
import { cp, readFile } from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const virtualModuleId = "virtual:storybook-index";
const resolvedVirtualModuleId = '\0' + virtualModuleId;
let runtimeEntries = {};
let astroInternalViteDevServer: ViteDevServer;
const astroVitePlugin: PluginOption = {
  name: "StoryBook-Index-Values",
  resolveId(id) {
    if (id === virtualModuleId) return resolvedVirtualModuleId;
  },
  configureServer(server) {
    astroInternalViteDevServer = server;
  },
  load(id) {
    if (id === resolvedVirtualModuleId) {
      return `
        export let index = ${JSON.stringify(runtimeEntries)};
        export function updateValue(newVal) {
          index = newVal;
        }
        if (import.meta.hot) {
          import.meta.hot.accept((mod) => {
          console.log("aha new hot", mod);
            index = mod.index;
          });
        }
      `;
    }
  }
}

const PreComponentsStorybookVitePlugin = ((option: Options): PluginOption => {
  let astroServer;
  return {
    name: '@precomponents/storybook-integration',
    enforce: 'post',
    async configResolved(resolvedConfig) {
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
                  ignored: ['!**/node_modules/@precomponents/**']
                }
              },
              plugins: [astroVitePlugin as any]
            },
          });
        }).catch((e) => {
          console.warn(`Failed to start story doc server`, e)
        })

      } else if (resolvedConfig.command === 'build') {

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

      }
    },
    async closeBundle() {
      if (!option.outputDir) {
        throw new Error('outputDir is not defined in options');
      }
      waitOn({
        resources: [`file://${option.outputDir}`]
      }).then(async () => {
        try {
          const entries = await readFile(join(option.outputDir!, './index.json'), { encoding: 'utf-8' });
          runtimeEntries = JSON.parse(entries);
        } catch (e) {
          console.warn('Failed to get the initial entries ', e);
        }

        const outputDir = join(option.outputDir!, '../precomponents');


        astroServer = await astroBuild({
          root: join(__dirname, '../docs'),
          output: 'static',
          outDir: outputDir,
          vite: {
            server: {
              watch: {
                ignored: ['!**/node_modules/@precomponents/**']
              }
            },
            plugins: [astroVitePlugin as any]
          },
        });
        await cp(option.outputDir!, outputDir + '/static', {
          recursive: true,
        });
      })
    }
  };
}) as any;

export {
  PreComponentsStorybookVitePlugin
};