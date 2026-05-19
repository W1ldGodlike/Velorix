/**
 * §15 Help — workflow articles cross-link owner + packaged smoke (§19/§21).
 */
import fs from 'node:fs'
import path from 'node:path'

import { REPO_ROOT } from './lib/repo-root.mjs'

const WORKFLOW_HELP_FILES = [
  'Help/downloads-workflow.md',
  'Help/ffmpeg-rail-presets.md',
  'Help/probe-and-inspector-basics.md',
  'Help/workflows-planner-scenarios.md',
  'Help/en/downloads-workflow.md',
  'Help/en/ffmpeg-rail-presets.md',
  'Help/en/probe-and-inspector-basics.md',
  'Help/en/workflows-planner-scenarios.md',
  'Help/knowledge-base-howto.md',
  'Help/en/knowledge-base-howto.md',
  'Help/extract-frames.md',
  'Help/processing-social-presets.md',
  'Help/en/extract-frames.md',
  'Help/en/processing-social-presets.md',
  'Help/processing-history.md',
  'Help/downloads-settings-rail.md',
  'Help/en/processing-history.md',
  'Help/en/downloads-settings-rail.md',
  'Help/downloads-dragdrop.md',
  'Help/processing-url-combo.md',
  'Help/ffmpeg-terminal-hints.md',
  'Help/en/downloads-dragdrop.md',
  'Help/en/processing-url-combo.md',
  'Help/en/ffmpeg-terminal-hints.md',
  'Help/processing-advanced-fields.md',
  'Help/en/processing-advanced-fields.md'
]

const SNIPPETS = [
  'owner-manual-smoke.md',
  'packaged-windows-smoke.md',
  '§21 e2e',
  'e2e <id>:',
  'releaseSmoke:'
]

let failed = false
for (const rel of WORKFLOW_HELP_FILES) {
  const file = path.join(REPO_ROOT, rel)
  const text = fs.readFileSync(file, 'utf8')
  const missing = SNIPPETS.filter((s) => !text.includes(s))
  if (missing.length > 0) {
    failed = true
    console.error(`[check:help-workflow-smoke-crosslinks] ${rel} missing: ${missing.join(', ')}`)
  }
}

if (failed) {
  process.exit(1)
}
console.log(
  `[check:help-workflow-smoke-crosslinks] OK (${WORKFLOW_HELP_FILES.length} files; ${SNIPPETS.length} snippets)`
)
