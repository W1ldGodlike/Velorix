/**
 * Phase 7.2: shared `*-contract.ts` files must match the domain table in ARCHITECTURE.md.
 */
import { readdirSync } from 'node:fs'
import { join } from 'node:path'

import { REPO_ROOT } from './lib/repo-root.mjs'

/** Root-level contract modules (one domain or deliberate sub-split). */
const ALLOWED_CONTRACT_FILES = new Set([
  'about-contract.ts',
  'diagnostics-contract.ts',
  'downloads-log-contract.ts',
  'engine-contract.ts',
  'engine-download-contract.ts',
  'engine-update-check-contract.ts',
  'ffmpeg-export-batch-contract.ts',
  'ffmpeg-export-benchmark-contract.ts',
  'ffmpeg-export-contract.ts',
  'ffmpeg-export-resolve-contract.ts',
  'ffmpeg-snapshot-contract.ts',
  'ffmpeg-frames-extract-contract.ts',
  'ffmpeg-cover-extract-contract.ts',
  'external-filter-script-contract.ts',
  'media-utilities-contract.ts',
  'ffprobe-contract.ts',
  'knowledge-contract.ts',
  'preview-dialog-contract.ts',
  'processing-history-contract.ts',
  'save-text-dialog-contract.ts',
  'settings-contract.ts',
  'settings-backup-contract.ts',
  'ytdlp-download-contract.ts',
  'ytdlp-history-contract.ts',
  'workflow-scenario-contract.ts',
  'workflow-watch-folder-contract.ts',
  'scheduled-task-contract.ts'
])

const ALLOWED_TERMINAL_AUX = new Set(['terminal-contract.ts', 'terminal-contract-types.ts'])

const TERMINAL_HINT_SHARD_RE = /^terminal-contract-hints-(downloads|preview-media)(|-\d{2})\.ts$/

const sharedDir = join(REPO_ROOT, 'src/shared')
const unknown = []

for (const name of readdirSync(sharedDir)) {
  if (!name.endsWith('.ts')) {
    continue
  }
  if (name === 'ipc-channels.ts') {
    continue
  }
  if (ALLOWED_CONTRACT_FILES.has(name) || ALLOWED_TERMINAL_AUX.has(name)) {
    continue
  }
  if (TERMINAL_HINT_SHARD_RE.test(name)) {
    continue
  }
  if (name.endsWith('-contract.ts')) {
    unknown.push(name)
  }
}

if (unknown.length > 0) {
  console.error('[audit:shared-contracts] FAIL unknown *-contract.ts in src/shared/:')
  for (const name of unknown.sort()) {
    console.error(`  ${name}`)
  }
  console.error(
    '[audit:shared-contracts] add domain to docs/ARCHITECTURE.md + ALLOWED_CONTRACT_FILES in audit-shared-contracts.mjs'
  )
  process.exit(1)
}

console.log(
  `[audit:shared-contracts] OK (${ALLOWED_CONTRACT_FILES.size} primary contracts + terminal hints shards)`
)
