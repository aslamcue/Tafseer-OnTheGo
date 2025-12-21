import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/quran': {
        target: 'https://api.quran.com/api/v4',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/quran/, '')
      },
      '/api/alquran': {
        target: 'https://api.alquran.cloud/v1',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/alquran/, '')
      }
    }
  }
})