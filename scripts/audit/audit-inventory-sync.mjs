/* eslint-disable @typescript-eslint/explicit-function-return-type */
/**
 * Phase 8.3: docs/audit-manifest.json must match current audit scope (run audit:inventory to refresh).
 */
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

import {
  AUDIT_CODE_EXTENSIONS,
  AUDIT_CODE_ROOT_FILES,
  AUDIT_CODE_ROOTS,
  AUDIT_SKIP_DIR_NAMES
} from '../audit-scope.config.mjs'
import { REPO_ROOT } from '../lib/repo-root.mjs'

const manifestPath = join(REPO_ROOT, 'docs/audit-manifest.json')

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    if (statSync(p).isDirectory()) {
      if (!AUDIT_SKIP_DIR_NAMES.has(name)) {
        walk(p, out)
      }
      continue
    }
    if (AUDIT_CODE_EXTENSIONS.test(name)) {
      out.push(p)
    }
  }
  return out
}

function collectScopeFiles() {
  const files = []
  for (const root of AUDIT_CODE_ROOTS) {
    const abs = join(REPO_ROOT, root)
    try {
      files.push(...walk(abs).map((p) => p.slice(REPO_ROOT.length + 1).replace(/\\/g, '/')))
    } catch {
      // skip missing root
    }
  }
  for (const f of AUDIT_CODE_ROOT_FILES) {
    try {
      statSync(join(REPO_ROOT, f))
      files.push(f.replace(/\\/g, '/'))
    } catch {
      // optional
    }
  }
  files.sort()
  return files
}

let manifest
try {
  manifest = JSON.parse(readFileSync(manifestPath, 'utf8'))
} catch {
  console.error(
    '[audit:inventory-sync] FAIL: missing docs/audit-manifest.json — run npm run audit:inventory'
  )
  process.exit(1)
}

const expected = manifest.files ?? []
const live = collectScopeFiles()

const onlyInManifest = expected.filter((f) => !live.includes(f))
const onlyInLive = live.filter((f) => !expected.includes(f))

if (onlyInManifest.length > 0 || onlyInLive.length > 0) {
  console.error(
    '[audit:inventory-sync] FAIL: audit-manifest.json out of sync with audit-scope.config.mjs'
  )
  console.error(`  manifest: ${expected.length} files, live scope: ${live.length} files`)
  for (const f of onlyInManifest.slice(0, 12)) {
    console.error(`  - removed from repo/scope: ${f}`)
  }
  for (const f of onlyInLive.slice(0, 12)) {
    console.error(`  + added in repo/scope: ${f}`)
  }
  if (onlyInManifest.length + onlyInLive.length > 24) {
    console.error(
      `  … and ${onlyInManifest.length + onlyInLive.length - 24} more — run npm run audit:inventory`
    )
  }
  process.exit(1)
}

console.log(`[audit:inventory-sync] OK (${live.length} files match docs/audit-manifest.json)`)
