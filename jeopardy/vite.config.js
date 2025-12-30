import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/jeopardy/',  // Set base path for deployment to /jeopardy/ subdirectory
  server: {
    proxy: {
      '/api': 'http://localhost:5000'
    }
  },
  plugins: [react()],
})