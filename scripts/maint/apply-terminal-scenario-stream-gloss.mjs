/* eslint-disable @typescript-eslint/explicit-function-return-type */
/**
 * §8 фаза E — пояснение v:0/a:N/s:N в summary сценарных подсказок (только summary, не fullLine).
 */
import { readFileSync, writeFileSync } from 'node:fs'

import { listTerminalContractHintFiles } from './terminal-contract-hint-paths.mjs'

/** @type {Array<[RegExp, string]>} */
const SUMMARY_GLOSS_REPLACEMENTS = [
  [/^Поток s:0:/, 'Дорожка субтитров (s:0):'],
  [/^Поток a:1:/, 'Вторая аудиодорожка (a:1):'],
  [/(Перв(?:ий|ые) (?:\S+ )?(?:кадр[ао]?|пакет[а]?)) v:0:/g, '$1 первой видеодорожки (v:0):'],
  [/Первый пакет v:0:/g, 'Первый пакет первой видеодорожки (v:0):']
]

function glossSummaryText(inner) {
  let next = inner
  let hits = 0
  for (const [re, repl] of SUMMARY_GLOSS_REPLACEMENTS) {
    const updated = next.replace(re, repl)
    if (updated !== next) {
      hits += 1
      next = updated
    }
  }
  return { next, hits }
}

function applyToFile(filePath) {
  let s = readFileSync(filePath, 'utf8')
  const summaryRe = /summary:\s*(?:\n\s*)?'((?:[^'\\]|\\.)*)'/g
  let replacements = 0
  const out = s.replace(summaryRe, (full, inner) => {
    const unescaped = inner.replace(/\\'/g, "'")
    const { next, hits } = glossSummaryText(unescaped)
    if (hits === 0 || next === unescaped) {
      return full
    }
    replacements += hits
    const escaped = next.replace(/'/g, "\\'")
    return `summary: '${escaped}'`
  })
  if (replacements > 0) {
    writeFileSync(filePath, out, 'utf8')
  }
  return replacements
}

let total = 0
for (const filePath of listTerminalContractHintFiles()) {
  const n = applyToFile(filePath)
  if (n > 0) {
    console.log('file', filePath.replace(/\\/g, '/').split('/').pop(), 'replacements:', n)
  }
  total += n
}

console.log('OK terminal scenario stream gloss, replacements:', total)
