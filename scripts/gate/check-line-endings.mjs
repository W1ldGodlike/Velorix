/* eslint-disable @typescript-eslint/explicit-function-return-type */
/**
 * CRLF guard: .editorconfig / .prettierrc endOfLine: lf / .gitattributes eol=lf.
 * Fails before eslint floods with hundreds of prettier/prettier «Delete ␍» warnings.
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

const EXTRA_ROOTS = ['Help', '.cursor/rules', 'docs', '.github/workflows']
const EXTRA_ROOT_FILES = [
  'AGENTS.md',
  '.editorconfig',
  '.gitattributes',
  '.prettierrc.yaml',
  'eslint.config.mjs',
  'package.json'
]
const EXTRA_EXTENSIONS = /\.(md|mdc|ya?ml|json|css)$/

const MAX_REPORT = 24

function walkDir(absDir, relPrefix, out) {
  for (const name of readdirSync(absDir)) {
    const rel = relPrefix ? `${relPrefix}/${name}` : name
    const abs = join(absDir, name)
    if (statSync(abs).isDirectory()) {
      if (AUDIT_SKIP_DIR_NAMES.has(name)) {
        continue
      }
      walkDir(abs, rel, out)
      continue
    }
    if (AUDIT_CODE_EXTENSIONS.test(name) || EXTRA_EXTENSIONS.test(name)) {
      out.push(rel.replace(/\\/g, '/'))
    }
  }
}

function collectFiles() {
  const files = []
  for (const root of AUDIT_CODE_ROOTS) {
    const abs = join(REPO_ROOT, root)
    try {
      walkDir(abs, root, files)
    } catch {
      // optional root
    }
  }
  for (const root of EXTRA_ROOTS) {
    const abs = join(REPO_ROOT, root)
    try {
      walkDir(abs, root, files)
    } catch {
      // optional root
    }
  }
  for (const rel of [...AUDIT_CODE_ROOT_FILES, ...EXTRA_ROOT_FILES]) {
    try {
      statSync(join(REPO_ROOT, rel))
      files.push(rel.replace(/\\/g, '/'))
    } catch {
      // optional file
    }
  }
  return [...new Set(files)].sort()
}

function fileHasCr(relPath) {
  const buf = readFileSync(join(REPO_ROOT, relPath))
  return buf.includes(0x0d)
}

const failures = []
for (const rel of collectFiles()) {
  if (fileHasCr(rel)) {
    failures.push(rel)
  }
}

if (failures.length > 0) {
  console.error('[check:line-endings] FAILED — CRLF (\\r) in text files; need LF per .editorconfig')
  console.error('[check:line-endings] fix: npm run format   (or: npx prettier --write <path>)')
  for (const rel of failures.slice(0, MAX_REPORT)) {
    console.error(`  ${rel}`)
  }
  if (failures.length > MAX_REPORT) {
    console.error(`  … and ${failures.length - MAX_REPORT} more`)
  }
  process.exit(1)
}

console.log(`[check:line-endings] OK (${collectFiles().length} files, LF only)`)
