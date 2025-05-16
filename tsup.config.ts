import { defineConfig } from 'tsup';
import fs from 'fs';
import path from 'path';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  splitting: false,
  external: ['react', 'next', 'react-dom'],
  outExtension: ({ format }) => ({
    js: format === 'cjs' ? '.js' : '.mjs',
  }),
  injectStyle: true,
  async onSuccess() {
    // Copy CSS file separately for direct import in Next.js
    const cssSource = path.resolve(__dirname, 'src/styles/blog.css');
    const cssDestination = path.resolve(__dirname, 'dist/index.css');
    fs.copyFileSync(cssSource, cssDestination);
    console.log('CSS file copied to dist/index.css for direct imports');
  },
});