import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/', // Base path
  build: {
    outDir: 'build', // Ensure this is set to 'build'
  },
});
