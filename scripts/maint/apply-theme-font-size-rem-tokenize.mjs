import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { tokenizeMainCssFontSizeDeclarations } from '../../src/shared/theme-font-size-rem-tokenize.ts'

const MAIN_CSS = join(process.cwd(), 'src/renderer/src/assets/main.css')
const before = readFileSync(MAIN_CSS, 'utf8')
const after = tokenizeMainCssFontSizeDeclarations(before)
writeFileSync(MAIN_CSS, after)
console.log('[apply-theme-font-size-rem-tokenize] done')
