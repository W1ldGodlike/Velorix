/* eslint-disable @typescript-eslint/explicit-function-return-type */
/**
 * UI-программа: пока gate open — временные артефакты на месте;
 * после F — ноль мусора программы; постоянно — Velorix-agent (UI §) + этот check.
 */
import fs from 'node:fs'
import path from 'node:path'
import { readRepoUtf8, REPO_ROOT } from '../lib/repo-root.mjs'

/** Variant A: hash-bootstrap pop-out routes must not return in renderer entrypoints. */
const RENDERER_HASH_BOOTSTRAP_RE =
  /#(?:downloads|inspector)\b|location\.hash\s*[=!].*(?:downloads|inspector)/i

const RENDERER_HASH_BOOTSTRAP_SCAN_ROOTS = [
  'src/renderer/src/main.tsx',
  'src/renderer/src/App.tsx',
  'src/renderer/src/app-lazy-panels.tsx'
]

const PLAN_PATH = 'docs/UI_CONSOLIDATION_AND_COPY_PROGRAM.md'
const PROGRAM_GATE_RULE = '.cursor/rules/VELORIX-program-gate.mdc'
const UI_SURFACES_RULE = '.cursor/rules/velorix-agent.mdc'
const CHECKLIST_PATH = 'docs/IMPLEMENTATION_NEON_CHECKLIST.md'
const QUIET_CHECK_PATH = 'scripts/gate/run-quiet-check.mjs'
const PACKAGE_JSON_PATH = 'package.json'

const PROGRAM_GATE_CHECK_SCRIPT = 'scripts/check-program-gate.mjs'
const PROGRAM_GATE_TEST = 'tests/scripts/check-program-gate.test.ts'

const GATE_OPEN_RE = /^program_gate:\s*open\s*$/im
const GATE_CLOSED_RE = /^program_gate:\s*closed\s*$/im
const SPRINT_HEADING_RE = /^## Ближайший TODO спринта\s*$/m

/** Временные артефакты разовой программы — после F в репо быть не должно */
const PROGRAM_TEMP_PATHS = [
  PLAN_PATH,
  PROGRAM_GATE_RULE,
  PROGRAM_GATE_CHECK_SCRIPT,
  PROGRAM_GATE_TEST
]

const LEGACY_PRODUCT_PATHS = [
  'src/main/downloads-window-html.ts',
  'src/main/downloads-window-html-layout.ts',
  'src/preload/downloads-window.ts',
  'src/shared/downloads-window-ui-strings-ru.ts',
  'src/shared/downloads-window-ui-strings-en.ts',
  'src/shared/downloads-window-ui-locale.ts',
  'src/shared/downloads-window-ui-locale-types.ts'
]

/** @type {{ rel: string, patterns: RegExp[] }[]} */
const FORBIDDEN_TEXT_WHEN_PROGRAM_ENDED = [
  {
    rel: 'AGENTS.md',
    patterns: [
      /VELORIX-program-gate\.mdc/i,
      /PROGRAM GATE.*открыт/i,
      /UI_CONSOLIDATION_AND_COPY_PROGRAM/i
    ]
  },
  {
    rel: 'scripts/cursor-automation/prompts/agent-contract.txt',
    patterns: [/program_gate:\s*open/i, /check:program-gate/i, /VELORIX-program-gate/i]
  },
  {
    rel: 'scripts/cursor-automation/prompts/continue.txt',
    patterns: [/program_gate:\s*open/i, /VELORIX-program-gate/i, /check:program-gate/i]
  },
  {
    rel: '.cursor/rules/velorix-continue.mdc',
    patterns: [/PROGRAM GATE открыт/i]
  },
  {
    rel: '.cursor/rules/velorix-core.mdc',
    patterns: [/PROGRAM GATE open/i, /UI_CONSOLIDATION_AND_COPY_PROGRAM/i]
  }
]

/** @param {string} rel */
function repoPathExists(rel) {
  return fs.existsSync(path.join(REPO_ROOT, rel))
}

/** @param {string} rel */
function readRepoOptional(rel) {
  const full = path.join(REPO_ROOT, rel)
  if (!fs.existsSync(full)) {
    return null
  }
  return fs.readFileSync(full, 'utf8')
}

/** @param {string | null} planText */
function parseGateStatus(planText) {
  if (!planText) {
    return 'no-plan'
  }
  if (GATE_OPEN_RE.test(planText)) {
    return 'open'
  }
  if (GATE_CLOSED_RE.test(planText)) {
    return 'closed'
  }
  return 'unknown'
}

/** @param {string} checklistText */
function extractSprintSection(checklistText) {
  const headingMatch = checklistText.match(SPRINT_HEADING_RE)
  if (!headingMatch || headingMatch.index === undefined) {
    return ''
  }
  const start = headingMatch.index + headingMatch[0].length
  const after = checklistText.slice(start)
  const sectionEnd = after.search(/^## /m)
  return sectionEnd === -1 ? after : after.slice(0, sectionEnd)
}

/** @param {string} checklistText */
function sprintMentionsClosurePhases(checklistText) {
  const section = extractSprintSection(checklistText)
  return (
    /PROGRAM\s+GATE[^\n]*фаза\s+F/i.test(section) && /PROGRAM\s+GATE[^\n]*фаза\s+G/i.test(section)
  )
}

/** @param {string} checklistText */
function sprintHasProgramGateMarkers(checklistText) {
  const section = extractSprintSection(checklistText)
  return /PROGRAM\s+GATE/i.test(section)
}

function main() {
  const errors = []
  const planText = readRepoOptional(PLAN_PATH)
  const gate = parseGateStatus(planText)
  const programEnded = gate === 'closed' || gate === 'no-plan'
  const hasProgramGateRule = repoPathExists(PROGRAM_GATE_RULE)
  const hasUiSurfacesRule = repoPathExists(UI_SURFACES_RULE)
  const quietText = readRepoUtf8(QUIET_CHECK_PATH)
  const packageText = readRepoUtf8(PACKAGE_JSON_PATH)
  const quietHasProgramGate =
    quietText.includes("'check:program-gate'") || /"check:program-gate"/.test(quietText)
  const packageHasProgramGate = /"check:program-gate"/.test(packageText)
  const checklistText = readRepoUtf8(CHECKLIST_PATH)

  if (!hasUiSurfacesRule) {
    errors.push(`missing permanent rule ${UI_SURFACES_RULE}`)
  }

  if (gate === 'open') {
    if (!planText) {
      errors.push('gate open: plan file missing')
    }
    if (!hasProgramGateRule) {
      errors.push(`gate open: missing temporary ${PROGRAM_GATE_RULE}`)
    }
    if (!quietHasProgramGate) {
      errors.push('gate open: check:program-gate must stay in check:quiet')
    }
    if (!packageHasProgramGate) {
      errors.push('gate open: check:program-gate must stay in package.json')
    }
    if (!sprintMentionsClosurePhases(checklistText)) {
      errors.push('gate open: sprint TODO must include PROGRAM GATE phases F and G')
    }
    const planBody = planText ?? ''
    if (!/\|\s*\*\*F\*\*/.test(planBody) || !/\|\s*\*\*G\*\*/.test(planBody)) {
      errors.push('gate open: plan progress table must list phases F and G')
    }
  }

  if (programEnded) {
    for (const rel of PROGRAM_TEMP_PATHS) {
      if (repoPathExists(rel)) {
        errors.push(`program ended: remove temporary artifact ${rel}`)
      }
    }
    if (hasProgramGateRule) {
      errors.push(`program ended: remove ${PROGRAM_GATE_RULE}`)
    }
    if (quietHasProgramGate) {
      errors.push('program ended: remove check:program-gate from check:quiet')
    }
    if (packageHasProgramGate) {
      errors.push('program ended: remove check:program-gate from package.json')
    }
    if (sprintHasProgramGateMarkers(checklistText)) {
      errors.push('program ended: sprint TODO must not contain PROGRAM GATE')
    }
    for (const rel of LEGACY_PRODUCT_PATHS) {
      if (repoPathExists(rel)) {
        errors.push(`program ended: legacy product file still present: ${rel}`)
      }
    }
    const mainDownloads = readRepoOptional('src/main/windows/downloads-window.ts')
    if (mainDownloads && /buildDownloadsHtml|data:text\/html/i.test(mainDownloads)) {
      errors.push(
        'program ended: downloads-window.ts still uses buildDownloadsHtml or data:text/html'
      )
    }
    for (const rel of RENDERER_HASH_BOOTSTRAP_SCAN_ROOTS) {
      const text = readRepoOptional(rel)
      if (text && RENDERER_HASH_BOOTSTRAP_RE.test(text)) {
        errors.push(`program ended: ${rel} still references #downloads/#inspector hash bootstrap`)
      }
    }
    for (const { rel, patterns } of FORBIDDEN_TEXT_WHEN_PROGRAM_ENDED) {
      const text = readRepoOptional(rel)
      if (!text) {
        continue
      }
      for (const pattern of patterns) {
        if (pattern.test(text)) {
          errors.push(`program ended: ${rel} still references program machinery (${pattern})`)
          break
        }
      }
    }
    const sources = readRepoOptional('docs/SOURCES_OF_TRUTH.md')
    if (sources && /program_gate:\s*open|VELORIX-program-gate/i.test(sources)) {
      errors.push('program ended: docs/SOURCES_OF_TRUTH.md still documents open PROGRAM GATE')
    }
  }

  if (gate === 'closed') {
    errors.push(`program ended: delete ${PLAN_PATH} (do not leave program_gate: closed)`)
  }

  if (gate === 'unknown' && planText) {
    errors.push(`${PLAN_PATH}: set program_gate: open or delete file after phase F`)
  }

  if (errors.length > 0) {
    console.error('[ui-surfaces-guard] FAILED:')
    for (const e of errors) {
      console.error(`  - ${e}`)
    }
    process.exit(1)
  }

  console.log(`[ui-surfaces-guard] OK (gate=${gate})`)
}

main()
