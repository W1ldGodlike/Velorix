import { existsSync, mkdirSync, readFileSync, renameSync, unlinkSync, writeFileSync } from 'fs'
import { dirname, join } from 'path'

import { logError } from './logger-service'
import type {
  ProcessingHistoryEntry,
  ProcessingHistoryFilter,
  ProcessingHistoryKind,
  ProcessingHistoryOutcome,
  ProcessingHistoryWeeklySummary
} from '../shared/processing-history-contract'

export const PROCESSING_HISTORY_SCHEMA = 1
export const PROCESSING_HISTORY_MAX_ENTRIES = 500

interface ProcessingHistoryFileShape {
  schema: number
  entries: ProcessingHistoryEntry[]
}

function processingHistoryFilePath(userDataRoot: string): string {
  return join(userDataRoot, 'processing', 'history.json')
}

function newEntryId(): string {
  try {
    const c = globalThis.crypto?.randomUUID
    if (typeof c === 'function') {
      return c.call(globalThis.crypto)
    }
  } catch {
    /* fallback */
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

function isFiniteNumber(raw: unknown): raw is number {
  return typeof raw === 'number' && Number.isFinite(raw)
}

function isKind(raw: unknown): raw is ProcessingHistoryKind {
  return (
    raw === 'ffmpegExport' ||
    raw === 'ffmpegBatchExport' ||
    raw === 'ffmpegSnapshot' ||
    raw === 'autoExport' ||
    raw === 'workflowScenario'
  )
}

function isOutcome(raw: unknown): raw is ProcessingHistoryOutcome {
  return raw === 'success' || raw === 'error' || raw === 'cancelled'
}

function parseEntry(raw: unknown): ProcessingHistoryEntry | null {
  if (!raw || typeof raw !== 'object') {
    return null
  }
  const o = raw as Record<string, unknown>
  if (typeof o['id'] !== 'string' || !isKind(o['kind'])) {
    return null
  }
  if (!isFiniteNumber(o['startedAt']) || !isFiniteNumber(o['finishedAt'])) {
    return null
  }
  if (
    typeof o['inputPath'] !== 'string' ||
    typeof o['status'] !== 'string' ||
    !isOutcome(o['outcome'])
  ) {
    return null
  }
  const outputRaw = o['outputPath']
  const errorRaw = o['errorHint']
  const codecRaw = o['exportVideoCodecUsed']
  const entry: ProcessingHistoryEntry = {
    id: o['id'].slice(0, 64),
    kind: o['kind'],
    startedAt: o['startedAt'],
    finishedAt: o['finishedAt'],
    inputPath: o['inputPath'].slice(0, 4096),
    outputPath: typeof outputRaw === 'string' ? outputRaw.slice(0, 4096) : null,
    outcome: o['outcome'],
    status: o['status'].slice(0, 400),
    errorHint: typeof errorRaw === 'string' ? errorRaw.slice(0, 500) : null
  }
  if (typeof codecRaw === 'string' && codecRaw.trim().length > 0) {
    entry.exportVideoCodecUsed = codecRaw.trim().slice(0, 64)
  }
  const scenarioIdRaw = o['workflowScenarioId']
  if (typeof scenarioIdRaw === 'string' && scenarioIdRaw.trim().length > 0) {
    entry.workflowScenarioId = scenarioIdRaw.trim().slice(0, 128)
  }
  return entry
}

function loadEntries(userDataRoot: string): ProcessingHistoryEntry[] {
  const file = processingHistoryFilePath(userDataRoot)
  if (!existsSync(file)) {
    return []
  }
  try {
    const parsed = JSON.parse(readFileSync(file, 'utf-8')) as Partial<ProcessingHistoryFileShape>
    if (parsed.schema !== PROCESSING_HISTORY_SCHEMA || !Array.isArray(parsed.entries)) {
      return []
    }
    return parsed.entries
      .map(parseEntry)
      .filter((entry): entry is ProcessingHistoryEntry => !!entry)
  } catch (err) {
    logError('processing-history', 'read processing/history.json failed', err)
    return []
  }
}

function writeHistoryFile(userDataRoot: string, entries: ProcessingHistoryEntry[]): void {
  const file = processingHistoryFilePath(userDataRoot)
  const tmp = `${file}.${process.pid}.${Date.now()}-${Math.random().toString(36).slice(2, 10)}.tmp`
  try {
    mkdirSync(dirname(file), { recursive: true })
    writeFileSync(
      tmp,
      JSON.stringify({ schema: PROCESSING_HISTORY_SCHEMA, entries }, null, 2),
      'utf-8'
    )
    renameSync(tmp, file)
  } catch (err) {
    try {
      if (existsSync(tmp)) {
        unlinkSync(tmp)
      }
    } catch {
      /* preserve original write error */
    }
    logError('processing-history', 'write processing/history.json failed', err)
  }
}

export function appendProcessingHistoryEntry(
  userDataRoot: string,
  partial: Omit<ProcessingHistoryEntry, 'id'> & { id?: string }
): void {
  const entries = loadEntries(userDataRoot)
  const next: ProcessingHistoryEntry = {
    id: partial.id && partial.id.length > 0 ? partial.id.slice(0, 64) : newEntryId(),
    kind: partial.kind,
    startedAt: partial.startedAt,
    finishedAt: partial.finishedAt,
    inputPath: partial.inputPath.slice(0, 4096),
    outputPath: partial.outputPath ? partial.outputPath.slice(0, 4096) : null,
    outcome: partial.outcome,
    status: partial.status.slice(0, 400),
    errorHint: partial.errorHint ? partial.errorHint.slice(0, 500) : null
  }
  if (
    typeof partial.exportVideoCodecUsed === 'string' &&
    partial.exportVideoCodecUsed.trim().length > 0
  ) {
    next.exportVideoCodecUsed = partial.exportVideoCodecUsed.trim().slice(0, 64)
  }
  if (
    typeof partial.workflowScenarioId === 'string' &&
    partial.workflowScenarioId.trim().length > 0
  ) {
    next.workflowScenarioId = partial.workflowScenarioId.trim().slice(0, 128)
  }
  entries.push(next)
  while (entries.length > PROCESSING_HISTORY_MAX_ENTRIES) {
    entries.shift()
  }
  writeHistoryFile(userDataRoot, entries)
}

export function readProcessingHistoryNewestFirst(
  userDataRoot: string,
  filter: ProcessingHistoryFilter = {},
  limit = 100
): ProcessingHistoryEntry[] {
  const q = filter.query?.trim().toLowerCase()
  const max = Math.min(PROCESSING_HISTORY_MAX_ENTRIES, Math.max(1, Math.floor(limit)))
  return loadEntries(userDataRoot)
    .filter((entry) => (filter.kind ? entry.kind === filter.kind : true))
    .filter((entry) => (filter.outcome ? entry.outcome === filter.outcome : true))
    .filter((entry) => {
      if (!q) {
        return true
      }
      return [
        entry.inputPath,
        entry.outputPath ?? '',
        entry.status,
        entry.errorHint ?? '',
        entry.exportVideoCodecUsed ?? '',
        entry.workflowScenarioId ?? ''
      ].some((text) => text.toLowerCase().includes(q))
    })
    .slice(-max)
    .reverse()
}

export function findProcessingHistoryEntryById(
  userDataRoot: string,
  id: string
): ProcessingHistoryEntry | null {
  const needle = id.trim()
  if (needle.length === 0) {
    return null
  }
  return loadEntries(userDataRoot).find((entry) => entry.id === needle) ?? null
}

export function getProcessingHistoryWeeklySummary(
  userDataRoot: string,
  now = Date.now()
): ProcessingHistoryWeeklySummary {
  const until = Number.isFinite(now) && now > 0 ? now : Date.now()
  const since = until - 7 * 24 * 60 * 60 * 1000
  const summary: ProcessingHistoryWeeklySummary = {
    since,
    until,
    total: 0,
    success: 0,
    error: 0,
    cancelled: 0,
    ffmpegExport: 0,
    ffmpegBatchExport: 0,
    ffmpegSnapshot: 0,
    autoExport: 0,
    workflowScenario: 0,
    totalDurationMs: 0
  }
  for (const entry of loadEntries(userDataRoot)) {
    if (entry.finishedAt < since || entry.finishedAt > until) {
      continue
    }
    summary.total += 1
    summary[entry.outcome] += 1
    summary[entry.kind] += 1
    summary.totalDurationMs += Math.max(0, entry.finishedAt - entry.startedAt)
  }
  return summary
}

export function clearProcessingHistory(userDataRoot: string): void {
  writeHistoryFile(userDataRoot, [])
}
