import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  //envDir: './env',
  plugins: [react()],
  preview: {
    allowedHosts: ['one3-candidatesearch-fgn2.onrender.com'],
  }
});
