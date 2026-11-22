import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
    // Node >= 25 trae un localStorage nativo que tapa al de jsdom (ver NOTES.md).
    poolOptions: { forks: { execArgv: ['--no-experimental-webstorage'] } },
  },
});
