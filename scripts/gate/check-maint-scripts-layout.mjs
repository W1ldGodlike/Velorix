/* eslint-disable @typescript-eslint/explicit-function-return-type */
/**
 * scripts/: только audit-scope.config.mjs в корне; .mjs в gate|audit|release|maint|e2e|lib.
 * Запрещены одноразовые split/migrate/splice и _migrate-*.
 */
import { readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

import { REPO_ROOT } from '../lib/repo-root.mjs'

const SCRIPTS_ROOT = join(REPO_ROOT, 'scripts')
const ALLOWED_BUCKETS = new Set([
  'gate',
  'audit',
  'release',
  'maint',
  'e2e',
  'lib',
  'data',
  'cursor-automation'
])

const BANNED_PREFIXES = ['split-', 'migrate-', 'extract-', 'splice-', '_migrate-']

function main() {
  const violations = []

  for (const name of readdirSync(SCRIPTS_ROOT)) {
    const full = join(SCRIPTS_ROOT, name)
    if (statSync(full).isDirectory()) {
      if (!ALLOWED_BUCKETS.has(name) && !name.startsWith('.')) {
        violations.push(`scripts/${name}/ (unknown bucket)`)
      }
      continue
    }
    if (name.endsWith('.mjs') && name !== 'audit-scope.config.mjs') {
      violations.push(`scripts/${name} (move to gate|audit|release|maint|e2e)`)
    }
  }

  for (const bucket of ALLOWED_BUCKETS) {
    if (bucket === 'lib' || bucket === 'cursor-automation') {
      continue
    }
    const dir = join(SCRIPTS_ROOT, bucket)
    if (!statSync(dir, { throwIf: false })?.isDirectory()) {
      continue
    }
    for (const name of readdirSync(dir)) {
      if (!name.endsWith('.mjs')) {
        continue
      }
      if (BANNED_PREFIXES.some((p) => name.startsWith(p))) {
        violations.push(`scripts/${bucket}/${name}`)
      }
    }
  }

  if (violations.length > 0) {
    console.error('[check:maint-scripts-layout] FAILED')
    for (const rel of violations.sort()) {
      console.error(`  ${rel}`)
    }
    process.exit(1)
  }

  console.log('[check:maint-scripts-layout] OK')
}

main()
