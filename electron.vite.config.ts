import { resolve } from 'path'
import { defineConfig } from 'electron-vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // Main — дефолт; preload: главное окно + pop-out `#downloads` / `#inspector` (тот же entry).
  main: {},
  preload: {
    build: {
      rollupOptions: {
        input: {
          index: resolve('src/preload/index.ts')
        }
      }
    }
  },
  renderer: {
    resolve: {
      alias: {
        // Алиас нужен, чтобы будущие UI-модули не строили длинные относительные импорты из renderer.
        '@renderer': resolve('src/renderer/src'),
        '@locales': resolve('locales')
      }
    },
    plugins: [react()]
  }
})
