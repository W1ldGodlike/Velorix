import {
  SCHEDULED_TASK_BACKENDS,
  SCHEDULED_TASK_FORMAT_VERSION,
  SCHEDULED_TASK_TRIGGERS,
  type ScheduledTaskBackend,
  type ScheduledTaskDocument,
  type ScheduledTaskTrigger,
  type ScheduledTaskRegistryV1
} from './scheduled-task-contract'

const TASK_ID_RE = /^[a-z][a-z0-9_-]{0,63}$/

function parseTrigger(raw: unknown): ScheduledTaskTrigger | null {
  if (typeof raw === 'string' && (SCHEDULED_TASK_TRIGGERS as readonly string[]).includes(raw)) {
    return raw as ScheduledTaskTrigger
  }
  return null
}

function parseBackend(raw: unknown): ScheduledTaskBackend | null {
  if (typeof raw === 'string' && (SCHEDULED_TASK_BACKENDS as readonly string[]).includes(raw)) {
    return raw as ScheduledTaskBackend
  }
  return null
}

function parseTaskId(raw: unknown): string | null {
  if (typeof raw !== 'string') {
    return null
  }
  const id = raw.trim()
  if (!TASK_ID_RE.test(id)) {
    return null
  }
  return id
}

function parseOptionalString(raw: unknown, maxLen: number): string | undefined {
  if (raw === undefined || raw === null) {
    return undefined
  }
  if (typeof raw !== 'string') {
    return undefined
  }
  const s = raw.trim()
  if (s.length === 0 || s.length > maxLen) {
    return undefined
  }
  return s
}

function parsePollIntervalSec(raw: unknown): number | null {
  if (typeof raw !== 'number' || !Number.isFinite(raw)) {
    return null
  }
  const n = Math.round(raw)
  if (n < 15 || n > 86_400) {
    return null
  }
  return n
}

export function parseScheduledTaskDocument(raw: unknown): ScheduledTaskDocument | null {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return null
  }
  const r = raw as Record<string, unknown>
  const version =
    typeof r['formatVersion'] === 'number' ? r['formatVersion'] : SCHEDULED_TASK_FORMAT_VERSION
  if (version !== SCHEDULED_TASK_FORMAT_VERSION) {
    return null
  }
  const id = parseTaskId(r['id'])
  const title = parseOptionalString(r['title'], 160)
  const trigger = parseTrigger(r['trigger'])
  const backend = parseBackend(r['backend'])
  const watchFolderPath = parseOptionalString(r['watchFolderPath'], 512) ?? ''
  const scenarioId = parseTaskId(r['scenarioId']) ?? ''
  const pollIntervalSec = parsePollIntervalSec(r['pollIntervalSec'])
  if (!id || !title || !trigger || !backend || pollIntervalSec === null) {
    return null
  }
  if (typeof r['enabled'] !== 'boolean') {
    return null
  }
  const executeScenarioOnDetect =
    typeof r['executeScenarioOnDetect'] === 'boolean' ? r['executeScenarioOnDetect'] : true
  const doc: ScheduledTaskDocument = {
    formatVersion: SCHEDULED_TASK_FORMAT_VERSION,
    id,
    title,
    enabled: r['enabled'],
    trigger,
    backend,
    watchFolderPath,
    scenarioId,
    pollIntervalSec,
    executeScenarioOnDetect
  }
  const scheduleNote = parseOptionalString(r['scheduleNote'], 240)
  if (scheduleNote !== undefined) {
    doc.scheduleNote = scheduleNote
  }
  return doc
}

export function parseScheduledTaskRegistry(raw: unknown): ScheduledTaskRegistryV1 | null {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return null
  }
  const r = raw as Record<string, unknown>
  const version =
    typeof r['formatVersion'] === 'number' ? r['formatVersion'] : SCHEDULED_TASK_FORMAT_VERSION
  if (version !== SCHEDULED_TASK_FORMAT_VERSION || !Array.isArray(r['tasks'])) {
    return null
  }
  const tasks: ScheduledTaskDocument[] = []
  for (const item of r['tasks']) {
    const doc = parseScheduledTaskDocument(item)
    if (!doc) {
      return null
    }
    if (tasks.some((t) => t.id === doc.id)) {
      return null
    }
    tasks.push(doc)
  }
  return { formatVersion: SCHEDULED_TASK_FORMAT_VERSION, tasks }
}

export function emptyScheduledTaskRegistry(): ScheduledTaskRegistryV1 {
  return { formatVersion: SCHEDULED_TASK_FORMAT_VERSION, tasks: [] }
}
