import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    // Bind to all interfaces (IPv4 + IPv6). Without this, Vite listens on
    // ::1 only on Windows and http://127.0.0.1:5173 fails to connect.
    host: true,
  },
});
