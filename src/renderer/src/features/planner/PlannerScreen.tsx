import { useCallback, useEffect, useMemo, useState, type JSX } from 'react'

import {
  SCHEDULED_TASK_TEMPLATE_V1,
  type ScheduledTaskListItem
} from '../../../../shared/scheduled-task-contract'
import { VELORIX_NEON_REFERENCE_PLANNER_REL } from '../../../../shared/velorix-neon-theme-tokens'

import {
  PLANNER_HOURS,
  PLANNER_WEEK_DAYS,
  plannerCellKey,
  plannerCellKeyForTaskIndex
} from '../../lib/planner-grid-layout'

async function loadScheduledTasks(): Promise<ScheduledTaskListItem[]> {
  const list = window.velorix?.workflows?.listScheduledTasks
  if (list == null) {
    return []
  }
  const result = await list()
  return result.ok ? result.items : []
}

export function PlannerScreen(): JSX.Element {
  const [tasks, setTasks] = useState<ScheduledTaskListItem[]>([])
  const [statusLine, setStatusLine] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const refresh = useCallback(async () => {
    setTasks(await loadScheduledTasks())
  }, [])

  useEffect(() => {
    void (async () => {
      setTasks(await loadScheduledTasks())
    })()
  }, [])

  const tasksByCell = useMemo(() => {
    const map = new Map<string, ScheduledTaskListItem[]>()
    tasks.forEach((task, index) => {
      const key = plannerCellKeyForTaskIndex(index)
      const bucket = map.get(key) ?? []
      bucket.push(task)
      map.set(key, bucket)
    })
    return map
  }, [tasks])

  async function handleNewTask(): Promise<void> {
    const pick = window.velorix?.workflows?.pickWatchFolder
    const save = window.velorix?.workflows?.saveScheduledTask
    if (pick == null || save == null) {
      setStatusLine('workflows.pickWatchFolder недоступен')
      return
    }
    setBusy(true)
    const picked = await pick()
    if (!picked.ok) {
      setBusy(false)
      return
    }
    const id = `task-${Date.now().toString(36)}`
    const saved = await save({
      ...SCHEDULED_TASK_TEMPLATE_V1,
      id,
      title: 'Мониторинг папки',
      watchFolderPath: picked.path,
      enabled: false
    })
    if (saved.ok) {
      setStatusLine(saved.osSchedulerWarning ?? `Задача «${saved.task.title}» сохранена`)
      await refresh()
    } else {
      setStatusLine(saved.error)
    }
    setBusy(false)
  }

  return (
    <div className="planner-screen">
      <header className="planner-screen__head">
        <h1 className="planner-screen__title">Планировщик</h1>
        <p className="planner-screen__subtitle">Эталон: {VELORIX_NEON_REFERENCE_PLANNER_REL}</p>
        {statusLine != null ? <p className="planner-screen__status">{statusLine}</p> : null}
        <button
          type="button"
          className="app-btn app-btn-primary"
          disabled={busy}
          onClick={() => void handleNewTask()}
        >
          Новая задача
        </button>
      </header>
      <div className="planner-grid vn-surface-glass" role="grid" aria-label="Неделя">
        <div className="planner-grid__corner" />
        {PLANNER_WEEK_DAYS.map((day) => (
          <div key={day} className="planner-grid__day-head">
            {day}
          </div>
        ))}
        {PLANNER_HOURS.flatMap((hour) => [
          <div key={`hour-${hour}`} className="planner-grid__hour">
            {hour}
          </div>,
          ...PLANNER_WEEK_DAYS.map((day) => {
            const key = plannerCellKey(day, hour)
            const cellTasks = tasksByCell.get(key) ?? []
            const active = cellTasks.some((task) => task.enabled)
            return (
              <div
                key={key}
                className={`planner-grid__cell${active ? ' planner-grid__cell--active' : ''}`}
                title={cellTasks.map((task) => task.title).join('\n')}
              >
                {cellTasks.map((task) => (
                  <span key={task.id} className="planner-grid__cell-label">
                    {task.title}
                  </span>
                ))}
              </div>
            )
          })
        ])}
      </div>
    </div>
  )
}

export function PlannerRail(): JSX.Element {
  const [scenarios, setScenarios] = useState<{ id: string; title: string }[]>([])
  const [tasks, setTasks] = useState<ScheduledTaskListItem[]>([])
  const [scenarioId, setScenarioId] = useState('')
  const [taskId, setTaskId] = useState('')
  const [osHint, setOsHint] = useState<string | null>(null)
  const [railStatus, setRailStatus] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    void (async () => {
      const listScenarios = window.velorix?.workflows?.listScenarios
      const listTasks = window.velorix?.workflows?.listScheduledTasks
      const caps = window.velorix?.workflows?.capabilities
      if (listScenarios != null) {
        const result = await listScenarios()
        if (result.ok) {
          const items = result.items.map((item) => ({ id: item.id, title: item.title }))
          setScenarios(items)
          if (items.length > 0) {
            setScenarioId(items[0]!.id)
          }
        }
      }
      if (listTasks != null) {
        const result = await listTasks()
        if (result.ok) {
          setTasks(result.items)
          if (result.items.length > 0) {
            setTaskId(result.items[0]!.id)
          }
        }
      }
      if (caps != null) {
        const result = await caps()
        if (result.ok) {
          const parts: string[] = []
          if (result.windowsTaskScheduler) {
            parts.push('Windows Task Scheduler')
          }
          if (result.macosLaunchd) {
            parts.push('launchd')
          }
          if (result.linuxSystemdUserTimer) {
            parts.push('systemd')
          }
          setOsHint(parts.length > 0 ? parts.join(' · ') : 'Только in-app watch-folder')
        }
      }
    })()
  }, [])

  async function handleRunNow(): Promise<void> {
    const run = window.velorix?.workflows?.runScenarioOnUrl
    if (run == null || scenarioId.length === 0) {
      return
    }
    const title = scenarios.find((row) => row.id === scenarioId)?.title ?? 'Сценарий'
    setBusy(true)
    const result = await run(scenarioId, title)
    setRailStatus(result.ok ? `Запуск «${title}» (очередь #${String(result.rowId)})` : result.error)
    setBusy(false)
  }

  async function handleToggleTask(): Promise<void> {
    const toggle = window.velorix?.workflows?.setScheduledTaskEnabled
    const task = tasks.find((row) => row.id === taskId)
    if (toggle == null || task == null) {
      return
    }
    setBusy(true)
    const result = await toggle(task.id, !task.enabled)
    if (result.ok) {
      const list = await loadScheduledTasks()
      setTasks(list)
      setRailStatus(
        result.osSchedulerWarning ??
          (task.enabled ? `«${task.title}» выключена` : `«${task.title}» включена`)
      )
    } else {
      setRailStatus(result.error)
    }
    setBusy(false)
  }

  const selectedTask = tasks.find((row) => row.id === taskId)

  return (
    <aside className="planner-rail vn-surface-glass">
      <h2 className="planner-rail__title">Автоматизация</h2>
      {osHint != null ? <p className="planner-rail__hint">{osHint}</p> : null}
      <label className="app-ui-showcase-field">
        <span className="app-ui-showcase-field-label">Сценарий</span>
        <select
          className="app-settings-select"
          value={scenarioId}
          onChange={(e) => setScenarioId(e.target.value)}
        >
          {scenarios.length === 0 ? (
            <option value="">Нет сценариев</option>
          ) : (
            scenarios.map((row) => (
              <option key={row.id} value={row.id}>
                {row.title}
              </option>
            ))
          )}
        </select>
      </label>
      <button
        type="button"
        className="app-btn app-btn-secondary"
        disabled={busy || scenarioId.length === 0}
        onClick={() => void handleRunNow()}
      >
        Запустить сейчас
      </button>
      <label className="app-ui-showcase-field">
        <span className="app-ui-showcase-field-label">Задача watch-folder</span>
        <select
          className="app-settings-select"
          value={taskId}
          onChange={(e) => setTaskId(e.target.value)}
        >
          {tasks.length === 0 ? (
            <option value="">Нет задач</option>
          ) : (
            tasks.map((row) => (
              <option key={row.id} value={row.id}>
                {row.title}
                {row.enabled ? ' · вкл' : ''}
              </option>
            ))
          )}
        </select>
      </label>
      <button
        type="button"
        className="app-btn app-btn-secondary"
        disabled={busy || selectedTask == null}
        onClick={() => void handleToggleTask()}
      >
        {selectedTask?.enabled === true ? 'Выключить задачу' : 'Включить задачу'}
      </button>
      {railStatus != null ? <p className="planner-rail__status">{railStatus}</p> : null}
    </aside>
  )
}
