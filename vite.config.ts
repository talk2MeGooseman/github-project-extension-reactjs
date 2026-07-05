import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  // Twitch hosts extension assets from a relative path — keep base './'.
  base: './',
  server: {
    port: 8080,
  },
  plugins: [react()],
})
