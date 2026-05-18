import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

import { resolveAppPaths } from './app-paths'
import type { ScheduledTaskDocument, ScheduledTaskListItem } from '../shared/scheduled-task-contract'
import {
  emptyScheduledTaskRegistry,
  parseScheduledTaskRegistry
} from '../shared/scheduled-task-parse'
import type {
  WorkflowScenarioDocument,
  WorkflowScenarioListItem
} from '../shared/workflow-scenario-contract'
import {
  emptyWorkflowScenarioRegistry,
  parseWorkflowScenarioRegistry
} from '../shared/workflow-scenario-parse'

function workflowsDir(): string {
  const dir = join(resolveAppPaths().userData, 'workflows')
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true })
  }
  return dir
}

function readJsonFile(path: string): unknown {
  if (!existsSync(path)) {
    return null
  }
  try {
    return JSON.parse(readFileSync(path, 'utf8')) as unknown
  } catch {
    return null
  }
}

function writeJsonFile(path: string, data: unknown): void {
  writeFileSync(path, `${JSON.stringify(data, null, 2)}\n`, 'utf8')
}

function scenariosPath(): string {
  return join(workflowsDir(), 'scenarios.json')
}

function scheduledTasksPath(): string {
  return join(workflowsDir(), 'scheduled-tasks.json')
}

function loadScenarioRegistry(): ReturnType<typeof emptyWorkflowScenarioRegistry> {
  const parsed = parseWorkflowScenarioRegistry(readJsonFile(scenariosPath()))
  return parsed ?? emptyWorkflowScenarioRegistry()
}

function loadScheduledRegistry(): ReturnType<typeof emptyScheduledTaskRegistry> {
  const parsed = parseScheduledTaskRegistry(readJsonFile(scheduledTasksPath()))
  return parsed ?? emptyScheduledTaskRegistry()
}

export function listWorkflowScenarios(): WorkflowScenarioListItem[] {
  return loadScenarioRegistry().scenarios.map((s) => ({
    id: s.id,
    title: s.title,
    updatedAt: s.updatedAt,
    nodeCount: s.nodes.length
  }))
}

export function getWorkflowScenario(id: string): WorkflowScenarioDocument | null {
  return loadScenarioRegistry().scenarios.find((s) => s.id === id) ?? null
}

export function saveWorkflowScenario(doc: WorkflowScenarioDocument): void {
  const registry = loadScenarioRegistry()
  const next = { ...doc, updatedAt: new Date().toISOString() }
  const idx = registry.scenarios.findIndex((s) => s.id === next.id)
  if (idx >= 0) {
    registry.scenarios[idx] = next
  } else {
    registry.scenarios.push(next)
  }
  writeJsonFile(scenariosPath(), registry)
}

export function deleteWorkflowScenario(id: string): boolean {
  const registry = loadScenarioRegistry()
  const before = registry.scenarios.length
  registry.scenarios = registry.scenarios.filter((s) => s.id !== id)
  if (registry.scenarios.length === before) {
    return false
  }
  writeJsonFile(scenariosPath(), registry)
  return true
}

export function listScheduledTasks(): ScheduledTaskListItem[] {
  return loadScheduledRegistry().tasks.map((t) => ({
    id: t.id,
    title: t.title,
    enabled: t.enabled,
    trigger: t.trigger,
    watchFolderPath: t.watchFolderPath,
    scenarioId: t.scenarioId,
    pollIntervalSec: t.pollIntervalSec,
    backend: t.backend,
    executeScenarioOnDetect: t.executeScenarioOnDetect
  }))
}

export function getScheduledTask(id: string): ScheduledTaskDocument | null {
  return loadScheduledRegistry().tasks.find((t) => t.id === id) ?? null
}

export function saveScheduledTask(doc: ScheduledTaskDocument): void {
  const registry = loadScheduledRegistry()
  const idx = registry.tasks.findIndex((t) => t.id === doc.id)
  if (idx >= 0) {
    registry.tasks[idx] = doc
  } else {
    registry.tasks.push(doc)
  }
  writeJsonFile(scheduledTasksPath(), registry)
}

export function deleteScheduledTask(id: string): boolean {
  const registry = loadScheduledRegistry()
  const before = registry.tasks.length
  registry.tasks = registry.tasks.filter((t) => t.id !== id)
  if (registry.tasks.length === before) {
    return false
  }
  writeJsonFile(scheduledTasksPath(), registry)
  return true
}

export function setScheduledTaskEnabled(id: string, enabled: boolean): boolean {
  const registry = loadScheduledRegistry()
  const task = registry.tasks.find((t) => t.id === id)
  if (!task) {
    return false
  }
  task.enabled = enabled
  writeJsonFile(scheduledTasksPath(), registry)
  return true
}
