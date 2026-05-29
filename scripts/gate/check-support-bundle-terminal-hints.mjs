/**
 * §18 Support ZIP — diagnostics.txt `terminalHints:` ↔ terminal-contract-hints-meta.
 */
import fs from 'node:fs'
import path from 'node:path'

import {
  TERMINAL_CONTRACT_HINTS_ABOUT_SUPPORT_ZIP_LOCALE_KEY,
  TERMINAL_CONTRACT_HINTS_META_MODULE,
  TERMINAL_CONTRACT_HINTS_SHARDS_GUARD_NPM_SCRIPT,
  TERMINAL_CONTRACT_HINTS_SUPPORT_BUNDLE_SOURCE_PATHS,
  TERMINAL_CONTRACT_HINTS_SUPPORT_ZIP_UI_SOURCE_PATHS,
  TERMINAL_CONTRACT_HINTS_SUPPORT_ZIP_SECTION_HEADING,
  formatTerminalContractHintsSupportZipLines
} from '../../src/shared/terminal-contract-hints-meta.ts'
import { REPO_ROOT } from '../lib/repo-root.mjs'

const LOG_PREFIX = 'check:support-bundle-terminal-hints'

let failed = false

const zipLines = formatTerminalContractHintsSupportZipLines()
if (zipLines.length < 4) {
  failed = true
  console.error(
    `[${LOG_PREFIX}] formatTerminalContractHintsSupportZipLines expected ≥4 lines, got ${zipLines.length}`
  )
}
for (const snippet of [
  TERMINAL_CONTRACT_HINTS_META_MODULE,
  TERMINAL_CONTRACT_HINTS_SHARDS_GUARD_NPM_SCRIPT
]) {
  if (!zipLines.some((line) => line.includes(snippet))) {
    failed = true
    console.error(`[${LOG_PREFIX}] formatTerminalContractHintsSupportZipLines missing: ${snippet}`)
  }
}

const [bundleRel, diagnosticsRel] = TERMINAL_CONTRACT_HINTS_SUPPORT_BUNDLE_SOURCE_PATHS
const bundleText = fs.readFileSync(path.join(REPO_ROOT, bundleRel), 'utf8')
const diagnosticsText = fs.readFileSync(path.join(REPO_ROOT, diagnosticsRel), 'utf8')

if (!bundleText.includes('TERMINAL_CONTRACT_HINTS_SUPPORT_ZIP_SECTION_HEADING')) {
  failed = true
  console.error(
    `[${LOG_PREFIX}] ${bundleRel} must use TERMINAL_CONTRACT_HINTS_SUPPORT_ZIP_SECTION_HEADING`
  )
}
if (!bundleText.includes('terminalHintsLines')) {
  failed = true
  console.error(`[${LOG_PREFIX}] ${bundleRel} must emit terminalHintsLines`)
}
if (!diagnosticsText.includes('formatTerminalContractHintsSupportZipLines')) {
  failed = true
  console.error(
    `[${LOG_PREFIX}] ${diagnosticsRel} must call formatTerminalContractHintsSupportZipLines()`
  )
}
if (!diagnosticsText.includes('terminalHintsLines')) {
  failed = true
  console.error(`[${LOG_PREFIX}] ${diagnosticsRel} must set terminalHintsLines`)
}

for (const rel of TERMINAL_CONTRACT_HINTS_SUPPORT_ZIP_UI_SOURCE_PATHS) {
  const uiSource = fs.readFileSync(path.join(REPO_ROOT, rel), 'utf8')
  if (!uiSource.includes(TERMINAL_CONTRACT_HINTS_ABOUT_SUPPORT_ZIP_LOCALE_KEY)) {
    failed = true
    console.error(
      `[${LOG_PREFIX}] ${rel} must reference ${TERMINAL_CONTRACT_HINTS_ABOUT_SUPPORT_ZIP_LOCALE_KEY} (uiText)`
    )
  }
}

if (failed) {
  process.exit(1)
}

console.log(
  `[${LOG_PREFIX}] OK (${TERMINAL_CONTRACT_HINTS_SUPPORT_ZIP_SECTION_HEADING} ↔ ${TERMINAL_CONTRACT_HINTS_META_MODULE}; ${bundleRel})`
)
