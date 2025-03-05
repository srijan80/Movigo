import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/', // Use '/' for Netlify or a custom path if deploying to a subdirectory
});
