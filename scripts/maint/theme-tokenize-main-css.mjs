/**
 * §5 — прогон всех tokenize-скриптов для main.css (spacing, font-size, line-height).
 */
import { execSync } from 'node:child_process'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..', '..')

const steps = [
  'apply-theme-spacing-rem-tokenize.mjs',
  'apply-theme-font-size-rem-tokenize.mjs',
  'apply-theme-line-height-tokenize.mjs'
]

const cmd = steps.map((s) => `npx tsx scripts/maint/${s}`).join(' && ')
console.log(`[theme-tokenize-main-css] ${cmd}`)
execSync(cmd, { cwd: repoRoot, stdio: 'inherit', shell: true })

console.log('[theme-tokenize-main-css] done')
