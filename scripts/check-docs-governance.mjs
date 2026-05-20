/* eslint-disable @typescript-eslint/explicit-function-return-type */
/**
 * Navigation docs: no broken relative links; no references to deleted governance/UI legacy paths.
 * IMPLEMENTATION_JOURNAL.md is excluded (historical mentions allowed).
 */
import fs from 'node:fs'
import path from 'node:path'
import { REPO_ROOT } from './lib/repo-root.mjs'

const JOURNAL_PATH = 'IMPLEMENTATION_JOURNAL.md'
const MAX_ALWAYS_APPLY_LINES = 120

/** Глоссарий удалённых артефактов — не считать «навигацией» */
const FORBIDDEN_TEXT_EXEMPT = new Set(['.cursor/rules/fluxalloy-rules-explicit.mdc'])

/** @type {string[]} */
const SCAN_ROOTS = ['docs', 'AGENTS.md', 'README.md', '.cursor/rules', '.cursor/skills']

/** Markdown / text to scan for forbidden substrings */
const FORBIDDEN_TEXT = [
  { pattern: /scripts\/archive\//, label: 'scripts/archive/' },
  { pattern: /check:zustand-migration-gate/, label: 'check:zustand-migration-gate' },
  { pattern: /fluxalloy-program-gate/, label: 'fluxalloy-program-gate' },
  { pattern: /check-program-gate/, label: 'check-program-gate' },
  { pattern: /UI_CONSOLIDATION_AND_COPY_PROGRAM/, label: 'UI_CONSOLIDATION_AND_COPY_PROGRAM' },
  { pattern: /continue_count\s*%\s*5/, label: 'continue_count % 5 (use J-NNN cadence)' },
  { pattern: /continue_count\s*%\s*10/, label: 'continue_count % 10 (use J-NNN cadence)' },
  { pattern: /fluxalloy-marathon/, label: 'fluxalloy-marathon (renamed fluxalloy-continue)' },
  { pattern: /не коммитить|не пушить/, label: 'cadence override removed (J-1570)' }
]

/** Paths removed in GOV B / J-984 — must not appear as markdown link targets */
const FORBIDDEN_LINK_TARGETS = [
  '.cursor/rules/fluxalloy-marathon.mdc',
  '.cursor/rules/fluxalloy-iteration-batch.mdc',
  '.cursor/rules/fluxalloy-project-audit.mdc',
  '.cursor/rules/fluxalloy-ui-surfaces.mdc',
  '.cursor/rules/fluxalloy-agent-runtime.mdc',
  '.cursor/rules/fluxalloy-program-gate.mdc',
  'docs/AGENT_MARATHON.md',
  'docs/AGENT_OPERATIONAL_NOTES.md',
  'docs/AGENT_SESSION_HANDOFF.md',
  'docs/UI_CONSOLIDATION_AND_COPY_PROGRAM.md',
  'docs/PROJECT_WIDE_AUDIT_REFACTOR_PLAN.md',
  'docs/ZUSTAND_MIGRATION_CHECKLIST_DONE.md',
  'scripts/archive/',
  'src/main/downloads-window-html.ts',
  'src/preload/downloads-window.ts'
]

const MARKDOWN_LINK_RE = /\[[^\]]*\]\(([^)]+)\)/g
const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---/

/** @param {string} dir */
function walkMarkdownFiles(dir, out) {
  if (!fs.existsSync(dir)) {
    return
  }
  const stat = fs.statSync(dir)
  if (stat.isFile()) {
    if (/\.(md|mdc|txt)$/i.test(dir)) {
      out.push(dir)
    }
    return
  }
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name)
    const s = fs.statSync(full)
    if (s.isDirectory()) {
      walkMarkdownFiles(full, out)
    } else if (/\.(md|mdc)$/i.test(name)) {
      out.push(full)
    }
  }
}

/** @returns {string[]} */
function collectNavFiles() {
  /** @type {string[]} */
  const abs = []
  for (const root of SCAN_ROOTS) {
    const full = path.join(REPO_ROOT, root)
    if (!fs.existsSync(full)) {
      continue
    }
    const stat = fs.statSync(full)
    if (stat.isFile()) {
      abs.push(full)
    } else {
      walkMarkdownFiles(full, abs)
    }
  }
  return abs
    .map((p) => path.relative(REPO_ROOT, p).replace(/\\/g, '/'))
    .filter((rel) => rel !== JOURNAL_PATH)
}

/**
 * @param {string} href
 * @param {string} fromRel
 */
function resolveRepoTarget(href, fromRel) {
  const raw = href.trim()
  if (!raw || /^https?:\/\//i.test(raw) || /^mailto:/i.test(raw)) {
    return null
  }
  const noAnchor = raw.split('#')[0]
  if (!noAnchor) {
    return null
  }
  const fromDir = path.dirname(fromRel)
  const normalized = path.normalize(path.join(fromDir, noAnchor)).replace(/\\/g, '/')
  if (normalized.startsWith('..')) {
    return null
  }
  return normalized
}

/** @param {string} rel */
function targetExists(rel) {
  const full = path.join(REPO_ROOT, rel)
  if (fs.existsSync(full)) {
    return true
  }
  if (fs.existsSync(`${full}.md`)) {
    return true
  }
  if (fs.existsSync(`${full}.mdc`)) {
    return true
  }
  return false
}

/** @param {string} rel */
function readUtf8(rel) {
  return fs.readFileSync(path.join(REPO_ROOT, rel), 'utf8')
}

/** @param {string} rel */
function checkForbiddenText(rel) {
  /** @type {string[]} */
  const hits = []
  if (FORBIDDEN_TEXT_EXEMPT.has(rel)) {
    return hits
  }
  const text = readUtf8(rel)
  for (const { pattern, label } of FORBIDDEN_TEXT) {
    if (pattern.test(text)) {
      hits.push(label)
    }
  }
  for (const target of FORBIDDEN_LINK_TARGETS) {
    const needle = target.replace(/\\/g, '/')
    if (text.includes(`](${needle})`) || text.includes(`](${needle.replace(/^\.\//, '')})`)) {
      hits.push(`link→${needle}`)
    }
  }
  return hits
}

/** @param {string} rel */
function checkLinks(rel) {
  /** @type {string[]} */
  const broken = []
  const text = readUtf8(rel)
  let match
  MARKDOWN_LINK_RE.lastIndex = 0
  while ((match = MARKDOWN_LINK_RE.exec(text)) !== null) {
    const href = match[1]
    const target = resolveRepoTarget(href, rel)
    if (!target) {
      continue
    }
    const norm = target.replace(/\\/g, '/')
    for (const forbidden of FORBIDDEN_LINK_TARGETS) {
      if (norm === forbidden || norm.startsWith(forbidden)) {
        broken.push(`${href} (legacy path ${forbidden})`)
        break
      }
    }
    if (!targetExists(target)) {
      broken.push(href)
    }
  }
  return broken
}

/** @param {string} rel */
function checkAlwaysApplySize(rel) {
  if (!rel.endsWith('.mdc')) {
    return null
  }
  const text = readUtf8(rel)
  const fm = text.match(FRONTMATTER_RE)
  if (!fm) {
    return null
  }
  if (!/^alwaysApply:\s*true\s*$/im.test(fm[1])) {
    return null
  }
  const lines = text.split(/\r?\n/).length
  if (lines > MAX_ALWAYS_APPLY_LINES) {
    return lines
  }
  return null
}

function main() {
  const errors = []
  const files = collectNavFiles()

  for (const rel of files) {
    for (const label of checkForbiddenText(rel)) {
      errors.push(`${rel}: forbidden reference (${label})`)
    }
    const broken = checkLinks(rel)
    if (broken.length > 0) {
      errors.push(`${rel}: broken or legacy links: ${broken.slice(0, 8).join(', ')}`)
    }
    const lineCount = checkAlwaysApplySize(rel)
    if (lineCount !== null) {
      errors.push(
        `${rel}: alwaysApply rule has ${lineCount} lines (max ${MAX_ALWAYS_APPLY_LINES}); split or move to skill`
      )
    }
  }

  if (errors.length > 0) {
    console.error('[docs-governance] FAILED:')
    for (const e of errors) {
      console.error(`  - ${e}`)
    }
    process.exit(1)
  }

  console.log(`[docs-governance] OK (${files.length} navigation files)`)
}

main()
