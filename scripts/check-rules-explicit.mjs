/**
 * Проверяет .cursor/rules/*.mdc на запрещённые размытые формулировки.
 */
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const RULES_DIR = '.cursor/rules'

/** Фраза → разрешение (regex на ту же строку). */
const BANNED = [
  { phrase: 'при необходимости', allow: null },
  { phrase: 'по возможности', allow: null },
  { phrase: 'если нужно', allow: null },
  { phrase: 'желательно', allow: null },
  { phrase: 'по желанию', allow: /не обязательн/i },
  { phrase: 'крупный', allow: /глоссар|fluxalloy-rules-explicit|Крупный срез/i },
  { phrase: 'мелоч', allow: /Микро-J|микро-J|глоссар/i },
  { phrase: 'подобн', allow: /Однотипн|глоссар|_SPECS|parseWhitelist/i }
]

const failures = []

for (const name of readdirSync(RULES_DIR)) {
  if (!name.endsWith('.mdc') || name === 'fluxalloy-rules-explicit.mdc') {
    continue
  }
  const path = join(RULES_DIR, name)
  const lines = readFileSync(path, 'utf8').split(/\r?\n/)
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (line.startsWith('---') || line.trim().startsWith('#')) {
      // still check content lines under headers
    }
    for (const { phrase, allow } of BANNED) {
      if (!line.toLowerCase().includes(phrase.toLowerCase())) {
        continue
      }
      if (allow && allow.test(line)) {
        continue
      }
      failures.push(
        `${path}:${i + 1}: размытая фраза «${phrase}» — см. fluxalloy-rules-explicit.mdc`
      )
    }
  }
}

if (failures.length > 0) {
  console.error('[check:rules-explicit] FAILED')
  for (const f of failures) {
    console.error(`  ${f}`)
  }
  process.exit(1)
}

console.log('[check:rules-explicit] OK')
