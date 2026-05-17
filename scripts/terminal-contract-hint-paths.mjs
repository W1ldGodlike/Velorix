/* eslint-disable @typescript-eslint/explicit-function-return-type */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const sharedDir = path.join(__dirname, '../src/shared')

/** Hint shard files that contain \`summary:\` strings (post terminal-contract split). */
export function listTerminalContractHintFiles() {
  return fs
    .readdirSync(sharedDir)
    .filter((name) => /^terminal-contract-hints-(downloads|preview-media)-\d+\.ts$/.test(name))
    .sort((a, b) => a.localeCompare(b, 'en'))
    .map((name) => path.join(sharedDir, name))
}
