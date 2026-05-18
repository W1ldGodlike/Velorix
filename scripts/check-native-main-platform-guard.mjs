/* eslint-disable @typescript-eslint/explicit-function-return-type */
/**
 * §2.1 — в src/main/ прямой process.platform только в allowlist; иначе native-main-platform.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'

import { REPO_ROOT } from './lib/repo-root.mjs'

const MAIN_ROOT = join(REPO_ROOT, 'src', 'main')

/** Файлы, где допустим сырой process.platform (диагностика / install root). */
const ALLOWLIST = new Set([
  'src/main/app-data-root-paths.ts',
  'src/main/app-data-root.ts',
  'src/main/logger-service.ts',
  'src/main/main-diagnostics-service.ts'
])

const PLATFORM_RE = /\bprocess\.platform\b/

function listTsFiles(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const abs = join(dir, name)
    if (statSync(abs).isDirectory()) {
      listTsFiles(abs, out)
      continue
    }
    if (name.endsWith('.ts')) {
      out.push(abs)
    }
  }
  return out
}

function main() {
  const violations = []
  for (const abs of listTsFiles(MAIN_ROOT)) {
    const rel = relative(REPO_ROOT, abs).replace(/\\/g, '/')
    if (!PLATFORM_RE.test(readFileSync(abs, 'utf8'))) {
      continue
    }
    if (ALLOWLIST.has(rel)) {
      continue
    }
    violations.push(rel)
  }
  if (violations.length > 0) {
    console.error('[native-main-platform-guard] use src/shared/native-main-platform.ts:')
    for (const v of violations.sort()) {
      console.error(`  ${v}`)
    }
    process.exit(1)
  }
  console.log('[native-main-platform-guard] OK')
}

main()
