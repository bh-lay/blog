import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue2'
const cdnDomain = '//static.bh-lay.com'
export default defineConfig({
  resolve: {
    alias: {
      '@': '/src/',
    },
  },
  define: {
    CDN_PATH: JSON.stringify(cdnDomain),
  },
  plugins: [vue()],
  base: process.env.NODE_ENV === 'production' ? cdnDomain + '/build/single-page-vue/' : '',
  server: {
    proxy: {
      '/api': 'http://127.0.0.1:8888/',
      '/img-robber': 'http://127.0.0.1:8888/',
    }
  }
})
