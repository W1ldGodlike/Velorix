import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

import { resolveAppPaths } from './app-paths'

const STATE_FORMAT_VERSION = 1

type TaskSeenState = {
  files: Record<string, { mtimeMs: number; size: number }>
}

type WatchFolderStateFile = {
  formatVersion: number
  tasks: Record<string, TaskSeenState>
}

function statePath(): string {
  const dir = join(resolveAppPaths().userData, 'workflows')
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true })
  }
  return join(dir, 'watch-folder-state.json')
}

function emptyState(): WatchFolderStateFile {
  return { formatVersion: STATE_FORMAT_VERSION, tasks: {} }
}

function loadState(): WatchFolderStateFile {
  const path = statePath()
  if (!existsSync(path)) {
    return emptyState()
  }
  try {
    const raw = JSON.parse(readFileSync(path, 'utf8')) as unknown
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
      return emptyState()
    }
    const r = raw as Record<string, unknown>
    if (r['formatVersion'] !== STATE_FORMAT_VERSION || typeof r['tasks'] !== 'object') {
      return emptyState()
    }
    return raw as WatchFolderStateFile
  } catch {
    return emptyState()
  }
}

function saveState(state: WatchFolderStateFile): void {
  writeFileSync(statePath(), `${JSON.stringify(state, null, 2)}\n`, 'utf8')
}

export function getWatchFolderSeenFiles(taskId: string): Record<string, { mtimeMs: number; size: number }> {
  const state = loadState()
  return state.tasks[taskId]?.files ?? {}
}

export function setWatchFolderSeenFiles(
  taskId: string,
  files: Record<string, { mtimeMs: number; size: number }>
): void {
  const state = loadState()
  state.tasks[taskId] = { files }
  saveState(state)
}

export function clearWatchFolderTaskState(taskId: string): void {
  const state = loadState()
  delete state.tasks[taskId]
  saveState(state)
}
