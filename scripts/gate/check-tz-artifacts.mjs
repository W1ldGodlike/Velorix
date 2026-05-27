/* eslint-disable @typescript-eslint/explicit-function-return-type */
/**
 * Сверка ключевых путей репозитория (§2.2 / IPC / renderer state) — без VELORIX_TZ (архив).
 */
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

import { REPO_ROOT } from '../lib/repo-root.mjs'

const IPC_PATH = join(REPO_ROOT, 'src', 'shared', 'ipc-channels.ts')
const NEON_CHECKLIST = join(REPO_ROOT, 'docs', 'IMPLEMENTATION_NEON_CHECKLIST.md')

const REQUIRED_PATHS = [
  'src/main/index.ts',
  'src/preload/index.ts',
  'src/renderer/src/stores/app-shell-store.ts',
  'src/shared/renderer-state-approach.ts',
  'docs/VELORIX_NEON_THEME.md',
  'Data/trusted_hashes.json',
  'locales/ru/common.json',
  'locales/en/common.json'
]

const FORBIDDEN_ROOT_ARTIFACTS = ['VELORIX_TZ.md', 'IMPLEMENTATION_CHECKLIST.md']

function main() {
  const violations = []

  if (!existsSync(NEON_CHECKLIST)) {
    violations.push('missing docs/IMPLEMENTATION_NEON_CHECKLIST.md')
  }

  for (const rel of FORBIDDEN_ROOT_ARTIFACTS) {
    if (existsSync(join(REPO_ROOT, rel))) {
      violations.push(`forbidden root artifact (use docs/archive): ${rel}`)
    }
  }

  for (const rel of REQUIRED_PATHS) {
    if (!existsSync(join(REPO_ROOT, rel))) {
      violations.push(`missing required path: ${rel}`)
    }
  }

  const ipc = readFileSync(IPC_PATH, 'utf8')
  for (const token of ['velorix:settings', 'velorix:export', 'velorix:downloads']) {
    if (!ipc.includes(token)) {
      violations.push(`ipc-channels.ts: missing ${token}`)
    }
  }

  const approach = readFileSync(
    join(REPO_ROOT, 'src', 'shared', 'renderer-state-approach.ts'),
    'utf8'
  )
  if (!approach.includes("RENDERER_STATE_APPROACH = 'zustand'")) {
    violations.push('renderer-state-approach.ts: expected zustand')
  }

  if (violations.length > 0) {
    console.error('[check-tz-artifacts] violations:')
    for (const v of violations) {
      console.error(`  ${v}`)
    }
    process.exit(1)
  }
  console.log('[check-tz-artifacts] OK')
}

main()
