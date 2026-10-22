import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  server: {
    port: 8080,
    strictPort: true,   // NEVER silently drift to 8081 — fail loudly instead
    host: 'localhost',
    open: true,         // auto-open browser on the correct URL
  },
  preview: {
    port: 8080,
    strictPort: true,
  },
  plugins: [
    tailwindcss(),
    react(),
  ],
  build: {
    sourcemap: false,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        // Split vendor chunks for better caching
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'router':       ['react-router-dom'],
          'motion':       ['framer-motion'],
          'icons':        ['lucide-react'],
        },
      },
    },
  },
})
