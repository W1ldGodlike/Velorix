/* eslint-disable @typescript-eslint/explicit-function-return-type */
/**
 * §2.2 — перенос оставшихся TS-only ключей (workspace/statusbar, downloads, about, …) в locales/{ru,en}/*.json;
 * затем prune дублей из ui-text-strings-*-NN.ts.
 *
 * Run: node scripts/migrate-locales-remaining-ts.mjs
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
  if (k.startsWith('statusbar') || k.startsWith('workspace') || k.startsWith('appStatusbar')) {
    return 'workspace'
  }
  if (k.startsWith('downloads')) {
    return 'downloads'
  }
  if (k.startsWith('about') || k.startsWith('mediaUtilities') || k.startsWith('mediaFile')) {
    return 'about'
  }
  if (k.startsWith('terminal')) {
    return 'terminal'
  }
  if (k.startsWith('timeline') || k.startsWith('waveform')) {
    return 'video'
  }
  if (k.startsWith('batchExport') || k.startsWith('batch')) {
    return 'batch-export'
  }
  if (k.startsWith('externalFilter') || k.startsWith('exportPreset')) {
    return 'editor-ffmpeg'
  }
  if (k.startsWith('enginePaths') || k.startsWith('appSettings')) {
    return 'settings'
  }
  if (k.startsWith('topbar') || k.startsWith('appMainShell')) {
    return 'shell'
  }
  if (k.startsWith('appDialog') || k.startsWith('uiPlaceholder') || k.startsWith('common')) {
    return 'common'
  }
  if (k.startsWith('quickYtdlp') || k.startsWith('editor')) {
    return 'editor'
  }
  if (k.startsWith('status')) {
    return 'status'
  }
  if (k.startsWith('mini')) {
    return 'mini'
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

const shardSet = new Set()
for (const locale of LOCALE_JSON_LOCALES) {
  const jsonKeys = loadJsonKeySet(locale)
  const byShard = new Map()
  for (const [k, v] of collectFromParts(locale, (key) => !jsonKeys.has(key))) {
    const shard = keyShard(k)
    if (shard === null) {
      console.error(`[migrate] unmapped key (${locale}): ${k}`)
      process.exit(1)
    }
    shardSet.add(shard)
    if (!byShard.has(shard)) {
      byShard.set(shard, {})
    }
    byShard.get(shard)[k] = v
  }
  for (const [shard, additions] of byShard) {
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
