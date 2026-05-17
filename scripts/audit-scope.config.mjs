/**
 * Единый scope обхода репозитория для audit/check (без хардкода числа файлов).
 * Менять здесь при росте проекта — не в каждом скрипте отдельно.
 */
export const AUDIT_REPO_ROOT = process.cwd()

/** Корни относительно корня репо — обход рекурсивно. */
export const AUDIT_CODE_ROOTS = ['src', 'tests', 'scripts']

/** Отдельные файлы у корня репо. */
export const AUDIT_CODE_ROOT_FILES = [
  'vitest.config.ts',
  'electron.vite.config.ts',
  'eslint.config.mjs',
  'tsconfig.json',
  'tsconfig.node.json',
  'tsconfig.web.json',
  'tsconfig.tests.json'
]

/** Имена каталогов: не заходить внутрь. */
export const AUDIT_SKIP_DIR_NAMES = new Set([
  'node_modules',
  'dist',
  'out',
  'build',
  '.git',
  'resources',
  'Help',
  'Data',
  '.cursor',
  'coverage'
])

/** Расширения исполняемого/проверяемого кода. */
export const AUDIT_CODE_EXTENSIONS = /\.(ts|tsx|mjs|cjs|js)$/

/** Зоны Phase 4+ (крупные модули) — обновлять по мере инвентаризации. */
export const AUDIT_LARGE_MODULE_CANDIDATES = [
  'src/main/index.ts',
  'src/main/ffmpeg-export-service.ts',
  'src/main/ffprobe-service.ts',
  'src/main/settings-store.ts',
  'src/renderer/src/App.tsx',
  'src/shared/ffmpeg-export-argv.ts',
  'src/shared/terminal-contract.ts',
  'tests/shared/terminal-contract-scenarios.test.ts',
  'tests/main/ytdlp-progress-parser-download.test.ts',
  'tests/shared/ffmpeg-export-argv-encode-audio.test.ts'
]
