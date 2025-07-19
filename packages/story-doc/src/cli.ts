#!/usr/bin/env node

import { spawn } from 'child_process';
import { build as buildAstro } from 'astro';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
export const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);

async function buildStorybook() {
  return new Promise<void>((resolve, reject) => {
    const child = spawn('npx', ['storybook', 'build', '--preview-only'], {
      stdio: 'inherit',
      shell: true,
    });

    child.on('close', (code) => {
      if (code === 0) {
        console.log('✅ Storybook build finished!');
        resolve();
      } else {
        reject(new Error(`Build failed with exit code ${code}`));
      }
    });
  });
}

const build = async () => {
    // storybook build into iframe
    await buildStorybook();
    await buildAstro({
      root: join(__dirname, '../docs'),
      vite: {
        server: {
          watch: {
            ignored: ['!**/node_modules/@componentview/**']
          }
        },
        base: '/docs',
      },
      configFile: false,
      outDir: join(process.cwd(), 'storybook-static/docs'),
    })
}


await build();