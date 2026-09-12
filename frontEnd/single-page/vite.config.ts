import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const cdnDomain = '//static.bh-lay.com'

export default defineConfig(({ mode }) => ({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  define: {
    CDN_PATH: JSON.stringify(cdnDomain),
  },
  plugins: [vue()],
  base: mode === 'production' ? cdnDomain + '/build/single-page-vue/' : '',
  server: {
    proxy: {
      // '/api': 'http://127.0.0.1:8888/',
      // '/img-robber': 'http://127.0.0.1:8888/',
      '/api': 'https://bh-lay.com/',
      '/img-robber': 'https://bh-lay.com/',
    },
  },
}))
