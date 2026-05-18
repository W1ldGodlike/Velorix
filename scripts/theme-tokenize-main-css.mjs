/**
 * §5 — прогон всех tokenize-скриптов для main.css (spacing, font-size, line-height).
 */
import { execSync } from 'node:child_process'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..')

const steps = [
  'apply-theme-spacing-rem-tokenize.mjs',
  'apply-theme-font-size-rem-tokenize.mjs',
  'apply-theme-line-height-tokenize.mjs'
]

for (const script of steps) {
  console.log(`[theme-tokenize-main-css] ${script}`)
  execSync(`npx tsx scripts/${script}`, { cwd: repoRoot, stdio: 'inherit' })
}

console.log('[theme-tokenize-main-css] done')
