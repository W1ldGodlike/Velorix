/* eslint-disable @typescript-eslint/explicit-function-return-type */
/**
 * §8 — guard: `npm run locales:terminal-summaries-ru` дважды подряд даёт 0 replacements и 0 gloss.
 */
import { spawnSync } from 'node:child_process'

import { REPO_ROOT } from './lib/repo-root.mjs'

function parseCounts(output) {
  const m = output.match(/replacements:\s*(\d+)\s*flux \(поле\) gloss:\s*(\d+)/)
  if (!m) {
    return null
  }
  return { replacements: Number.parseInt(m[1], 10), gloss: Number.parseInt(m[2], 10) }
}

function runApplyPass(passLabel) {
  const result = spawnSync(process.execPath, ['scripts/apply-terminal-summary-ru.mjs'], {
    cwd: REPO_ROOT,
    encoding: 'utf8',
    windowsHide: true
  })
  const output = `${result.stdout ?? ''}${result.stderr ?? ''}`
  const counts = parseCounts(output)
  if (result.status !== 0 || counts === null) {
    console.error(`[check:terminal-summaries-ru] pass ${passLabel} failed (exit ${result.status ?? '?'})`)
    console.error(output)
    process.exit(1)
  }
  if (counts.replacements !== 0 || counts.gloss !== 0) {
    console.error(
      `[check:terminal-summaries-ru] pass ${passLabel}: expected replacements=0 gloss=0, got`,
      counts
    )
    process.exit(1)
  }
}

runApplyPass(1)
runApplyPass(2)
console.log('[check:terminal-summaries-ru] OK (2 passes, 0 replacements, 0 gloss)')
