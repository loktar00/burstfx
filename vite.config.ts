import { resolve } from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

// `npm run dev` serves the demo from index.html; `npm run build` bundles the library.
export default defineConfig({
    plugins: [react()],
    build: {
        lib: {
            entry: resolve(import.meta.dirname, 'src/index.ts'),
            formats: ['es'],
            fileName: 'index',
        },
        copyPublicDir: false,
        sourcemap: true,
        rollupOptions: {
            external: ['react', 'react-dom', 'react/jsx-runtime'],
        },
    },
    test: {
        environment: 'jsdom',
        globals: true,
        restoreMocks: true,
    },
});
