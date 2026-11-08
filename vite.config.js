import { defineConfig } from 'vite'
import { resolve } from 'path'

// Многостраничный сайт: каждая страница — отдельный html
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        pipeline: resolve(__dirname, 'pipeline.html'),
        price: resolve(__dirname, 'price.html'),
        about: resolve(__dirname, 'about.html'),
      },
    },
  },
})
