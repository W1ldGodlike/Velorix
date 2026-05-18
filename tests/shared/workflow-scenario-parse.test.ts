import { describe, expect, it } from 'vitest'

import {
  WORKFLOW_SCENARIO_BAD_KIND,
  WORKFLOW_SCENARIO_VALID
} from '../fixtures/workflow-scenario-cases'
import {
  emptyWorkflowScenarioRegistry,
  parseWorkflowScenarioDocument,
  parseWorkflowScenarioRegistry
} from '../../src/shared/workflow-scenario-parse'
import { parseScheduledTaskDocument } from '../../src/shared/scheduled-task-parse'

describe('workflow-scenario-parse', () => {
  it('parseWorkflowScenarioDocument accepts template', () => {
    const doc = parseWorkflowScenarioDocument(WORKFLOW_SCENARIO_VALID)
    expect(doc?.id).toBe('scenario-new')
    expect(doc?.nodes).toHaveLength(3)
    expect(doc?.edges).toHaveLength(2)
  })

  it('parseWorkflowScenarioDocument rejects unknown node kind', () => {
    expect(parseWorkflowScenarioDocument(WORKFLOW_SCENARIO_BAD_KIND)).toBeNull()
  })

  it('parseWorkflowScenarioDocument normalizes sourceUrl on download node', () => {
    const doc = parseWorkflowScenarioDocument({
      ...WORKFLOW_SCENARIO_VALID,
      nodes: [
        {
          id: 'download-1',
          kind: 'download',
          label: 'URL',
          sourceUrl: 'https://example.com/watch?v=1'
        },
        { id: 'process-1', kind: 'process', label: 'Process' },
        { id: 'save-1', kind: 'save', label: 'Save' }
      ]
    })
    expect(doc?.nodes[0]?.sourceUrl).toBe('https://example.com/watch?v=1')
  })

  it('parseWorkflowScenarioRegistry round-trip', () => {
    const reg = { ...emptyWorkflowScenarioRegistry(), scenarios: [WORKFLOW_SCENARIO_VALID] }
    const parsed = parseWorkflowScenarioRegistry(reg)
    expect(parsed?.scenarios).toHaveLength(1)
  })
})

describe('scheduled-task-parse', () => {
  it('parseScheduledTaskDocument watch-folder', () => {
    const doc = parseScheduledTaskDocument({
      formatVersion: 1,
      id: 'task-watch-1',
      title: 'Папка входа',
      enabled: false,
      trigger: 'watch-folder',
      backend: 'in-app',
      watchFolderPath: 'C:\\in',
      scenarioId: 'scenario-new',
      pollIntervalSec: 120
    })
    expect(doc?.backend).toBe('in-app')
    expect(doc?.pollIntervalSec).toBe(120)
    expect(doc?.executeScenarioOnDetect).toBe(true)
  })

  it('parseScheduledTaskDocument windows backend', () => {
    const doc = parseScheduledTaskDocument({
      formatVersion: 1,
      id: 'task-watch-3',
      title: 'Win',
      enabled: true,
      trigger: 'watch-folder',
      backend: 'windows-task-scheduler',
      watchFolderPath: 'D:\\in',
      scenarioId: 'scenario-new',
      pollIntervalSec: 300
    })
    expect(doc?.backend).toBe('windows-task-scheduler')
  })

  it('parseScheduledTaskDocument macos launchd backend', () => {
    const doc = parseScheduledTaskDocument({
      formatVersion: 1,
      id: 'task-watch-4',
      title: 'Mac',
      enabled: true,
      trigger: 'watch-folder',
      backend: 'macos-launchd',
      watchFolderPath: '/Users/in',
      scenarioId: 'scenario-new',
      pollIntervalSec: 90
    })
    expect(doc?.backend).toBe('macos-launchd')
  })

  it('parseScheduledTaskDocument linux systemd user timer backend', () => {
    const doc = parseScheduledTaskDocument({
      formatVersion: 1,
      id: 'task-watch-5',
      title: 'Linux',
      enabled: true,
      trigger: 'watch-folder',
      backend: 'linux-systemd-user-timer',
      watchFolderPath: '/home/user/in',
      scenarioId: 'scenario-new',
      pollIntervalSec: 60
    })
    expect(doc?.backend).toBe('linux-systemd-user-timer')
  })

  it('parseScheduledTaskDocument executeScenarioOnDetect', () => {
    const off = parseScheduledTaskDocument({
      formatVersion: 1,
      id: 'task-watch-2',
      title: 'Без авто',
      enabled: true,
      trigger: 'watch-folder',
      backend: 'in-app',
      watchFolderPath: 'C:\\in',
      scenarioId: 'scenario-new',
      pollIntervalSec: 60,
      executeScenarioOnDetect: false
    })
    expect(off?.executeScenarioOnDetect).toBe(false)
  })
})
