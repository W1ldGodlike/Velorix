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

/** Зоны Phase 4+ (крупные модули) — файлы ближе к порогу 500 строк; обновлять по инвентаризации. */
export const AUDIT_LARGE_MODULE_CANDIDATES = [
  'src/shared/terminal-contract-hints-preview-media-01.ts',
  'tests/fixtures/ffprobe-track-detail-cases.ts',
  'src/renderer/src/components/downloads/DownloadsWorkspaceMainQueueTable.tsx',
  'src/main/downloads-window-html-body.ts',
  'tests/fixtures/ytdlp-progress-parser-queue-failure-cases.ts',
  'src/main/downloads-window-html-script-fragment-queue.ts',
  'tests/shared/ffmpeg-export-argv-filters-metadata.test.ts'
]
