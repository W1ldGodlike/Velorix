/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { readdirSync } from 'node:fs'
import { join } from 'node:path'

import { TERMINAL_CONTRACT_HINTS_SHARD_TOTAL_PART_COUNT } from '../src/shared/terminal-contract-hints-meta.ts'
import { REPO_ROOT } from './lib/repo-root.mjs'

const sharedDir = join(REPO_ROOT, 'src/shared')

/** Hint shard files that contain `summary:` strings (post terminal-contract split). */
export function listTerminalContractHintFiles() {
  const names = readdirSync(sharedDir)
    .filter((name) => /^terminal-contract-hints-(downloads|preview-media)-\d+\.ts$/.test(name))
    .sort((a, b) => a.localeCompare(b, 'en'))
  if (names.length !== TERMINAL_CONTRACT_HINTS_SHARD_TOTAL_PART_COUNT) {
    throw new Error(
      `listTerminalContractHintFiles: expected ${TERMINAL_CONTRACT_HINTS_SHARD_TOTAL_PART_COUNT} shards, found ${names.length} in src/shared`
    )
  }
  return names.map((name) => join(sharedDir, name))
}
