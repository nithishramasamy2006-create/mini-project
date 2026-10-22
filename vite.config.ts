import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  server: {
    port: 8080,
    strictPort: false,  // auto-increment port if 8080 is in use
    host: 'localhost',
  },
  plugins: [
    tailwindcss(),
    react(),
  ],
})
