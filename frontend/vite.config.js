import { defineConfig } from 'vite';

const SURFACES = new Set(['student', 'teacher', 'admin']);

export default defineConfig(({ mode }) => {
  const surface = SURFACES.has(mode) ? mode : 'student';

  return {
    base: './',
    build: {
      outDir: `dist/${surface}`,
      emptyOutDir: true,
    },
  };
});
