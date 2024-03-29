import react from '@vitejs/plugin-react'
import { defineConfig , splitVendorChunkPlugin } from 'vite'
import svgrPlugin from 'vite-plugin-svgr'
import eslint from 'vite-plugin-eslint'

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  server: {
    port: '8080'
  },
  plugins: [
    react(),
    splitVendorChunkPlugin(),
    svgrPlugin({
      svgrOptions: {
        icon: true,
      }
    }),
    eslint({
      fix: true,
    })
  ]
})
