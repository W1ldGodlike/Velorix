/* eslint-disable @typescript-eslint/explicit-function-return-type */
/**
 * scripts/ — каждый .mjs в gate|audit|release|maint|e2e в package.json или SCRIPTS_MAINT_MANUAL;
 * каждый `node scripts/...mjs` из package.json существует на диске.
 */
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

import {
  SCRIPTS_WIRING_EXEMPT_REL_PATHS,
  listScriptPathsFromPackageScripts
} from '../../src/shared/scripts-inventory-meta.ts'
import { REPO_ROOT } from '../lib/repo-root.mjs'

const LOG_PREFIX = 'check:scripts-wiring'
const WALK_BUCKETS = ['gate', 'audit', 'release', 'maint', 'e2e']
const EXEMPT = new Set(SCRIPTS_WIRING_EXEMPT_REL_PATHS)

function walkBucket(bucket, acc = []) {
  const dir = join(REPO_ROOT, 'scripts', bucket)
  for (const name of readdirSync(dir)) {
    if (!name.endsWith('.mjs')) {
      continue
    }
    acc.push(`scripts/${bucket}/${name}`)
  }
  return acc
}

function main() {
  const pkg = JSON.parse(readFileSync(join(REPO_ROOT, 'package.json'), 'utf8'))
  const scripts = pkg.scripts ?? {}
  const wired = new Set(listScriptPathsFromPackageScripts(scripts))
  const violations = []

  for (const rel of wired) {
    if (!existsSync(join(REPO_ROOT, rel))) {
      violations.push(`missing file for npm script: ${rel}`)
    }
  }

  for (const bucket of WALK_BUCKETS) {
    for (const rel of walkBucket(bucket)) {
      if (!wired.has(rel) && !EXEMPT.has(rel)) {
        violations.push(`unwired: ${rel} (add npm script or SCRIPTS_WIRING_EXEMPT_REL_PATHS)`)
      }
    }
  }

  if (violations.length > 0) {
    console.error(`[${LOG_PREFIX}] FAILED (${violations.length})`)
    for (const v of violations.sort()) {
      console.error(`  ${v}`)
    }
    process.exit(1)
  }

  console.log(
    `[${LOG_PREFIX}] OK (${wired.size} wired; ${EXEMPT.size} exempt; ${WALK_BUCKETS.join('+')} buckets)`
  )
}

main()
