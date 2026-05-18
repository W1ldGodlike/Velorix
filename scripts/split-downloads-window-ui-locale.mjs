import fs from 'node:fs'
import path from 'node:path'

import { execSync } from 'node:child_process'

const outDir = path.join('src/shared')
const lines = execSync('git show HEAD:src/shared/app-ui-locale.ts', {
  encoding: 'utf8'
}).split(/\r?\n/)

const typesBlock = lines.slice(0, 224).join('\n')
const ruBlock = lines
  .slice(225, 437)
  .join('\n')
  .replace(/^const RU/, 'export const downloadsWindowUiStringsRu')
const enBlock = lines
  .slice(437, 647)
  .join('\n')
  .replace(/^const EN/, 'export const downloadsWindowUiStringsEn')
const tailBlock = lines
  .slice(648)
  .join('\n')
  .replace(/\bEN\b/g, 'downloadsWindowUiStringsEn')
  .replace(/\bRU\b/g, 'downloadsWindowUiStringsRu')

fs.writeFileSync(
  path.join(outDir, 'app-ui-locale.ts'),
  `${typesBlock}
`
)

fs.writeFileSync(
  path.join(outDir, 'downloads-window-ui-strings-ru.ts'),
  `import type { DownloadsWindowUiStrings } from './app-ui-locale'

${ruBlock}
`
)

fs.writeFileSync(
  path.join(outDir, 'downloads-window-ui-strings-en.ts'),
  `import type { DownloadsWindowUiStrings } from './app-ui-locale'

${enBlock}
`
)

const entry = `/**
 * UI copy for the pop-out downloads manager (\`buildDownloadsHtml\` in main).
 * Kept main-safe (no renderer imports).
 */
export type {
  DownloadsTopbarClusterCopy,
  AppUiLocale,
  DownloadsWindowUiStrings
} from './app-ui-locale'
export {
  appUiLocaleFromSystemLocale,
  parseAppUiLocale
} from './app-ui-locale'

import type { AppUiLocale } from './app-ui-locale'
import { downloadsWindowUiStringsEn } from './downloads-window-ui-strings-en'
import { downloadsWindowUiStringsRu } from './downloads-window-ui-strings-ru'

${tailBlock}
`

fs.writeFileSync(path.join(outDir, 'app-ui-locale.ts'), entry)
console.log('split app-ui-locale OK')
