import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { tokenizeMainCssSpacingDeclarations } from '../../src/shared/theme-spacing-rem-tokenize.ts'

const MAIN_CSS = join(process.cwd(), 'src/renderer/src/assets/main.css')
const before = readFileSync(MAIN_CSS, 'utf8')
const after = tokenizeMainCssSpacingDeclarations(before)
writeFileSync(MAIN_CSS, after)
console.log('[apply-theme-spacing-rem-tokenize] done')
