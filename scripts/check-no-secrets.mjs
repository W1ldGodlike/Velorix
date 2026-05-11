import { execFileSync } from 'node:child_process'

/**
 * Минимальная защита от случайного коммита секретов (в т.ч. Cursor SDK key).
 * Проверяет только tracked-файлы git, чтобы не читать node_modules/out/dist и т.п.
 */

const filesRaw = execFileSync('git', ['ls-files', '-z'], { encoding: 'utf8' })
const files = filesRaw.split('\0').filter(Boolean)

const patterns = [
  // Cursor SDK key
  { id: 'CURSOR_API_KEY', re: /\bCURSOR_API_KEY\s*=\s*\S+/g },
  { id: 'crsr_token', re: /\bcrsr_[A-Za-z0-9_]+\b/g },

  // Generic suspects
  { id: 'AWS_access_key_id', re: /\bAKIA[0-9A-Z]{16}\b/g },
  { id: 'private_key_block', re: /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/g }
]

const allowFile = /(^|\/)\.env\.example$|(^|\/)README\.md$/

let hit = false

for (const f of files) {
  // Пропускаем любые .env файлы — они должны быть untracked; но на всякий случай не фейлим на .env.example.
  if (allowFile.test(f)) continue

  let text = ''
  try {
    text = execFileSync('git', ['show', `:${f}`], { encoding: 'utf8' })
  } catch {
    // binary or missing in index; ignore
    continue
  }

  for (const p of patterns) {
    if (p.re.test(text)) {
      // reset stateful regex
      p.re.lastIndex = 0
      console.error(`[secrets] ${p.id} matched in ${f}`)
      hit = true
    }
  }
}

if (hit) {
  process.exitCode = 2
  console.error('[secrets] Refusing to proceed. Remove secrets from tracked files.')
} else {
  console.log('[secrets] OK')
}

