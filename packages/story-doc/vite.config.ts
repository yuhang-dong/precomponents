import {defineConfig} from 'vite';
import { builtinModules } from 'module';
export default defineConfig({
  build: {
    target: 'node16',
    outDir: 'dist',
    lib: {
      entry: 'src/index.ts',
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
        external: [
      ...builtinModules,
      ...builtinModules.map((m) => `node:${m}`),
      'astro',
      'fsevents',
      '@storybook/builder-vite',
      'wait-on',
      '@astrojs/starlight'
      ],
    },
  },
  ssr: {
    noExternal: true,
  },
});