import { dirname, isAbsolute, normalize } from 'node:path'

import type { WorkflowScenarioDocument, WorkflowScenarioNode } from './workflow-scenario-contract'
import { orderWorkflowScenarioNodes } from './workflow-scenario-layout'

export type WorkflowScenarioRunStepKind = 'passthrough-local' | 'ffmpeg-export'

export type WorkflowScenarioRunStep = {
  nodeId: string
  kind: WorkflowScenarioRunStepKind
  label: string
}

export type WorkflowScenarioRunPlan = {
  inputPath: string
  saveDirectory: string
  steps: WorkflowScenarioRunStep[]
  /** Заполняется планировщиком main: целевой файл после `process`. */
  plannedOutputPath: string | null
}

export function resolveWorkflowScenarioSaveDirectory(
  saveNode: WorkflowScenarioNode | undefined,
  inputAbsolutePath: string
): string {
  const raw = saveNode?.outputDirectory?.trim()
  if (raw) {
    const n = normalize(raw)
    if (n.length > 0 && n.length <= 4096 && isAbsolute(n)) {
      return n
    }
  }
  return dirname(inputAbsolutePath)
}

/** §11 — план прогона watch-folder: локальный файл, `download` = passthrough, `process` = ffmpeg export. */
export function buildWorkflowScenarioRunPlan(
  scenario: WorkflowScenarioDocument,
  inputAbsolutePath: string
): WorkflowScenarioRunPlan | null {
  const ordered = orderWorkflowScenarioNodes(scenario.nodes, scenario.edges)
  if (ordered.length === 0) {
    return null
  }
  const saveNode = ordered.find((n) => n.kind === 'save')
  const saveDirectory = resolveWorkflowScenarioSaveDirectory(saveNode, inputAbsolutePath)
  const steps: WorkflowScenarioRunStep[] = []
  for (const node of ordered) {
    if (node.kind === 'download') {
      steps.push({ nodeId: node.id, kind: 'passthrough-local', label: node.label })
    } else if (node.kind === 'process') {
      steps.push({ nodeId: node.id, kind: 'ffmpeg-export', label: node.label })
    } else if (node.kind === 'save') {
      steps.push({ nodeId: node.id, kind: 'passthrough-local', label: node.label })
    }
  }
  const hasExport = steps.some((s) => s.kind === 'ffmpeg-export')
  if (!hasExport) {
    return null
  }
  return {
    inputPath: inputAbsolutePath,
    saveDirectory,
    steps,
    plannedOutputPath: null
  }
}
