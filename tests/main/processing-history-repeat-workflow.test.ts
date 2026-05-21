import { existsSync, mkdtempSync, rmSync, writeFileSync } from 'fs'
import { tmpdir } from 'os'
import { join } from 'path'
import { afterEach, describe, expect, it, vi } from 'vitest'

import type { WorkflowScenarioDocument } from '../../src/shared/workflow-scenario-contract'
import { repeatWorkflowFromHistoryEntry } from '../../src/main/services/history/processing-history-repeat-workflow'

vi.mock('../../src/main/services/workflow/workflow-run-scenario-on-file', () => ({
  runWorkflowScenarioOnFile: vi.fn(() => ({ ok: true }))
}))

vi.mock('../../src/main/services/workflow/workflow-run-scenario-on-url', () => ({
  runWorkflowScenarioOnUrl: vi.fn(async () => ({ ok: true, rowId: 1, started: true }))
}))

vi.mock('../../src/main/services/workflow/workflow-registry-service', () => ({
  getWorkflowScenario: vi.fn()
}))

import { runWorkflowScenarioOnFile } from '../../src/main/services/workflow/workflow-run-scenario-on-file'
import { runWorkflowScenarioOnUrl } from '../../src/main/services/workflow/workflow-run-scenario-on-url'
import { getWorkflowScenario } from '../../src/main/services/workflow/workflow-registry-service'

const fileScenario: WorkflowScenarioDocument = {
  formatVersion: 1,
  id: 'scenario-file',
  title: 'Local',
  updatedAt: '2026-05-18T00:00:00.000Z',
  nodes: [
    { id: 'p', kind: 'process', label: 'Process' },
    { id: 's', kind: 'save', label: 'Save' }
  ],
  edges: [{ from: 'p', to: 's' }]
}

const urlScenario: WorkflowScenarioDocument = {
  formatVersion: 1,
  id: 'scenario-url',
  title: 'URL',
  updatedAt: '2026-05-18T00:00:00.000Z',
  nodes: [
    {
      id: 'd',
      kind: 'download',
      label: 'Download',
      sourceUrl: 'https://example.com/watch?v=1'
    },
    { id: 'p', kind: 'process', label: 'Process' },
    { id: 's', kind: 'save', label: 'Save' }
  ],
  edges: [
    { from: 'd', to: 'p' },
    { from: 'p', to: 's' }
  ]
}

const tempRoots: string[] = []

function makeTempRoot(): string {
  const dir = mkdtempSync(join(tmpdir(), 'flux-ph-repeat-'))
  tempRoots.push(dir)
  return dir
}

afterEach(() => {
  vi.clearAllMocks()
  while (tempRoots.length > 0) {
    const dir = tempRoots.pop()
    if (dir && existsSync(dir)) {
      rmSync(dir, { recursive: true, force: true })
    }
  }
})

describe('processing-history-repeat-workflow §13', () => {
  it('rejects non-workflow entries', async () => {
    await expect(
      repeatWorkflowFromHistoryEntry({
        id: 'a',
        kind: 'ffmpegExport',
        startedAt: 1,
        finishedAt: 2,
        inputPath: 'C:/in.mp4',
        outputPath: null,
        outcome: 'success',
        status: 'ok',
        errorHint: null
      })
    ).resolves.toEqual({ ok: false, error: 'not-workflow' })
  })

  it('rejects workflow without scenario id', async () => {
    await expect(
      repeatWorkflowFromHistoryEntry({
        id: 'b',
        kind: 'workflowScenario',
        startedAt: 1,
        finishedAt: 2,
        inputPath: 'C:/in.mp4',
        outputPath: null,
        outcome: 'success',
        status: 'workflow demo',
        errorHint: null
      })
    ).resolves.toEqual({ ok: false, error: 'no-scenario-id' })
  })

  it('queues file run for local scenario', async () => {
    vi.mocked(getWorkflowScenario).mockReturnValue(fileScenario)
    const root = makeTempRoot()
    const file = join(root, 'clip.mp4')
    writeFileSync(file, '')
    const entry = {
      id: 'x',
      kind: 'workflowScenario' as const,
      startedAt: 1,
      finishedAt: 2,
      inputPath: file,
      outputPath: null,
      outcome: 'success' as const,
      status: 'workflow demo',
      errorHint: null,
      workflowScenarioId: 'scenario-file'
    }
    await expect(repeatWorkflowFromHistoryEntry(entry)).resolves.toEqual({ ok: true })
    expect(runWorkflowScenarioOnFile).toHaveBeenCalledWith('scenario-file', file, 'History')
    expect(runWorkflowScenarioOnUrl).not.toHaveBeenCalled()
  })

  it('queues url run when scenario has sourceUrl', async () => {
    vi.mocked(getWorkflowScenario).mockReturnValue(urlScenario)
    const entry = {
      id: 'y',
      kind: 'workflowScenario' as const,
      startedAt: 1,
      finishedAt: 2,
      inputPath: 'C:/downloads/out.mp4',
      outputPath: null,
      outcome: 'success' as const,
      status: 'workflow URL',
      errorHint: null,
      workflowScenarioId: 'scenario-url'
    }
    await expect(repeatWorkflowFromHistoryEntry(entry)).resolves.toMatchObject({ ok: true })
    expect(runWorkflowScenarioOnUrl).toHaveBeenCalledWith('scenario-url', 'History')
    expect(runWorkflowScenarioOnFile).not.toHaveBeenCalled()
  })
})
