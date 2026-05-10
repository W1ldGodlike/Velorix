import { existsSync, mkdirSync, readFileSync, renameSync, unlinkSync, writeFileSync } from 'fs'
import { dirname, join } from 'path'
import type { App } from 'electron'

import { resolveAppPaths } from './app-paths'
import type { DownloadsQueueRow } from './downloads-queue'
import { getDownloadsQueueSnapshot, replaceDownloadsQueueState } from './downloads-queue'
import {
  sanitizePersistedQueuePayload,
  YTDLP_DOWNLOAD_QUEUE_PERSIST_SCHEMA
} from './ytdlp-download-queue-persist-parse'
import { logError } from './logger-service'

interface QueueFileShape {
  schema: number
  rows: DownloadsQueueRow[]
}

let persistTimer: ReturnType<typeof setTimeout> | null = null
let quitHookAttached = false

export { YTDLP_DOWNLOAD_QUEUE_PERSIST_SCHEMA } from './ytdlp-download-queue-persist-parse'

export function queuePersistFilePath(userDataRoot: string): string {
  return join(userDataRoot, 'downloads', 'queue.json')
}

function writeQueueFileAtomic(file: string, payload: QueueFileShape, failureMessage: string): void {
  const dir = dirname(file)
  try {
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true })
    }
  } catch (err) {
    logError('ytdlp-queue-persist', 'mkdir downloads failed', err)
    return
  }
  const tmp = `${file}.${process.pid}.${Date.now()}-${Math.random().toString(36).slice(2, 10)}.tmp`
  try {
    writeFileSync(tmp, JSON.stringify(payload, null, 2), 'utf-8')
    renameSync(tmp, file)
  } catch (err) {
    try {
      if (existsSync(tmp)) {
        unlinkSync(tmp)
      }
    } catch {
      /* ignore */
    }
    logError('ytdlp-queue-persist', failureMessage, err)
  }
}

export function readDownloadsQueueFromDisk(userDataRoot: string): DownloadsQueueRow[] {
  const file = queuePersistFilePath(userDataRoot)
  if (!existsSync(file)) {
    return []
  }
  try {
    const text = readFileSync(file, 'utf-8')
    const parsed: unknown = JSON.parse(text) as unknown
    return sanitizePersistedQueuePayload(parsed)
  } catch (err) {
    logError('ytdlp-queue-persist', 'read queue.json failed', err)
    return []
  }
}

export function persistDownloadsQueueSync(userDataRoot: string): void {
  const snap = getDownloadsQueueSnapshot()
  const file = queuePersistFilePath(userDataRoot)
  writeQueueFileAtomic(
    file,
    { schema: YTDLP_DOWNLOAD_QUEUE_PERSIST_SCHEMA, rows: snap },
    'write queue.json failed'
  )
}

export function schedulePersistDownloadsQueueDebounced(): void {
  if (persistTimer !== null) {
    clearTimeout(persistTimer)
  }
  persistTimer = setTimeout(() => {
    persistTimer = null
    persistDownloadsQueueSync(resolveAppPaths().userData)
  }, 400)
}

export function flushDownloadsQueuePersistSync(userDataRoot: string): void {
  if (persistTimer !== null) {
    clearTimeout(persistTimer)
    persistTimer = null
  }
  persistDownloadsQueueSync(userDataRoot)
}

export function hydrateDownloadsQueueFromDisk(userDataRoot: string): void {
  const loaded = readDownloadsQueueFromDisk(userDataRoot)
  replaceDownloadsQueueState(loaded)
}

/** Один раз: синхронная запись при выходе, чтобы debounce не потерял очередь. */
export function attachDownloadsQueuePersistOnQuitOnce(app: App): void {
  if (quitHookAttached) {
    return
  }
  quitHookAttached = true
  app.on('will-quit', () => {
    flushDownloadsQueuePersistSync(resolveAppPaths().userData)
  })
}
