import { resolve } from 'path'
import { defineConfig } from 'electron-vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // Main — дефолт; preload: два entry (главное окно + окно загрузок §6).
  main: {},
  preload: {
    build: {
      rollupOptions: {
        input: {
          index: resolve('src/preload/index.ts'),
          downloadsWindow: resolve('src/preload/downloads-window.ts')
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
