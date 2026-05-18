import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { tokenizeMainCssLineHeightDeclarations } from '../src/shared/theme-line-height-tokenize.ts'

const MAIN_CSS = join(process.cwd(), 'src/renderer/src/assets/main.css')
const before = readFileSync(MAIN_CSS, 'utf8')
const after = tokenizeMainCssLineHeightDeclarations(before)
writeFileSync(MAIN_CSS, after)
console.log('[apply-theme-line-height-tokenize] done')
