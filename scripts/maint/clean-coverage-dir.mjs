/**
 * Удаляет каталог coverage/ после успешного test:coverage (отчёт уже в stdout).
 */
import { rmSync } from 'node:fs'
import { join } from 'node:path'

import { REPO_ROOT } from '../lib/repo-root.mjs'

const dir = join(REPO_ROOT, 'coverage')
try {
  rmSync(dir, { recursive: true, force: true })
  console.log('[clean-coverage-dir] removed coverage/')
} catch (error) {
  console.error('[clean-coverage-dir] FAILED', error instanceof Error ? error.message : error)
  process.exit(1)
}
