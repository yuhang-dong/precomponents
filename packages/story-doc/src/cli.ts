#!/usr/bin/env node

import { spawn } from 'child_process';
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
}


await build();