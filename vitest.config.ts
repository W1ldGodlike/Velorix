import { defineConfig } from 'vitest/config'

/**
 * §21 — конфигурация Vitest для unit-тестов чистых парсеров main.
 *
 * Сценарий запуска ограничен Node-средой (без jsdom): тестируем не React, а
 * парсеры yt-dlp/ffmpeg argv/строк прогресса. Тесты лежат отдельно от исходников
 * (`tests/`), чтобы прод-сборка electron-vite их не подхватывала.
 */
export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts'],
    reporters: ['default'],
    passWithNoTests: false,
    clearMocks: true
  }
})
