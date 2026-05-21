/* eslint-disable @typescript-eslint/explicit-function-return-type */
/**
 * Список scripts/*.mjs без npm script и без импорта из других скриптов/package.json.
 * Информационный; не входит в check:quiet по умолчанию.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'

import { REPO_ROOT } from '../lib/repo-root.mjs'

const SCRIPTS_ROOT = join(REPO_ROOT, 'scripts')
const SKIP_DIRS = new Set(['lib', 'cursor-automation'])

function walkScripts(dir, acc = []) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name)
    if (statSync(full).isDirectory()) {
      if (!SKIP_DIRS.has(name) && !name.startsWith('.')) {
        walkScripts(full, acc)
      }
      continue
    }
    if (name.endsWith('.mjs')) {
      acc.push(full.slice(REPO_ROOT.length + 1).replace(/\\/g, '/'))
    }
  }
  return acc
}

function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function main() {
  const scriptPaths = walkScripts(SCRIPTS_ROOT)
  const pkg = readFileSync(join(REPO_ROOT, 'package.json'), 'utf8')
  const corpusParts = [pkg, readFileSync(join(REPO_ROOT, 'docs', 'audit-manifest.json'), 'utf8')]
  for (const rel of scriptPaths) {
    corpusParts.push(readFileSync(join(REPO_ROOT, rel), 'utf8'))
  }
  const corpus = corpusParts.join('\n')

  const orphans = []
  for (const rel of scriptPaths) {
    const base = rel.split('/').pop()
    const stem = base.replace(/\.mjs$/, '')
    if (pkg.includes(base) || pkg.includes(stem)) {
      continue
    }
    const re = new RegExp(escapeRe(stem), 'g')
    const hits = corpus.match(re)?.length ?? 0
    if (hits <= 1) {
      orphans.push(rel)
    }
  }

  orphans.sort()
  if (orphans.length === 0) {
    console.log('[audit:orphan-scripts] no orphan candidates')
    return
  }
  console.log(
    `[audit:orphan-scripts] ${orphans.length} maint/split scripts (not in package.json, no cross-import):`
  )
  for (const rel of orphans) {
    console.log(`  ${rel}`)
  }
}

main()
