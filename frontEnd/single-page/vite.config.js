import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue2'

export default defineConfig({
  resolve: {
    alias: {
      '@': '/src/',
    },
  },
  define: {
    CDN_PATH: JSON.stringify('http://static.bh-lay.com/'),
  },
  plugins: [vue()],
  base: './',
  server: {
    proxy: {
      '/api': 'http://127.0.0.1:8888/',
    }
  }
  
})
