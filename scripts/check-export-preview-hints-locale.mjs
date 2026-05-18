/* eslint-disable @typescript-eslint/explicit-function-return-type */
/**
 * Locales guard: editorExportPreviewHint keys exist in locales editor-ffmpeg.json (ru/en).
 */
import fs from 'node:fs'
import path from 'node:path'

import { EDITOR_EXPORT_PREVIEW_HINT_KEYS } from '../src/shared/editor-export-preview-hint-keys.ts'
import { LOCALE_JSON_LOCALES } from '../src/shared/locale-json-catalog.ts'
import { REPO_ROOT } from './lib/repo-root.mjs'

const PREVIEW_HOOK = path.join(REPO_ROOT, 'src/renderer/src/use-editor-export-pipeline-preview.ts')
const hookSrc = fs.readFileSync(PREVIEW_HOOK, 'utf8')
const inlineHintKeys = [...hookSrc.matchAll(/editorExportPreviewHint[A-Za-z]+/g)].map((m) => m[0])
if (inlineHintKeys.length > 0) {
  console.error(
    `[check:export-preview-hints-locale] ${path.relative(REPO_ROOT, PREVIEW_HOOK)} must not reference ${inlineHintKeys.join(', ')}; use editor-export-preview-hint-resolve.ts`
  )
  process.exit(1)
}

function loadShard(locale, name) {
  const file = path.join(REPO_ROOT, 'locales', locale, `${name}.json`)
  return JSON.parse(fs.readFileSync(file, 'utf8'))
}

let failed = false
for (const locale of LOCALE_JSON_LOCALES) {
  const table = loadShard(locale, 'editor-ffmpeg')
  const missing = EDITOR_EXPORT_PREVIEW_HINT_KEYS.filter((key) => typeof table[key] !== 'string')
  if (missing.length > 0) {
    failed = true
    console.error(
      `[check:export-preview-hints-locale] locales/${locale}/editor-ffmpeg.json missing: ${missing.join(', ')}`
    )
  }
}

if (failed) {
  process.exit(1)
}
console.log(
  `[check:export-preview-hints-locale] OK (${EDITOR_EXPORT_PREVIEW_HINT_KEYS.length} keys × ${LOCALE_JSON_LOCALES.length} locales)`
)
