import { existsSync, mkdirSync, readFileSync, renameSync, unlinkSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import type { App } from 'electron'

import { resolveAppPaths } from '../../core/app-paths'
import {
  getFfmpegExportBatchSnapshot,
  hydrateFfmpegExportBatchQueueFromPersisted,
  setFfmpegExportBatchQueueChangeHook
} from './ffmpeg-export-batch-queue'
import {
  FFMPEG_EXPORT_BATCH_QUEUE_PERSIST_SCHEMA,
  sanitizePersistedFfmpegExportBatchPayload,
  type PersistedFfmpegExportBatchQueuePayload
} from './ffmpeg-export-batch-persist-parse'
import { logError } from '../../core/logger-service'

let persistTimer: ReturnType<typeof setTimeout> | null = null
let quitHookAttached = false

export { FFMPEG_EXPORT_BATCH_QUEUE_PERSIST_SCHEMA } from './ffmpeg-export-batch-persist-parse'

export function ffmpegExportBatchQueueFilePath(userDataRoot: string): string {
  return join(userDataRoot, 'ffmpeg-export-batch', 'queue.json')
}

function writeBatchQueueFileAtomic(
  file: string,
  payload: PersistedFfmpegExportBatchQueuePayload,
  failureMessage: string
): void {
  const dir = dirname(file)
  try {
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true })
    }
  } catch (err) {
    logError('ffmpeg-export-batch-persist', 'mkdir failed', err)
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
    logError('ffmpeg-export-batch-persist', failureMessage, err)
  }
}

export function readFfmpegExportBatchQueueFromDisk(
  userDataRoot: string
): PersistedFfmpegExportBatchQueuePayload | null {
  const file = ffmpegExportBatchQueueFilePath(userDataRoot)
  if (!existsSync(file)) {
    return null
  }
  try {
    const text = readFileSync(file, 'utf-8')
    const parsed: unknown = JSON.parse(text) as unknown
    return sanitizePersistedFfmpegExportBatchPayload(parsed)
  } catch (err) {
    logError('ffmpeg-export-batch-persist', 'read queue.json failed', err)
    return null
  }
}

export function persistFfmpegExportBatchQueueSync(userDataRoot: string): void {
  const snap = getFfmpegExportBatchSnapshot()
  let nextId = 1
  for (const r of snap.rows) {
    if (r.id >= nextId) {
      nextId = r.id + 1
    }
  }
  const file = ffmpegExportBatchQueueFilePath(userDataRoot)
  writeBatchQueueFileAtomic(
    file,
    {
      schema: FFMPEG_EXPORT_BATCH_QUEUE_PERSIST_SCHEMA,
      concurrency: snap.concurrency,
      nextId,
      rows: snap.rows
    },
    'write ffmpeg-export-batch queue.json failed'
  )
}

export function schedulePersistFfmpegExportBatchQueueDebounced(): void {
  if (persistTimer !== null) {
    clearTimeout(persistTimer)
  }
  persistTimer = setTimeout(() => {
    persistTimer = null
    persistFfmpegExportBatchQueueSync(resolveAppPaths().userData)
  }, 400)
}

export function flushFfmpegExportBatchQueuePersistSync(userDataRoot: string): void {
  if (persistTimer !== null) {
    clearTimeout(persistTimer)
    persistTimer = null
  }
  persistFfmpegExportBatchQueueSync(userDataRoot)
}

export function hydrateFfmpegExportBatchQueueFromDisk(userDataRoot: string): void {
  const loaded = readFfmpegExportBatchQueueFromDisk(userDataRoot)
  if (loaded) {
    hydrateFfmpegExportBatchQueueFromPersisted(loaded)
  }
}

export function attachFfmpegExportBatchQueuePersist(app: App): void {
  setFfmpegExportBatchQueueChangeHook(() => {
    schedulePersistFfmpegExportBatchQueueDebounced()
  })
  if (!quitHookAttached) {
    quitHookAttached = true
    app.on('will-quit', () => {
      flushFfmpegExportBatchQueuePersistSync(resolveAppPaths().userData)
    })
  }
}
