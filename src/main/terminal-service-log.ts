import { appendFileSync, existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'fs'
import { app } from 'electron'
import { join } from 'path'

import { downloadsWindowUiLocaleFromSystemLocale } from '../shared/downloads-window-ui-locale'
import { getMainApplicationStrings } from '../shared/main-application-locale'
import {
  TERMINAL_CLI_LOG_KEEP_BYTES,
  TERMINAL_CLI_LOG_MAX_BYTES
} from './terminal-service-constants'

/** Путь к журналу прогонов вкладки «Терминал» (`app-data/logs/terminal-cli.log`). */
export function resolveTerminalCliSessionLogPath(userData: string): string {
  return join(userData, 'logs', 'terminal-cli.log')
}

export function terminalCliLogIsoStamp(): string {
  return new Date().toISOString()
}

/** §8 — журнал прогонов вкладки «Терминал» для Support ZIP (stderr и блокировки). */
export function appendTerminalCliSessionLog(params: { userData: string; block: string }): void {
  const { userData, block } = params
  try {
    const dir = join(userData, 'logs')
    mkdirSync(dir, { recursive: true })
    const file = resolveTerminalCliSessionLogPath(userData)
    if (existsSync(file)) {
      const st = statSync(file)
      if (st.size > TERMINAL_CLI_LOG_MAX_BYTES) {
        const raw = readFileSync(file)
        const loc = downloadsWindowUiLocaleFromSystemLocale(app.getLocale())
        const head = Buffer.from(getMainApplicationStrings(loc).terminalLogTruncatedOlder, 'utf8')
        const tail = raw.subarray(Math.max(0, raw.length - TERMINAL_CLI_LOG_KEEP_BYTES))
        writeFileSync(file, Buffer.concat([head, tail]))
      }
    }
    appendFileSync(file, block, 'utf8')
  } catch {
    /* Support / диагностика не должны ломать CLI */
  }
}
