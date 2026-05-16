/* eslint-disable @typescript-eslint/explicit-function-return-type */
/**
 * Локальный счётчик marathon-итераций (docs/.agent-session.json, в .gitignore).
 * Владельцу ничего создавать не нужно — первый вызов создаёт файл.
 *
 *   npm run agent:session          # статус
 *   npm run agent:session -- bump  # +1 после итерации
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'

const sessionPath = join('docs', '.agent-session.json')

function defaultState() {
  return {
    continue_count: 0,
    last_reanchor_at: 0,
    last_commit_iteration: 0,
    last_push_iteration: 0
  }
}

function load() {
  if (!existsSync(sessionPath)) return defaultState()
  try {
    return { ...defaultState(), ...JSON.parse(readFileSync(sessionPath, 'utf8')) }
  } catch {
    return defaultState()
  }
}

function save(state) {
  mkdirSync(dirname(sessionPath), { recursive: true })
  writeFileSync(sessionPath, `${JSON.stringify(state, null, 2)}\n`, 'utf8')
}

const cmd = process.argv[2] ?? 'status'
const state = load()

if (cmd === 'bump') {
  state.continue_count += 1
  save(state)
  console.log(`[agent-session] continue_count=${state.continue_count}`)
  process.exit(0)
}

if (cmd === 'status') {
  console.log(`[agent-session] continue_count=${state.continue_count}`)
  process.exit(0)
}

console.error('[agent-session] usage: npm run agent:session [-- bump|status]')
process.exit(1)
