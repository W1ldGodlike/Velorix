/* eslint-disable @typescript-eslint/explicit-function-return-type */
/**
 * §2.2 — перенос TS-only ключей editor / video / mini (+ editor-ffmpeg export) в locales/{ru,en}/*.json;
 * затем prune дублей из ui-text-strings-*-NN.ts.
 *
 * Run: node scripts/migrate-locales-editor-video-mini.mjs
 */
import fs from 'node:fs'
import path from 'node:path'

import { LOCALE_JSON_LOCALES } from '../src/shared/locale-json-catalog.ts'
import { REPO_ROOT } from './lib/repo-root.mjs'
import {
  parseUiTextTsPart,
  pruneUiTextTsPart
} from './lib/parse-ui-text-ts-part.mjs'

const localesDir = path.join(REPO_ROOT, 'src/renderer/src/locales')

/** @param {string} k */
function keyShard(k) {
  if (k.startsWith('mini')) {
    return 'mini'
  }
  if (k.startsWith('videoTimeline') || k.startsWith('video')) {
    return 'video'
  }
  if (k.startsWith('preview') || k.startsWith('transport')) {
    return 'video'
  }
  if (
    k.startsWith('editorExport') ||
    k.startsWith('ffmpegExport') ||
    k.startsWith('editorPreview') ||
    k.startsWith('editorFfmpeg')
  ) {
    return 'editor-ffmpeg'
  }
  if (k.startsWith('editor')) {
    return 'editor'
  }
  return null
}

function loadJsonKeySet(locale) {
  const set = new Set()
  const dir = path.join(REPO_ROOT, 'locales', locale)
  for (const file of fs.readdirSync(dir)) {
    if (!file.endsWith('.json')) {
      continue
    }
    const table = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8'))
    for (const key of Object.keys(table)) {
      set.add(key)
    }
  }
  return set
}

function mergeShard(locale, shard, additions) {
  const file = path.join(REPO_ROOT, 'locales', locale, `${shard}.json`)
  const prev = fs.existsSync(file)
    ? JSON.parse(fs.readFileSync(file, 'utf8'))
    : {}
  const next = { ...prev, ...additions }
  const sorted = {}
  for (const k of Object.keys(next).sort()) {
    sorted[k] = next[k]
  }
  fs.writeFileSync(file, `${JSON.stringify(sorted, null, 2)}\n`, 'utf8')
}

function collectFromParts(locale, predicate) {
  const out = new Map()
  const suffix = locale === 'ru' ? '-ru-' : '-en-'
  for (const file of fs.readdirSync(localesDir)) {
    if (!file.includes(suffix) || !file.endsWith('.ts')) {
      continue
    }
    const content = fs.readFileSync(path.join(localesDir, file), 'utf8')
    for (const [k, v] of parseUiTextTsPart(content)) {
      if (predicate(k)) {
        out.set(k, v)
      }
    }
  }
  return out
}

const targetShards = ['editor', 'editor-ffmpeg', 'video', 'mini']

for (const locale of LOCALE_JSON_LOCALES) {
  const jsonKeys = loadJsonKeySet(locale)
  for (const shard of targetShards) {
    const additions = {}
    for (const [k, v] of collectFromParts(
      locale,
      (key) => keyShard(key) === shard && !jsonKeys.has(key)
    )) {
      additions[k] = v
    }
    if (Object.keys(additions).length > 0) {
      mergeShard(locale, shard, additions)
      console.log(`[migrate] locales/${locale}/${shard}.json +${Object.keys(additions).length} keys`)
    }
  }
}

let prunedTotal = 0
for (const locale of LOCALE_JSON_LOCALES) {
  const jsonKeys = loadJsonKeySet(locale)
  const suffix = locale === 'ru' ? '-ru-' : '-en-'
  for (const file of fs.readdirSync(localesDir)) {
    if (!file.includes(suffix) || !file.endsWith('.ts')) {
      continue
    }
    const filePath = path.join(localesDir, file)
    const before = parseUiTextTsPart(fs.readFileSync(filePath, 'utf8')).size
    const pruned = pruneUiTextTsPart(fs.readFileSync(filePath, 'utf8'), jsonKeys)
    fs.writeFileSync(filePath, pruned, 'utf8')
    const after = parseUiTextTsPart(fs.readFileSync(filePath, 'utf8')).size
    prunedTotal += before - after
    console.log(`[migrate] ${file}: ${before} → ${after} keys`)
  }
}

console.log(`[migrate] pruned ${prunedTotal} duplicate TS entries (ru+en total)`)
