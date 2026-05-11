/* eslint-disable @typescript-eslint/explicit-function-return-type */
/**
 * Запуск `prepare-engines-win.mjs` с `FLUXALLOY_ENGINES_FORCE=1` (§19): перекачать движки в `bin/`,
 * даже если exe уже есть (актуально после смены upstream `latest` или битого кэша CI).
 */
import { spawnSync } from 'node:child_process'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = dirname(fileURLToPath(import.meta.url))
const script = join(rootDir, 'prepare-engines-win.mjs')

if (process.argv.includes('--help')) {
  console.log(`engines:prepare:win:force — то же, что prepare-engines-win с FLUXALLOY_ENGINES_FORCE=1.

Подробности: npm run engines:prepare:win -- --help`)
  process.exit(0)
}

process.env.FLUXALLOY_ENGINES_FORCE = '1'
const result = spawnSync(process.execPath, [script], {
  stdio: 'inherit',
  env: process.env,
  cwd: join(rootDir, '..')
})

process.exit(result.status === null ? 1 : result.status)
