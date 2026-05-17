import fs from 'node:fs'
import path from 'node:path'

const outDir = path.join('src/shared')
const lines = fs.readFileSync(path.join(outDir, 'main-application-locale.ts'), 'utf8').split(/\r?\n/)

const typesBlock = lines.slice(2, 169).join('\n')
const ruBlock = lines
  .slice(170, 348)
  .join('\n')
  .replace(/^const RU/, 'export const mainApplicationStringsRu')
const enBlock = lines
  .slice(348, 526)
  .join('\n')
  .replace(/^const EN/, 'export const mainApplicationStringsEn')
const tailBlock = lines
  .slice(527)
  .join('\n')
  .replace(/\bEN\b/g, 'mainApplicationStringsEn')
  .replace(/\bRU\b/g, 'mainApplicationStringsRu')

fs.writeFileSync(path.join(outDir, 'main-application-locale-types.ts'), `${typesBlock}\n`)

fs.writeFileSync(
  path.join(outDir, 'main-application-locale-strings-ru.ts'),
  `import type { MainApplicationStrings } from './main-application-locale-types'

${ruBlock}
`
)

fs.writeFileSync(
  path.join(outDir, 'main-application-locale-strings-en.ts'),
  `import type { MainApplicationStrings } from './main-application-locale-types'

${enBlock}
`
)

const entry = `import type { DownloadsWindowUiLocale } from './downloads-window-ui-locale'

export type { MainApplicationStrings } from './main-application-locale-types'

import type { MainApplicationStrings } from './main-application-locale-types'
import { mainApplicationStringsEn } from './main-application-locale-strings-en'
import { mainApplicationStringsRu } from './main-application-locale-strings-ru'

${tailBlock}
`

fs.writeFileSync(path.join(outDir, 'main-application-locale.ts'), entry)
console.log('split main-application-locale OK')
