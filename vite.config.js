import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/', // Base path
  build: {
    outDir: 'build', // Change this from 'dist' to 'build'
  },
});
