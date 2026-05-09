import { resolve } from 'path'
import { defineConfig } from 'electron-vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // Main и preload пока используют дефолты electron-vite; доменные сервисы подключаются из src/main.
  main: {},
  preload: {},
  renderer: {
    resolve: {
      alias: {
        // Алиас нужен, чтобы будущие UI-модули не строили длинные относительные импорты из renderer.
        '@renderer': resolve('src/renderer/src')
      }
    },
    plugins: [react()]
  }
})
