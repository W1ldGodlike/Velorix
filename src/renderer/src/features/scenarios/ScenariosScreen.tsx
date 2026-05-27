import { useEffect, useState, type JSX } from 'react'

import {
  WORKFLOW_SCENARIO_TEMPLATE_V1,
  type WorkflowScenarioListItem
} from '../../../../shared/workflow-scenario-contract'
import type { WorkflowWatchFolderRunFinishedPayload } from '../../../../shared/workflow-watch-folder-contract'
import { VELORIX_NEON_REFERENCE_SCENARIOS_REL } from '../../../../shared/velorix-neon-theme-tokens'

import { useAppShellStore } from '../../stores/app-shell-store'

type ScenarioRunRow = {
  id: string
  title: string
  detail: string
}

function scenarioStatusTone(runs: number): 'ready' | 'processing' | 'info' {
  if (runs > 0) {
    return 'ready'
  }
  return 'info'
}

export function ScenariosScreen(): JSX.Element {
  const mediaSource = useAppShellStore((s) => s.mediaSource)
  const [flows, setFlows] = useState<WorkflowScenarioListItem[]>([])
  const [loadError, setLoadError] = useState<string | null>(null)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [runNote, setRunNote] = useState<string | null>(null)

  async function refresh(): Promise<void> {
    const list = window.velorix?.workflows?.listScenarios
    if (list == null) {
      setLoadError('workflows.listScenarios недоступен')
      return
    }
    const result = await list()
    if (!result.ok) {
      setLoadError(result.error)
      return
    }
    setLoadError(null)
    setFlows(result.items)
  }

  useEffect(() => {
    void (async () => {
      await refresh()
    })()
  }, [])

  async function handleNewScenario(): Promise<void> {
    const save = window.velorix?.workflows?.saveScenario
    if (save == null) {
      return
    }
    const id = `scenario-${Date.now().toString(36)}`
    const result = await save({
      ...WORKFLOW_SCENARIO_TEMPLATE_V1,
      id,
      title: 'Новый сценарий',
      updatedAt: new Date().toISOString()
    })
    if (result.ok) {
      await refresh()
      setRunNote(`Создан «${result.scenario.title}»`)
    } else {
      setRunNote(result.error)
    }
  }

  async function handleRun(flow: WorkflowScenarioListItem): Promise<void> {
    setBusyId(flow.id)
    const path = mediaSource?.path
    if (path != null && path.length > 0) {
      const runFile = window.velorix?.workflows?.runScenarioOnFile
      if (runFile != null) {
        const result = await runFile(flow.id, path, flow.title)
        setRunNote(result.ok ? `Файл: ${path}` : result.error)
        setBusyId(null)
        return
      }
    }
    const runUrl = window.velorix?.workflows?.runScenarioOnUrl
    if (runUrl == null) {
      setBusyId(null)
      return
    }
    const result = await runUrl(flow.id, flow.title)
    setRunNote(result.ok ? `Очередь #${String(result.rowId)}` : result.error)
    setBusyId(null)
  }

  return (
    <div className="portal-screen scenarios-screen">
      <header className="portal-screen__head">
        <div>
          <h1 className="portal-screen__title">Сценарии</h1>
          <p className="portal-screen__subtitle">Эталон: {VELORIX_NEON_REFERENCE_SCENARIOS_REL}</p>
          {runNote != null ? <p className="scenarios-screen__status">{runNote}</p> : null}
        </div>
        <button
          type="button"
          className="app-btn app-btn-primary"
          onClick={() => void handleNewScenario()}
        >
          Новый сценарий
        </button>
      </header>
      {loadError != null ? <p className="scenarios-screen__error">{loadError}</p> : null}
      <div className="scenarios-screen__grid">
        {flows.length === 0 ? (
          <p className="scenarios-screen__empty vn-surface-glass">
            Сценариев пока нет — создайте первый.
          </p>
        ) : (
          flows.map((flow) => (
            <article key={flow.id} className="portal-card vn-surface-glass">
              <h2>{flow.title}</h2>
              <span
                className={`app-ui-showcase-status-pill app-ui-showcase-status-pill--${scenarioStatusTone(0)}`}
              >
                {flow.nodeCount} блоков
              </span>
              <button
                type="button"
                className="app-btn app-btn-secondary"
                disabled={busyId === flow.id}
                onClick={() => void handleRun(flow)}
              >
                {busyId === flow.id ? '…' : 'Запустить'}
              </button>
            </article>
          ))
        )}
      </div>
    </div>
  )
}

function formatRunTime(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) {
    return iso
  }
  return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
}

export function ScenariosRail(): JSX.Element {
  const [runs, setRuns] = useState<ScenarioRunRow[]>([])

  useEffect(() => {
    const subscribe = window.velorix?.workflows?.onWatchFolderRunFinished
    if (subscribe == null) {
      return
    }
    return subscribe((payload: WorkflowWatchFolderRunFinishedPayload) => {
      const detail =
        payload.outcome === 'success'
          ? `успех · ${formatRunTime(payload.finishedAtUtc)}`
          : `${payload.outcome} · ${formatRunTime(payload.finishedAtUtc)}`
      setRuns((prev) =>
        [
          { id: `${payload.taskId}-${payload.finishedAtUtc}`, title: payload.taskTitle, detail },
          ...prev
        ].slice(0, 8)
      )
    })
  }, [])

  return (
    <aside className="portal-rail vn-surface-glass">
      <h2 className="portal-rail__title">Последние запуски</h2>
      <ul className="scenarios-rail__runs">
        {runs.length === 0 ? (
          <li>
            <span>Нет событий</span>
            <small>watch-folder / ручной запуск</small>
          </li>
        ) : (
          runs.map((row) => (
            <li key={row.id}>
              <span>{row.title}</span>
              <small>{row.detail}</small>
            </li>
          ))
        )}
      </ul>
    </aside>
  )
}
