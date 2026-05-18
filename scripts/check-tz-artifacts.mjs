/* eslint-disable @typescript-eslint/explicit-function-return-type */
/**
 * Сверка ключевых артефактов FLUXALLOY_TZ с репозиторием (§2.2 / §3 / IPC).
 */
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

import { REPO_ROOT } from './lib/repo-root.mjs'

const TZ_PATH = join(REPO_ROOT, 'FLUXALLOY_TZ.md')
const IPC_PATH = join(REPO_ROOT, 'src', 'shared', 'ipc-channels.ts')

const REQUIRED_PATHS = [
  'src/main/index.ts',
  'src/preload/index.ts',
  'src/renderer/src/stores/app-shell-store.ts',
  'src/shared/renderer-state-approach.ts',
  'Data/trusted_hashes.json',
  'locales/ru/common.json',
  'locales/en/common.json'
]

const TZ_KEYWORDS = ['Electron', 'React', 'TypeScript', 'ffmpeg', 'yt-dlp', 'ffprobe']

function main() {
  const violations = []
  if (!existsSync(TZ_PATH)) {
    violations.push('missing FLUXALLOY_TZ.md')
  } else {
    const tz = readFileSync(TZ_PATH, 'utf8')
    for (const kw of TZ_KEYWORDS) {
      if (!tz.includes(kw)) {
        violations.push(`FLUXALLOY_TZ.md: missing keyword ${kw}`)
      }
    }
  }

  for (const rel of REQUIRED_PATHS) {
    if (!existsSync(join(REPO_ROOT, rel))) {
      violations.push(`missing required path: ${rel}`)
    }
  }

  const ipc = readFileSync(IPC_PATH, 'utf8')
  for (const token of ['fluxalloy:settings', 'fluxalloy:export', 'fluxalloy:downloads']) {
    if (!ipc.includes(token)) {
      violations.push(`ipc-channels.ts: missing ${token}`)
    }
  }

  const approach = readFileSync(
    join(REPO_ROOT, 'src', 'shared', 'renderer-state-approach.ts'),
    'utf8'
  )
  if (!approach.includes("RENDERER_STATE_APPROACH = 'zustand'")) {
    violations.push('renderer-state-approach.ts: expected zustand')
  }

  if (violations.length > 0) {
    console.error('[check-tz-artifacts] violations:')
    for (const v of violations) {
      console.error(`  ${v}`)
    }
    process.exit(1)
  }
  console.log('[check-tz-artifacts] OK')
}

main()
