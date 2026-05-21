/* eslint-disable @typescript-eslint/explicit-function-return-type */
/**
 * PROGRAM GATE E1: user-facing copy must not use bare ffprobe stream indices (a:0 / v:0)
 * without plain-language context (дорожка / stream / ffprobe / first video|audio).
 */
import fs from 'node:fs'
import path from 'node:path'

import { REPO_ROOT } from '../lib/repo-root.mjs'
import { listTerminalContractHintFiles } from '../maint/terminal-contract-hint-paths.mjs'

const UI_TEXT_GLOB_DIRS = [
  path.join(REPO_ROOT, 'src/renderer/src/locales'),
  path.join(REPO_ROOT, 'locales')
]

const ALLOWED_STREAM_CONTEXT =
  /дорожк|stream|ffprobe|видео|аудио|audio|video|first|перва|перви|индекс|index|карточк|подсказк|\bnot\b|\bне\b/i

/** @param {string} text */
function hasBareStreamIndex(text) {
  const re = /\b[av]:0\b/g
  let m
  while ((m = re.exec(text)) !== null) {
    const start = Math.max(0, m.index - 48)
    const window = text.slice(start, m.index + m[0].length + 24)
    if (!ALLOWED_STREAM_CONTEXT.test(window)) {
      return { index: m.index, snippet: text.slice(Math.max(0, m.index - 20), m.index + 20) }
    }
  }
  return null
}

/** @param {string} rel */
function collectUiCopyFiles(relRoot) {
  const out = []
  const walk = (dir) => {
    for (const name of fs.readdirSync(dir)) {
      const full = path.join(dir, name)
      const st = fs.statSync(full)
      if (st.isDirectory()) {
        walk(full)
      } else if (/\.(ts|json)$/.test(name) && !name.includes('.test.')) {
        out.push(full)
      }
    }
  }
  walk(relRoot)
  return out
}

const failures = []

for (const root of UI_TEXT_GLOB_DIRS) {
  if (!fs.existsSync(root)) {
    continue
  }
  for (const filePath of collectUiCopyFiles(root)) {
    const rel = path.relative(REPO_ROOT, filePath).replace(/\\/g, '/')
    const text = fs.readFileSync(filePath, 'utf8')
    const hit = hasBareStreamIndex(text)
    if (hit) {
      failures.push(`${rel}: bare a:0/v:0 near «${hit.snippet}»`)
    }
  }
}

const FORBIDDEN_SUMMARY_SUBSTRINGS = ['Поток v:0', 'Поток a:0', "summary: 'Поток "]

for (const filePath of listTerminalContractHintFiles()) {
  const rel = path.relative(REPO_ROOT, filePath).replace(/\\/g, '/')
  const text = fs.readFileSync(filePath, 'utf8')
  for (const sub of FORBIDDEN_SUMMARY_SUBSTRINGS) {
    if (text.includes(sub)) {
      failures.push(`${rel}: forbidden summary wording «${sub}»`)
    }
  }
}

if (failures.length > 0) {
  console.error('[check:ui-copy-quality] FAIL:')
  for (const line of failures.slice(0, 40)) {
    console.error(' ', line)
  }
  if (failures.length > 40) {
    console.error(`  … and ${failures.length - 40} more`)
  }
  process.exit(1)
}

console.log('[check:ui-copy-quality] OK')
