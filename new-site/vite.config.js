import { defineConfig } from 'vite'
import { resolve } from 'path'

// Главный экран — рабочий стол; разделы открываются окнами (адреса #works, #price, #work/<id>)
export default defineConfig({
  // ролики и обложки берём из общей папки public/ старого сайта — без дублирования
  publicDir: resolve(__dirname, '../public'),
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
    },
  },
})
