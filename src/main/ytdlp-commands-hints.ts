import { existsSync, readFileSync } from 'fs'
import { join } from 'path'

import { app } from 'electron'
import { is } from '@electron-toolkit/utils'

import type { YtdlpCommandHintEntry } from '../shared/ytdlp-download-contract'

export type { YtdlpCommandHintEntry } from '../shared/ytdlp-download-contract'

let memo: YtdlpCommandHintEntry[] | undefined

function resolveYtdlpCommandsJsonPath(): string | null {
  const packaged = join(process.resourcesPath, 'Data', 'ytdlp_commands.json')
  if (!is.dev && existsSync(packaged)) {
    return packaged
  }
  const dev = join(app.getAppPath(), 'Data', 'ytdlp_commands.json')
  if (existsSync(dev)) {
    return dev
  }
  if (existsSync(packaged)) {
    return packaged
  }
  return null
}

/**
 * Читает справочник из `Data/ytdlp_commands.json` (dev — из репозитория, prod — extraResources).
 * Ошибки чтения не роняют процесс: возвращается пустой список.
 */
export function getYtdlpCommandHints(): YtdlpCommandHintEntry[] {
  if (memo !== undefined) {
    return memo
  }
  const path = resolveYtdlpCommandsJsonPath()
  if (!path) {
    memo = []
    return memo
  }
  try {
    const raw = readFileSync(path, 'utf-8')
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) {
      memo = []
      return memo
    }
    const out: YtdlpCommandHintEntry[] = []
    for (const row of parsed) {
      if (!row || typeof row !== 'object') {
        continue
      }
      const o = row as { token?: unknown; summary?: unknown }
      if (typeof o.token !== 'string' || o.token.trim() === '') {
        continue
      }
      const summary = typeof o.summary === 'string' ? o.summary.trim().slice(0, 600) : ''
      const token = o.token.trim()
      if (token.length > 160) {
        continue
      }
      out.push({ token, summary })
    }
    memo = out
    return memo
  } catch {
    memo = []
    return memo
  }
}
