import { describe, expect, it, vi } from 'vitest'

import { WORKFLOW_SCENARIO_TEMPLATE_V1 } from '../../src/shared/workflow-scenario-contract'
import { WORKFLOW_MANUAL_EDITOR_TASK_ID } from '../../src/shared/workflow-watch-folder-contract'

const enqueueMock = vi.fn()

vi.mock('../../src/main/services/workflow/workflow-scenario-runner', () => ({
  enqueueWorkflowScenarioRun: (...args: unknown[]) => enqueueMock(...args)
}))

vi.mock('../../src/main/services/workflow/workflow-registry-service', () => ({
  getWorkflowScenario: (id: string) =>
    id === 'scenario-new' ? { ...WORKFLOW_SCENARIO_TEMPLATE_V1, id: 'scenario-new' } : null
}))

vi.mock('node:fs', () => ({
  existsSync: (p: string) => p === 'C:\\in\\clip.mp4'
}))

vi.mock('../../src/main/core/media-protocol', () => ({
  isGrantedMediaPath: () => true,
  grantMediaPath: vi.fn()
}))

describe('workflow-run-scenario-on-file §11', () => {
  it('queues manual editor run', async () => {
    enqueueMock.mockClear()
    const { runWorkflowScenarioOnFile } =
      await import('../../src/main/services/workflow/workflow-run-scenario-on-file')
    const res = runWorkflowScenarioOnFile('scenario-new', 'C:\\in\\clip.mp4', 'Редактор')
    expect(res).toEqual({ ok: true })
    expect(enqueueMock).toHaveBeenCalledOnce()
    const [payload, scenario, execute] = enqueueMock.mock.calls[0] as [
      { taskId: string },
      { id: string },
      boolean
    ]
    expect(payload.taskId).toBe(WORKFLOW_MANUAL_EDITOR_TASK_ID)
    expect(scenario.id).toBe('scenario-new')
    expect(execute).toBe(true)
  })

  it('rejects missing scenario', async () => {
    const { runWorkflowScenarioOnFile } =
      await import('../../src/main/services/workflow/workflow-run-scenario-on-file')
    expect(runWorkflowScenarioOnFile('missing', 'C:\\in\\clip.mp4', 'x')).toEqual({
      ok: false,
      error: 'scenario-not-found'
    })
  })
})
