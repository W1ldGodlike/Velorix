import { readFileSync, existsSync } from 'fs'
import { app } from 'electron'
import { join } from 'path'
import { is } from '@electron-toolkit/utils'

import type { EngineId } from './engine-service'
import type { TerminalCommandHintEntry, TerminalToolId } from '../shared/terminal-contract'
import { TERMINAL_ALLOWED_TOOLS, TERMINAL_MAX_LINE_CHARS } from './terminal-service-constants'

let hintsMemo: TerminalCommandHintEntry[] | undefined

function commandsJsonPath(fileName: string): string | null {
  const packaged = join(process.resourcesPath, 'Data', fileName)
  if (!is.dev && existsSync(packaged)) {
    return packaged
  }
  const dev = join(app.getAppPath(), 'Data', fileName)
  if (existsSync(dev)) {
    return dev
  }
  return existsSync(packaged) ? packaged : null
}

function readHints(fileName: string, fallbackTool: EngineId): TerminalCommandHintEntry[] {
  const path = commandsJsonPath(fileName)
  if (!path) {
    return []
  }
  try {
    const parsed = JSON.parse(readFileSync(path, 'utf-8')) as unknown
    if (!Array.isArray(parsed)) {
      return []
    }
    const out: TerminalCommandHintEntry[] = []
    for (const row of parsed) {
      if (!row || typeof row !== 'object') {
        continue
      }
      const src = row as { token?: unknown; summary?: unknown; tool?: unknown; fullLine?: unknown }
      const tool = TERMINAL_ALLOWED_TOOLS.includes(src.tool as TerminalToolId)
        ? (src.tool as TerminalToolId)
        : fallbackTool
      if (typeof src.token === 'string' && src.token.trim().length > 0) {
        const token = src.token.trim().slice(0, 160)
        const summary = typeof src.summary === 'string' ? src.summary.trim().slice(0, 600) : ''
        let fullLine: string | undefined
        if (typeof src.fullLine === 'string') {
          const fl = src.fullLine.trim()
          if (fl.length > 0) {
            fullLine = fl.length > TERMINAL_MAX_LINE_CHARS ? fl.slice(0, TERMINAL_MAX_LINE_CHARS) : fl
          }
        }
        const entry: TerminalCommandHintEntry = { token, summary, tool }
        if (fullLine !== undefined) {
          entry.fullLine = fullLine
        }
        out.push(entry)
      }
    }
    return out
  } catch {
    return []
  }
}

export function getTerminalCommandHints(): TerminalCommandHintEntry[] {
  if (hintsMemo !== undefined) {
    return hintsMemo
  }
  hintsMemo = [
    ...readHints('ffmpeg_commands.json', 'ffmpeg'),
    ...readHints('ytdlp_commands.json', 'yt-dlp')
  ].sort((a, b) => a.tool.localeCompare(b.tool) || a.token.localeCompare(b.token, 'ru'))
  return hintsMemo
}
