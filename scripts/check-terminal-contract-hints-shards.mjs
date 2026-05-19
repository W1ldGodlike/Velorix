/**
 * §8 — shard files + hint counts (`terminal-contract-hints-meta.ts`).
 */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

import {
  TERMINAL_CONTRACT_HINTS_DOWNLOADS_HINT_COUNT,
  TERMINAL_CONTRACT_HINTS_DOWNLOADS_PART_COUNT,
  TERMINAL_CONTRACT_HINTS_PREVIEW_MEDIA_HINT_COUNT,
  TERMINAL_CONTRACT_HINTS_PREVIEW_MEDIA_PART_COUNT,
  formatTerminalContractHintsDownloadsShardBasename,
  formatTerminalContractHintsPreviewMediaShardBasename
} from '../src/shared/terminal-contract-hints-meta.ts'
import { listTerminalContractHintFiles } from './terminal-contract-hint-paths.mjs'
import { REPO_ROOT } from './lib/repo-root.mjs'

const sharedDir = join(REPO_ROOT, 'src/shared')
const missing = []

function countHintEntries(filePath) {
  const text = readFileSync(filePath, 'utf8')
  const matches = text.match(/^\s+tool:/gm)
  return matches?.length ?? 0
}

for (let part = 1; part <= TERMINAL_CONTRACT_HINTS_DOWNLOADS_PART_COUNT; part++) {
  const name = formatTerminalContractHintsDownloadsShardBasename(part)
  if (!existsSync(join(sharedDir, name))) {
    missing.push(name)
  }
}

for (let part = 1; part <= TERMINAL_CONTRACT_HINTS_PREVIEW_MEDIA_PART_COUNT; part++) {
  const name = formatTerminalContractHintsPreviewMediaShardBasename(part)
  if (!existsSync(join(sharedDir, name))) {
    missing.push(name)
  }
}

if (missing.length > 0) {
  console.error(`[check:terminal-contract-hints-shards] missing shard files: ${missing.join(', ')}`)
  process.exit(1)
}

const listed = listTerminalContractHintFiles()
const expectedShardCount =
  TERMINAL_CONTRACT_HINTS_DOWNLOADS_PART_COUNT + TERMINAL_CONTRACT_HINTS_PREVIEW_MEDIA_PART_COUNT
if (listed.length !== expectedShardCount) {
  console.error(
    `[check:terminal-contract-hints-shards] listTerminalContractHintFiles: expected ${expectedShardCount}, got ${listed.length}`
  )
  process.exit(1)
}

let downloadsCount = 0
let previewCount = 0
for (const filePath of listed) {
  const base = filePath.replace(/\\/g, '/').split('/').pop() ?? ''
  const n = countHintEntries(filePath)
  if (base.includes('downloads-')) {
    downloadsCount += n
  } else if (base.includes('preview-media-')) {
    previewCount += n
  }
}

if (downloadsCount !== TERMINAL_CONTRACT_HINTS_DOWNLOADS_HINT_COUNT) {
  console.error(
    `[check:terminal-contract-hints-shards] downloads hints: expected ${TERMINAL_CONTRACT_HINTS_DOWNLOADS_HINT_COUNT}, counted ${downloadsCount} (bump terminal-contract-hints-meta.ts)`
  )
  process.exit(1)
}

if (previewCount !== TERMINAL_CONTRACT_HINTS_PREVIEW_MEDIA_HINT_COUNT) {
  console.error(
    `[check:terminal-contract-hints-shards] preview hints: expected ${TERMINAL_CONTRACT_HINTS_PREVIEW_MEDIA_HINT_COUNT}, counted ${previewCount} (bump terminal-contract-hints-meta.ts)`
  )
  process.exit(1)
}

console.log(
  `[check:terminal-contract-hints-shards] OK (${expectedShardCount} shards; ${TERMINAL_CONTRACT_HINTS_DOWNLOADS_HINT_COUNT}+${TERMINAL_CONTRACT_HINTS_PREVIEW_MEDIA_HINT_COUNT} hints)`
)
