import { defineConfig } from 'vite';
import { builtinModules } from 'module';
import { peerDependencies, dependencies } from './package.json';
export default defineConfig({
  build: {
    target: 'node16',
    outDir: 'dist',
    lib: {
      entry: {
        index: 'src/index.ts',
        plugin: 'src/storybookVitePlugin.ts',
        decorator: 'src/storybookDecorator.tsx'
      },
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: [
        ...builtinModules,
        ...builtinModules.map((m) => `node:${m}`),
        ...Object.keys(peerDependencies || {}),
        ...Object.keys(dependencies || {}),
        'react/jsx-runtime',
      ],
    },
  },
  ssr: {
    noExternal: true,
  },
});