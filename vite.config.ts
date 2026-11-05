import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  resolve: {
    // Matches the "shadcn" import convention (@/components/ui/...) used by the
    // components in src/components/ui, so they drop in without rewrites.
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    // Bind to all interfaces (IPv4 + IPv6). Without this, Vite listens on
    // ::1 only on Windows and http://127.0.0.1:5173 fails to connect.
    host: true,
  },
});
