/* eslint-disable @typescript-eslint/explicit-function-return-type */
/**
 * Phase 5: fail on unused `export type { … } from` in src/ (dead re-exports).
 */
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { basename, join, relative } from 'node:path'
import { AUDIT_REPO_ROOT, AUDIT_SKIP_DIR_NAMES } from '../audit-scope.config.mjs'

const SRC_ROOT = join(AUDIT_REPO_ROOT, 'src/main')
const EXPORT_TYPE_RE = /^export type \{([^}]+)\} from ['"]([^'"]+)['"]/gm

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    if (statSync(p).isDirectory()) {
      if (!AUDIT_SKIP_DIR_NAMES.has(name)) {
        walk(p, out)
      }
      continue
    }
    if (p.endsWith('.ts') || p.endsWith('.tsx')) {
      out.push(p)
    }
  }
  return out
}

function parseExportedNames(block) {
  return block
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
}

function moduleImportMatchers(filePath) {
  const rel = relative(AUDIT_REPO_ROOT, filePath).replace(/\\/g, '/')
  const noExt = rel.replace(/\.tsx?$/, '')
  const base = basename(noExt)
  const parts = []
  for (const candidate of [noExt, base]) {
    parts.push(candidate.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
  }
  return parts
}

const srcFiles = walk(SRC_ROOT)
const corpus = srcFiles.map((file) => ({
  file,
  rel: relative(AUDIT_REPO_ROOT, file).replace(/\\/g, '/'),
  text: readFileSync(file, 'utf8')
}))

const failures = []

for (const { file, rel, text } of corpus) {
  const matchers = moduleImportMatchers(file)
  for (const match of text.matchAll(EXPORT_TYPE_RE)) {
    const names = parseExportedNames(match[1])
    for (const name of names) {
      const typeToken = new RegExp(`\\b${name}\\b`)
      let usedFromModule = false
      for (const other of corpus) {
        if (other.file === file) {
          continue
        }
        if (!typeToken.test(other.text)) {
          continue
        }
        const importsModule = matchers.some((escaped) => {
          const fromRe = new RegExp(`from ['"][^'"]*${escaped}['"]`)
          return fromRe.test(other.text)
        })
        if (importsModule) {
          usedFromModule = true
          break
        }
      }
      if (!usedFromModule) {
        failures.push({ rel, name })
      }
    }
  }
}

if (failures.length > 0) {
  console.error(`[audit:dead-type-reexports] ${failures.length} unused type re-export(s):`)
  for (const f of failures) {
    console.error(`  ${f.rel}  ${f.name}`)
  }
  console.error('[audit:dead-type-reexports] remove re-export or import the type from that module')
  process.exit(1)
}

console.log('[audit:dead-type-reexports] OK (src/main type re-exports referenced)')
