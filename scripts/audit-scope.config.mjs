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

/** Фаза 4: целевой максимум строк на файл (весь scope `AUDIT_CODE_ROOTS` + `AUDIT_CODE_ROOT_FILES`). */
export const AUDIT_STRUCTURAL_MAX_LINES = 500

/**
 * Файлы > `AUDIT_STRUCTURAL_MAX_LINES` допустимы только при совпадении glob и непустом `reason`
 * (категория/архитектура, не «разрешить этот путь»). Иначе — split в той же итерации.
 * Glob: `**`, `*`; не список отдельных путей без обоснования.
 *
 * @type {ReadonlyArray<{ glob: string; reason: string }>}
 */
export const AUDIT_STRUCTURAL_OVERSIZE_JUSTIFIED = [
  {
    glob: 'src/shared/packaged-e2e-help-workflow-crosslinks-meta.ts',
    reason:
      '§15/§21 canonical Help crosslinks registry (44 paths + guards/formatters); leaf for Node ESM — split deferred until path list extract without breaking scripts'
  }
]
