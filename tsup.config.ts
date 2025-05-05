// tsup.config.ts
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['bin/nexus-cli.ts'],
  format: ['cjs', 'esm'],
  splitting: false,
  clean: true,
  dts: true,
  sourcemap: true,
  target: 'node20',
  outDir: 'dist',
  tsconfig: './tsconfig.build.json',
  banner: {
    js: '#!/usr/bin/env node'
  },
  shims: true,
  esbuildOptions(options) {
    options.loader = {
      ...options.loader,
      '.json': 'json',
    };
  },
});
