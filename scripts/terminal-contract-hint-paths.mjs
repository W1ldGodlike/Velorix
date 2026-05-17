/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { readdirSync } from 'node:fs'
import { join } from 'node:path'

import { REPO_ROOT } from './lib/repo-root.mjs'

const sharedDir = join(REPO_ROOT, 'src/shared')

/** Hint shard files that contain `summary:` strings (post terminal-contract split). */
export function listTerminalContractHintFiles() {
  return readdirSync(sharedDir)
    .filter((name) => /^terminal-contract-hints-(downloads|preview-media)-\d+\.ts$/.test(name))
    .sort((a, b) => a.localeCompare(b, 'en'))
    .map((name) => join(sharedDir, name))
}
