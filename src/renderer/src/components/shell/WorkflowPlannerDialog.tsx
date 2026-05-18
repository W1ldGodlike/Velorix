import { useCallback, useEffect, useState, type JSX } from 'react'

import {
  SCHEDULED_TASK_TEMPLATE_V1,
  type ScheduledTaskListItem
} from '../../../../shared/scheduled-task-contract'
import type { WorkflowScenarioListItem } from '../../../../shared/workflow-scenario-contract'
import { parseScheduledTaskDocument } from '../../../../shared/scheduled-task-parse'
import { uiText } from '../../locales/ui-text'

function newTaskId(): string {
  return `task-watch-${Math.random().toString(36).slice(2, 8)}`
}

export type WorkflowPlannerDialogProps = {
  open: boolean
  onClose: () => void
  onStatus?: (message: string) => void
}

export function WorkflowPlannerDialog(props: WorkflowPlannerDialogProps): JSX.Element | null {
  const { open, onClose, onStatus } = props
  const [tasks, setTasks] = useState<ScheduledTaskListItem[]>([])
  const [scenarios, setScenarios] = useState<WorkflowScenarioListItem[]>([])
  const [addOpen, setAddOpen] = useState(false)
  const [busy, setBusy] = useState(false)
  const [draft, setDraft] = useState(() => ({
    ...SCHEDULED_TASK_TEMPLATE_V1,
    id: newTaskId()
  }))

  const reload = useCallback(async (): Promise<void> => {
    const [taskRes, scenRes] = await Promise.all([
      window.fluxalloy.workflows.listScheduledTasks(),
      window.fluxalloy.workflows.listScenarios()
    ])
    if (taskRes.ok) {
      setTasks(taskRes.items)
    }
    if (scenRes.ok) {
      setScenarios(scenRes.items)
    }
  }, [])

  useEffect(() => {
    if (!open) {
      return
    }
    let cancelled = false
    void Promise.all([
      window.fluxalloy.workflows.listScheduledTasks(),
      window.fluxalloy.workflows.listScenarios()
    ]).then(([taskRes, scenRes]) => {
      if (cancelled) {
        return
      }
      if (taskRes.ok) {
        setTasks(taskRes.items)
      }
      if (scenRes.ok) {
        setScenarios(scenRes.items)
      }
    })
    return (): void => {
      cancelled = true
    }
  }, [open])

  const openAdd = (): void => {
    setDraft({
      ...SCHEDULED_TASK_TEMPLATE_V1,
      id: newTaskId(),
      scenarioId: scenarios[0]?.id ?? SCHEDULED_TASK_TEMPLATE_V1.scenarioId
    })
    setAddOpen(true)
  }

  const saveTask = async (): Promise<void> => {
    const doc = parseScheduledTaskDocument(draft)
    if (!doc) {
      onStatus?.(uiText('workflowPlannerTaskInvalid'))
      return
    }
    setBusy(true)
    try {
      const res = await window.fluxalloy.workflows.saveScheduledTask(doc)
      if (res.ok) {
        onStatus?.(uiText('workflowPlannerTaskSaved'))
        setAddOpen(false)
        await reload()
      } else {
        onStatus?.(uiText('workflowPlannerTaskSaveFailed'))
      }
    } finally {
      setBusy(false)
    }
  }

  const toggleEnabled = async (id: string, enabled: boolean): Promise<void> => {
    setBusy(true)
    try {
      const res = await window.fluxalloy.workflows.setScheduledTaskEnabled(id, enabled)
      if (res.ok) {
        await reload()
      }
    } finally {
      setBusy(false)
    }
  }

  const deleteTask = async (id: string): Promise<void> => {
    setBusy(true)
    try {
      const res = await window.fluxalloy.workflows.deleteScheduledTask(id)
      if (res.ok) {
        onStatus?.(uiText('workflowPlannerTaskDeleted'))
        await reload()
      }
    } finally {
      setBusy(false)
    }
  }

  if (!open) {
    return null
  }

  return (
    <div
      className="app-modal-backdrop"
      role="presentation"
      onMouseDown={(e) => {
        if (busy) {
          return
        }
        if (e.target === e.currentTarget) {
          onClose()
        }
      }}
    >
      <div
        className="app-modal app-modal-wide"
        role="dialog"
        aria-modal="true"
        aria-busy={busy}
        aria-labelledby="workflow-planner-title"
        aria-describedby="workflow-planner-hint"
        onMouseDown={(e) => {
          e.stopPropagation()
        }}
      >
        <h2 id="workflow-planner-title" className="app-modal-title">
          {uiText('workflowPlannerDialogTitle')}
        </h2>
        <p id="workflow-planner-hint" className="app-modal-hint">
          {uiText('workflowPlannerDialogHint')}
        </p>
        {addOpen ? (
          <section className="workflow-planner-add-form" aria-label={uiText('workflowPlannerAddTitle')}>
            <h3 className="app-settings-hidpi-title">{uiText('workflowPlannerAddTitle')}</h3>
            <div className="app-settings-stack">
              <div className="app-settings-field-row">
                <label className="app-settings-label" htmlFor="wf-task-title">
                  {uiText('workflowPlannerFieldTitle')}
                </label>
                <input
                  id="wf-task-title"
                  className="app-control"
                  disabled={busy}
                  value={draft.title}
                  onChange={(e) => setDraft((p) => ({ ...p, title: e.target.value }))}
                />
              </div>
              <div className="app-settings-field-row">
                <label className="app-settings-label" htmlFor="wf-task-folder">
                  {uiText('workflowPlannerFieldFolder')}
                </label>
                <div className="app-settings-inline-actions">
                  <input
                    id="wf-task-folder"
                    className="app-control"
                    disabled={busy}
                    value={draft.watchFolderPath}
                    onChange={(e) => setDraft((p) => ({ ...p, watchFolderPath: e.target.value }))}
                  />
                  <button
                    type="button"
                    className="app-btn app-btn-compact"
                    disabled={busy}
                    onClick={() => {
                      void window.fluxalloy.workflows.pickWatchFolder().then((res) => {
                        if (res.ok) {
                          setDraft((p) => ({ ...p, watchFolderPath: res.path }))
                        }
                      })
                    }}
                  >
                    {uiText('workflowPlannerPickFolder')}
                  </button>
                </div>
              </div>
              <div className="app-settings-field-row">
                <label className="app-settings-label" htmlFor="wf-task-scenario">
                  {uiText('workflowPlannerFieldScenario')}
                </label>
                <select
                  id="wf-task-scenario"
                  className="app-settings-select"
                  disabled={busy || scenarios.length === 0}
                  value={draft.scenarioId}
                  onChange={(e) => setDraft((p) => ({ ...p, scenarioId: e.target.value }))}
                >
                  {scenarios.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.title}
                    </option>
                  ))}
                </select>
              </div>
              <div className="app-settings-field-row">
                <label className="app-settings-label" htmlFor="wf-task-interval">
                  {uiText('workflowPlannerFieldInterval')}
                </label>
                <input
                  id="wf-task-interval"
                  type="number"
                  min={15}
                  max={86400}
                  className="app-control"
                  disabled={busy}
                  value={draft.pollIntervalSec}
                  onChange={(e) => {
                    const n = Number.parseInt(e.target.value, 10)
                    setDraft((p) => ({
                      ...p,
                      pollIntervalSec: Number.isFinite(n) ? n : p.pollIntervalSec
                    }))
                  }}
                />
              </div>
              <label className="app-settings-label">
                <input
                  type="checkbox"
                  disabled={busy}
                  checked={draft.enabled}
                  onChange={(e) => setDraft((p) => ({ ...p, enabled: e.target.checked }))}
                />{' '}
                {uiText('workflowPlannerFieldEnabled')}
              </label>
              <label className="app-settings-label">
                <input
                  type="checkbox"
                  disabled={busy}
                  checked={draft.executeScenarioOnDetect}
                  onChange={(e) =>
                    setDraft((p) => ({ ...p, executeScenarioOnDetect: e.target.checked }))
                  }
                />{' '}
                {uiText('workflowPlannerFieldExecuteScenario')}
              </label>
            </div>
            <div className="app-modal-actions" role="toolbar" aria-orientation="horizontal">
              <button
                type="button"
                className="app-btn app-btn-primary"
                disabled={busy || scenarios.length === 0}
                onClick={() => {
                  void saveTask()
                }}
              >
                {uiText('workflowPlannerAddSave')}
              </button>
              <button type="button" className="app-btn" disabled={busy} onClick={() => setAddOpen(false)}>
                {uiText('workflowPlannerAddCancel')}
              </button>
            </div>
          </section>
        ) : null}
        <div className="app-settings-table-wrap" role="region" aria-label={uiText('workflowPlannerDialogTitle')}>
          <table className="app-settings-table">
            <thead>
              <tr>
                <th scope="col">{uiText('workflowPlannerColTitle')}</th>
                <th scope="col">{uiText('workflowPlannerColEnabled')}</th>
                <th scope="col">{uiText('workflowPlannerColFolder')}</th>
                <th scope="col">{uiText('workflowPlannerColScenario')}</th>
                <th scope="col">{uiText('workflowPlannerColInterval')}</th>
                <th scope="col">{uiText('workflowPlannerColActions')}</th>
              </tr>
            </thead>
            <tbody>
              {tasks.length === 0 ? (
                <tr>
                  <td colSpan={6}>{uiText('workflowPlannerEmpty')}</td>
                </tr>
              ) : (
                tasks.map((row) => (
                  <tr key={row.id}>
                    <td>{row.title}</td>
                    <td>
                      <button
                        type="button"
                        className="app-btn app-btn-compact"
                        disabled={busy}
                        title={uiText('workflowPlannerToggleEnabled')}
                        onClick={() => {
                          void toggleEnabled(row.id, !row.enabled)
                        }}
                      >
                        {row.enabled ? uiText('workflowPlannerEnabledOn') : uiText('workflowPlannerEnabledOff')}
                      </button>
                    </td>
                    <td title={row.watchFolderPath}>
                      {row.watchFolderPath.length > 0
                        ? row.watchFolderPath.replace(/^.*[/\\]/, '')
                        : '—'}
                    </td>
                    <td>{row.scenarioId || '—'}</td>
                    <td>{row.pollIntervalSec}</td>
                    <td>
                      <button
                        type="button"
                        className="app-btn app-btn-compact"
                        disabled={busy}
                        onClick={() => {
                          void deleteTask(row.id)
                        }}
                      >
                        {uiText('workflowPlannerDelete')}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="app-modal-actions" role="toolbar" aria-orientation="horizontal">
          <button type="button" className="app-btn" disabled={busy || addOpen} onClick={openAdd}>
            {uiText('workflowPlannerAddTask')}
          </button>
          <button type="button" className="app-btn app-btn-primary" disabled={busy} onClick={() => onClose()}>
            {uiText('workflowScenarioClose')}
          </button>
        </div>
      </div>
    </div>
  )
}
